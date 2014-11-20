<?php

class bannersBasicLayout extends waLayout
{
    public function __construct(){
        parent::__construct();
    }
    public function execute()
    {
        $module = waRequest::get('module', '');
        $this->assign('module', $module);
        $sidebar_class = 'bannersSidebar'.ucfirst($module).'Action';
        if(class_exists($sidebar_class)){
            $this->executeAction('sidebar', new $sidebar_class());
        }
        else{
            $this->assign('sidebar', '');
        }
    }
}