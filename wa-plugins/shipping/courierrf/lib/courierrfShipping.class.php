<?
class courierrfShipping extends waShipping
{
	protected function initControls()
    {
        $this
            ->registerControl('WeightCosts')
            ->registerControl('DeliveryTime')
            ->registerControl('RegionRatesControl');
        parent::initControls();
    }    
	public function calculate()
	{
		$region_id = $this->getAddress('region');
		$zone = $this->region[$region_id]['zone'];
		$date = $this->delivery_time;
        if ($this->delivery_time) {
            $delivery_date = strtotime($date[$zone]);
            $delivery_date = waDateTime::format('humandate', $delivery_date);
        } else {
            $delivery_date = null;
        }
        return array(
            'delivery' => array(
                'est_delivery' => $delivery_date,
                'currency'     => $this->allowedCurrency(),
                'rate'         => $this->getZoneRate($this->getTotalWeight(), $this->getTotalPrice(), $zone),
            ),
        );
	}
	
	public function allowedCurrency()
    {
        return 'RUB';
    }

    public function allowedWeightUnit()
    {
        return 'kg';
    }
    
    private function getZoneRate($weight, $price, $zone)
    {
        $zone = max(1, min(5, $zone));
        $kilocost = $this->kilocost;
        return ceil($weight) * $kilocost[$zone];
    }
	
	public static function settingRegionRatesControl($name, $params = array())
    {
        foreach ($params as $field => $param) {
            if (strpos($field, 'wrapper')) {
                unset($params[$field]);
            }
        }

        if (empty($params['value']) || !is_array($params['value'])) {
            $params['value'] = array();
        }
        $control = '';

        waHtmlControl::addNamespace($params, $name);

        $rm = new waRegionModel();
        if ($regions = $rm->getByCountry('rus')) {

            $control .= "<table class=\"zebra\"><thead>";
            $control .= "<tr class=\"gridsheader\"><th colspan=\"3\">";
            $control .= htmlentities('Распределите регионы по тарифным поясам Почты России', ENT_QUOTES, 'utf-8');
            $control .= "</th>";
            $control .= "<th>Только авиа</th>";
            $control .= "</th></tr></thead><tbody>";

            $params['control_wrapper'] = '<tr><td>%s</td><td>&rarr;</td><td>%s</td><td>%s</td></tr>';
            $params['title_wrapper'] = '%s';
            $params['description_wrapper'] = '%s';
            $params['options'] = array();
            $params['options'][0] = _wp('*** пояс не выбран ***');
            for ($region = 1; $region <= 5; $region++) {
                $params['options'][$region] = sprintf(_wp('Пояс %d'), $region);
            }
            $avia_params = $params;
            $avia_params['control_wrapper'] = '%2$s';
            $avia_params['description_wrapper'] = false;
            $avia_params['title_wrapper'] = false;

            foreach ($regions as $region) {
                $name = 'zone';
                $id = $region['code'];
                if (empty($params['value'][$id])) {
                    $params['value'][$id] = array();
                }
                $params['value'][$id] = array_merge(array($name => 0, 'avia_only' => false), $params['value'][$id]);
                $region_params = $params;

                waHtmlControl::addNamespace($region_params, $id);
                $avia_params = array(
                    'namespace'           => $region_params['namespace'],
                    'control_wrapper'     => '%2$s',
                    'description_wrapper' => false,
                    'title_wrapper'       => false,
                    'value'               => $params['value'][$id]['avia_only'],
                );
                $region_params['value'] = max(0, min(5, $params['value'][$id][$name]));

                $region_params['description'] = waHtmlControl::getControl(waHtmlControl::CHECKBOX, 'avia_only', $avia_params);
                $region_params['title'] = $region['name'];
                if ($region['code']) {
                    $region_params['title'] .= " ({$region['code']})";
                }
                $control .= waHtmlControl::getControl(waHtmlControl::SELECT, 'zone', $region_params);
            }
            $control .= "</tbody>";
            $control .= "</table>";
        } else {
            $control .= 'Не определено ни одной области. Для работы модуля необходимо определить хотя бы одну область в России (см. раздел «Страны и области»).';
        }
        return $control;
    }
    
    public static function settingWeightCosts($name, $params = array())
    {
        foreach ($params as $field => $param) {
            if (strpos($field, 'wrapper')) {
                unset($params[$field]);
            }
        }
        $control = '';
        if (!isset($params['value']) || !is_array($params['value'])) {
            $params['value'] = array();
        }
        $costs = $params['value'];

        waHtmlControl::addNamespace($params, $name);
        $control .= '<table class="zebra">';
        $params['description_wrapper'] = '%s';
        $currency = waCurrency::getInfo('RUB');
        $params['title_wrapper'] = '%s';
        $params['control_wrapper'] = '<tr title="%3$s"><td>%1$s</td><td>&rarr;</td><td>%2$s '.$currency['sign'].'</td></tr>';
        $params['size'] = 6;
        for ($zone = 1; $zone <= 5; $zone++) {
            $params['value'] = floatval(isset($costs[$zone]) ? $costs[$zone] : 0.0);
            $params['title'] = "Пояс {$zone}";
            $control .= waHtmlControl::getControl(waHtmlControl::INPUT, $zone, $params);
        }
        $control .= "</table>";

        return $control;
    }
    
    public static function settingDeliveryTime($name, $params = array())
    {
        foreach ($params as $field => $param) {
            if (strpos($field, 'wrapper')) {
                unset($params[$field]);
            }
        }
        $control = '';
        if (!isset($params['value']) || !is_array($params['value'])) {
            $params['value'] = array();
        }
        $time = $params['value'];

        waHtmlControl::addNamespace($params, $name);
        $control .= '<table class="zebra">';
        $params['description_wrapper'] = '%s';
        $params['title_wrapper'] = '%s';
        $params['control_wrapper'] = '<tr title="%3$s"><td>%1$s</td><td>&rarr;</td><td>%2$s </td></tr>';
        $params['size'] = 6;
        for ($zone = 1; $zone <= 5; $zone++) {
            $params['value'] = floatval(isset($time[$zone]) ? $time[$zone] : 0.0);
            $params['title'] = "Пояс {$zone}";
            $control .= waHtmlControl::getControl(waHtmlControl::INPUT, $zone, $params);
        }
        $control .= "</table>";

        return $control;
    }
}
