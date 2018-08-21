<?php

class blogTitlePlugin extends blogPlugin{
    public function frontendHead(){
        $get_vars = self::getVars();
        if(isset($get_vars['page'])) {
            if($get_vars['page']>1){
                $title = wa()->getResponse()->getMeta('title');
                if(strpos($title, 'раница')>0){
                    return '';
                }
                else{
                    wa()->getResponse()->setTitle($title.', страница '.$get_vars['page']);
                }

                $description = wa()->getResponse()->getMeta('description');
                if(strpos($title, 'раница')>0){
                    return '';
                }
                else{
                    wa()->getResponse()->setMeta('description', $description.', страница '.$get_vars['page']);
                }
            }
        }
        return '';
    }

    private static function getVars(){
        $query = $_SERVER['QUERY_STRING'];
        parse_str($query, $get_array);
        return $get_array;
    }
}