<?php

class waDesignActions extends waActions
{

    protected $design_url = '#/';
    protected $themes_url = '#/themes/';

    protected $options = array(
        'container' => true,
        'save_panel' => true,
        'js' => array(
            'ace' => true,
            'editor' => true,
        ),
        'is_ajax' => false
    );

    public function defaultAction()
    {
        $app_id = $this->getAppId();
        $app_fake_id = $this->getAppFakeId();// VADIM CODE
        $app = wa()->getAppInfo($app_fake_id);// VADIM CODE

        if (empty($app['themes'])) {
            throw new waException('App does not support themes.');
        }

        $themes = wa()->getThemes($app_id);
        $routes = $this->getRoutes();
        $themes_routes = $this->getThemesRoutes($themes, $routes);

        $themes = $this->sortThemes($themes, $themes_routes);

        $template = $this->getConfig()->getRootPath().'/wa-system/design/templates/Design.html';

        $routing_url = false;
        if (wa()->appExists('site')) {
            wa('site');
            $domain_model = new siteDomainModel();
            $routing_url = wa()->getAppUrl('site').'#/routing/';
        }
        $this->display(array(
            'template_path' => $this->getConfig()->getRootPath().'/wa-system/design/templates/',
            'design_url' => $this->design_url,
            'themes_url' => $this->themes_url,
            'themes' => $themes,
            'themes_routes' => $themes_routes,
            'app_id' => $app_id,
            'app' => $app,
            'routing_url' => $routing_url,
            'options' => $this->options
        ), $template);
    }

    protected function sortThemes($themes, $themes_routes)
    {
        // sort themes
        $result = array();
        foreach ($themes_routes as $theme_id => $r) {
            $result[$theme_id] = $themes[$theme_id];
        }

        foreach ($themes as $theme_id => $theme) {
            if (!isset($temp_themes[$theme_id])) {
                $result[$theme_id] = $theme;
            }
        }

        return $result;
    }


    public function editAction()
    {
        $app_id = $this->getAppId();
        $app = wa()->getAppInfo($app_id);
        $theme_id = waRequest::get('theme');
        $theme = new waTheme($theme_id, $app_id);
        if (($f = waRequest::get('file')) !== '') {
            if (!$f) {
                $files = $theme['files'];
                if (isset($files['index.html'])) {
                    $f = 'index.html';
                } else {
                    ksort($files);
                    $f = key($files);
                }
            }
            $file = $theme->getFile($f);
            $file['id'] = $f;
            if ($theme->parent_theme_id && !empty($file['parent'])) {
                if (!waTheme::exists($theme->parent_theme_id, $app_id)) {
                    $theme_id = $theme->parent_theme_id;
                    if (strpos($theme_id, ':') !== false) {
                        list($app_id, $theme_id) = explode(':', $theme_id, 2);
                        $app = wa()->getAppInfo($app_id);
                    }
                    throw new waException(sprintf(_ws('Theme %s for “%s” app not found.'), $theme_id, $app['name']));
                }
                $path = $theme->parent_theme->getPath();
                $parent_file = $theme->parent_theme->getFile($f);
                if (empty($file['description'])) {
                    $file['description'] = ifset($parent_file['description'], '');
                }
            } else {
                $path = $theme->getPath();
            }
            $path .= '/'.$f;
            $content = file_exists($path) ? file_get_contents($path) : '';
            $file['content'] = $content;
            if ($theme->type == waTheme::OVERRIDDEN) {
                $file['has_original'] = $theme['type'] == file_exists(wa()->getAppPath('themes/'.$theme_id, $app_id).'/'.$f);
            }
        } else {
            $file = array(
                'id' => null,
                'description' => '',
                'custom' => true,
                'content' => ''
                );
        }

        $template = $this->getConfig()->getRootPath().'/wa-system/design/templates/DesignEdit.html';
        $data = array(
            'options' => $this->options,
            'app_id' => $app_id,
            'design_url' => $this->design_url,
            'app' => $app,
            'file' => $file,
            'theme_id' => $theme_id,
            'theme' => $theme
        );
        if ($theme->parent_theme_id) {
            $data['parent_theme'] = $theme->parent_theme;
        }
        $this->display($data, $template);
    }

