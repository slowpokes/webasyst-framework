<?php

class cashPayment extends waPayment
{
    public function allowedCurrency()
    {
        return true;
    }

    public function customFields(waOrder $order)
    {
        if($this->order_discount > 0) {
            $result = array(
                'order_discount' => array(
                    'value' => $this->order_discount,
                    'class' => 'order-discount',
                    'control_type' => waHtmlControl::HIDDEN,
                ),
            );
            return $result;
        }
        return array();
    }
}
