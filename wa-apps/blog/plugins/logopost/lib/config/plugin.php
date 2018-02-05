<?php

return array(
    'name' => 'Изображение для поста',
    'description' => 'Позволяет добавить главное изображение для записи блога',
    'vendor' => '985310',
    'version' => '1.0.0',
    'img' => 'img/logopost.png',
    'settings' => array(
        'status' => array(
            'title' => 'Статус плагина',
            'description' => '',
            'value' => '1',
            'settings_html_function' => 'checkbox',
        ),
        'prepare_posts_frontend' => array(
            'title' => 'Использовать стандартный вывод',
            'description' => '',
            'value' => '1',
            'settings_html_function' => 'checkbox',
        ),
    ),
    'handlers' => array(
        'backend_post_edit' => 'backendPostEdit',
        'post_delete' => 'postDelete',
        'prepare_posts_backend' => 'preparePostsBackend',
        'prepare_posts_frontend' => 'preparePostsFrontend',
    ),
);