    protected function getThemesRoutes(&$themes, $routes)
    {
        $hash = $this->getThemeHash();
        $themes_routes = array();
        $preview_url = '';
        if (wa()->appExists('site')) {
            wa('site');
            $model = new siteDomainModel();
            $domains = $model->select('id,name')->fetchAll('name', true);
            $routing_url = wa()->getAppUrl('site');
        } else {
            $domains = array();
        }
        $domain = wa()->getRouting()->getDomain();
        foreach ($routes as $r) {
            $t_id = isset($r['theme']) ? $r['theme']: 'default';
            if (isset($themes[$t_id])) {
                if (!isset($themes[$t_id]['preview_url'])) {
                    $url = $r['_url'];
                    if (!$preview_url && $r['_domain'] == $domain) {
                        $preview_url = $url;
                    }
                    $themes[$t_id]['is_used'] = true;
                    $themes[$t_id]['preview_url'] = $url;
                }
                if (isset($domains[$r['_domain']]) && $this->getUser()->getRights('site', 'domain.'.$domains[$r['_domain']])) {
                    $r['_routing_url'] = $routing_url.'?domain_id='.$domains[$r['_domain']].'#/routing/'.$r['_id'];
                }
                $themes_routes[$t_id][$r['_url']] = $r;
            }
        }
        $preview_params = strpos($preview_url, '?') === false ? '?' : '&';
        $preview_params .= 'theme_hash='.$hash.'&set_force_theme=';
        foreach ($themes as $t_id => $theme) {
            if (!isset($theme['preview_url'])) {
                $themes[$t_id]['preview_url'] = $preview_url ? $preview_url.$preview_params.$t_id : '';
            }
            $themes[$t_id]['preview_name'] = preg_replace('/^.*?\/\/(.*?)\?.*$/', '$1', $themes[$t_id]['preview_url']);
        }
        return $themes_routes;
    }

    protected function getThemeHash()
    {
        $hash = $this->appSettings('theme_hash');
        if ($hash) {
            $hash_parts = explode('.', $hash);
            if (time() - $hash_parts[1] > 14400) {
                $hash = '';
            }
        }
        if (!$hash) {
            $hash = uniqid().'.'.time();
            $app_settings_model = new waAppSettingsModel();
            $app_settings_model->set($this->getAppId(), 'theme_hash', $hash);
        }

        return md5($hash);
    }

    protected function getRoutes()
    {
        $routes = wa()->getRouting()->getByApp($this->getAppId());
        $result = array();
        foreach ($routes as $d => $domain_routes) {
            foreach ($domain_routes as $route_id => $route) {
                $route['_id'] = $route_id;
                $route['_domain'] = $d;
                $route['_url'] = waRouting::getUrlByRoute($route, $d);
                $route['_url_title'] = $d.'/'.waRouting::clearUrl($route['url']);
                $result[] = $route;
            }
        }
        return $result;
    }


