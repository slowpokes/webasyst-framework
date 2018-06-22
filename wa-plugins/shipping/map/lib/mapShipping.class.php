<?php

class mapShipping extends waShipping
{

    private function getPoints($city)
    {
        $uniq_id = $this->uniq_id;
        $model = new waModel();
        $where = "";
        if ($city!='all') {
            $where = " AND city = '{$city}' ";
        }
        $sql = "SELECT * FROM shop_point_shipping WHERE uniq = '{$uniq_id}' $where ORDER BY sort, name";
        $points = $model->query($sql)->fetchAll();
        return $points;
    }

    public function calculate()
    {
        $city = $this->getAddress('city');

        if(is_array($this->closed_cities) && isset($this->closed_cities[$city])){
            return null;
        }

        $points = $this->getPoints($city);
        if (count($points) == 0) {
            return null;
        }

        $order_price = $this->getTotalPrice();

        $result = array();
        foreach ($points as $point) {
            $point_number = substr($point['point_key'], strpos($point['point_key'], "_") + 1);
            $result['point_' . $point_number] = array(
                'currency' => 'RUB',
                'rate' => $order_price >= $this->free_shipping ? 0 : $point['price'],
                'name' => $point['name'] . " (" . $point['address'] . ")",
                'comment' => $point['name'] . " (" . $point['address'] . ")",
                'force_subrates' => true,
                'est_delivery' => $point['time'],
                'params' => array(
                    'id' => $point['id'],
                    'address' => $point['city'] . ', ' . $point['address'],
                    'comment' => $point['comment'],
                    'lat' => str_replace(',', '.', $point['lat']),
                    'lon' => str_replace(',', '.', $point['lon']),
                    'shipment_type' => $this->shipment_type,
                    'commission' => $this->getSettings('commission')
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
