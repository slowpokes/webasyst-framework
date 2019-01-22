<?php

class countryShipping extends waShipping
{

    public function calculate(){
        $country = $this->getAddress('country');
        if ($country) {
            if ($this->country_code == $country) {
                $rate = $this->price;

                $order_price = $this->getTotalPrice();
                $rate += $order_price * ($this->commission / 100);
                $rate = round($rate/10)*10;
                return array(
                    'delivery' => array(
                        'est_delivery' => $this->time,
                        'currency'     => 'RUB',
                        'rate'         => $rate,
                        'params' => array(
                            'shipment_type' => $this->shipment_type,
                        ),
                    ),
                );
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