    public function saveAction()
    {
        $app_id = $this->getAppFakeId();
        $theme_id = waRequest::get('theme_id');
        $file = waRequest::get('file');

        $errors = null;

        $path = wa()->getDataPath('themes', true, $app_id, false);
        $this->checkAccess($path);

        // copy original theme
        $theme = new waTheme($theme_id, $app_id);
        if ($theme['type'] == waTheme::ORIGINAL) {
            $theme->copy();
        }
        // create file
        if (!$file) {
            // parent
            if (waRequest::post('type')) {
                $file = waRequest::post('parent');
                $theme->addFile($file, '', array('parent' => 1));
            } else {
                $file = waRequest::post('file');
                if ($this->checkFile($file, $errors)) {
                    $theme->addFile($file, waRequest::post('description'));
                }
            }
            if (!$errors) {
                if (!$theme->save()) {
                    $errors = _ws('Insufficient file access permissions to save theme settings');
                } else {
                    $this->logAction('template_add', $file);
                }
            }
        } else {
            if (waRequest::post('file') && $file != waRequest::post('file')) {
                if (!$this->checkFile(waRequest::post('file'), $errors)) {
                    $this->displayJson(array(), $errors);
                    return;
                }
                $theme->removeFile($file);
                $file = waRequest::post('file');
                if (!$theme->addFile($file, waRequest::post('description'))->save()) {
                    $errors = _ws('Insufficient file access permissions to save theme settings');
                } else {
                    $this->logAction('template_edit', $file);
                }
            } else {
                $f = $theme->getFile($file);
                if (!empty($theme['parent_theme_id']) && $f['parent']) {
                    $theme = new waTheme($theme['parent_theme_id']);
                    if ($theme['type'] == waTheme::ORIGINAL) {
                        $theme->copy();
                    }
                }
                if (!$theme->changeFile($file, waRequest::post('description'))) {
                    $errors = _ws('Insufficient file access permissions to save theme settings');
                } else {
                    $this->logAction('template_edit', $file);
                }
            }
            @touch($theme->getPath().'/'.waTheme::PATH);
        }

        $response = array();
        if ($file && !$errors) {
            // update mtime of theme.xml
            @touch($path);
            $response['id'] = $file;
            switch ($ext = waFiles::extension($file)) {
                case 'css':
                case 'js':
                    $response['type'] = $ext;
                    break;
                default:
                    $response['type'] = '';
            }
            $response['theme'] = $theme_id;
            // if not parent
            if (!waRequest::post('type')) {
                $content = waRequest::post('content');
                $file_path = $theme->getPath().'/'.$file;
                if (!file_exists($file_path) || is_writable($file_path)) {
                    if ($content || file_exists($file_path)) {
                        $r = @file_put_contents($file_path, $content);
                        if ($r !== false) {
                            $r = true;
                        }
                    } else {
                        $r = @touch($file_path);
                    }
                } else {
                    $r = false;
                }
                if (!$r) {
                    $errors = _ws('Insufficient access permissions to save the file').' '.$file_path;
                }
            } else {
                $response['inherit'] = 1;
            }
        }

        $this->displayJson($response, $errors);
    }

    protected function checkAccess($path)
    {
        // create .htaccess to deny access to *.php and *.html files
        if (!file_exists($path.'/.htaccess')) {
            waFiles::create($path.'/');
            $htaccess = '<FilesMatch "\.(php\d?|html)">
    Deny from all
</FilesMatch>
';
            @file_put_contents($path.'/.htaccess', $htaccess);
        }
    }

    protected function checkFile($file, &$errors = array())
    {
        if (!$file) {
            $errors = array(
                _ws('Please enter a filename'),
                'input[name=file]'
            );
            return false;
        }
        if (!preg_match("/^[a-z0-9_\.-]+$/", $file)) {
            $errors = array(
            _ws('Only latin characters (a—z, A—Z), numbers (0—9) and underline character (_) are allowed.'),
                'input[name=file]'
                );
                return false;
        }
        if (!preg_match("/\.(xml|xsl|html|js|css)$/i", $file)) {
            $errors = array(
            _ws('File should have one of the allowed extensions:').' .html, .css, .js, .xml, .xsl',
                'input[name=file]'
                );
                return false;
        }
        return true;
    }


    public function deleteAction()
    {
        $theme = waRequest::post('theme_id', 'default');
        $file = waRequest::post('file');

        $theme = new waTheme($theme, $this->getAppId());
        $theme->removeFile($file);
        $theme->save();
        $this->logAction('template_delete', $file);

        $this->displayJson(array());
    }


    public function themeAction()
    {
        $app_id = $this->getAppId();
        $app_id = $this->getAppFakeId();//VADIM CODE
        $theme_id = waRequest::get('theme');
        $parent_themes = array();
        $apps = wa()->getApps();
        /**
         * @var waTheme $current_theme
         */
        $current_theme = null;

        foreach ($apps as $theme_app_id => $app) {
            if (!empty($app['themes']) && ($themes = wa()->getThemes($theme_app_id))) {
                $themes_data = array();
                foreach($themes as $id => $theme) {
                    if (($app_id == $theme_app_id) && ($theme_id == $id) ) {
                        $current_theme = $theme;
                    }
                    $themes_data[$id] = $theme->name;
                }
                if ($themes_data) {
                    $parent_themes[$theme_app_id] = array(
                            'name'=>$app['name'],
                            'img'=>$app['img'],
                            'themes'=>$themes_data,
                    );
                }
            }
        }
        if (!$current_theme) {
            if(isset($parent_themes[$app_id]) && count($parent_themes[$app_id]['themes']) && ($default = key($parent_themes[$app_id]['themes']))) {
                $this->displayJson(array('redirect'=>"{$this->design_url}theme={$default}&action=theme"));
            } else {
                $this->displayJson(array('redirect'=>$this->themes_url));
            }
        } else {

            $settings = $current_theme->getSettings();
            if ($current_theme->parent_theme) {
                $parent_settings = $current_theme->parent_theme->getSettings();
                foreach ($parent_settings as &$s) {
                    $s['parent'] = 1;
                }
                unset($s);
                foreach ($settings as $k => $v) {
                    $parent_settings[$k] = $v;
                }
                $settings = $parent_settings;
            }

            $this->display(array(
                'settings' => $settings,
                'design_url' => $this->design_url,
                'app' => wa()->getAppInfo($app_id),
                'theme' => $current_theme,
                'options' => $this->options,
                'parent_themes' => $parent_themes,
                'path'=>waTheme::getThemesPath($app_id),
            ), $this->getConfig()->getRootPath().'/wa-system/design/templates/Theme.html');
        }
    }


