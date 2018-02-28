<?php
return array(
    /******************
     * API *
     ******************/
    'b2c_api' => array(
        'client_id' => 'OOOSTANDARTSERVIS',
        'key' => '297E47BB',
        'sender' => 'Интернет магазин пафюмерии',
    ),
    'sdt_api' => array(
        'login' => '465',
        'password' => 't7bLHYTQ',
        'url' => 'https://api.accordpost.ru/ff/v1/wsrv'
    ),
    'hermes_api'=> array(
        'login' => 'aromacode2',
        'password' => '&^=0]X%)',
        'business_unit_code' => '2811',
        'distribution_center_code' => '435',
        'url' => 'https://api.hermes-dpd.ru/WS/RestService.svc/rest/',
        'debug' => '0',
    ),
    'cdek_api' => array(
        'url' => 'http://integration.cdek.ru/',
        'account' => 'b474b0fca8771a5930aa1cc59ec3152c',
        'password' => 'a41c50bc55c23b01b70f4972ab9dfed3',
        'email' => 'chelbeh@gmail.com',
        'sender' => array(
            'name' => 'Стандарт Сервис',
            'postcode' => '115324',
            'phone' => '+7 (495) 662-30-60',
            'city_code' => '',
            'street' => 'Варшавское шоссе',
            'house' => '5'
        )
    ),
    /******************
     * INFO *
     ******************/
    'post_prefixes' => array(
        'shop_mmtt'=>'#MT-',
        'shop_magic'=>'#MG-',
        'shop_aromateca'=>'#AR-',
        'shop_cttt'=>'#CT-'
    ),
    'shop_prefixes' => array(
        'shop_mmtt'=>'#MT-',
        'shop_magic'=>'#MG-',
        'shop_aromateca'=>'#AR-',
        'shop_cttt'=>'#CT-'
    ),
    'delivery_methods_uniq' => array(
        'b2c' => 'Курьер B2C',
        'cdek' => 'Курьер СДЭК',
        'cdekpickup' => 'ПВЗ - СДЭК',
        'hermes' => 'ПВЗ - Гермес',
        'post' => 'Почта России',
        'post1' => 'Почта России 1 класс',
        'sdtpost' => 'СДТ Почта России',
        'sdtpost1' => 'СДТ Почта России 1 класс',
    ),

    'delivery_methods' => array(
        'sdtpost' => 'Почта России',
        'sdtpost1' => 'Почта России 1 класс',
        'sdtems' => 'Почта EMS',
        'sdtkaz' => 'Почта СНГ Казахстан',
        'sdtbel' => 'Почта СНГ Беларусь',

        /* 'ruspost' => 'Почта России',
         'post' => 'Почта России',
         'ruspost1' => 'Почта России 1 класс',
         'pr1' => 'Почта России 1 класс',
         'ems' => 'Почта EMS',
         'sng' => 'Почта СНГ',*/

        'b2c' => 'Курьер B2C',
        'cdek' => 'Курьер СДЕК',
        'moscow' => 'Курьер Мо',

        'cdekpickup' => 'Пункты выдачи СДЕК',
        'hermes' => 'Пункты выдачи Гермес'
    ),
    /******************
     * STATUSES *
     ******************/
    'statuses'=>array(
        'process' => 'processing',
        'assembly' => 'assembly',
        'delivery' => 'delivery',
        'delivered' => 'delivered',
    ),
    /******************
     * ACTIONS *
     ******************/
    'actions' => array(
        'process' => 'process',
        'assembly' => 'to_assembly',
        'delivery' => 'to_delivery',
        'barcode' => 'add_barcode_pr',
    ),
    'mail_check' => array(
        'host' => 'pop.yandex.ru',
        'port' => 110,
        'user' => 'aromacode.result@yandex.ru',
        'password' => 'aromacodePassword',
    ),
    'checker_statuses' => ['delivery'],
    'barcode_action' => 'add_code',
    'action_delivered' => 'delivered',
    'action_completed' => 'complete',
    'action_return' => 'vozvrat',
    'action_inpoint' => 'in_point',
    'barcodes_limit' => 10,
    'php_path' => 'php',
    'status_assembly' => 'processing',
 /*   'company' => array(
        'name' => 'Лидер Бренд',
        'boss' => 'Юдин Д.Г.',
        'address' => '115191, г.Москва, ул. 2-я Рощинская, д.4, оф.503',
        'inn' => '7725832471',
        'kpp' => '772501001',
        'ogrn' => '1147746693258',
        'raschet' => '40702810101270000039',
        'bank' => 'ТОЧКА ПАО БАНКА "ФК ОТКРЫТИЕ"',
        'kor' => '30101810845250000999',
        'bik' => '044525999'
    ),*/
    /******************
     * DATABASES *
     ******************/
    'databases' => array(
        'mmtt' => array(
            'id_contact' => 'default',
            'prefix' => '#MT-',
            'cli' => 'php /home/bd9/bd9.ru/cli.php shop_mmtt consolePluginUpdate',
            'url' => 'http://bd9.ru/webasyst/shop_mmtt/',
        ),
        'aromateca' => array(
            'id_contact' => 'default',
            'prefix' => 'AR-',
            'cli' => 'php /home/bd9/bd9.ru/cli.php shop_aromateca consolePluginUpdate',
            'url' => 'http://bd9.ru/webasyst/shop_aromateca/',
        ),
        'magic' => array(
            'id_contact' => 'default',
            'prefix' => 'MG-',
            'cli' => 'php /home/bd9/bd9.ru/cli.php shop_magic consolePluginUpdate',
            'url' => 'http://bd9.ru/webasyst/shop_magic/',
        ),
        'cttt' => array(
            'id_contact' => 'default',
            'prefix' => 'CT-',
            'cli' => 'php /home/bd9/bd9.ru/cli.php shop_cttt consolePluginUpdate',
            'url' => 'http://bd9.ru/webasyst/shop_cttt/',
        ),
    ),
    'company' => array(
        'name' => 'Стандарт Сервис',
        'boss' => 'Курков Ю. Е.',
        'address' => '119019, г.Москва, Филипповский пер. д.7, пом.1, комн.3-4',
        'inn' => '7704315899',
        'kpp' => '770401001',
        'ogrn' => '1157746418730',
        'raschet' => '40702810801270001215',
        'bank' => 'ТОЧКА ПАО БАНКА "ФК ОТКРЫТИЕ"',
        'kor' => '30101810845250000999',
        'bik' => '044525999'
    ),

    /******************
     * SHIPPING PLUGINS *
     ******************/
    'shipping_plugins' => array(
        'shop_mmtt' => array(
            'b2c' => array(18),
            'hermes' => array(19),
            'cdek' => array(25),
            'post' => array(14),
            'pr1' => array(16),
            'sng' => array(23, 24),
            'ems' => array(26),
        ),
        'shop_cttt' => array(
            'b2c' => array(18),
            'hermes' => array(19),
            'cdek' => array(),
            'post' => array(14),
            'pr1' => array(16),
            'sng' => array(23, 24),
            'ems' => array(25),
        ),
        'shop_magic' => array(
            'b2c' => array(21),
            'hermes' => array(28),
            'cdek' => array(),
            'post' => array(15),
            'pr1' => array(18),
            'sng' => array(),
            'ems' => array(29),
        ),
        'shop_aromateca' => array(
            'b2c' => array(21),
            'hermes' => array(27),
            'cdek' => array(22),
            'post' => array(15),
            'pr1' => array(18),
            'sng' => array(),
            'ems' => array(29, 37),
        ),
    ),
    'logistic' => array(
        'ruspost' => 'Почта России',
        'post' => 'Логоскор Почта России',
        'ruspost1' => 'Почта России 1 класс',
        'pr1' => 'Логоскор Почта России 1 класс',
        'ems' => 'Логоскор Почта EMS',
        'sng' => 'Логоскор Почта СНГ',
        'sdtpost' => 'СДТ Почта России',
        'sdtpost1' => 'СДТ Почта России 1 класс',
        'b2c' => 'B2Cpl Курьер',
        'cdek' => 'СДЕК Курьер',
        'moscow' => 'Москва и МО Курьер',

        'cdekpickup' => 'ПВЗ СДЕК',
        'hermes' => 'ПВЗ Гермес',
        'total' => 'Итого'
    ),

);
