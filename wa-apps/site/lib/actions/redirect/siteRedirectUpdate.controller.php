<?php 

class siteRedirectUpdateController extends waJsonController
{
    public function execute()
    {
        $id = waRequest::post('id');
        $redirect = waRequest::post('redirect');
        waRedirect::update($id, $redirect);
        $this->response = array(
            'info'=>waRedirect::get($id)
        );
    }
}