<?php

class bannersFrontendLinkController extends waController{
    public function execute()
    {
        $id = waRequest::param('id');
        $image = new bannersImage($id);
        $image = $image->getInfo();
        if($image){
            $click_model = new bannersClickModel();
            $click_model->insert(array(
                'ip' => waRequest::getIp(),
                'user_agent' => waRequest::getUserAgent(),
                'image_id'=>$id,
                'create_datetime'=>date("Y-m-d H:i:s"),
            ));
            $this->redirect($image['url']);
        }
        $this->redirect(wa()->getRootUrl(true));
    }
}