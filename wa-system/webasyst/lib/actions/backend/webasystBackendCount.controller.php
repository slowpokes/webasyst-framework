<?php
/**
  * Counts to show in header near applications' icons.
  * Saves its cache in session with key 'apps-count'.
  */
class webasystBackendCountController extends waJsonController
{
    public function execute()
    {
        // close session
        wa()->getStorage()->close();

        // counts to show in page header near app names
        $apps = $this->getUser()->getApps(false);
        $root_path = wa()->getConfig()->getRootPath();
        $app_settings_model = new waAppSettingsModel();
        $checked = array(); //VADIM CODE
        foreach ($apps as $app_id => $app) {
            $class_name = $app_id.'Config';
            if ($app_settings_model->get($app_id, 'update_time') && file_exists($root_path.'/wa-apps/'.$app_id.'/lib/config/'.$class_name.'.class.php')) {
                $checked[$app_id] = true; //VADIM CODE
                try {
                    $n = wa($app_id)->getConfig()->onCount();
                    if ($n !== null) {
                        $this->response[$app_id] = $n;
                    }
                } catch(Exception $ex) {
                    waLog::log('Error '.$ex->getCode().': '.$ex->getMessage());
                }
            }
        }

        // VADIM CODE START
        foreach ($apps as $app_id => $app) {
            $real_name = $app['id'];
            $class_name = $real_name.'Config';
            if (!isset($checked[$app_id])&&file_exists($root_path.'/wa-apps/'.$real_name.'/lib/config/'.$class_name.'.class.php')) {
                try {
                    $name = wa()->getAppName($app_id);
                    $n = wa($app_id)->getConfig()->onCount();
                    if ($n !== null) {
                        $this->response[$app_id] = $n;
                    }
                } catch(Exception $ex) {
                    waLog::log($ex->__toString());
                }
            }
        }
        //VADIM CODE END

        // cache counts in session
        wa()->getStorage()->write('apps-count', array_filter($this->response));
    }
}
