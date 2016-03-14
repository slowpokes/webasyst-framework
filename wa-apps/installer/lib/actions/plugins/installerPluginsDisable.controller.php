<?php

class installerPluginsDisableController extends waJsonController
{
    public function execute()
    {
        try {
            $app_id = waRequest::post('app_id');
            $plugin_id = waRequest::post('plugin_id');
            $apps = wa()->getApps();
            if (empty($app_id) || empty($plugin_id) || empty($apps[$app_id])) {
                throw new waException('Plugin not found');
            }
            $installer = new waInstallerApps();
            //TODO check that plugin a exists
            $installer->updateAppPluginsConfig($app_id, $plugin_id, false);
            $this->response['message'] = _w('Cache cleared');
            $errors = installerHelper::flushCache();
            if ($errors) {
                $this->response['message'] .= "<br>"._w('But with errors:')."<br>".implode("<br>", $errors);
            }
        } catch (Exception $ex) {
            $this->setError($ex->getMessage());
        }
    }
}
