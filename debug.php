<?php

$debug = 0;

if(isset($_GET['debug'])){
    if($_GET['debug']=='1') $debug = 1;
    if($_GET['debug']=='2') $debug = 2;
    setcookie('show_debug', $debug, time()+60*60*24*365*10);
}

echo time()." OK";

//testing repo