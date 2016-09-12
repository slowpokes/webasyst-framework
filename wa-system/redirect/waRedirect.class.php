<?php

class waRedirect {

    static $count_per_page = 50;

    static function getRoute($url, $domain){
        $model = new waRedirectModel();
        $data = $model->getByField(array('domain'=>$domain, 'url'=>$url));
        if($data){
            if($data['redirect']){
                if($data['redirect']=='/'.$data['url'])
                    return null;
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

    static function getByDomain($domain, $paging){
        $limit_start = ($paging['page']-1)*self::$count_per_page;
        $sort= 'url';
        if($paging['sort']=='redirect')$sort = 'redirect';
        if($paging['sort']=='status')$sort = "redirect != '/'";
        if($paging['sort']=='is_bad')$sort = "is_bad";
        if($paging['order']=='desc') $sort .= " desc";

        $model = new waRedirectModel();
        $data = $model->where("domain = '$domain'")->where('visible = 1')->order($sort)->limit("$limit_start, ".self::$count_per_page)->fetchAll('id');
        $total = $model->select('count(id)')->where("domain = '$domain'")->where('visible = 1')->fetchField();
        $page_count = ceil($total/self::$count_per_page);
        return array(
            'data'=>$data,
            'total'=>$total,
            'page_count'=>$page_count
        );
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