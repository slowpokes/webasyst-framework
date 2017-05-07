<?php

return array(
    'merchant_commission' => array(
        'value'        => '0',
        'title'        => 'Комиссия, начисляемая за использование сервиса (в %)',
        'description'  => '',
        'control_type' => waHtmlControl::INPUT,
    ),
    'order_discount' => array(
        'value'        => '0',
        'title'        => 'Скидка к заказу (в %)',
        'description'  => '',
        'control_type' => waHtmlControl::INPUT,
    ),
    'disable_order_discount' => array(
        'value'        => false,
        'title'        => 'Отменить все остальные скидки',
        'description'  => '',
        'control_type' => waHtmlControl::CHECKBOX,
    ),
);
