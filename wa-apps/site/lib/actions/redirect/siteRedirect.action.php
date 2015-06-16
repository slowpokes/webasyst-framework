<?php 

class siteRedirectAction extends waViewAction
{
    public function execute()
    {
        $paging = array();
        $paging['page'] = waRequest::get('page', '1');
        $paging['sort'] = waRequest::get('sort', 'name', 'string');
        $paging['order'] = waRequest::get('order', '', 'string');

        $domain_id = waRequest::get('domain_id');
        $domain = siteHelper::getDomain();
        $urls_array = waRedirect::getByDomain($domain, $paging);

        $domain_replace_array = array(
            'new.1mmtt.ru'=>'1mmtt.ru',
            'l1mmtt'=>'1mmtt.ru',
        );
        $domain_replace = $domain;
        if(isset($domain_replace_array[$domain]))$domain_replace = $domain_replace_array[$domain];
        $this->view->assign('domain_replace', $domain_replace);

        if (isset($_GET['module']))unset($_GET['module']);
        if (isset($_GET['_']))unset($_GET['_']);
        if (isset($_GET['domain_id']))unset($_GET['domain_id']);

        $this->view->assign('pages_count', $urls_array['page_count']);
        $this->view->assign('urls', $urls_array['data']);
        $this->view->assign('paging', $paging);
        $this->view->assign('domain_id', $domain_id);
        $this->view->assign('domain', $domain);
    }
}