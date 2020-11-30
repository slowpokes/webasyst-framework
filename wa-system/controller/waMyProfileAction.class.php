<?php
/**
 * Profile editor form for various "my account" sections with front-end auth.
 * To use it, an application must extend this class it and provide a template,
 * similar to waLoginAction.
 */
abstract class waMyProfileAction extends waViewAction
{
    /** @var waContactForm */
    public $form = null;

    /** @var waContact */
    public $contact = null;

    /**
     * @var string waContactForm namesapce
     */
    protected $namespace = 'profile';

    public function execute()
    {
        $this->form = $this->getForm();
        $this->contact = $this->getContact();

        $this->form->setValue($this->contact);

        $this->updateAddress($this->contact);//VADIM CODE
        $saved = waRequest::post() && $this->saveFromPost($this->form, $this->contact);

        //VADIM CODE START
        if($saved){
            $this->redirect('/my/profile/');
        }
        //VADIM CODE END

        $this->view->assign('saved', $saved);
        $this->view->assign('contact', $this->contact);
        $this->view->assign('form', $this->form);
        $this->view->assign('user_info', $this->getFormFieldsHtml());
    }

    /**
     * @param waContactForm $form
     * @param waContact $contact
     * @return bool
     */
    protected function saveFromPost($form, $contact)
    {
        $data = $form->post();
        if (!$data || !is_array($data)) {
            return false;
        }

        // save photo before all
        $photo_file = waRequest::file('photo_file');
        if (array_key_exists('photo', $data)) {
            if ($photo_file->uploaded() && $avatar = $photo_file->waImage()) { // add/update photo
                $square = min($avatar->height, $avatar->width);

                // setPhoto with crop
                $rand = mt_rand();
                $path = wa()->getDataPath(waContact::getPhotoDir($contact->getId()), true, 'contacts', false);
                // delete old image
                if (file_exists($path)) {
                    waFiles::delete($path);
                }
                waFiles::create($path);

                $filename = $path.$rand.".original.jpg";
                waFiles::create($filename);
                waImage::factory($photo_file)->save($filename, 90);

                $filename = $path.$rand.".jpg";
                waFiles::create($filename);
                waImage::factory($photo_file)->crop($square, $square)->save($filename, 90);

                waContactFields::getStorage('waContactInfoStorage')->set($contact, array('photo' => $rand));

            } elseif (empty($data['photo'])) { // remove photo
                $contact->set('photo', "");
            }

            // just in case, may be some outer code user values array
            $this->form->values['photo'] = $contact->get('photo');

            // after saving page it is not reloaded, but waContactForm gets data from post property to render itself by html() method
            $this->form->post['photo'] = $contact->get('photo');
        }

        // Validation
        if (!$form->isValid($contact)) {
            return false;
        }

        // Password validation
        if (!empty($data['password']) && $data['password'] !== $data['password_confirm']) {
            $form->errors('password', _ws('Passwords do not match'));
            return false;
        } elseif (!empty($data['password']) && strlen($data['password']) > waAuth::PASSWORD_MAX_LENGTH) {
            $form->errors('password', _ws('Specified password is too long.'));
            return false;
        } elseif (empty($data['password']) || empty($data['password_confirm'])) {
            unset($data['password']);
        }
        unset($data['password_confirm']);

        // get old data for logging
        if ($this->contact) {
            $old_data = array();
            foreach ($data as $field_id => $field_value) {
                $old_data[$field_id] = $this->contact->get($field_id);
            }
        }

        if (isset($data['address'])) {
            $this->prepareAddressesBeforeSave($data['address']);
        }

        foreach ($data as $field => $value) {
            // except photo, photo is already set
            if ($field != 'photo') {
                $contact->set($field, $value);
            }
        }
        $errors = $contact->save();

        // If something went wrong during save for any reason,
        // show it to user. In theory it shouldn't but better be safe.
        if ($errors) {
            foreach ($errors as $field => $errs) {
                foreach($errs as $e) {
                    $form->errors($field, $e);
                }
            }
            return false;
        }

        // get new data for logging
        $new_data = array();
        foreach ($data as $field_id => $field_value) {
            if (!isset($errors[$field_id])) {
                $new_data[$field_id] = $this->contact->get($field_id);
            }
        }

        $this->logProfileEdit($old_data, $new_data);

        return true;
    }

    protected function prepareAddressesBeforeSave(&$address_data)
    {
        if (!is_array($address_data)) {
            return;
        }

        // This is a list of all addresses saved in contact. [ i => array( data => array, ext => string ) ]
        $contact_addresses = $this->contact['address'];

        // preserve address 'ext'
        if (!isset($address_data[0])) {
            $address_data = array($address_data);
        }

        foreach ($address_data as $index => &$address) {

            if (isset($address['data']) && (isset($address['ext']) || isset($address['value']))) {
                $address = $address['data'];
            }

            if (isset($contact_addresses[$index])) {
                $ext = isset($contact_addresses[$index]['ext']) ? $contact_addresses[$index]['ext'] : null;
            } else {
                $ext = null;
            }

            $address = array(
                'value' => $address,
                'ext' => $ext
            );
        }
        unset($address);
    }

