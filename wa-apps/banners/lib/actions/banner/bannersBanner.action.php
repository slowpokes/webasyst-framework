<?php
class bannersBannerAction extends waViewAction
{
	public function execute()
	{
        $id = waRequest::get('id');
        if($id){
            $banner = new bannersBanner($id);
            if($banner->exist()){
                if(waRequest::post('save_banner')){
                    $banner->save(waRequest::post());
                    $this->redirect('?module=banner&id='.$banner->getId());
                }
                if(waRequest::post('save_images')){
                    $banner->saveImages(waRequest::post());
                    $this->redirect('?module=banner&id='.$banner->getId());
                }
                if(waRequest::post('delete_banner')){
                    $banner->delete();
                    $this->redirect('?module=banner');
                }
                $images = $banner->getImages();
                $url = wa()->getRouteUrl('banners/frontend/link/', array('id' => '%id%'), true);
                if(!$url){
                    $this->view->assign('url_error', true);
                }
                $info = $banner->getInfo();
                bannersBanner::addCTR($info, $images, $banner->getCTR());
                $this->view->assign('banner', $info);
                $this->view->assign('images', $images);
                $this->view->assign('animation_in', bannersBanner::getAvailableAnimationIn());
                $this->view->assign('animation_out', bannersBanner::getAvailableAnimationOut());
                $this->view->assign('animation_speeds', bannersBanner::getAvailableAnimationSpeeds());
                $this->view->assign('sizes', bannersBanner::getAvailableSizes());
                $this->getResponse()->setTitle($info['title']);
                return;
            }
            $this->redirect('?module=banner');
        }
        else{
            $banners = bannersBanner::getAll();
            if(count($banners)==0){
                $this->redirect('?module=banner&action=create');
            }
            else{
                foreach($banners as $b){
                    $this->redirect('?module=banner&id='.$b['id']);
                }
            }
        }
	}
}
