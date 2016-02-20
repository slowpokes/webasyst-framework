<?php

class installerFeaturedAction extends installerItemsAction
{
    protected function getTags()
    {
        return array('homepage');
    }

    protected function getExtrasOptions()
    {
        $options = parent::getExtrasOptions();
        $options['filter'] = array('tag' => 'homepage');

        return $options;
    }

    public function execute()
    {
        $this->module = array('plugins', 'themes', 'widgets');
        parent::execute();

        $options = array(
            'local'  => false, //retrieve only server info
            'filter' => array('tag' => 'homepage'),
        );

        try {
            $installer = installerHelper::getInstaller();
            $messages = installerMessage::getInstance()->handle(waRequest::get('msg'));
            $this->view->assign('featured_apps', $apps = $installer->getApps($options));

            $plugins = 'wa-plugins/payment';
            if (isset($apps['shop'])) {
                $plugins = 'shop';
            } else {
                ksort($apps);
                foreach ($apps as $app => $info) {
                    if (!empty($info['plugins'])) {
                        $plugins = $app;
                        break;
                    }
                }
            }

            $this->view->assign('plugins_app', $plugins);

            $this->view->assign('promos', $installer->getServerData('promos'));
        } catch (Exception $ex) {
            installerHelper::handleException($ex, $messages);
        }
        $this->view->assign('messages', $messages);
    }
}
