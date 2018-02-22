<?php

$general = include 'general_config.php';
$local = include 'local_config.php';
$config = array_merge($general, $local);

return $config;