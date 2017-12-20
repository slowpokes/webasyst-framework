<?php

/**
 *
 * @author KM
 * @name                 kmbitcoin
 * @description Плагин оплаты с помощью биткоинов.
 *
 * @property-read string $payout_address
 * @property-read int    $confirmations
 * @property-read string $fee_level
 * @property-read bool   $after
 * @property-read bool   $before
 * @property-read bool   $show_qr
 * @property-read bool   $fee_type
 */
class kmbitcoinPayment extends waPayment implements waIPayment
{
    const API = 'https://bitaps.com/api/';

    const FEE_LOW = 'low';
    const FEE_MEDIUM = 'medium ';
    const FEE_HIGH = 'high ';

    const FEE_PLUS = 'plus';
    const FEE_MINUS = 'minus';

    /** @var  waOrder */
    private $_order;
    private $_address;
    private $_payment_code;
    private $_invoice;
    private $_callback;
    private $_btc;
    /** @var  kmbitcoinNet */
    private $_net;

    public function init()
    {
        waAutoload::getInstance()->add(array(
            'kmbitcoinNet' => 'wa-plugins/payment/kmbitcoin/lib/kmbitcoinNet.class.php',
        ));
        $this->_net = new kmbitcoinNet(array(
            'verify' => false,
        ));

        return parent::init();
    }

    /**
     * Возвращает ISO3-коды валют, поддерживаемых платежной системой,
     * допустимые для выбранного в настройках протокола подключения и указанного номера кошелька продавца.
     *
     * @see waPayment::allowedCurrency()
     * @return mixed
     */
    public function allowedCurrency()
    {
        return array(
            'RUB',
            'UAH',
            'USD',
            'EUR',
            'USD',
            'UZS',
            'BYR',
            'CAD',
        );
    }

