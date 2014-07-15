<?php

/**
 * Controller that saves the campaign (message). Common for all editor steps.
 */
class mailerCampaignsSaveController extends waJsonController
{
    public function execute()
    {
        $message_id = waRequest::post('id', 0, 'int');

        // Check whether campaign can be modified
        $mm = new mailerMessageModel();
        if ($message_id) {
            $campaign = $mm->getById($message_id);
            if (!$campaign || $campaign['status'] > 0) {
                $this->response = $message_id;
                return;
            }

            // Access control
            if (mailerHelper::campaignAccess($campaign) < 2) {
                throw new waException('Access denied.', 403);
            }
        } else {
            // Access control
            if (mailerHelper::isAuthor() < 2) {
                throw new waException('Access denied.', 403);
            }
        }

        $data = waRequest::post('data', array());

        // Populate from_name and from_email from sender data
        if (!empty($data['sender_id'])) {
            $sm = new mailerSenderModel();
            $sender = $sm->getById($data['sender_id']);
            if ($sender) {
                // Update message data using data from sender parameters.
                $spm = new mailerSenderParamsModel();
                $params = $spm->getBySender($data['sender_id']);
                $data['from_name'] = trim($sender['name']);
                $data['from_email'] = trim($sender['email']);
                $data['reply_to'] = trim(ifempty($params['reply_to'], ''));
            } else {
                $data['sender_id'] = 0;
            }
        }

        // Clean up data when illegal sender given, or no sender for new message
        if (empty($data['sender_id']) && (!$message_id || array_key_exists('sender_id', $data))) {
            $asm = new waAppSettingsModel();
            $data['sender_id'] = 0;
            $data['from_name'] = $asm->get('webasyst', 'name');
            $data['from_email'] = $asm->get('webasyst', 'email');
        }

        // Save message
        if ($message_id) {
            $mm->updateById($message_id, $data);
        } else {
            $data['create_datetime'] = date("Y-m-d H:i:s");
            $data['create_contact_id'] = $this->getUser()->getId();
            foreach(array('subject','body','name','from_name','from_email','reply_to','return_path') as $fld) {
                if (empty($data[$fld])) {
                    $data[$fld] = '';
                }
            }

            $message_id = $mm->insert($data);
        }

        if (!empty($data['body'])) {
            mailerHelper::copyMessageFiles($message_id, $data['body']);
        }

        // Save message params
        $new_params = waRequest::post('params');
        $delete_old_params = waRequest::post('delete_old_params');
        if ($new_params === null || !is_array($new_params)) {
            $new_params = array();
        }
        if ($delete_old_params === null || !is_array($delete_old_params)) {
            $delete_old_params = array();
        }
        $mpm = new mailerMessageParamsModel();
        $mpm->save($message_id, $new_params, $delete_old_params);

        $this->response = $message_id;
    }
}
