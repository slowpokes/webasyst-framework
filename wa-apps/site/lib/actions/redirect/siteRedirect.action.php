<?php 

class siteRedirectAction extends waViewAction
{
    public function execute()
    {
        $domain_id = waRequest::get('domain_id');
        $domain = siteHelper::getDomain();
        $urls = waRedirect::getByDomain($domain);

        $this->view->assign('urls', $urls);
        $this->view->assign('domain_id', $domain_id);
        $this->view->assign('domain', $domain);
    }
}