    /**
     * @param array   $payment_form_data
     * @param waOrder $order_data
     * @param bool    $auto_submit
     *
     * @return string
     * @throws waPaymentException
     */
    public function payment($payment_form_data, $order_data, $auto_submit = false)
    {
        if (!$this->payout_address) {
            throw new waPaymentException('Не задан Биткоин адрес для выплат');
        }

        // заполняем обязательный элемент данных с описанием заказа
        if (empty($order_data['description'])) {
            $order_data['description'] = 'Заказ ' . $order_data['order_id'];
        }

        // вызываем класс-обертку, чтобы гарантировать использование данных в правильном формате
        $this->_order = waOrder::factory($order_data);

        try {
            $transaction = $this->getTransactionByOrderId($this->_order->id);
        } catch (waPaymentException $ex) {
            $transaction = false;
        }

        // добавляем в платежную форму поля, требуемые платежной системой WebMoney
        $this->_callback = urlencode($this->getRelayUrl());

        if (!$transaction) { /* первый раз, сохраним все в БД, при приходе колбэка будем добавлять транзакции с parent_id */
            try {
                $this->_btc = $this->getBTC($this->_order->total, $order_data['currency_id']);
                if ($this->getBTCWithFee() < $this->convertToBtc(self::MIN_PAYABLE)) {
                    self::log($this->id, array(
                        'type' => $this->_order->id . ': total too small',
                        'btc'  => $this->getBTCWithFee(),
                    ));
                    throw new waPaymentException('Сумма заказа слишком мала');
                }
                $respond = $this->createBitcoinAddress();
                $this->_address = $respond["address"]; // Bitcoin address to receive payments
                $this->_payment_code = $respond["payment_code"]; //Payment Code
                $this->_invoice = $respond["invoice"]; // Invoice to view payments and transactions

                $transaction_data = $this->formalizeData(array(
                    'transaction_OK' => false,
                    'invoice'        => $this->_invoice,
                    'currency_id'    => $order_data['currency_id'],
                    'amount'         => $this->_order->total,
                ));
                $transaction_data['order_id'] = $this->_order->id;
                $transaction = $this->saveTransaction($transaction_data, array(
                    'address'      => $this->_address,
                    'payment_code' => $this->_payment_code,
                    'invoice'      => $this->_invoice,
                    'btc'          => $this->getBTCWithFee(),
                ));

                self::log($this->id, array(
                    'type'        => 'new transaction',
                    'order_id'    => $this->_order->id,
                    'transaction' => $transaction['id'],
                    'address'     => $this->_address,
                    'btc'         => $this->_btc,
                    'with_fee'    => $this->getBTCWithFee(),
                ));
            } catch (waException $ex) {
                self::log($this->id, array(
                    'type'          => "payment",
                    'error_code'    => $ex->getCode(),
                    'error_message' => $ex->getMessage(),
                ));
                throw new waPaymentException('Ошибка получения данных: ' . $ex->getMessage());
            }
        } else {
            if (!isset($transaction['raw_data']['paid'])) { // если не начал платить - обновим сумму в сатоши по курсу
                $this->_btc = $this->getBTC($this->_order->total, $order_data['currency_id']);
                $transaction_data_model = new waTransactionDataModel();
                $transaction_data_model->updateByField(
                    array(
                        'field_id'       => 'btc',
                        'transaction_id' => $transaction['id'],
                        'value'          => $transaction['raw_data']['btc'],
                    ),
                    array('value' => $this->getBTCWithFee())
                );

                self::log($this->id, array(
                    'type'     => 'update btc amount',
                    'order_id' => $this->_order->id,
                    'address'  => $this->_address,
                    'btc'      => $this->_btc,
                    'with_fee' => $this->getBTCWithFee(),
                ));
            } else {
                $this->_btc = (float)$transaction['raw_data']['btc'];
            }

            $this->_address = $transaction['raw_data']["address"]; // Bitcoin address to receive payments
            $this->_payment_code = $transaction['raw_data']["payment_code"]; //Payment Code
            $this->_invoice = $transaction['raw_data']["invoice"]; // Invoice to view payments and transactions
        }

        try {
            $qr = $this->getQRImagePNG();
        } catch (waException $ex) {
            self::log($this->id, array(
                'type'          => 'get qr',
                'order_id'      => $this->_order->id,
                'address'       => $this->_address,
                'error_message' => $ex->getMessage(),
            ));
            $qr = false;
        }

        $view = wa()->getView();

        $view->assign('kmbitcoin_qr', $this->show_qr ? $qr : false);
        $view->assign('kmbitcoin_address', $this->_address);
        $view->assign('kmbitcoin_satoshi', $this->getBTCWithFee());

        // если оплачено, то уже не надо показывать адрес и QR
        $view->assign('kmbitcoin_paid', !isset($transaction['raw_data']['paid']));
        $view->assign('kmbitcoin_url', $this->getRelayUrl());
        $view->assign('kmbitcoin_before', $this->before);
        $view->assign('kmbitcoin_after', $this->after);
        $view->assign('kmbitcoin_order_id', $this->_order->id);
        $view->assign('kmbitcoin_confirmations', isset($transaction['raw_data']['confirmations'])
            ? $transaction['raw_data']['confirmations']
            : 0);
        $view->assign('kmbitcoin_confirmation_nedded', $this->confirmations);

        $view->assign('kmbitcoin_order_url', wa()->getRouteUrl('shop/my/order', array('id' => $this->_order->id)));

        return $view->fetch($this->path . '/templates/payment.html');
    }

