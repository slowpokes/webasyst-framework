<?php 

class siteRedirectAddController extends waJsonController
{
    public function execute()
    {
        $domain = siteHelper::getDomain();
        $array = array(
            'domain' => $domain,
            'url' => waRequest::post('url', '', 'string'),
            'redirect' => waRequest::post('redirect', '', 'string')
        );
        $id = waRedirect::add($array);
        $this->response = array(
            'info'=>waRedirect::get($id)
        );
    }
}