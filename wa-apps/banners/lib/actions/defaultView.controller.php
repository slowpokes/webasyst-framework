<?php
// VADIM CODE FILE

class defaultViewController extends waDefaultViewController{
    public function execute()
    {
        $this->setLayout(new bannersBasicLayout());
        parent::execute();
    }
}