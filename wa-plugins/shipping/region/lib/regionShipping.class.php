<?php

class regionShipping extends waShipping
{

    public function calculate(){
        $region_id = $this->getAddress('region');
        if ($region_id) {
            if (isset($this->regions[$region_id])) {
                $price = $this->regions[$region_id];
                if($price>0){
                    //мы доставляем в этот регион
                    $rate = $price;
                    $order_price = $this->getTotalPrice();
                    if($order_price>=$this->free_shipping){
                        $rate = 0;
                    }
                    return array(
                        'delivery' => array(
                            'est_delivery' => 'Завтра',
                            'currency'     => 'RUB',
                            'rate'         => $rate,
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

    public function tracking(){

    }

    public static function settingRegionControl($name, $params = array()){
        $control = '';
        $values = $params['value'];
        $rm = new waRegionModel();
        if ($regions = $rm->getByCountry('rus')) {

            $control .= "<table class=\"zebra\"><thead>";
            $string = '<tr><td>%s</td><td>%s</td></tr>';
            $c_params = array();
            $c_params['namespace'] = array($name);
            $control .= "<tr class=\"gridsheader\"><th>";
            $control .= htmlentities('Впишите стоимость доставки для каждого региона (0 - доставка не осуществляется)', ENT_QUOTES, 'utf-8');
            $control .= "</th>";
            $control .= "<th></th>";
            $control .= "</tr></thead><tbody>";

            foreach ($regions as $region) {
                $title = $region['name'];
                if ($region['code']) {
                    $title .= " ({$region['code']})";
                }
                $c_params['value'] = $values[$region['code']];
                $price = waHtmlControl::getControl(waHtmlControl::INPUT, $region['code'], $c_params);
                $control .= sprintf($string, $title, $price);
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
}
