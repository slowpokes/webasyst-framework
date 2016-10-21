<?php 

class siteRedirectCheckCli extends waCliController
{
    public function execute()
    {
        $domain = waRequest::param(0);
        $redirect_model = new waRedirectModel();
        $data = $redirect_model->where("domain = '$domain'")->where("redirect !=''")->fetchAll();
        $finals = array();
        foreach($data as $row){
            $to = $row['redirect'];
            $from = $row['url'];
            if(substr($to, 0, 1)=='/'){
                $to = substr($to, 1);
            }
            if($from!=$to) {
                if(isset($finals[$from])){
                    $redirect_model->deleteById($row['id']);
                }
                else {
                    $finals[$from] = $to;
                }
            }
            else{
                $redirect_model->deleteById($row['id']);
            }
        }
        $work = true;
        $i = 1;
        $update = array();
        while($work){
            echo "check $i\n";
            $i++;
            $update = array();
            foreach($finals as $from => $to){
                if(isset($finals[$to])){
                    $update[$from] = $finals[$to];
                }
            }
            echo "update count = ".count($update)."\n";
            foreach($update as $from => $to){
                $finals[$from] = $to;
                $redirect_model->exec("UPDATE wa_redirect SET redirect = '/$to' WHERE url = '$from' AND domain = '$domain'");
            }
            echo "updated\n";
            if(count($update)==0 || $i >= 10){
                $work = false;
            }
        }

        print_r($update);
        echo "OK\n";
        exit;
    }
}