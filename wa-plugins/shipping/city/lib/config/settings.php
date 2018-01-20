<?php
return array(
    'free_shipping'  => array(
        'value'        => '10000000',
        'title'        => 'Сумма для бесплатной доставки',
        'description'  => 'Укажите сумму начиная с которой начинается бесплатная доставка',
        'control_type' => waHtmlControl::INPUT,
    ),
    'free_shipping_amount'  => array(
        'value'        => '0',
        'title'        => 'Максимальная сумма скидки',
        'description'  => 'Укажите сумму, которая будет вычитаться вместо бесплатной доставки',
        'control_type' => waHtmlControl::INPUT,
    ),
    'require_zip'  => array(
        'value'        => '',
        'title'        => 'Запрашивать индекс',
        'control_type' => waHtmlControl::CHECKBOX,
    ),
    'uniq_id'  => array(
        'value'        => '',
        'title'        => 'ID',
        'control_type' => waHtmlControl::INPUT,
    ),
    'shipment_type'  => array(
        'value'        => '',
        'title'        => 'Тип доставки',
        'control_type' => waHtmlControl::SELECT,
        'options'      => waShipping::getTypes(),
    ),
    'closed_cities' => array(
        'title' => 'Отключенные города',
        'control_type' => waHtmlControl::CUSTOM.' '.'cityShipping::settingClosedCitiesControl',
    ),

);

//EOF