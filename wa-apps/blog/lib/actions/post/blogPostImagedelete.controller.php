<?php

class blogPostImagedeleteController extends waJsonController
{
    public function execute()
    {

        if ($ids = waRequest::post('id', null)) {
            $post_model = new blogPostModel();
            $blog_model = new blogBlogModel();
            $blogs = $blog_model->getAvailable($this->getUser(), 'id');
            $options = array('id' => $ids, 'blog_id' => array_keys($blogs));
            $this->response['update'] = $post_model->updateByField($options, array("main_image" => null));
        } else {
            $this->errors[] = 'empty request';
        }

    }
}