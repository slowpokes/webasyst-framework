<?php

$model = new waModel();

//попытка получить содержимое потенциально отсутствующего поля таблицы
try {
    $model->query('SELECT `nofollow` FROM `banner_items` WHERE 0');

//в случае неудачи — если поле отсутствует — добавляем его в таблицу
} catch (waDbException $e) {
    $sql = 'ALTER TABLE `banner_items` ADD `nofollow` INT(1) NOT NULL DEFAULT 0';
    
    $model->exec($sql);
}