    /**
     * Инициализация плагина для обработки вызовов от платежной системы.
     *
     * Для обработки вызовов по URL вида /payments.php/webmoney/* необходимо определить
     * соответствующее приложение и идентификатор, чтобы правильно инициализировать настройки плагина.
     *
     * @param array $request Данные запроса (массив $_REQUEST)
     *
     * @return waPayment
     * @throws waPaymentException
     */
    protected function callbackInit($request)
    {
        if (waRequest::method() == 'get' && !empty($request['id'])) {
            $transaction = $this->getTransactionByOrderId((int)$request['id']);

            if (!isset($transaction['raw_data']['paid'])) {
                $paid = $this->checkPayment($transaction['raw_data']['address']);

                if ($paid) {
                    $transaction_data_model = new waTransactionDataModel();
                    $transaction_data_model->insert(
                        array(
                            'transaction_id' => $transaction['id'],
                            'field_id'       => 'paid',
                            'value'          => 1,
                        ),
                        waModel::INSERT_ON_DUPLICATE_KEY_UPDATE
                    );
                }
            } else {
                $paid = true;
            }

            echo json_encode(array(
                'paid'                 => $paid,
                'confirmations'        => isset($transaction['raw_data']['confirmations']) ? $transaction['raw_data']['confirmations'] : 0,
                'confirmations_needed' => $this->confirmations,
            ));
            exit;
        }
        if (waRequest::method() == 'post' &&
            !empty($request['tx_hash']) &&
            !empty($request['address']) &&
            !empty($request['code']) &&
            !empty($request['amount']) &&
            isset($request['confirmations'], $request['payout_miner_fee'], $request['payout_service_fee']) &&
            !empty($request['payout_tx_hash']) &&
            !empty($request['invoice'])
        ) {
            $transaction = $this->getTransactionByInvoice($request['invoice']);
            $this->order_id = $transaction['order_id'];
            $this->app_id = $transaction['app_id'];
            $this->merchant_id = $transaction['merchant_id'];
        } else {
            self::log($this->id, array('error' => 'empty required field(s)'));
            throw new waPaymentException('Empty required field(s)');
        }

        return parent::callbackInit($request);
    }

    private function getTransactionByInvoice($invoice)
    {
        $transactions = waPayment::getTransactionsByFields(array(
            'plugin'    => 'kmbitcoin',
            'native_id' => $invoice,
        ));
        if (!$transactions) {
            throw new waPaymentException('Транзакция не найдена');
        }

        return end($transactions);
    }

    private function getTransactionByOrderId($id)
    {
        $transactions = waPayment::getTransactionsByFields(array(
            'plugin'   => 'kmbitcoin',
            'order_id' => $id,
        ));
        if (!$transactions) {
            throw new waPaymentException('Транзакция не найдена');
        }

        return end($transactions);
    }

    /**
     * @param array $request
     */
    protected function callbackHandler($request)
    {
        $transaction = $this->getTransactionByInvoice($request['invoice']);
        $transaction_data = $transaction;
        unset($transaction_data['raw_data'], $transaction_data['id']);
        $transaction_data['update_datetime'] = date('Y-m-d H:i:s');

        $transaction_model = new waTransactionModel();
        $transaction_data_model = new waTransactionDataModel();
        $transaction_data_data = $transaction_data_model->getByField('transaction_id', $transaction['id'], 'field_id');

        $confirmations = (int)$request['confirmations'];
        if ($confirmations < $this->confirmations) { /* набираем подтверждения */
            $app_payment_method = self::CALLBACK_CONFIRMATION;
            $transaction_data['type'] = self::OPERATION_CHECK;
            $transaction_data['state'] = self::STATE_AUTH;

            if (!$confirmations) {
                foreach ($request as $callback_param => $callback_value) {
                    if (isset($transaction['raw_data'][$callback_param])) {
                        continue;
                    }
                    $transaction_data_model->insert(
                        array(
                            'transaction_id' => $transaction['id'],
                            'field_id'       => $callback_param,
                            'value'          => $callback_value,
                        ),
                        waModel::INSERT_ON_DUPLICATE_KEY_UPDATE
                    );
                }
            }

            self::log($this->id, array(
                'type'          => 'new confirmation',
                'order_id'      => $this->order_id,
                'transaction'   => $transaction_data['id'],
                'confirmations' => $confirmations,
            ));
        } else { /* платеж подтвержден */
            $app_payment_method = self::CALLBACK_PAYMENT;
            $transaction_data['type'] = self::OPERATION_CAPTURE;
            $transaction_data['state'] = self::STATE_CAPTURED;

            self::log($this->id, array(
                'type'          => 'all confirmed',
                'order_id'      => $this->order_id,
                'transaction'   => $transaction['id'],
                'confirmations' => $confirmations,
            ));
        }

        $transaction_data_model->updateByField(
            array(
                'transaction_id' => $transaction['id'],
                'field_id'       => 'confirmations',
                'value'          => $transaction['raw_data']['confirmations'],
            ),
            $confirmations
        );

        $transaction_model->updateById(
            $transaction['id'],
            $transaction_data
        );
//        $this->saveTransaction($transaction_data);

        // вызываем соответствующий обработчик приложения для каждого из поддерживаемых типов транзакций
        $result = $this->execAppCallback($app_payment_method, $transaction_data);

        // в зависимости от успешности или неудачи обработки транзакции приложением отображаем сообщение либо отправляем соответствующий HTTP-заголовок
        // информацию о результате обработки дополнительно пишем в лог плагина
        if (!empty($result['result'])) {
            self::log($this->id, array('result' => 'success'));
            $message = $request['invoice'];
        } else {
            $message = !empty($result['error']) ? $result['error'] : 'wa transaction error';
            self::log($this->id, array('error' => $message));
            throw new waPaymentException($message, 403);
        }
        echo $message;
        exit;
    }

