<?php

class waContactNewAddressField extends waContactAddressField
{
    public function getHtmlOne($params = array(), $attrs = '')
    {
        $result = array();
        $params_subfield = $params;
        $value = ifset($params['value'], array());
        $data = ifset($value['data'], array());
        $params_subfield['composite_value'] = $data;

        if (!isset($params['id'])) {
            $params['id'] = $this->getId();
        }

        if (wa()->getEnv() == 'backend') {
            $required_class = 'required ';
        } else {
            $required_class = 'wa-required ';
        }

        foreach ($this->options['fields'] as $field) {
            $params_subfield['id'] = $field->getId();
            $params_subfield['parent'] = $params['id'];
            $params_subfield['value'] = ifset($data[$field->getId()]);

            if (!strlen($params_subfield['value'])) {
                $default_value = $field->getParameter('value');
                if ($default_value) {
                    $params_subfield['value'] = $default_value;
                }
            }

            $errors_html = '';
            $attrs_one = $attrs;
            if (!empty($params['validation_errors']) && !empty($params['validation_errors'][$field->getId()])) {
                $params_subfield['validation_errors'] = $params['validation_errors'][$field->getId()];
                $attrs_one = preg_replace('~class="~', 'class="error ', $attrs_one);
                if (false === strpos($attrs_one, 'class="error')) {
                    $attrs_one .= ' class="error"';
                }
            } else {
                unset($params_subfield['validation_errors']);
            }

            if ($field instanceof waContactHiddenField) {
                $result[] = $field->getHTML($params_subfield, $attrs_one);
            } else {
                $field_class = 'field-'.$this->getId().'-'.$field->getId();
                if (wa()->getEnv() == 'frontend') {
                    $field_class = 'wa-'.$field_class;
                }
                $result[] = '<div class="'.($field->isRequired() ? $required_class : '').'fa-field '.$field_class.'"><div class="fa-name">'.$field->getName().'</div><div class="fa-value">'.$field->getHTML($params_subfield, $attrs_one).$errors_html.'</div></div>';
            }
        }
        $result[] = "<div class='fa-fields-end'></div>";
        return implode($result);
    }
}
// EOF
