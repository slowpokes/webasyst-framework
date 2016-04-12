<?php

if (PHP_SAPI !== 'cli') {
    // Chelbeh code
    if ($_SERVER['SERVER_NAME'] == 'magic.vadim-z.ru') {
        //Если не переданы важные параметры запуска
        if (!isset($_GET['app']) || !isset($_GET['class'])) {
            die("<form>" .
                "APP_ID:<input type='text' name='app'><br>" .
                "Class:<input type='text' name='class'><br>" .
                "Parameters:<input type='text' name='params'>(разделять пробелами)<br>" .
                "<input type='submit'></form>");
        } else {
            //получаем параметры из поля 'params' и разбиваем его на отдельные параметры пробелами
            $params = isset($_GET['params']) ? explode(" ", $_GET['params']) : array();
            //Формируем "фиальшивые" параметры командной строки
            $_SERVER['argv'] = array_merge(
                array("cli.php",
                    $_GET['app'],
                    $_GET['class']), $params);

            //откроем стандартный вывод чтобы все ошибки попадали не в лог сервера
            //а прямо в выдачу браузера
            define("STDERR", fopen("php://output", "w"));
        }
        $_SERVER['argc'] = count($_SERVER['argv']);
    } else {
        //Сервер не локальный
        die('Run from CLI only!');
    }
}

if ($_SERVER['argc'] < 3) {
    die('Use ' . PHP_EOL . realpath(dirname(__FILE__) . '/../') . '/cli.php APP CLASS PARAMS');
}

try {
    require_once realpath(dirname(__FILE__) . '/../wa-config/') . '/SystemConfig.class.php';
    $config = new SystemConfig('cli');
    waSystem::getInstance(null, $config)->dispatchCli($_SERVER['argv']);
} catch (Exception $e) {
    waLog::log($e, 'cli.log');
    if (waSystemConfig::isDebug()) {
        fwrite(STDERR, PHP_EOL . $e . PHP_EOL);
    }
}
