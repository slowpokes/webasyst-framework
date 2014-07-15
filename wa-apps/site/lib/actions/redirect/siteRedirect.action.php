<?php 

class siteRedirectAction extends waViewAction
{
    public function execute()
    {
        $domain_id = waRequest::get('domain_id');
        $domain = siteHelper::getDomain();
        $urls = waRedirect::getByDomain($domain);

        $domain_replace_array = array(
            'new.1mmtt.ru'=>'1mmtt.ru',
            'l1mmtt'=>'1mmtt.ru',
        );
        $domain_replace = $domain;
        if(isset($domain_replace_array[$domain]))$domain_replace = $domain_replace_array[$domain];
        $this->view->assign('domain_replace', $domain_replace);

        $this->view->assign('urls', $urls);
        $this->view->assign('domain_id', $domain_id);
        $this->view->assign('domain', $domain);
    }
}