<?php

class waPageActions extends waActions
{
    protected $model;
    protected $sidebar = true;
    protected $url = '#/';
    protected $ibutton = true;

    protected $options = array(
        'container' => true,
        'show_url' => false,
        'save_panel' => true,
        'js' => array(
            'ace' => true,
            'editor' => true,
            'storage' => false,
        ),
        'is_ajax' => false,
        'data' => array()
    );

    public function defaultAction()
    {
        $pages = $this->getPages();
        $data = array(
            'sidebar' => $this->sidebar,
            'page_url' => $this->url,
            'lang' => substr(wa()->getLocale(), 0, 2),
            'ibutton' => $this->ibutton,
            'options' => $this->options,
            'pages' => $pages
        );

        $routes = $this->getRoutes();
        foreach ($pages as $page) {
            $r = $page['domain'].'/'.$page['route'];
            if (!isset($routes[$r])) {
                $r = 0;
            }
            $routes[$r]['pages'][$page['id']] = $page;
        }
        if (isset($routes[0]) || !$routes) {
            $routes[0]['route'] = '';
            $routes[0]['domain'] = '';
        }
        foreach ($routes as &$r) {
            if (isset($r['pages'])) {
                $r['pages'] = $this->getPagesTree($r['pages']);
            }
        }

        //convert punycode
        $idna = new waIdna();
        foreach ($routes as $key=> &$route) {
            $route['url_decoded'] = $idna->decode($key);
        }
        unset($route);

        $data['routes'] = $routes;

        /**
         * Backend sidebar pages
         * UI hook allow extends backend settings page
         * @event backend_pages_sidebar
         * @param array $params
         * @return array[string][string]string $return[%plugin_id%] html output
         */
        $event_params = array();
        $data['backend_pages_sidebar'] = wa()->event('backend_pages_sidebar', $event_params);

        $template = $this->getConfig()->getRootPath().'/wa-system/page/templates/Page.html';
        $this->display($this->prepareData($data), $template);
    }

    protected function settleAction()
    {
        $pages = $this->getPages();
        $routes = $this->getRoutes();
        $ids = array();
        foreach ($pages as $page) {
            $r = $page['domain'].'/'.$page['route'];
            if (!isset($routes[$r])) {
                $ids[] = $page['id'];
            }
        }
        $domain = waRequest::post('domain');
        $route = waRequest::post('route');
        if ($ids) {
            $this->getPageModel()->updateById($ids, array('domain' => $domain, 'route' => $route));
        }
        $this->displayJson(array());
    }

    protected function prepareData(&$data)
    {
        return $data;
    }

    protected function getPage($id)
    {
        return $this->getPageModel()->getById($id);
    }

    protected function editAction()
    {
        $id = waRequest::get('id');
        $page_model = $this->getPageModel();

        if (!$id || !($page = $this->getPage($id))) {
            $id = null;
            $page = array();
        }

        $url = '';
        if ($page) {
            $domain = $page['domain'];
            $route = $page['route'];
            if ($page['parent_id']) {
                $parent = $page_model->getById($page['parent_id']);
                $url = $parent['full_url'] ? rtrim($parent['full_url'], '/').'/' : '';
            }
        } else {
            if ($parent_id = waRequest::get('parent_id')) {
                $parent = $this->getPage($parent_id);
                $domain = $parent['domain'];
                $route = $parent['route'];
                $this->options['data']['info[parent_id]'] = $parent_id;
                $url = $parent['full_url'] ? rtrim($parent['full_url'], '/').'/' : '';
            } else {
                $domain = waRequest::get('domain');
                $this->options['data']['info[domain]'] = $domain;
                $route = waRequest::get('route');
                $this->options['data']['info[route]'] = $route;
            }
        }

        $routes = $this->getRoutes();
        if ($domain && isset($routes[$domain.'/'.$route])) {
            $url = 'http://'.$domain.'/'.wa()->getRouting()->clearUrl($route).$url;
        } else {
            $url = null;
        }

        $warnings = array();
        if (!isset($routes[$domain.'/'.$route])) {
            if (empty($page)) {
                $warnings['no_site_storefront'] = true;
            } elseif (empty($routes)) {
                $warnings['deleted_site_storefront'] = true;
            } else {
                $warnings['several_site_storefront'] = true;
            }
        }

        if ($url) {
            $idna = new waIdna();
            $url_decoded = $idna->decode($url);
        } else {
            $url_decoded = null;
        }

        $data = array(
            'url'          => $url,
            'url_decoded'  => $url_decoded,
            'warnings'     => $warnings,
            'page'         => $page,
            'page_url'     => $this->url,
            'options'      => $this->options,
            'preview_hash' => $this->getPreviewHash(),
            'lang'         => substr(wa()->getLocale(), 0, 2),
            'ibutton'      => $this->ibutton,
            'upload_url'   => wa()->getDataUrl('img', true)
        ) + $this->getPageParams($id);

        $data['page_edit'] = wa()->event('page_edit', $data);

        /**
         * Backend settings page
         * UI hook allow extends backend settings page
         * @event backend_page_edit
         * @param array $page
         * @return array[string][string]string $return[%plugin_id%]['action_button_li'] html output
         * @return array[string][string]string $return[%plugin_id%]['settings_section'] html output
         * @return array[string][string]string $return[%plugin_id%]['section'] html output
         */
        $data['backend_page_edit'] = wa()->event('backend_page_edit', $page, array(
            'action_button_li',
            'section',
            'settings_section'
        ));

        $template = $this->getConfig()->getRootPath().'/wa-system/page/templates/PageEdit.html';
        $this->display($data, $template);
    }

