<?php

$_gl_time_start = microtime(1);

$path = dirname(__FILE__).'/wa-config/SystemConfig.class.php';

if (file_exists($path)) {
	require_once($path);
	waSystem::getInstance(null, new SystemConfig())->dispatch();
} else {
	$path = dirname(__FILE__).'/wa-installer/install.php';
	if (file_exists($path)) {
		require_once($path);
	} else {
		//404
	}
}

$_gl_time_end = microtime(1);

$time = (intval(($_gl_time_end - $_gl_time_start)*1000))/1000;
