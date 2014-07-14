<?php 

class siteRedirectDeleteController extends waJsonController
{
    public function execute()
    {
        waRedirect::delete(waRequest::post('id'));
        $this->response = array(
        );
    }
}