    protected function getPagesTree($pages)
    {
        foreach ($pages as $page_id => $page) {
            if ($page['parent_id']) {
                if (!empty($pages[$page['parent_id']])) {
                    $pages[$page['parent_id']]['childs'][] = &$pages[$page_id];
                } else {
                    $pages[$page_id]['parent_id'] = null;
                }
            }
        }

        foreach ($pages as $page_id => $page) {
            if (!empty($page['parent_id'])) {
                unset($pages[$page_id]);
            }
        }

        return $pages;
    }

    public static function printPagesTree($p, $pages, $prefix_url)
    {
        $html = '<ul class="menu-v with-icons" data-parent-id="'.$p['id'].'">';
        foreach ($pages as $page) {
            $html .= '<li class="drag-newposition"></li>';
            $html .= '<li class="dr" id="page-'.$page['id'].'">'.
            (!empty($page['childs']) ? '<i class="icon16 darr expander overhanging"></i>' : '').'<i class="icon16 notebook"></i>'.
            '<a class="wa-page-link" href="'.$prefix_url.$page['id'].'"><span class="count"><i class="icon10 add wa-page-add"></i></span>'.
            htmlspecialchars($page['name']).
            ' <span class="hint">/'.htmlspecialchars($page['full_url']).'</span>';
            if (!$page['status']) {
                $html .= ' <span class="wa-page-draft">'._ws('draft').'</span>';
            }
            $html .= '</a>';
            if (!empty($page['childs'])) {
                $html .= self::printPagesTree($page, $page['childs'], $prefix_url);
            }
            $html .= '</li>';
        }
        $html .= '<li class="drag-newposition"></li></ul>';
        return $html;
    }

    protected function getRoutes()
    {
        $routes = wa()->getRouting()->getByApp($this->getAppFakeId());
        $result = array();
        foreach ($routes as $d => $domain_routes) {
            foreach ($domain_routes as $route) {
                $result[$d.'/'.$route['url']] = array(
                    'route' => $route['url'],
                    'domain' => $d
                );
            }
        }
        return $result;
    }

    protected function getPages()
    {
        return $this->getPageModel()->
            select('id,name,url,full_url,status,domain,route,parent_id')->order('parent_id,sort')->fetchAll('id');
    }

    /**
     * @param int $id - page id
     * @return array
     */
    protected function getPageParams($id)
    {
        $params = $other_params = array();
        $vars = array(
            'h1' => 'H1',
            'keywords' => _ws('META Keywords'),
            'description' => _ws('META Description')
        );

        if ($id) {
            $params = $this->getPageModel()->getParams($id);
        }

        $og_params = array();
        foreach ($params as $k => $v) {
            if (substr($k, 0, 3) == 'og_') {
                $og_params[substr($k, 3)] = $v;
                unset($params[$k]);
            }
        }

        $main_params = array();
        foreach ($vars as $v => $t) {
            if (isset($params[$v])) {
                $main_params[$v] = $params[$v];
                unset($params[$v]);
            } else {
                $main_params[$v] = '';
            }
        }

        return array(
            'vars' => $vars,
            'params' => $main_params,
            'other_params' => $params,
            'og_params' => $og_params
        );
    }

