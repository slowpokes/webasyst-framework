<?php 

class siteRedirectGenerateAction extends waViewAction
{
    public function execute()
    {
        $domain_id = waRequest::get('domain_id');
        $domain = siteHelper::getDomain();
        $add = waRequest::get('add');
        $model = new waRedirectModel();

        $products = $model->query('SELECT productID as id, slug from SC_products')->fetchAll();
        $categories = $model->query('SELECT categoryID as id, slug from SC_categories')->fetchAll();
        $pages = $model->query('SELECT aux_page_ID as id, aux_page_slug as slug from SC_aux_pages')->fetchAll();

        $data = array();
        foreach($products as $line){
            if($line['slug']=='')$line['slug'] = $line['id'];
            $data[] = array(
                'url' => "index.php?productID=".$line['id'],
                'redirect' => "/product/{$line['slug']}/",
                'visible'=>0,
            );
            if($line['slug']!=$line['id']){
                $data[] = array(
                    'url' => "product/{$line['id']}/",
                    'redirect' => "/product/{$line['slug']}/",
                    'visible'=>0,
                );
            }
            $data[] = array(
                'url' => "product/{$line['slug']}/",
                'redirect' => "",
            );
        }
        foreach($categories as $line){
            if($line['slug']=='')$line['slug'] = $line['id'];
            $data[] = array(
                'url' => "index.php?categoryID=".$line['id'],
                'redirect' => "/category/{$line['slug']}/",
                'visible'=>0,
            );
            if($line['slug']!=$line['id']){
                $data[] = array(
                    'url' => "category/{$line['id']}/",
                    'redirect' => "/category/{$line['slug']}/",
                    'visible'=>0,
                );
            }
            $data[] = array(
                'url' => "category/{$line['slug']}/",
                'redirect' => "",
            );
        }
        foreach($pages as $line){
            $data[] = array(
                'url' => "index.php?ukey=auxpage_".$line['slug'],
                'redirect' => "/auxpage_{$line['slug']}/",
                'visible'=>0,
            );
            $data[] = array(
                'url' => "auxpage_{$line['slug']}/",
                'redirect' => "",
            );
        }
        foreach($data as $line){
            $line['domain'] = $domain;
            if($add){
                $model->insert($line);
            }
        }

        echo "OK";
        exit;
    }
}