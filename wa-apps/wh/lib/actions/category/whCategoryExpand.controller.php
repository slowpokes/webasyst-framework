<?php

class shopSmartdiscountsPluginBackendCategoryExpandAction extends waViewAction
{
    public function execute()
    {
        $id = waRequest::get('id', 0, waRequest::TYPE_INT);
        $this->view->assign('categories', shopSmartdiscountsPlugin::getCategories($id));
    }
}