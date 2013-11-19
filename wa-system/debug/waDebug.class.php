<?php

class Debug {

    static $objects;
    static $timer;

    static function enabled(){
        if(isset($_COOKIE['show_debug'])){
            if($_COOKIE['show_debug']>=1)
                return true;
        }
        return false;
    }

    static function query($sql, $result, $error_code, $error, $debug_backtrace){
        if(self::enabled()){
            $time_end = microtime(1);
            $time = $time_end - self::$timer;

            $tv = array();
            $tv['type'] = 'query';
            $tv['query'] = $sql;
            $tv['backtrace'] = debug_backtrace();
            $tv['time'] = $time;
            self::$objects[] = $tv;
            self::$timer = 0;
        }
    }

    static function queryStart(){
        if(self::enabled()){
            self::$timer = microtime(1);
        }
    }

    static function describe($table, $keys){
    }

    static function sql($sql){
    }

    private static function getViewBacktrace($arr){
        $backtrace = '';
        $n = 0;
        foreach($arr as $b){
            $file = $b['file'];
            $line = $b['line'];
            if($n>0){
                $backtrace .= "$file ($line) -> ";
            }
            $n++;
        }
        return $backtrace;
    }

    private static function getViewQuery($obj){
        $html = "<div class='query'>{$obj['query']}</div>";
        $html .= "<div class='time'>".sprintf("%01.5f", $obj['time'])."</div>";
        $html .= "<div class='backtrace'>".self::getViewBacktrace($obj['backtrace'])."</div>";
        return $html;
    }

    private static function getVariableQuery($obj){
        $html = "<div class='query'>{$obj['var']}</div>";
        $html .= "<div class='backtrace'>".self::getViewBacktrace($obj['backtrace'])."</div>";
        return $html;
    }

    static function variable($obj){
        if(self::enabled()){
            $tv = array();
            $tv['type'] = 'variable';
            $tv['var'] = $obj;
            $tv['backtrace'] = debug_backtrace();
            self::$objects[] = $tv;
        }
    }

    static function getHtml(){
        if(self::enabled()){
            $str = '';
            $str .= '<link href="/debug.css" rel="stylesheet" type="text/css">';
            $str .= "<div class='debug'>";
            foreach(self::$objects as $obj){
                if($obj['type']=='query')       $str .= self::getView(self::getViewQuery($obj));
                if($obj['type']=='variable')    $str .= self::getView(self::getVariableQuery($obj));
            }
            $str .= "</div>";
            return $str;
        }
    }

    private static function getView($html){
        return "<div class='debug_obj'>$html</div>";
    }

    static function breakpoint(){
        throw new waException("Breakpoint", 404);
    }
}