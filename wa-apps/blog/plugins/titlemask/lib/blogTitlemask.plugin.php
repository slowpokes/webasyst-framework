<?php

class blogTitlemaskPlugin extends blogPlugin{
    public function frontendPost($post){
        if($post['meta_title']==''){
            $meta = wa()->getConfig()->getOption('titlemask_title');
            $name = $post['title'];
            $meta = str_replace("%name%", $name, $meta);
            wa()->getResponse()->setTitle($meta);
        }
        if($post['meta_keywords']==''){
            $meta = wa()->getConfig()->getOption('titlemask_keywords');
            $name = $post['title'];
            $meta = str_replace("%name%", $name, $meta);
            wa()->getResponse()->setMeta('keywords', $meta);
        }
        if($post['meta_description']==''){
            $meta = wa()->getConfig()->getOption('titlemask_description');
            $name = $post['title'];
            $meta = str_replace("%name%", $name, $meta);
            wa()->getResponse()->setMeta('description', $meta);
        }
    }
}