    protected function getPreviewHash()
    {
        $hash = $this->appSettings('preview_hash');
        if ($hash) {
            $hash_parts = explode('.', $hash);
            if (time() - $hash_parts[1] > 14400) {
                $hash = '';
            }
        }
        if (!$hash) {
            $hash = uniqid().'.'.time();
            $app_settings_model = new waAppSettingsModel();
            $app_settings_model->set($this->getAppId(), 'preview_hash', $hash);
        }

        return md5($hash);
    }

    public function saveAction()
    {
        $id = (int)waRequest::get('id');
        $data = waRequest::post('info');
        if (empty($data['name'])) {
            $data['name'] = '('._ws('no-title').')';
        }
        $data['url'] = ltrim($data['url'], '/');
        $data['status'] = isset($data['status']) ? 1 : 0;

        try {
            $this->checkGlobalRouting();
        } catch (waException $e) {
            $this->displayJson(array(), $e->getMessage());
            return;
        }

        $page_model = $this->getPageModel();

        if ($id) {
            $is_new = false;
            $old = $page_model->getById($id);
            $data['full_url'] = substr($old['full_url'], 0, -strlen($old['url'])).$data['url'];
            if ($old['full_url'] && substr($old['full_url'], -1, 1) != '/') {
                $old['full_url'] .= '/';
            }
            // save to database
            if (!$page_model->update($id, $data)) {
                $this->displayJson(array(), _ws('Error saving web page'));
                return;
            }
            $this->logAction('page_edit', $id);
            $childs = $page_model->getChilds($id);
            if ($childs) {
                $page_model->updateFullUrl($childs, $data['full_url'], $old['full_url']);
            }
        } else {
            if (waRequest::post('translit') && !$data['url']) {
                $data['url'] = $this->translit($data['name']);
            }
            if ($data['url'] && substr($data['url'], -1) != '/' && strpos(substr($data['url'], -5), '.') === false) {
                $data['url'] .= '/';
            }
            if (!empty($data['parent_id'])) {
                $parent = $this->getPage($data['parent_id']);
                $data['full_url'] = ($parent['full_url'] ? rtrim($parent['full_url'], '/').'/' : '').$data['url'];
                $data['domain'] = $parent['domain'];
                $data['route'] = $parent['route'];
                $this->beforeSave($data, $parent);
            } else {
                $data['full_url'] = $data['url'];
                $this->beforeSave($data);
            }
            $is_new = true;
            if ($id = $page_model->add($data)) {
                $data['id'] = $id;
                $this->logAction('page_add', $id);
            } else {
                $this->displayJson(array(), _ws('Error saving web page'));
                return;
            }
        }

        // save params
        $this->saveParams($id);

        /**
         * New page created or existing page modified.
         *
         * @event page_save
         * @param array $params
         * @param array[array] $params['page'] page data after save
         * @param array[array] $params['old'] page data before save (null if page is new)
         * @return void
         */
        $event_params = array(
            'page' => $page_model->getById($id),
            'old' => $is_new ? null : $old,
        );
        wa()->event('page_save', $event_params);
        $data = $event_params['page'];

        // prepare response
        $this->displayJson(array(
            'id' => $id,
            'name' => htmlspecialchars($data['name']),
            'add' => $is_new ? 1 : 0,
            'url' => $data['url'],
            'full_url' => $data['full_url'],
            'old_full_url' => isset($old) ? $old['full_url'] : '',
            'status' => $data['status']
        ));
    }

