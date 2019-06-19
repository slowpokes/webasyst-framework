<?php

class blogImagesPlugin extends blogPlugin
{
    public static function process($post_id){
        self::myLog("process post $post_id");
        $model = new blogPostModel();
        $post = $model->getById($post_id);

        $doc = new DOMDocument();
        $doc->loadHTML($post['text'], LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $tags = $doc->getElementsByTagName('img');
        $images_folder = wa()->getDataPath("images/$post_id/", true);
        $images_url = wa()->getDataUrl("images/$post_id/", true);
        $images_url = str_replace("cli.php", '/', $images_url);
        $images_url = str_replace(" /home/bd9/bd9.ru/", '/', $images_url);
        $updated = false;
        foreach ($tags as $tag) {
            $url = $tag->getAttribute('src');
            self::myLog("found image $url");
            $url_parts = parse_url($url);
            if(isset($url_parts['host'])){
                if($url_parts['host']=='bd9.ru'){
                    $new_src_url = $url;
                    $new_src_url = str_replace("http://bd9.ru", '', $new_src_url);
                    $new_src_url = str_replace("https://bd9.ru", '', $new_src_url);
                }else {
                    self::myLog("start download");
                    $new_filename = self::downloadImage($url, $images_folder);
                    $new_src_url = $images_url . $new_filename;
                }
                self::myLog("new url: $new_src_url");
                $tag->setAttribute('src', $new_src_url);
                $updated = true;
            }
            else{
                self::myLog('hosted, skip');
            }
        }
        if($updated){
            self::myLog("save post");
            $doc->encoding = 'utf-8';
            $result = utf8_decode($doc->saveHTML($doc->documentElement));
            $model->updateById($post_id, array('text' => $result));
        }
    }

    private static function myLog($string){
        echo "$string\n";
    }

    private static function downloadImage($url, $to_folder){
        $ext = pathinfo($url, PATHINFO_EXTENSION);
        $ext = strtolower($ext);
        if($ext==''){
            $ext = 'jpg';
        }
        $new_filename = time().'_'.mt_rand(0, 1000000).'.'.$ext;
        $path = $to_folder.$new_filename;
        $ch = curl_init ($url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
        $raw=curl_exec($ch);
        curl_close ($ch);
        $fp = fopen($path,'x');
        fwrite($fp, $raw);
        fclose($fp);
        return $new_filename;
    }
}
