<?php
return array(
    'price' => array(
        'value' => '',
        'title' => 'Фикс стоимость',
        'control_type' => waHtmlControl::INPUT,
    ),
    'commission' => array(
        'value'        => '0',
        'title'        => 'Плата за сумму объявленной ценности посылки',
        'description'  => 'Укажите размер комиссии в процентах. Например, укажите 4, если с каждого рубля взимается 4 копейки.',
        'control_type' => waHtmlControl::INPUT,
    ),
    'country_code' =>array(
        'value'        => false,
        'title'        => 'Код страны',
        'control_type' => waHtmlControl::INPUT,
    ),
    'time'  => array(
        'value'        => '',
        'title'        => 'Сроки доставки',
        'control_type' => waHtmlControl::INPUT,
    ),
    'shipment_type'  => array(
        'value'        => '',
        'title'        => 'Тип доставки',
        'control_type' => waHtmlControl::SELECT,
        'options'      => waShipping::getTypes(),
    ),
);

//EOF