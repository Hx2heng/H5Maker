<?php
	//获取数据
	$data = json_decode($_POST["data"]);
	//$data->name ：项目名字
	//$data->html : html片段
	//$data->imgList ：base64 列表
	//$data->imgList->id 
	//$data->imgList->type 
	//$data->imgList->src 
	$proName = $data->name;
	$buildPath = 'build/';
	$basePath = 'base/';

	//判断是否存在项目
	if (!file_exists($buildPath.$proName)){ 
		//不存在
		mkdir ($buildPath.$proName); //新建项目文件夹
		mkdir ($buildPath.$proName.'/images'); //新建项目images文件夹
		mkdir ($buildPath.$proName.'/js'); //新建项目js文件夹
		mkdir ($buildPath.$proName.'/css'); //新建项目css文件夹
		//文件夹搬移
		recurse_copy($basePath.'js',$buildPath.$proName.'/js');
		recurse_copy($basePath.'css',$buildPath.$proName.'/css');
		//修改index.html
		copy($basePath."index.html",$buildPath.$proName.'/index.html');//复制index
		//替换 插入html
		$str=file_get_contents($buildPath.$proName.'/index.html');//获取baseHtml 内容
		$html=str_replace('{{$html}}',$data->html,$str);
		file_put_contents($buildPath.$proName.'/index.html',$html);
		//替换 插入imgPath
		$imgPath = '';
		for ($x=0; $x<count($data->imgList); $x++) {
			if($x == count($data->imgList)-1){
				$imgPath = $imgPath.'"images/'.$data->imgList[$x]->id.'.'.$data->imgList[$x]->type.'"';
			}
			else{
				$imgPath = $imgPath.'"images/'.$data->imgList[$x]->id.'.'.$data->imgList[$x]->type.'",';
			}
		}
		$str=file_get_contents($buildPath.$proName.'/index.html');//获取baseHtml 内容
		$html=str_replace('{{$imgs}}',$imgPath,$str);
		file_put_contents($buildPath.$proName.'/index.html',$html);
		// base64 另存为图片

		for ($i=0; $i<count($data->imgList); $i++) {
		  	$base64_url =$data->imgList[$i]->src;
		  	$base64 =substr(strstr($base64_url,','),1);//去除头部
		  	$img = base64_decode($base64);
		  	file_put_contents($buildPath.$proName.'/images/'.$data->imgList[$i]->id.'.'.$data->imgList[$i]->type, $img);
		}

        echo json_encode(array('val' => "ok"));
        exit;
	} 
	else {
		echo '需创建的文件夹test已经存在';
		exit;
	}

	

	//echo $proName;


	// function get_password( $length = 4 ) 
	// {
 //   	 	$str = substr(md5(time()), 0, $length);
 //   	 	return $str;
	// }

//recurse_copy("原文件夹","目录文件夹")
	function recurse_copy($src,$dst) {  // 原目录，复制到的目录
	        $dir = opendir($src);
	        @mkdir($dst);
	        while(false !== ( $file = readdir($dir)) ) {
	            if (( $file != '.' ) && ( $file != '..' )) {
	                if ( is_dir($src . '/' . $file) ) {
	                    recurse_copy($src . '/' . $file,$dst . '/' . $file);
	                }
	                else {
	                    copy($src . '/' . $file,$dst . '/' . $file);
	                }
	            }
	        }
	        closedir($dir);
	    }