    public function logProfileEdit($old_data, $new_data)
    {
        $diff = array();
        wa_array_diff_r($old_data, $new_data, $diff);
        if (!empty($diff)) {
            $this->logAction('my_profile_edit', $diff, null, $this->contact->getId());
        }
    }

    /**
     * waContact to use as initial form data.
     * @return waContact
     */
    protected function getContact()
    {
        return wa()->getUser();
    }

    /**
     * @return waContactForm
     */
    protected function getForm()
    {
        // Read all contact fields and find all enabled for "my profile"
        $fields = array(
                'photo' => new waContactHiddenField('photo', _ws('Photo')),
            ) + waContactFields::getAll('person') + array(
                'password' => new waContactPasswordField('password', _ws('Password')),
            ) + array(
                'password_confirm' => new waContactPasswordField('password_confirm', _ws('Confirm password')),
            );

        $domain = wa()->getRouting()->getDomain();
        $domain_config_path = wa()->getConfig()->getConfigPath('domains/'.$domain.'.php', true, 'site');
        if (file_exists($domain_config_path)) {
            $domain_config = include($domain_config_path);
        } else {
            $domain_config = array();
        }

        $enabled = array();
        foreach($fields as $fld_id => $f) {
            if (!empty($domain_config['personal_fields'][$fld_id])) {
                $enabled[$fld_id] = $f;
                if ($fld_id === 'password') {
                    $enabled[$fld_id.'_confirm'] = $fields[$fld_id.'_confirm'];
                }
            }
        }

        // If nothing found, fall back to the default field list
        if (!$enabled) {
            foreach(array('firstname', 'middlename', 'lastname', 'email', 'phone', 'password', 'password_confirm') as $fld_id) {
                if (!empty($fields[$fld_id])) {
                    $enabled[$fld_id] = $fields[$fld_id];
                }
            }
        }

        return waContactForm::loadConfig($enabled, array(
            'namespace' => $this->namespace
        ));
    }

    //VADIM CODE START
    private function updateAddress(waContact $contact){
        if(isset($_POST['customer']['address'])){
            //исправляем поля если только один адрес
            foreach($_POST['customer']['address'] as $key=>$val){
                if(!is_int($key)){
                    $_POST['customer']['address'][0][$key] = $val;
                    unset($_POST['customer']['address'][$key]);
                }
            }

            //добавление нового адреса
            $add = waRequest::post('add', null, 'array');
            if($add){
                if(isset($add['address'])){
                    if(count($_POST['customer']['address'])==1){
                        $arr = $_POST['customer']['address'][0];
                        $arr['ext'] = '';
                        $_POST['customer']['address'][] = $arr;
                    }
                    $arr = array('ext'=>'', 'country' => 'rus');
                    $_POST['customer']['address'][] = $arr;
                }
            }

            // восстанавливаем shipping адрес
            $addr = $contact->get('address');
            if(!isset($_POST['customer']['address'][0])){
                $_POST['customer']['address'][0] = $addr[0];
                ksort($_POST['customer']['address']);
            }

            // формирование названия адреса
            foreach($_POST['customer']['address'] as $key=>$val){
                if($key==0){
                    $_POST['customer']['address'][$key]['ext'] = 'shipping';
                }
                else{
                    if(isset($addr[$key]['ext'])){
                        $_POST['customer']['address'][$key]['ext'] = $addr[$key]['ext'];
                    }
                    else{
                        $_POST['customer']['address'][$key]['ext'] = "custom_$key";
                    }
                }
            }

            // удаление адреса
            $delete = waRequest::post('delete', null, 'array');
            if($delete){
                if(isset($delete['address'])){
                    if($delete['address']>0){
                        foreach($delete['address'] as $id=>$smth){
                            if(isset($_POST['customer']['address'][$id])){
                                array_splice($_POST['customer']['address'], $id, 1);
                            }
                            if(count($_POST['customer']['address'])==2){
                                array_splice($_POST['customer']['address'], 0, 1);
                                $_POST['customer']['address'][0]['ext'] = 'shipping';
                            }
                        }
                    }
                }
            }
            ksort($_POST['customer']['address']);
        }
    }
    //VADIM CODE END
    /**
     * @description Get HTML with contact info (field name => field html)
     * @return array
     */
    protected function getFormFieldsHtml()
    {
        if (!$this->contact) {
            $this->contact = $this->getContact();
        }
        if (!$this->form) {
            $this->form = $this->getForm();
        }
        $user_info = array();
        foreach($this->form->fields as $id => $field) {
            if (!in_array($id, array('password', 'password_confirm'))) {
                if ($id === 'photo') {
                    $user_info[$id] = array(
                        'name' => _ws('Photo'),
                        'value' => '<img src="'.$this->contact->getPhoto().'">',
                    );
                } else {
                    $user_info[$id] = array(
                        'name' => $this->form->fields[$id]->getName(null, true),
                        'value' => $this->contact->get($id, 'html'),
                    );
                }
            }
        }
        return $user_info;
    }

    public function display($clear_assign = true)
    {
        return parent::display(false);
    }
}

