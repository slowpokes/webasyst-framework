<?php 

class siteRedirectBadAction extends waViewAction
{
    public function execute()
    {
        $domain = siteHelper::getDomain();
        $model = new waRedirectModel();
        $data = $model->where("domain = '$domain'")->where("redirect !=''")->where('visible = 1')->fetchAll();
        $blocks = array();
        $bad_parts = array();
        foreach($data as $row){
            $url = $row['redirect'];
            if(substr($url, 0, 1)=='/'){
                $url = substr($url, 1);
            }
            $parts = explode('/', $url);
            if(isset($parts[0])){
                if($parts[0]){
                    $part = $parts[0];
                    if($part=='category'){

                    }
                    elseif($part=='product'){

                    }
                    elseif($part=='set'){

                    }
                    else{
                        if(!isset($bad_parts[$part])){
                            $bad_parts[$part] = array();
                        }
                        $bad_parts[$part][] = $url;
                    }
                }
            }
        }

        print_r($bad_parts);
        echo "OK";
        exit;
    }
}