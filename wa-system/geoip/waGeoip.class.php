<?php

class Geoip {
    private $model;
    public function __construct(){
        $this->model = new GeoipModel();
    }

    public function getIP(){
        $ip = false;
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipa[] = trim(strtok($_SERVER['HTTP_X_FORWARDED_FOR'], ','));
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipa[] = $_SERVER['HTTP_CLIENT_IP'];
        if (isset($_SERVER['REMOTE_ADDR']))
            $ipa[] = $_SERVER['REMOTE_ADDR'];
        if (isset($_SERVER['HTTP_X_REAL_IP']))
            $ipa[] = $_SERVER['HTTP_X_REAL_IP'];
        foreach ($ipa as $ips) {
            if ($this->isValidIP($ips)) {
                $ip = $ips;
                break;
            }
        }
        return $ip;
    }

    private function isValidIP($ip = null)    {
        if (preg_match("#^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$#", $ip))
            return true;
        return false;
    }

    public function getGeoData(){
        $ip = $this->getIP();
        $data = $this->model->getData($ip);
        return $data;
    }
}