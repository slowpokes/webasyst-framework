<?php

class cityShipping extends waShipping
{

    public function calculate()
    {
        $city = $this->getAddress('city');

        if(is_array($this->closed_cities) && isset($this->closed_cities[$city])){
            return null;
        }

        $uniq_id = $this->uniq_id;
        $model = new waModel();
        $city = $model->escape($city);
        $sql = "SELECT * FROM shop_city_shipping WHERE uniq = '{$uniq_id}' AND city = '{$city}' LIMIT 1";
        $data = $model->query($sql)->fetch();

        $order_price = $this->getTotalPrice();

        if ($data) {
            return array(
                'delivery' => array(
                    'est_delivery' => $data['time'],
                    'currency' => 'RUB',
                    'rate' => $order_price >= $this->free_shipping ? 0 : $data['price'],
                    'params' => array(
                        'shipment_type' => $this->shipment_type,
                        'commission' => $this->getSettings('commission')
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
