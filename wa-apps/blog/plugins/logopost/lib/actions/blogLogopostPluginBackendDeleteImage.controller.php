<?php

class blogLogopostPluginBackendDeleteImageController extends waJsonController {

    public function execute() {
        try {
            $post_id = waRequest::post('post_id');
            $post_model = new blogPostModel();
            $post = $post_model->getById($post_id);
            $image_path = wa()->getDataPath('plugins/logopost/images/', 'blog');
            $name = $post['image'];

            if ($name && file_exists($image_path . $name)) {
                if (@!unlink($image_path . $name)) {
                    $this->response['message'] = 'Ошибка удаления ' . $image_path . $name;
                } else {
                    $this->response['message'] = 'Изображение удалено';
                }
            }
            $post_model->updateById($post_id, array('image' => ''));
        } catch (Exception $e) {
            $this->setError($e->getMessage());
        }
    }

}