    public function themeAboutAction()
    {
        $app_id = $this->getAppId();
        $app = wa()->getAppInfo($app_id);
        $theme_id = waRequest::get('theme');
        $theme = new waTheme($theme_id, $app_id);
        $template = $this->getConfig()->getRootPath().'/wa-system/design/templates/ThemeAbout.html';
        $this->display(array(
            'design_url' => $this->design_url,
            'app_id' => $app_id,
            'app' => $app,
            'theme_id' => $theme_id,
            'theme' => $theme,
            'options' => $this->options,
        ), $template);

    }


    public function themesAction()
    {
        $app_id = $this->getAppId();
        $app = wa()->getAppInfo($app_id);

        $template = $this->getConfig()->getRootPath().'/wa-system/design/templates/Themes.html';

        $this->display(array(
            'design_url' => $this->design_url,
            'themes_url' => $this->themes_url,
            'template_path' => $this->getConfig()->getRootPath().'/wa-system/design/templates/',
            'app_id' => $app_id,
            'app' => $app,
            'options' => $this->options,
        ), $template);
    }

    public function themeSettingsAction()
    {
        try {
            $theme_id = waRequest::get('theme');
            $theme = new waTheme($theme_id);
            if ($theme->parent_theme && waRequest::post('parent_settings')) {
                $this->saveThemeSettings($theme->parent_theme, waRequest::post('parent_settings'), waRequest::file('parent_image'));
            }
            $this->saveThemeSettings($theme, waRequest::post('settings'), waRequest::file('image'));
            $this->displayJson(array());
        } catch (waException $e) {
            $this->displayJson(array(), $e->getMessage());
        }
    }

    /**
     * @param waTheme $theme
     * @param array $settings
     * @param waRequestFileIterator $files
     * @throws waException
     */
    protected function saveThemeSettings(waTheme $theme, $settings, $files)
    {
        $old_settings = $theme['settings'];
        foreach ($files as $k => $f) {
            /**
             * @var waRequestFile $f
             */
            if (isset($old_settings[$k])) {
                $error = '';
                $filename = str_replace('*', $f->extension, $old_settings[$k]['filename']);
                if ($this->uploadImage($f, $theme->path.'/'.$filename, $error)) {
                    $settings[$k] = $filename;
                } elseif ($error) {
                    throw new waException($error);
                }
            }
        }
        $theme['settings'] = $settings;
        $theme->save();
    }

    /**
     * @param waRequestFile $f
     * @param string $path
     * @param string $error
     * @return bool
     */
    protected function uploadImage(waRequestFile $f, $path, &$error = '')
    {
        if ($f->uploaded()) {
            if (!$this->isImageValid($f, $error)) {
                return false;
            }
            $path = str_replace('*', $f->extension, $path);
            if (!$f->moveTo($path)) {
                $error = sprintf(_w('Failed to upload file %s.'), $f->name);
                return false;
            }
            return true;
        } else {
            if ($f->name) {
                $error = sprintf(_w('Failed to upload file %s.'), $f->name).' ('.$f->error.')';
            }
            return false;
        }
    }

    /**
     * @param waRequestFile $f
     * @param string $error
     * @return bool
     */
    protected function isImageValid(waRequestFile $f, &$error = '')
    {
        $allowed = array('jpg', 'jpeg', 'png', 'gif');
        if (!in_array(strtolower($f->extension), $allowed)) {
            $error = sprintf(_ws("Files with extensions %s are allowed only."), '*.'.implode(', *.', $allowed));
            return false;
        }
        return true;
    }

