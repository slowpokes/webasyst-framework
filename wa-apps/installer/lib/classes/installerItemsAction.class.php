<?php
abstract class installerItemsAction extends waViewAction
{
    protected $module = null;
    protected $redirect = false;
    protected $update_counter = 0;

    public function execute()
    {
        $extended = false;
        $this->view->assign('action', 'update');

        $this->view->assign('error', false);
        $messages = installerMessage::getInstance()->handle(waRequest::get('msg'));
        $filter = array();
        $filter['enabled'] = true;
        if ($this->module) {
            $filter['extras'] = $this->module;
        }

        $applications = installerHelper::getApps($messages, $this->update_counter, $filter);
        $app = false;
        try {
            $subject = waRequest::get('subject');
            if (empty($subject)) {
                $storage = wa()->getStorage();
                $search = array();
                $extras = preg_replace('/s$/', '', $this->module);
                $slug_id = "installer_select_{$extras}";
                $vendor_id = "installer_select_{$extras}_vendor";
                $search['slug'] = waRequest::get('slug', $storage->read($slug_id));
                $search['vendor'] = waRequest::get('vendor', $storage->read($vendor_id));

                if ((!$this->redirect || array_filter($search, 'strlen')) && $app = installerHelper::search($applications, $search)) {
                    $storage->write($slug_id, $search['slug'] = $app['slug']);
                    $storage->write($vendor_id, $search['vendor'] = $app['vendor']);
                } else {
                    reset($applications);
                    if ($app = current($applications)) {
                        $this->redirect(array('module' => $this->module, 'slug' => $app['slug'], 'vendor' => $app['vendor']));
                    }

                }
                $this->view->assign('slug', $search['slug']);
                $this->view->assign('vendor', $search['vendor']);
                $this->view->assign('selected_app', $app);
            }
        } catch (Exception $ex) {
            $messages[] = array('text' => $ex->getMessage(), 'result' => 'fail');
        }

        installerHelper::checkUpdates($messages);
        $model = new waAppSettingsModel();
        $this->view->assign('update_counter', $model->get($this->getApp(), 'update_counter'));
        $this->view->assign('messages', $messages);
        $this->view->assign('apps', $applications);
        $this->view->assign('extended', $extended);
        $this->view->assign('title', _w('Installer'));
    }
}
