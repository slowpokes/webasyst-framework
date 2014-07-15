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
        //echo "$url\n";
        $redirect = self::getRoute($url, $domain);
        if($redirect){
            wa()->getResponse()->redirect($redirect, 301);
            return;
        }
        $url = wa()->getConfig()->getRequestUrl(true, false);
        //echo "$url\n";
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

    static function update($id, $redirect){
        $array = array();
        $array['redirect'] = self::clearTo($redirect);
        $model = new waRedirectModel();
        return $model->updateById($id, $array);
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
        return $model->where("domain = '$domain'")->where('visible = 1')->order('url')->fetchAll('id');
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