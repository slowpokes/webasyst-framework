<?php 

class siteRedirectBadCli extends waCliController
{
    public function execute()
    {
        $domain = waRequest::param(0);
        $redirect_model = new waRedirectModel();
        $data = $redirect_model->where("domain = '$domain'")->where("redirect !=''")->where('visible = 1')->fetchAll();
        $db = waRequest::param(1);
        $model = new waModel($db);
        $n = count($data);
        $i = 1;
        foreach($data as $row){
            echo "$i / $n\n";
            $url = $row['redirect'];
            if(substr($url, 0, 1)=='/'){
                $url = substr($url, 1);
            }
            $parts = explode('/', $url);
            if(isset($parts[0])){
                if($parts[0]){
                    $is_bad = 0;
                    $part = $parts[0];
                    if(!isset($parts[1])){
                        $redirect_model->updateById($row['id'], array('is_bad' => 1));
                        continue;
                    }
                    $slug = $parts[1];
                    if($part=='category'){
                        $tmp = $model->query("SELECT * FROM shop_category WHERE url = :url LIMIT 1", array('url' => $slug))->fetch();
                        if(!$tmp){
                            $is_bad = 1;
                        }
                    }
                    elseif($part=='product'){
                        $tmp = $model->query("SELECT * FROM shop_product WHERE url = :url LIMIT 1", array('url' => $slug))->fetch();
                        if(!$tmp){
                            $is_bad = 1;
                        }
                    }
                    elseif($part=='set'){
                        $tmp = $model->query("SELECT * FROM shop_set WHERE id = :url LIMIT 1", array('url' => $slug))->fetch();
                        if(!$tmp){
                            $is_bad = 1;
                        }
                    }
                    elseif($part=='brand'){
                        $tmp = $model->query("SELECT * FROM shop_brand WHERE name = :url LIMIT 1", array('url' => urlencode($slug)))->fetch();
                        if(!$tmp){
                            $is_bad = 1;
                        }
                    }
                    else{
                        $tmp = $model->query("SELECT * FROM shop_page WHERE url = :url LIMIT 1", array('url' => $url))->fetch();
                        if(!$tmp){
                            $is_bad = 1;
                        }
                    }
                    if($is_bad != $row['is_bad']){
                        $redirect_model->updateById($row['id'], array('is_bad' => $is_bad));
                    }
                }
            }
            else{
                $redirect_model->updateById($row['id'], array('is_bad' => 1));
            }
            $i++;
        }

        echo "OK\n";
        exit;
    }
}