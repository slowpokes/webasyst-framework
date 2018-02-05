<?php

$model = new waModel();
try {
    $model->exec("ALTER TABLE `blog_post` DROP `image`");
} catch (waDbException $e) {
    
}