    public function themeDownloadAction()
    {
        $theme_id = waRequest::get('theme');
        $theme = new waTheme($theme_id, $this->getAppId());
        $this->logAction('theme_download', $theme_id);
        $target_file = $theme->compress(wa()->getTempPath("themes"));
        waFiles::readFile($target_file, basename($target_file), false);
        waFiles::delete($target_file);
        $this->displayJson(array());
    }

    protected function themeRenameAction()
    {
        try {
            $theme = new waTheme(waRequest::post('theme'));
            $id = $theme->move(waRequest::post('id'), array(
                'name' => waRequest::post('name')
            ))->id;
            $this->logAction('theme_rename');
            $this->displayJson(array('redirect'=>"{$this->design_url}theme={$id}&action=theme"));
        } catch (waException $e) {
            $this->displayJson(array(), $e->getMessage());
        }
    }

    public function themeParentAction()
    {
        try {
            if($id = waRequest::post('id')) {
                $theme = new waTheme($id);
                $theme->parent_theme_id = waRequest::post('parent_theme_id');
                $theme->save();
                $this->displayJson(array('parent_theme_id' => $theme->parent_theme_id));
            }

        } catch (waException $e) {
            $this->displayJson(array(), $e->getMessage());
        }
    }

    public function themeCopyAction()
    {
        try {
            $theme = new waTheme(waRequest::post('theme'));
            $duplicate = $theme->duplicate();
            $this->logAction('theme_duplicate', $theme->id);
            $this->displayJson(array('redirect'=>"{$this->design_url}theme={$duplicate->id}&action=theme"));
        } catch (waException $e) {
            $this->displayJson(array(), $e->getMessage());
        }
    }

    public function themeResetAction()
    {
        try {
            $theme = new waTheme(waRequest::post('theme'));
            $parent = $theme->parent_theme;
            $theme->brush();
            // reset parent theme
            if ($parent && waRequest::post('parent')) {
                $parent->brush();
            }
            $this->logAction('theme_reset', $theme->id);
            $this->displayJson(array());
        } catch (waException $e) {
            $this->displayJson(array(), $e->getMessage());
        }
    }

    public function themeDeleteAction()
    {
        try {
            $theme_id = waRequest::post('theme');
            $theme = new waTheme($theme_id);
            $theme->purge();
            $this->logAction('theme_delete', $theme_id);
            $this->displayJson(array('redirect'=>$this->design_url,'theme_id'=>$theme_id));
        } catch (waException $e) {
            $this->displayJson(array(), $e->getMessage());
        }
    }

    protected function themeUploadAction()
    {
        if ($file = waRequest::file('theme_files')) {
            /**
             * @var waRequestFile
             */
            if ($file->uploaded()) {
                try {
                    $theme = waTheme::extract($file->tmp_name);
                    $this->logAction('theme_upload', $theme->id);
                    $this->displayJson(array('theme' => $theme['id']));
                } catch (Exception $e) {
                    waFiles::delete($file->tmp_name);
                    $this->displayJson(array(), $e->getMessage());
                }
            } else {
                $this->displayJson(array(), $file->error);
            }
        }
    }

    public function viewOriginalAction()
    {
        $theme_id = waRequest::get('theme_id');
        $template = $this->getConfig()->getRootPath().'/wa-system/design/templates/DesignViewOriginal.html';

        $file = array();
        if ($theme_id && $f = waRequest::get('file')) {
            $app_id = $this->getAppId();
            $theme = new waTheme($theme_id, $app_id);
            $theme_path = wa()->getAppPath('themes/'.$theme_id, $app_id).'/';

            $path = $theme_path.$f;
            if ($theme['type'] == waTheme::OVERRIDDEN && file_exists($path)) {
                $file = $theme->getFile($f);
                $file['id'] = $f;
                $file['content'] = file_get_contents($path);
                $file['theme_path'] = str_replace(wa()->getConfig()->getRootPath(), '', $theme_path);
            }
        }
        $this->display(array(
            'file' => $file
        ), $template);
    }

    protected function getView()
    {
        return wa('webasyst')->getView();
    }
}