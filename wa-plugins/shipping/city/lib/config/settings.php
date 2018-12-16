<?php
return array(
    'free_shipping' => array(
        'value' => '10000000',
        'title' => 'Сумма для бесплатной доставки',
        'description' => 'Укажите сумму начиная с которой начинается бесплатная доставка',
        'control_type' => waHtmlControl::INPUT,
    ),
    'free_shipping_amount' => array(
        'value' => '0',
        'title' => 'Максимальная сумма скидки',
        'description' => 'Укажите сумму, которая будет вычитаться вместо бесплатной доставки',
        'control_type' => waHtmlControl::INPUT,
    ),
    'require_zip' => array(
        'value' => '',
        'title' => 'Запрашивать индекс',
        'control_type' => waHtmlControl::CHECKBOX,
    ),
    'uniq_id' => array(
        'value' => '',
        'title' => 'ID',
        'control_type' => waHtmlControl::INPUT,
    ),
    'shipment_type' => array(
        'value' => '',
        'title' => 'Тип доставки',
        'control_type' => waHtmlControl::SELECT,
        'options' => waShipping::getTypes(),
    ),
    'insurance_price' => array(
        'value' => '',
        'title' => 'Страхование',
        'description' => 'Процент, который прибавляется к сумме товаров (объявленной стоимости)',
        'control_type' => waHtmlControl::INPUT,
    ),
    'box_price' => array(
        'value' => '',
        'title' => 'Упаковка',
        'description' => 'Фикс сумма, которая прибавляется к итоговой сумме заказа',
        'control_type' => waHtmlControl::INPUT,
    ),
    'np_price' => array(
        'value' => '',
        'title' => 'Комиссия за наложенный платеж',
        'description' => 'Процент, который прибавляется к итоговой сумме заказа. Отменяется при предоплате',
        'control_type' => waHtmlControl::INPUT,
    ),
    'total_comission' => array(
        'value' => '',
        'title' => 'Дополнительная комиссия',
        'description' => 'Процент, который прибавляется к итоговой сумме заказа',
        'control_type' => waHtmlControl::INPUT,
    ),
    'kladr' => array(
        'value' => '',
        'title' => 'Использовать КЛАДР',
        'control_type' => waHtmlControl::CHECKBOX,
    ),
    'prepayment_only' => array(
        'value' => '',
        'title' => 'Только по предоплате',
        'control_type' => waHtmlControl::CHECKBOX,
    ),
);

//EOF