    protected function checkGlobalRouting()
    {
        $id = (int)waRequest::get('id');
        $data = waRequest::post('info', array(), waRequest::TYPE_ARRAY_TRIM);
        $data['url'] = ltrim($data['url'], '/');

        $page_url = $data['url'];
        if ($page_url && substr($page_url, -1) != '/' && strpos(substr($page_url, -5), '.') === false) {
            $page_url .= '/';
        }

        // Get Domain
        if (!empty($data['parent_id'])) {
            $parent = $this->getPage($data['parent_id']);
            $domain = (!empty($parent['domain'])) ? $parent['domain'] : null;
            $page_url = ($parent['full_url'] ? rtrim($parent['full_url'], '/').'/' : '') . $page_url;
        }

        if (!empty($data['domain'])) {
            $domain = trim($data['domain']);

        // Find domain by PAGE
        } elseif ($id) {
            $page = $this->getPageModel()->getById($id);
            $domain = ifempty($page[$this->getPageModel()->getDomainField()]);
            if ($this->getPageModel()->getDomainField() === 'domain_id') {
                $domain_data = $this->getDomainModel()->getById($page['domain_id']);
                $domain = ifempty($domain_data['name']);
            }

        // Find domain by domain_id in an external table (e.g. site_domain)
        } elseif (!empty($data['domain_id'])) {
            $domain_data = $this->getDomainModel()->getById($data['domain_id']);
            $domain = ifempty($domain_data['name']);
        }

        // Get route
        if (!empty($data['route'])) {  // post
            $route = $data['route'];
        } elseif (isset($parent)) {    // parent page
            $route = $parent['route'];
        } elseif (isset($page)) {      // page
            $route = $page['route'];
        }

        if (empty($domain)) throw new waException(_ws('Unknown page domain'));
        if (empty($route)) throw new waException(_ws('Unknown page route'));

        $page_model = $this->getPageModel();
        $domain_field = $page_model->getDomainField();
        if ($domain_field == 'domain_id') {
            if (!empty($data['domain_id'])) {
                $domain_name = $data['domain_id'];
            } elseif (!empty($page['domain_id'])) {
                $domain_name = $page['domain_id'];
            } elseif (!empty($parent['domain_id'])) {
                $domain_name = $parent['domain_id'];
            }
        } else {
            $domain_name = $domain;
        }

        $full_url = '';
        if (!empty($parent['full_url'])) {
            if (substr($parent['full_url'], -1) == '/') {
                $full_url = $parent['full_url'];
            } else {
                $full_url = $parent['full_url'] . '/';
            }
        }

        if (isset($page)) {
            $full_url .= $data['url'];
        } elseif (substr($data['url'], -1) == '/') {
            $full_url .= $data['url'];
        } else {
            $full_url .= $data['url'] . '/';
        }

        $same_url = $page_model->getByField(array(
            $domain_field => $domain_name,
            'route' => $route,
            'full_url' => $full_url,
        ), true);

        if (!empty($same_url)) {
            foreach ($same_url as $page) {
                if ($page['id'] != $id) {
                    throw new waException(_ws('Specified URL already exists.'));
                }
            }
        }

        $page_url = str_replace('*', '', $route) . $page_url;
        $domain_routes = wa()->getRouting()->getRoutes($domain);

        $rule_for_url = wa()->getRouting()->getRuleForUrl($domain_routes, $page_url);

        if ($route !== ifempty($rule_for_url['url'])) {
            throw new waException(_ws('Page URL is in conflict with the website structure.'));
        }
    }

    public function getPageChilds($id)
    {
        $page_model = $this->getPageModel();
        $result = array();
        $ids = array($id);
        $sql = "SELECT id FROM ".$page_model->getTableName()." WHERE parent_id IN (i:ids)";
        while ($ids = $page_model->query($sql, array('ids' => $ids))->fetchAll(null, true)) {
            $result = array_merge($result, $ids);
        }
        return $result;
    }

    protected function beforeSave(&$data, $parent = array())
    {

    }

    public function translitAction()
    {
        $str = waRequest::post('str');
        $this->displayJson(array('str' => $this->translit($str)));
    }

    private function translit($str)
    {
        $str = preg_replace('/\s+/u', '-', $str);
        if ($str) {
            foreach (waLocale::getAll() as $locale_id => $locale) {
                $str = waLocale::transliterate($str, $locale);
            }
        }
        $str = preg_replace('/[^a-zA-Z0-9_\-]+/u', '', $str);
        return strtolower($str);
    }

    /**
     * @param int $id - page id
     */
    protected function saveParams($id)
    {
        $params = waRequest::post('params');
        $other_params = waRequest::post('other_params');
        if ($other_params) {
            $other_params = explode("\n", $other_params);
            foreach ($other_params as $param) {
                $param = explode("=", trim($param), 2);
                if (count($param) == 2) {
                    $params[$param[0]] = $param[1];
                }
            }
        }
        $og = waRequest::post('og');
        foreach ($og as $k => $v) {
            if ($v) {
                $params['og_'.$k] = $v;
            }
        }
        $this->getPageModel()->setParams($id, $params);
    }

    public function deleteAction()
    {
        $id = waRequest::post('id', null, 'int');
        $page_model = $this->getPageModel();
        $page = $page_model->getById($id);
        if ($page) {

            $childs = $this->getPageChilds($id);

            /**
             * Before page deletion
             *
             * @event page_delete
             * @param array $params
             * @param array[array] $params['page'] page data
             * @param array[array] $params['child_ids'] list of ids of all subpages that will also be deleted
             * @return void
             */
            $event_params = array(
                'page' => $page,
                'child_ids' => $childs,
            );
            wa()->event('page_delete', $event_params);

            // remove childs
            if ($childs) {
                $page_model->delete($childs);
            }
            // remove from database
            $page_model->delete($id);
            $this->logAction('page_delete', $id);
        }
        $this->displayJson(array());
    }