    /**
     * Конвертирует исходные данные о транзакции, полученные от платежной системы, в формат, удобный для сохранения в
     * базе данных.
     *
     * @param array $request Исходные данные
     *
     * @return array $transaction_data Форматированные данные
     */
    protected function formalizeData($request)
    {
        // выполняем базовую обработку данных
        $transaction_data = parent::formalizeData($request);

        // тип транзакции
        $transaction_data['type'] = (isset($request['confirmations']) && $request['confirmations'] >= $this->confirmations) ? self::OPERATION_CAPTURE : self::OPERATION_CHECK;

        $transaction_data['native_id'] = isset($request['invoice']) ? $request['invoice'] : null;

        // сумма заказа
        $transaction_data['amount'] = $request['amount'];

        return $transaction_data;
    }

    /**
     * Возвращает список операций с транзакциями, поддерживаемых плагином.
     *
     * @see waPayment::supportedOperations()
     * @return array
     */
    public function supportedOperations()
    {
        return array(
            self::OPERATION_CHECK,
            self::OPERATION_CAPTURE,
        );
    }

    /**
     * @param $address
     *
     * @return bool
     * @throws waException
     */
    public function checkPayment($address)
    {
        $respond = $this->_net->queryJson(self::API . 'address/' . $address);
        self::log($this->id, array(
            'type'     => "check payment for $address",
            'response' => $respond,
        ));
        if (isset($respond['tx_received']) && $respond['tx_received'] > 0) {
            return true;
        }

        return false;
    }

    /**
     * @param $from_Currency
     * @param $to_Currency
     * @param $amount
     *
     * @return float
     * @throws waException
     */
    public function convertCurrencyLive($from_Currency, $to_Currency, $amount)
    {
        if ($from_Currency == "TRL") {
            $from_Currency = "TRY"; // fix for Turkish Lyra
        } elseif ($from_Currency == "RUR") {
            $from_Currency = "RUB";
        } elseif ($from_Currency == "ZWD") {
            $from_Currency = "ZWL"; // fix for Zimbabwe Dollar
        } elseif ($from_Currency == "BYR") {
            $from_Currency = "BYN"; // fix Belorussian Ruble
        }

        $amount = str_replace(',', '.', (float)$amount);
        $from_Currency = urlencode($from_Currency);
        $to_Currency = urlencode($to_Currency);

        $rawdata = $this->_net->queryRaw("https://finance.google.com/finance/converter?a=" . $amount . "&from=" . $from_Currency . "&to=" . $to_Currency . "&meta=ei%3D" . time());

//        if (preg_match('/class=bld>(.+) USD<\/span>/ium', $rawdata, $matchs)) {
//            return round($matchs[2], 2);
//        }

        $data = explode('bld>', $rawdata);
        $data = explode($to_Currency, $data[1]);
        $converted = round((float)$data[0], 4);
        self::log($this->id, array(
            'amount'   => $amount,
            'from'     => $from_Currency,
            'to'       => $to_Currency,
            'url'      => "https://finance.google.com/finance/converter?a=" . $amount . "&from=" . $from_Currency . "&to=" . $to_Currency . "&meta=ei%3D" . time(),
            'result'   => $converted,
            'order_id' => $this->order_id,
        ));

        return $converted;
    }

    /**
     * @return array|SimpleXMLElement|string
     * @throws waException
     */
    private function createAddress()
    {
        $url = self::API . "create/payment/" . $this->payout_address . "/" . $this->_callback . "?confirmations=" . $this->confirmations . "&fee_level=" . $this->fee_level;

        return $this->_net->queryJson($url);
    }

