<?php 

class siteRedirectBulkController extends waController
{
    public function execute()
    {
        $domain = siteHelper::getDomain();
        $text = waRequest::post('text');
        $lines = explode("\n", $text);
        foreach ($lines as $line){
            $parts = explode("\t", trim($line));
            if(count($parts)==2){
                $array = array(
                    'domain' => $domain,
                    'url' => $parts[0],
                    'redirect' => $parts[1]
                );
                waRedirect::add($array);
            }
        }
        echo "ok";
    }
}