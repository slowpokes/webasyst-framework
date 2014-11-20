<?php

class bannersSidebarBannerAction extends waViewAction
{
    public function execute(){
        $this->view->assign('banners', bannersBanner::getAll());
    }
}