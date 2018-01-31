<?php

class blogLogopostPluginBackendSaveImageController extends waJsonController {

    public function execute() {
        $file = waRequest::file('logopost');
        $post_id = waRequest::post('post_id');
        if ($file->uploaded()) {
            $image_path = wa()->getDataPath('plugins/logopost/images/', 'blog');
            $path_info = pathinfo($file->name);
            $name = $this->uniqueName($image_path, $path_info['extension']);
            $app_settings_model = new waAppSettingsModel();
            try {
                $file->waImage()->save($image_path . $name);
                $this->response['preview'] = wa()->getDataUrl('plugins/logopost/images/' . $name, true, 'blog');
                $post_model = new blogPostModel();
                $post = $post_model->getById($post_id);
                if ($post['image']) {
                    @unlink($image_path . $post['image']);
                }
                $post_model->updateById($post_id, array('image' => $name));
            } catch (Exception $e) {
                $this->setError($e->getMessage());
            }
        }
    }

    protected function uniqueName($path, $extension) {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        do {
            $name = '';
            for ($i = 0; $i < 10; $i++) {
                $n = rand(0, strlen($alphabet) - 1);
                $name .= $alphabet{$n};
            }
            $name .= '.' . $extension;
        } while (file_exists($path . $name));
        return $name;
    }

}