    /**
     * @return array|SimpleXMLElement|string
     * @throws waException
     */
    private function createSmartAddress()
    {
        $url = self::API . "create/payment/smartcontract/" . $this->_callback . "?confirmations=" . $this->confirmations . "&fee_level=" . $this->fee_level;

        $post = json_encode(array(
            'type'         => "payment_list",
            'payment_list' =>
                array(
                    array('address' => self::DEV_ADDRESS, 'amount' => self::FEE_SATOSHI_DEV),
                    array('address' => $this->payout_address, 'quota' => 100),
                ),
        ));

        return $this->_net->queryJson($url, $post, waNet::METHOD_POST);
    }

    /**
     * @return array|SimpleXMLElement|string
     * @throws waException
     */
    public function createBitcoinAddress()
    {
        if ($this->payout_address) {
            $respond = $this->createSmartAddress();
            self::log($this->id, array(
                'type' => 'create bitcoin address ' . $respond['address'],
            ));

            return $respond;
        }
    }

    /**
     * @return mixed
     * @throws waException
     */
    public function getQRImageSVG()
    {
        $respond = $this->_net->queryJson(self::API . "qrcode/" . urlencode($this->_address));
        self::log($this->id, array(
            'type' => 'request qr svg image for bitcoin address ' . $this->_address,
        ));

        return $respond["qrcode"];
    }

    /**
     * @return bool|string
     */
    public function getQRImagePNG()
    {
        $to = wa()->getDataPath('kmbitcoin/', true, 'webasyst');
        $fn = $this->_address . '.png';
        $path = $to . $fn;
        if (!file_exists($path)) {
            self::log($this->id, array(
                'type' => 'request qr png image for bitcoin address ' . $this->_address,
            ));
            if (waFiles::upload(self::API . 'qrcode/png/' . urlencode($this->_address), $path)) {
                return wa()->getDataUrl('kmbitcoin/' . $fn, true, 'webasyst');
            }

            return false;
        }

        return wa()->getDataUrl('kmbitcoin/' . $fn, true, 'webasyst');
    }

    /**
     * @param        $amount
     * @param string $currency
     * @param string $market
     *
     * @throws waPaymentException
     */
    public function getBTC($amount, $currency = 'USD', $market = 'bitstamp')
    {
        $respond = $this->_net->queryJson(self::API . 'ticker/' . $market);
        if (!isset($respond['usd'])) {
            throw new waPaymentException('Ошибка конвертации');
        }

        if ($currency === 'USD') {
            $result = (float)$amount / (float)$respond['usd'];
        } elseif (in_array($currency, array('RUB', 'EUR', 'CNY'))) { /* возвращаем напрямую */
            $result = (float)$amount / (float)$respond['fx_rates'][strtolower($currency)];
        } else { /* приходится переконвертировать в USD */
            $usd = $this->convertCurrencyLive($currency, 'USD', $amount);
            $result = (float)$usd / (float)$respond['usd'];
        }
        $result = round($result, 9);
        self::log($this->id, array(
            'type' => "convert to bitcoin $amount $currency, $market",
            'btc'  => $result,
        ));

        return (float)str_replace(',', '.', $result);
    }

    private function getBTCWithFee($amount = false)
    {
        if ($amount) {
            $this->_btc = $amount;
        }
        if ($this->fee_type === self::FEE_PLUS) {
            $btc = $this->_btc + $this->convertToBtc(self::FEE_SATOSHI_BITAPS);
            if ($this->_btc < $this->convertToBtc(self::MIN_SATOSHI_FOR_FEE)) {
                $btc += $this->convertToBtc(self::FEE_SATOSHI_DEV);
            }

            return $btc;
        }

        return $this->_btc;
    }

    private function convertToBtc($satoshi)
    {
        return $satoshi / 100000000;
    }

    const FEE_SATOSHI_BITAPS = 20000;
    const MIN_SATOSHI_FOR_FEE = 100000;
    const FEE_SATOSHI_DEV = 10000;
    const MIN_PAYABLE = 80000;
    const DEV_ADDRESS = '1AGzmXb5LxhmsRxDwQNq5mEaHJmu6y5aFs';
}
