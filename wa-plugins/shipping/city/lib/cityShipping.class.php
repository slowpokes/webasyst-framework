<?php

class cityShipping extends waShipping
{

    public function calculate()
    {
        $city = $this->getAddress('city');
        $kladr_id = $this->getAddress('kladr_id');
        $region_id = $this->getAddress('region');

        $uniq_id = $this->uniq_id;
        $regular_region_ids = $this->regular_region_ids;
        $model = new waModel();
        $data = array();
        if($this->kladr){
            $kladr_id = $model->escape($kladr_id);
            $kladr_ids = array($kladr_id);

            $sql = "SELECT * FROM shop_kladr_corrections WHERE kladr_id = '{$kladr_id}'";
            try{
                $data = $model->query($sql)->fetchAll();
            }
            catch (Exception $e) {
                $data = array();
            }
            if($data){
                foreach ($data as $row){
                    $kladr_ids[] = $row['corrected_kladr_id'];
                }
            }

            $sql = "SELECT * FROM shop_city_shipping WHERE uniq = '{$uniq_id}' AND kladr_id IN('".implode("', '", $kladr_ids)."') LIMIT 1";
            $data = $model->query($sql)->fetch();
        }
        if(!$data) {
            if ($region_id > 0) {
                $city = $model->escape($city);
                $sql = "SELECT * FROM shop_city_shipping WHERE uniq = '{$uniq_id}' AND city = '{$city}' AND region_id = '{$region_id}' LIMIT 1";
                $data = $model->query($sql)->fetch();
            }
        }

        $order_price = $this->getTotalPrice();
        $prepayment = false;
        if($this->getPackageProperty('prepayment')){
            $prepayment = true;
        }
        $shipping_params = ($this->getPackageProperty('shipping_params'));
        if(isset($shipping_params['prepayment']) && $shipping_params['prepayment']){
            $prepayment = true;
        }

        if(waRequest::param('prepayment')){
            $prepayment = true;
        }

        $estimate = $this->getPackageProperty('estimate');

        if($estimate){
            if($this->prepayment_only){
                if($prepayment==false){
                    return null;
                }
            }
        }

        $free_shipping = false;
        if($this->free_shipping && $order_price >= $this->free_shipping){
            $free_shipping = true;
        }
        if($this->getPackageProperty('real_price')){
            $free_shipping = false;
        }


        if ($data) {
            if($free_shipping){
                $price = 0;
                $price_prepayment = 0;
            }
            else{
                $price = $data['price'];
                $price_prepayment = $data['price'];
                if($this->insurance_price){
                    $p = $order_price * $this->insurance_price/100;
                    $price += $p;
                    $price_prepayment += $p;
                }
                if($this->box_price){
                    $p = $this->box_price;
                    $price += $p;
                    $price_prepayment += $p;
                }
                if($this->np_price && !$prepayment){
                    $np_order_price = $order_price;
                    if(waRequest::param('order_prepayment_amount')){
                        $np_order_price = $order_price - waRequest::param('order_prepayment_amount');
                    }
                    if($np_order_price > 0) {
                        $p = ($np_order_price * $this->np_price) / (100 - $this->np_price);
                        $price += $p;
                    }
                }
                if($this->total_comission){
                    $p = ($order_price * $this->total_comission) / (100 - $this->total_comission);
                    $price += $p;
                    $price_prepayment += $p;
                }
            }
            $price = ceil($price/10)*10;
            $price_prepayment = ceil($price_prepayment/10)*10;
            waRequest::setParam('prepayment_rate', $price_prepayment);
            return array(
                'delivery' => array(
                    'est_delivery' => $data['time'],
                    'currency' => 'RUB',
                    'rate' => $price,
                    'params' => array(
                        'shipment_type' => $this->shipment_type,
                        'price_prepayment' => $price_prepayment,
                    ),
                ),
            );
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

    public function saveSettings($settings = array())
    {

        return parent::saveSettings($settings);
    }

    private function myTracking($barcode)
    {
        $model = new waModel();
        $data = $model->query("SELECT * FROM shipment_codecheck WHERE barcode = '$barcode' ORDER BY operation_date, datetime, id")->fetchAll();
        $result = "";
        if (count($data) > 0) {
            $result = "<table class='tracking_table table'>";
            foreach ($data as $line) {
                $result .= "<tr>";
                $result .= "<td>" . date('d.m.Y H:i', strtotime($line['operation_date'])) . "</td>";
                $result .= "<td>{$line['operation_place']}</td>";
                $result .= "<td>{$line['operation_type']}</td>";
                $result .= "<td>{$line['operation_text']}</td>";
                $result .= "</tr>";
            }
            $result .= "</table>";
        }
        return $result;
    }

    public function requestedAddressFields()
    {
        $fields = array(
            'region' => array(),
            'city' => array('cost' => true),
            'street' => array(),
        );


        if ($this->require_zip) {
            $fields += array(
                'zip' => array(),
            );
        }

        return $fields;
    }

    public static function settingClosedCitiesControl($name, $params = array()){
        $control = '';
        $values = $params['value'];

        $model = new waModel();
        $sql = "SELECT DISTINCT city FROM shop_city_shipping ORDER BY city";
        $cities = $model->query($sql)->fetchAll();

        $control .= "<table class=\"zebra\"><thead>";
        $string = '<tr><td class="map-city">%s %s</td></tr>';
        $c_params = array();
        $control .= "<tr class=\"gridsheader\">";
        $control .= "<th>Город</th>";
        $control .= "</tr></thead><tbody>";

        foreach ($cities as $row) {
            $city = $row['city'];
            $c_params['value'] = '';
            if(isset($values[$city])){
                $c_params['value'] = 1;
            }
            $c_params['namespace'] = $name;
            $input = waHtmlControl::getControl(waHtmlControl::CHECKBOX, $city, $c_params);

            $control .= sprintf($string, $input, $city);
        }
        $control .= "</tbody>";
        $control .= "</table>";
        return $control;
    }
}
