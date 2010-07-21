<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>OZ Core</title>
        <link rel="stylesheet" type="text/css" href="../../ozBase/easyui/themes/icon.css">
		<link rel="stylesheet" type="text/css" href="../../ozBase/themes/default/oz-panel.css">
		<link rel="stylesheet" type="text/css" href="../../ozBase/themes/default/oz-layout.css">
		<script type="text/javascript" src="../../ozBase/jquery-1.4.2.min.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/jquery.metadata.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.core.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.panel.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.mouse.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.layout.js"></script>
		<script>
			$(function(){
				//第一种方法
				$("body").layout();
				//$("#main-center").layout();
				//第二种方法
				//new $.oz.layout({},$("#main-center")[0]);
				//$("body").bind("layout.layout",function(){alert("layout")});
			});
		</script>
	</head>
<body >
	<div class="oz-layout-north {layoutRegion:{split:true,margins:'0 0 5 0'}}" style="height:60px;background:#efefef;">
		<div style="font-size: 40px;padding: 5px">OZUI</div>
	</div>
	<div class="oz-layout-south {layoutRegion:{split:true,margins:'5 0 0 0'}}" style="height:20px;background:#efefef;overflow: hidden;">
		<div style="text-align: center;padding: 2px;">广州嘉瑶软件</div>
	</div>
	<div class="oz-layout-east {layoutRegion:{split:true,margins:'0 0 0 5',title:'通知',iconCls:'icon-ok'}}" style="width:250px;background:#efefef;">
		east
	</div>
	<div class="oz-layout-west {layoutRegion:{split:true,collapsible:true,margins:'0 5 0 0',title:'功能菜单',iconCls:'icon-search'}}" style="width:200px;background:#efefef;">
		west
	</div>
	<div class="oz-layout-center {layoutRegion:{margins:'0 0 0 0',title:'首页区'}}" style="overflow: hidden;">
		center
	</div>
</body>
</html>