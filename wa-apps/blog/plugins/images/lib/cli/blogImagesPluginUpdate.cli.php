<?php

class blogImagesPluginUpdateCli extends waCliController
{

    public function execute()
    {
        $model = new blogPostModel();
        $posts = $model->select('id')->order('id')->fetchAll();
        foreach ($posts as $post){
            blogImagesPlugin::process($post['id']);
        }
        echo "ok\n";
    }
}