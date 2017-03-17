<?php 
$proName  = $_GET["proname"];


$buildPath = 'build/';

$filename = $buildPath.$proName.'/'.$proName.'.zip';
if(!file_exists($filename)){   
		    exit("无法找到文件"); //即使创建，仍有可能失败。。。。   
		}
header("Content-Type:text/html;charset=utf-8"); 
header('Content-type: application/force-download');
header('Content-Disposition: attachment; filename="'.$filename.'"');   
@readfile($filename);
// $get_url = "x.zip";
// ob_end_clean();
// header("Content-Type: application/force-download");
// header("Content-Transfer-Encoding: binary");
// header('Content-Type: application/zip');
// header('Content-Disposition: attachment; filename='.'123_'.$get_url);
// header('Content-Length: '.filesize($get_url));
// error_reporting(0);
// readfile($get_url);
// flush();
// ob_flush();
exit;
?>