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
        //$ip = '188.244.45.3'; // test
        $data = $this->model->getData($ip);
        return $data;
    }

    public function getCity(){
        $cookie_sity = waRequest::cookie('city');
        if($cookie_sity) return $cookie_sity;
        $data = $this->getGeoData();
        if(isset($data['city'])) return $data['city'];
        return '';
    }

    public function getData(){
        $city = '';
        $region = 0;
        $cookie_sity = waRequest::cookie('city');
        $cookie_region = waRequest::cookie('region');
        if($cookie_sity) {
            $city = $cookie_sity;
        }
        if($cookie_region) {
            $region = $cookie_region;
        }
        if(($city=='')||($region==0)){
            $data = $this->getGeoData();
            if(isset($data['city'])) {
                $city = $data['city'];
            }
            if(isset($data['region_id'])) {
                $region = $data['region_id'];
            }
        }
        if(($city!='')&&($region>0))
            return array('city'=>$city, 'region'=>$region);
        return null;
    }

    public function saveData($data){
        if(isset($data['address.shipping']['region'])&&($data['address.shipping']['region']>0)){
            wa()->getResponse()->setCookie('region', $data['address.shipping']['region'], time() + 365 * 86400, null, '', false, true);
        }
        if(isset($data['address.shipping']['city'])&&($data['address.shipping']['city']!='')){
            wa()->getResponse()->setCookie('city', $data['address.shipping']['city'], time() + 365 * 86400, null, '', false, true);
        }
    }
}