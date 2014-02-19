<?php

/**
 * For campaign sent or being sent, show its parameters.
 */
class mailerCampaignsSettingsReadOnlyAction extends waViewAction
{
    public function execute()
    {
        $campaign_id = waRequest::get('campaign_id', 0, 'int');
        if (!$campaign_id) {
            throw new waException('No campaign id given.', 404);
        }

        // Campaign data
        $mm = new mailerMessageModel();
        $campaign = $mm->getById($campaign_id);
        if (!$campaign) {
            throw new waException('Campaign not found.', 404);
        }
        if ($campaign['status'] <= 0) {
            echo "<script>window.location.hash = '#/campaigns/send/{$campaign_id}/';</script>";
            exit;
        }

        // Access control
        if (mailerHelper::campaignAccess($campaign) < 2) {
            throw new waException('Access denied.', 403);
        }

        // Campaign params
        $mpm = new mailerMessageParamsModel();
        $params = $mpm->getByMessage($campaign_id);

        mailerHelper::assignCampaignSidebarVars($this->view, $campaign, $params);
        $this->view->assign('campaign', $campaign);
        $this->view->assign('params', $params);
    }
}

