<?php
class installerBackendController extends waViewController
{
    public function execute()
    {
        if (!waRequest::get('_')) {
            $this->setLayout(new installerBackendLayout());
            $this->layout->assign('loading',true);
        }
        $this->executeAction(new installerBackendDefaultAction());
    }
}
