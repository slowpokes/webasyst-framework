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
    }

    /**
     * @return bool
     */
    protected function saveFromPost($form, $contact)
    {
        // Validation
        if (!$form->isValid($contact)) {
            return false;
        }

        $data = $form->post();
        if (!$data || !is_array($data)) {
            return false;
        }

        foreach ($data as $field => $value) {
            $contact->set($field, $value);
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

        return true;
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
        $fields = waContactFields::getAll('person');
        $enabled = array();
        foreach($fields as $fld_id => $f) {
            if ($f->getParameter('my_profile')) {
                $enabled[$fld_id] = $f;
            }
        }

        // If nothing found, fall back to the default field list
        if (!$enabled) {
            foreach(array('firstname', 'middlename', 'lastname', 'email', 'phone') as $fld_id) {
                if (!empty($fields[$fld_id])) {
                    $enabled[$fld_id] = $fields[$fld_id];
                }
            }
        }

        return waContactForm::loadConfig($enabled, array(
            'namespace' => 'profile'
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
}

