<?php

class regionShipping extends waShipping
{

    public function calculate(){
        $region_id = $this->getAddress('region');
        if ($region_id) {
            if (isset($this->regions['price'][$region_id])) {
                $price = $this->regions['price'][$region_id];
                $time = $this->regions['time'][$region_id];
                if($price>0){
                    //мы доставляем в этот регион
                    $rate = $price;
                    $order_price = $this->getTotalPrice();
                    if($order_price>=$this->free_shipping){
                        if($this->free_shipping_amount > 0){
                            $rate =  $price - $this->free_shipping_amount;
                            if($rate < 0){
                                $rate = 0;
                            }
                        }
                        else {
                            $rate = 0;
                        }
                    }

                    return array(
                        'delivery' => array(
                            'est_delivery' => $time,
                            'currency'     => 'RUB',
                            'rate'         => $rate,
                            'params' => array(
                                'shipment_type' => $this->shipment_type,
                            ),
                        ),
                    );
                }
            }
        }
        return null;
    }

    public function allowedCurrency()
    {
        return 'RUB';
    }

    public function allowedWeightUnit()
    {
        return 'kg';
    }

    public function tracking($tracking_id = null)
    {
        return $this->myTracking($tracking_id);
    }

    public static function settingRegionControl($name, $params = array()){
        $control = '';
        $values = $params['value'];
        $rm = new waRegionModel();
        if ($regions = $rm->getByCountry('rus')) {

            $control .= "<table class=\"zebra\"><thead>";
            $string = '<tr><td>%s</td><td class="inp_price">%s</td><td class="inp_time">%s</td></tr>';
            $c_params = array();
            $control .= "<tr class=\"gridsheader\">";
            $control .= "<th>Регион</th>";
            $control .= "<th>Стоимость доставки<br>(0 - доставка не осуществляется)</th>";
            $control .= "<th>Срок доставки</th>";
            $control .= "</tr></thead><tbody>";

            foreach ($regions as $region) {
                $title = $region['name'];
                if ($region['code']) {
                    $title .= " ({$region['code']})";
                }
                $c_params['value'] = '';
                if(isset($values[$region['code']])){
                    $c_params['value'] = $values[$region['code']];
                }
                if(isset($values['price'][$region['code']])){
                    $c_params['value'] = $values['price'][$region['code']];
                }
                $c_params['namespace'] = $name."[price]";
                $price = waHtmlControl::getControl(waHtmlControl::INPUT, $region['code'], $c_params);

                $c_params['value'] = '';
                if(isset($values['time'][$region['code']])){
                    $c_params['value'] = $values['time'][$region['code']];
                }
                $c_params['namespace'] = $name."[time]";
                $time = waHtmlControl::getControl(waHtmlControl::INPUT, $region['code'], $c_params);
                $control .= sprintf($string, $title, $price, $time);
            }
            $control .= "</tbody>";
            $control .= "</table>";
        } else {
            $control .= 'Не определено ни одной области. Для работы модуля необходимо определить хотя бы одну область в России (см. раздел «Страны и области»).';
        }
        return $control;
    }

    public function saveSettings($settings = array())
    {

        return parent::saveSettings($settings);
    }

    private function myTracking($barcode){
        $model = new waModel();
        $data = $model->query("SELECT * FROM shipment_codecheck WHERE barcode = '$barcode' ORDER BY operation_date, datetime, id")->fetchAll();
        $result = "";
        if(count($data)>0){
            $result = "<table class='tracking_table table'>";
            foreach($data as $line){
                $result .= "<tr>";
                $result .= "<td>".date('d.m.Y H:i', strtotime($line['operation_date']))."</td>";
                $result .= "<td>{$line['operation_place']}</td>";
                $result .= "<td>{$line['operation_type']}</td>";
                $result .= "<td>{$line['operation_text']}</td>";
                $result .= "</tr>";
            }
            $result .= "</table>";
        }
        return $result;
    }

    public function getSettingsHTML($params = array()){
        $view = wa()->getView();
        $html = '';
        $html .= $view->fetch($this->path.'/templates/settings.html');
        $html .= parent::getSettingsHTML($params);
        return $html;
    }

    public static function settingChangeShippingAmountControl () {
        return '<input id="change_shipping_amount" type="button" class="button green" value="Изменить стоимость" />';
    }

    public function requestedAddressFields()
    {
        //request either all or no address fields depending on the value of the corresponding plugin settings option
        return $this->prompt_address ? array() : false;
    }
}
