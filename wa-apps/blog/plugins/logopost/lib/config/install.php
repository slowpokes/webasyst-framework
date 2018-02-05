<?php
/*
$plugin_id = array('shop', 'logocategory');
$app_settings_model = new waAppSettingsModel();
$app_settings_model->set($plugin_id, 'status', '1');
$app_settings_model->set($plugin_id, 'resize', '1');
$app_settings_model->set($plugin_id, 'size', '100');
$app_settings_model->set($plugin_id, 'default_output', '1');
*/
$model = new waModel();
try {
    $sql = 'SELECT `image` FROM `blog_post` WHERE 0';
    $model->query($sql);
} catch (waDbException $ex) {
    $sql = 'ALTER TABLE  `blog_post` ADD  `image` varchar(255) DEFAULT NULL AFTER  `id`';
    $model->query($sql);
}