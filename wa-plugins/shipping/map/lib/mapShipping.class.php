<?php

class mapShipping extends waShipping
{

    private function getPoints($city, $kladr_id = 0)
    {
        $uniq_id = $this->uniq_id;
        $model = new waModel();
        $where = "";
        if ($city!='all') {
            if($this->kladr){
                $kladr_id = $model->escape($kladr_id);
                $kladr_ids = array($kladr_id);

                $data = array();
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
                $where = " AND kladr_id IN('".implode("', '", $kladr_ids)."') ";

            }
            else {
                $city = $model->escape($city);
                $where = " AND city = '{$city}' ";
            }

            if($kladr_id=='') {
                if ($this->getPackageProperty('real_price')) {
                    $city = $model->escape($city);
                    $where = " AND city = '{$city}' ";
                }
            }
        }

        $sql = "SELECT * FROM shop_point_shipping WHERE uniq = '{$uniq_id}' $where ORDER BY sort, address, name";
        $points = $model->query($sql)->fetchAll();
        return $points;
    }

    public function calculate()
    {
        $city = $this->getAddress('city');
        $kladr_id = $this->getAddress('kladr_id');

        $points = $this->getPoints($city, $kladr_id);
        if (count($points) == 0) {
            return null;
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

        $free_shipping = false;
        if($this->free_shipping && $order_price >= $this->free_shipping){
            $free_shipping = true;
        }
        if($this->getPackageProperty('real_price')){
            $free_shipping = false;
        }

        $price = 0;
        $price_prepayment = 0;
        if($free_shipping){
            $price_prepayment = 0;
        }
        else{
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
            if($this->np_price && !$prepayment) {
                $np_order_price = $order_price;
                if (waRequest::param('order_prepayment_amount')) {
                    $np_order_price = $order_price - waRequest::param('order_prepayment_amount');
                }
                if ($np_order_price > 0) {
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

        $result = array();
        foreach ($points as $point) {
            $point_number = substr($point['point_key'], strpos($point['point_key'], "_") + 1);
            $point_price = $price + $point['price'];
            $point_price_prepayment = $price_prepayment + $point['price'];

            $small_address = $point['address'];
            if($point['sub_region'] && $point['city'] && $point['sub_region']!=$point['city']){
                $small_address = $point['city'].", ".$point['address'];
            }

            $point_price = ceil($point_price/10)*10;
            $point_price_prepayment = ceil($point_price_prepayment/10)*10;

            waRequest::setParam('prepayment_rate', $point_price_prepayment);

            $result['point_' . $point_number] = array(
                'currency' => 'RUB',
                'rate' => $point_price,
                'name' => $point['name'] . " (" . $small_address . ")",
                'comment' => $point['name'] . " (" . $small_address . ")",
                'force_subrates' => true,
                'est_delivery' => $point['time'],
                'params' => array(
                    'id' => $point['id'],
                    'address' => $point['city'] . ', ' . $small_address,
                    'comment' => $point['comment'],
                    'lat' => str_replace(',', '.', $point['lat']),
                    'lon' => str_replace(',', '.', $point['lon']),
                    'shipment_type' => $this->shipment_type,
                    'price_prepayment' => $point_price_prepayment,
                ),
            );
        }

        return $result;
    }

    public function allowedCurrency()
    {
        return 'RUB';
    }

    public function allowedWeightUnit()
    {
        return 'kg';
    }

    public static function getFields($for_replace = false)
    {
        $fields = array(
            'city',
        );
        if ($for_replace) {
            foreach ($fields as &$field) {
                $field = '%' . $field . '%';
            }
        }
        return $fields;
    }


    public function requestedAddressFields()
    {
        return false;
    }

    public function mapAction()
    {
        $view = wa()->getView();
        $view->assign('points', $this->getPoints('all'));
        $html = $view->fetch($this->path . '/templates/map.html');
        echo $html;
    }

    public static function settingClosedCitiesControl($name, $params = array()){
        $control = '';
        $values = $params['value'];

        $model = new waModel();
        $sql = "SELECT DISTINCT city FROM shop_point_shipping ORDER BY city";
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

    public function tracking($tracking_id = null)
    {
        return $this->myTracking($tracking_id);
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
}
