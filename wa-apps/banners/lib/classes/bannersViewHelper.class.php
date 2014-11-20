<?php

class bannersViewHelper
{
    public static function banner($id){
        $banner = new bannersBanner($id);
        $images = $banner->getImages(true);
        if(count($images)==0) return '';
        $banner->addView();
        $view = wa()->getView();
        $uniq = mt_rand(1, 100000);
        $view->assign('banner', $banner->getInfo());
        $view->assign('images', $images);
        $view->assign('uniq', $uniq);
        if(count($images)>1){
            $template_path = wa()->getAppPath('templates/actions/frontend/Banner.html', 'banners');
        }
        else{
            $template_path = wa()->getAppPath('templates/actions/frontend/BannerOne.html', 'banners');
        }
        $html = $view->fetch($template_path);
        return $html;
    }
}