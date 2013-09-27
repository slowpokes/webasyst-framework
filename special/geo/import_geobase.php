<?php

set_time_limit(0); // указываем, чтобы скрипт не ограничивался временем по умолчанию
ignore_user_abort(1); // указываем, чтобы скрипт продолжал работать даже при разрыве
ini_set('memory_limit','256M');

// настройки для подключения к БД
$SERVER = 'localhost';
$DB_NAME = 'vbd9'; // название ВАШЕЙ базы данных
$DB_USER = 'root'; // имя пользователя ВАШЕЙ бд
$DB_PASS = 'root'; // пароль от ВАШЕЙ бд



// Соединяемся с базой данных
// авторизация на сервере базы
if (!($db = mysql_pconnect($SERVER, $DB_USER, $DB_PASS)))
{
    echo "Нет соединения с сервером базы<br />*проверьте параметры подключения";
    exit;
}
// подключение к базе
if (!mysql_select_db($DB_NAME, $db))
{
    echo "База даных не найдена<br />*проверьте, существует ли данная база";
    exit;
}
mysql_query('set charset utf8', $db);
mysql_query('SET names utf8', $db);
mysql_query('set character_set_client="utf8"', $db);
mysql_query('set character_set_connection="utf8"', $db);
mysql_query('set character_set_result="utf8"', $db);



// проверяем наличие файла cities.txt в папке рядом с этим скриптом
if(file_exists('cities.txt'))
{
    mysql_query("TRUNCATE TABLE `geo_cities`"); // очищаем таблицу перед импортом актуальных данных
    $file = file('cities.txt');
    $pattern = '#(\d+)\s+(.*?)\t+(.*?)\t+(.*?)\t+(.*?)\s+(.*)#';
    foreach ($file as $row)
    {
        $row = iconv('windows-1251', 'utf-8', $row);
        if(preg_match($pattern, $row, $out))
        {
            mysql_query("INSERT INTO `geo_cities` (`city_id`, `city`, `region`, `district`, `lat`, `lng`) VALUES('$out[1]', '$out[2]', '$out[3]', '$out[4]', '$out[5]', '$out[6]')");
        }        
    }   
    echo mysql_error(); 
}else
{
    echo 'Ошибка! Файл cities.txt должен лежать рядом с этим файлом!';
}

// проверяем наличие файла cidr_optim.txt в папке рядом с этим скриптом
if(file_exists('cidr_optim.txt'))
{
    mysql_query("TRUNCATE TABLE `geo_base`"); // очищаем таблицу перед импортом актуальных данных

    $file = file('cidr_optim.txt');
    $pattern = '#(\d+)\s+(\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+-\s+(\d+\.\d+\.\d+\.\d+)\s+(\w+)\s+(\d+|-)#';
    foreach ($file as $row)
    {
        if(preg_match($pattern, $row, $out))
        {
            mysql_query("INSERT INTO `geo_base` (`long_ip1`, `long_ip2`, `ip1`, `ip2`, `country`, `city_id`) VALUES('$out[1]', '$out[2]', '$out[3]', '$out[4]', '$out[5]', '$out[6]')");
        }        
    }
    echo mysql_error();
}else
{
    echo 'Ошибка! Файл cidr_optim.txt должен лежать рядом с этим файлом!';
}


?>