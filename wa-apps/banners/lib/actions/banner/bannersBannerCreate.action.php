<?php
class bannersBannerCreateAction extends waViewAction
{
	public function execute()
	{
        if(waRequest::post('save_banner')){
            $banner = bannersBanner::create();
            $banner->save(waRequest::post());
            $this->redirect('?module=banner&id='.$banner->getId());
        }
        $this->getResponse()->setTitle(_w('Новый баннер'));
	}
}
