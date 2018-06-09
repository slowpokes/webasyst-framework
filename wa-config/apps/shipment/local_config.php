<?php

return array(
    'updater_ids' => ['ewaypickup'],
    'updater_cities_databases' => array(
        'default' => array(
            'price_plus' => 50,
        ),
    ),
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
    )
);
