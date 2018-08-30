<?php

class blogImagesPluginUpdateCli extends waCliController
{

    public function execute()
    {
        $model = new blogPostModel();
        $posts = $model->select('id')->where("status = 'published'")->order('id')->fetchAll();
        foreach ($posts as $post){
            echo "check post {$post['id']}\n";
            blogImagesPlugin::process($post['id']);
        }
        echo "ok\n";
    }
}