<?php
return array(
    'free_shipping'  => array(
        'value'        => '10000000',
        'title'        => 'Сумма для бесплатной доставки',
        'description'  => 'Укажите сумму начиная с которой начинается бесплатная доставка',
        'control_type' => waHtmlControl::INPUT,
    ),
    'free_shipping_amount' => array(
        'value' => '0',
        'title' => 'Максимальная сумма скидки',
        'description' => 'Укажите сумму, которая будет вычитаться вместо бесплатной доставки',
        'control_type' => waHtmlControl::INPUT,
    ),
    'change_shipping_amount' => array(
        'value' => '0',
        'title' => 'Массовое изменение стоимости',
        'description' => 'Укажите сумму, на которую будет увеличена (уменьшена) стоимость доставки всех регионов',
        'control_type' => waHtmlControl::CUSTOM . ' ' . 'hermespickupShipping::settingChangeShippingAmountControl',
    ),
    'regions' => array(
        'title' => 'Регионы',
        'control_type' => waHtmlControl::CUSTOM.' '.'hermespickupShipping::settingRegionControl',
    ),
);

//EOF