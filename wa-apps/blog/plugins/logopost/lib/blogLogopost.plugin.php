<?php

class blogLogopostPlugin extends blogPlugin {

    public function preparePostsFrontend(&$posts) {
        if ($this->getSettingValue('status') && $this->getSettingValue('prepare_posts_frontend')) {
            foreach ($posts as $id => &$post) {
                if (isset($post['image']) && $post['image']) {
                    $post['plugins']['before'][$this->id] = '<div class="logopost-plugin"><img src="' . self::getImgUrl($post['id']) . '" /></div>';
                }
                unset($post);
            }
        }
    }

    public function preparePostsBackend(&$posts) {
        if ($this->getSettingValue('status')) {
            foreach ($posts as $id => &$post) {
                if (isset($post['image']) && $post['image']) {
                    $post['plugins']['before'][$this->id] = '<div class="logopost-plugin"><img src="' . self::getImgUrl($post['id']) . '" /></div>';
                }
                unset($post);
            }
        }
    }

    public function backendPostEdit($post) {
        if ($this->getSettingValue('status')) {
            $app_settings_model = new waAppSettingsModel();
            $view = wa()->getView();
            $view->assign('post', $post);
            $html = $view->fetch($this->path . '/templates/BackendPostEdit.html');
            return array('toolbar' => $html);
        }
    }

    public static function getImgUrl($post_id) {
        $post_model = new blogPostModel();
        $post = $post_model->getById($post_id);
        if ($post['image']) {
            return wa()->getDataUrl('plugins/logopost/images/' . $post['image'], true, 'blog');
        }
    }

    public function postDelete($post) {
        $image_path = wa()->getDataPath('plugins/logopost/images/', 'blog');
        $name = $post['image'];
        if ($name && file_exists($image_path . $name)) {
            @!unlink($image_path . $name);
        }
    }

}
