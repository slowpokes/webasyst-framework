<?php

class waDebugger
{
    private static $instance;
    private function __construct(){
        global $_debug_start;
        $this->queries_num = 0;
        $this->slow_query = 0;
        $this->start_time = $_debug_start;
        $this->queries = array();
    }
    private $vars;
    private $typed_vars = array();
    private $queries_num;
    private $slow_query;
    private $start_time;

    public function start(){
    }

    public static function getInstance() {
        if ( empty(self::$instance) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function isDebug(){
        if(isset($_COOKIE['show_debug'])){
            if($_COOKIE['show_debug']>=1)
                return true;
        }
        return false;
    }

    public static function isAJAXDebug(){
        if(isset($_COOKIE['show_ajax_debug'])){
            if($_COOKIE['show_ajax_debug']>=1)
                return true;
        }
        return false;
    }

    public function addString($string) {
        if($this->isDebug()){
            $this->vars[] = $string;

            $tv = array();
            $tv['type'] = 'string';
            $tv['params'] = '';
            $tv['string'] = $string;
            $tv['backtrace'] = self::getBackTrace();
            $tv['time'] = microtime(1) - $this->start_time;
            $this->typed_vars[] = $tv;
        }
        return true;
    }

    private function getBackTrace(){
        $backtrace = '';
        $arr = debug_backtrace();
        $n = 0;
        foreach($arr as $b){
            $file = '';
            $line = '0';
            if(isset($b['file']) && isset($b['line'])){
                $file = $b['file'];
                $line = $b['line'];
            }

            $file = str_replace($_SERVER["DOCUMENT_ROOT"], '<i>ROOT</i>', $file);

            if($n>0){
                $backtrace .= "$file ($line) -> ";
            }
            $n++;
        }
        return $backtrace;
    }

    public function addQuery($string, $time_start, $time_end){
        if(self::isDebug()){
            $time_diff = $time_end - $time_start;
            $time_diff_str = sprintf("%01.5f", $time_diff);
            $tv = array();
            $tv['optimize'] = 0;
            if(isset($this->queries[$string])){
                $tv['optimize'] = '1';
            }
            $this->queries[$string] = 1;

            $tv['type'] = 'query';
            $tv['params'] = "$time_diff_str; ";

            if(($time_diff*1000)>500){
                $tv['params'] = "<b>$time_diff_str</b>; ";
                $this->slow_query = 1;
            }

            $tv['string'] = $string;
            $tv['backtrace'] = self::getBackTrace();
            $tv['time_start'] = $time_start - $this->start_time;
            $tv['time_end'] = $time_end - $this->start_time;
            $this->vars[] = "$time_diff_str\n".(round($tv['time_start']*1000)/1000)." -> ".(round($tv['time_end']*1000)/1000)."\nQuery: ".$string;
            $this->typed_vars[] = $tv;
            $this->queries_num++;
        }
        return true;
    }

    public function getText(){
        $res = "";
        if(self::isDebug()){
            foreach ($this->vars as $value) {
                $res .= $value . "\n";
            }
        }
        return $res;
    }

    public function showInView(){
        $str = '';
        if(self::isDebug()){
            $str .= "<link rel='stylesheet' href='/wa-content/css/debug.css'>";
            $str .= "<div class='debug'>";
            $str .= "<div class='debug_info'>".$this->getInfoText()."</div>";
            $queries_count = 0;
            $prev_time = 0;
            foreach($this->typed_vars as $tv){
                $gap = $tv['time_start'] - $prev_time;
                $prev_time = $tv['time_end'];
                if($gap>0.1){
                    $str .= "<div class='typed type_warning'>Long time between queries</div>";
                }
                $str .= "<div class='typed type_".$tv['type']."'>";
                $str .= "<div class='string'> ".(round($tv['time_start']*1000)/1000)." -> ".(round($tv['time_end']*1000)/1000)."</div>";
                $str .= "<div class='string'>";
                $str .= $tv['string'];
                $str .= "</div>";
                if(isset($tv['optimize']) && $tv['optimize']){
                    $str .= "<div class='string'>Can be optimized</div>";
                }
                $str .= "<div class='params'>";
                $str .= $tv['params'];
                $str .= "</div>";
                $str .= "<div class='backtrace'>";
                $str .= $tv['backtrace'];
                $str .= "</div>";
                $str .= "</div>";
                if($tv['type']=='query'){
                    $queries_count++;
                }
            }
            $str .= "</div>";
        }
        return $str;
    }

    public function json(){
        if(self::isAJAXDebug()){
            foreach($this->vars as $var){
                echo "\n$var\n";
            }
            $end_time = microtime(1) - $this->start_time;
            echo "\nTotal time: ".(round($end_time*1000)/1000);
        }
    }

    public function show(){
        if(self::isDebug()){
            echo "<pre class='debug'>";
            print_r($this->vars);
            echo "</pre>";
        }
    }

    private function getInfoText(){
        $str =  "";
        if($this->slow_query==1){
            $str .=  "<span class='error'>Slow query!</span><br>\n";
        }
        $str .=  "Total queries: <b>".$this->queries_num."</b><br>\n";
        $end_time = microtime(1);
        $diff = $end_time - $this->start_time;
        $diff = round($diff*1000)/1000;
        $str .=  "Total time: <b>".$diff." sec.</b><br>\n";
        return $str;
    }
}
