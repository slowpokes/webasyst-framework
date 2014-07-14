<?php

class waRedirect {

    static function getRoute($url, $domain){
        $model = new waRedirectModel();
        $data = $model->getByField(array('domain'=>$domain, 'url'=>$url));
        if($data){
            if($data['redirect']){
                return $data['redirect'];
            }
        }
        return null;
    }

    static function execute(){
        $routing = new waRouting(wa());
        $domain = $routing->getDomain(null, true);
        $url = wa()->getConfig()->getRequestUrl(true, true);
        $redirect = self::getRoute($url, $domain);
        if($redirect){
            wa()->getResponse()->redirect($redirect, 301);
        }
    }

    static function add($array){
        $array['url'] = self::clearFrom($array['url']);
        $array['redirect'] = self::clearTo($array['redirect']);
        $model = new waRedirectModel();
        if($array['url']=='/')return 0;
        return $model->insert($array);
    }

    static function get($id){
        $model = new waRedirectModel();
        return $model->getById($id);
    }

    static function delete($id){
        $model = new waRedirectModel();
        $model->deleteById($id);
    }

    static function getByDomain($domain){
        $model = new waRedirectModel();
        return $model->where("domain = '$domain'")->order('url')->fetchAll('id');
    }

    static function clearFrom($url){
        $arr = parse_url($url);
        $path = $arr['path'];
        if(substr($path, 0, 1)=='/'){
            $path = substr($path, 1);
        }
        if(substr($path, -1)!='/'){
            $path = $path.'/';
        }
        return $path;
    }

    static function clearTo($url){
        if(substr($url, 0, 7)=='http://'){
            $url = substr(7, 7);
        }
        elseif(substr($url, 0, 1)=='/'){
            return $url;
        }
        return '/'.$url;
    }
}