<?php

class waMetroModel extends waModel
{
    protected $table = 'wa_metro';

    public function all()
    {
        $stations = array();
        $data = $this->order('name')->fetchAll();
        foreach ($data as $d) {
            $stations[$d['name']] = $d['name'];
        }

        return $stations;
    }

    /**
     * Обновляет список станций метро
     *
     * @see shopUpdateMetroCli
     * @throws waException
     */
    public function update()
    {
        $json = file_get_contents('https://api.hh.ru/metro/1');
        $metro = json_decode($json);

        if ($metro) {
            foreach ($metro->lines as $line) {
                foreach ($line->stations as $station) {
                    $this->insert([
                        'name' => $station->name,
                        'line_id' => $line->id,
                        'color' => $line->hex_color,
                        'sort' => $station->order
                    ], 1);
                }
            }
        }
    }
}
