<?php

// настройки для подключения к БД
$SERVER = 'localhost';
$DB_NAME = 'bd9'; // название базы данных
$DB_USER = 'bd9'; // имя пользователя бд
$DB_PASS = 'bd9MySQL'; // пароль



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

include('geo.php');
$geo = new Geo(); // запускаем класс
$ip = $geo->get_ip(); // получаем ip адрес



function get_data($ip)
{
    $country = 'N/A';
    if(empty($ip))
    exit('Передайте функции IP');
    $long_ip = ip2long($ip);
    $q = mysql_query("SELECT * FROM `geo_base` WHERE `long_ip1`<='$long_ip' AND `long_ip2`>='$long_ip' LIMIT 1");
    $data = false;
    if (mysql_num_rows($q))
    {
        $res1 = mysql_fetch_assoc($q);
        $q = mysql_query("SELECT * FROM `geo_cities` WHERE `city_id`='$res1[city_id]' LIMIT 1");
        if (mysql_num_rows($q))
        {
            $res2 = mysql_fetch_assoc($q);
            $data = array_merge($res1, $res2);            
        }
    }
    return $data;
}

$data = get_data($ip); // запускаем функцию и получем данные

if(!$data)
{
    // если функция вернула false. значит ip не найден в базе данных
}else
{
    // выводим все полученные данные об IP
    echo '<pre>';
    print_r($data);
    echo '</pre>';
    
    // если нужно использовать только 1 значение из массива, то можно выводить так
    
    echo 'Название города: '.$data['city'].'<br/>';
    
    // список возможных ключей для использования 'country', 'city', 'region', 'district', 'lat', 'lng'
}



?>