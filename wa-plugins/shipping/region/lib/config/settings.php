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
    'prompt_address' =>array(
        'value'        => false,
        'title'        => 'Запрашивать адрес',
        'description'  => 'Запрашивать адрес у покупателя',
        'control_type' => waHtmlControl::CHECKBOX,
    ),
    'change_shipping_amount' => array(
        'value' => '0',
        'title' => 'Массовое изменение стоимости',
        'description' => 'Укажите сумму, на которую будет увеличена (уменьшена) стоимость доставки всех регионов',
        'control_type' => waHtmlControl::CUSTOM.' '.'regionShipping::settingChangeShippingAmountControl',
    ),
    'commission' => array(
        'value'        => '0',
        'title'        => 'Плата за сумму объявленной ценности посылки',
        'description'  => 'Укажите размер комиссии в процентах. Например, укажите 4, если с каждого рубля взимается 4 копейки.',
        'control_type' => waHtmlControl::INPUT,
    ),
    'box_price' => array(
        'value' => '',
        'title' => 'Упаковка',
        'description' => 'Фикс сумма, которая прибавляется к итоговой сумме заказа',
        'control_type' => waHtmlControl::INPUT,
    ),
    'shipment_type'  => array(
        'value'        => '',
        'title'        => 'Тип доставки',
        'control_type' => waHtmlControl::SELECT,
        'options'      => waShipping::getTypes(),
    ),
    'regions' => array(
        'title' => 'Регионы',
        'control_type' => waHtmlControl::CUSTOM.' '.'regionShipping::settingRegionControl',
    ),
);

//EOF