    public function moveAction()
    {
        $page_model = $this->getPageModel();
        $parent_id = waRequest::post('parent_id');
        if (!$parent_id) {
            $parent_id = array(
                'domain' => waRequest::post('domain'),
                'route' => waRequest::post('route'),
            );
        }
        $page_id = waRequest::post('id', 0, 'int');
        $result = $page_model->move($page_id, $parent_id, waRequest::post('before_id', 0, 'int'));
        if ($result) {
            $this->logAction('page_move', $page_id);
        }
        $this->displayJson($result, $result ? null: _w('Database error'));
    }

    public function uploadimageAction()
    {
        $path = wa()->getDataPath('img', true);

        $response = '';

        if (!is_writable($path)) {
            $p = substr($path, strlen(wa()->getDataPath('', true)));
            $errors = sprintf(_w("File could not be saved due to insufficient write permissions for the %s folder."), $p);
        } else {
            $errors = array();
            $f = waRequest::file('file');
            $f->transliterateFilename();
            $name = $f->name;
            if ($this->processFile($f, $path, $name, $errors)) {
                $response = wa()->getDataUrl('img/'.$name, true, null, !!waRequest::get('absolute'));
            }
            $errors = implode(" \r\n", $errors);
        }

        $this->getResponse()->sendHeaders();
        if (waRequest::get('filelink')) {
            if ($errors) {
                echo json_encode(array('error' => $errors));
            } else {
                echo json_encode(array('filelink' => $response));
            }
        } else if (waRequest::get('r') === '2') {
            if ($errors) {
                echo json_encode(array('error' => $errors));
            } else {
                echo json_encode(array('url' => $response));
            }
        } else {
            $this->displayJson($response, $errors);
        }
    }

    /**
     * @param waRequestFile $f
     * @param string $path
     * @param string $name
     * @param array $errors
     * @return bool
     */
    protected function processFile(waRequestFile $f, $path, &$name, &$errors = array())
    {
        if ($f->uploaded()) {
            if (!$this->isFileValid($f, $errors)) {
                return false;
            }
            if (!$this->saveFile($f, $path, $name)) {
                $errors[] = sprintf(_w('Failed to upload file %s.'), $f->name);
                return false;
            }
            return true;
        } else {
            $errors[] = sprintf(_w('Failed to upload file %s.'), $f->name).' ('.$f->error.')';
            return false;
        }
    }

    protected function isFileValid($f, &$errors = array())
    {
        $allowed = array('jpg', 'jpeg', 'png', 'gif');
        if (!in_array(strtolower($f->extension), $allowed)) {
            $errors[] = sprintf(_ws("Files with extensions %s are allowed only."), '*.'.implode(', *.', $allowed));
            return false;
        }
        return true;
    }

    protected function saveFile(waRequestFile $f, $path, &$name)
    {
        $name = $f->name;
        if (!preg_match('//u', $name)) {
            $tmp_name = @iconv('windows-1251', 'utf-8//ignore', $name);
            if ($tmp_name) {
                $name = $tmp_name;
            }
        }
        if (file_exists($path.DIRECTORY_SEPARATOR.$name)) {
            $i = strrpos($name, '.');
            $ext = substr($name, $i + 1);
            $name = substr($name, 0, $i);
            $i = 1;
            while (file_exists($path.DIRECTORY_SEPARATOR.$name.'-'.$i.'.'.$ext)) {
                $i++;
            }
            $name = $name.'-'.$i.'.'.$ext;
        }
        return $f->moveTo($path, $name);
    }

    public function helpAction()
    {
        $webasyst_cheat_sheet_helper = new webasystBackendCheatSheetActions();
        return $webasyst_cheat_sheet_helper->cheatSheetAction();
    }

    /**
     * @return waPageModel
     */
    protected function getPageModel()
    {
        if (!$this->model) {
            $this->model = $this->getAppId().'PageModel';
        }
        return new $this->model();
    }

    /**
     * @return waModel
     */
    protected function getDomainModel()
    {
        static $model;
        if (!$model) {
            $model = $this->getAppId().'DomainModel';
            $model = new $model();
        }
        return $model;
    }

    protected function getView()
    {
        return wa('webasyst')->getView();
    }

}
