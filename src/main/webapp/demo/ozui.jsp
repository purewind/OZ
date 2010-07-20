<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>OZ Core</title>
		<script type="text/javascript" src="../ozBase/jquery-1.4.2.min.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/jquery.metadata.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.core.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.panel.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.mouse.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.layout.js"></script>
		<link rel="stylesheet" type="text/css" href="../ozBase/easyui/themes/icon.css">
		<link rel="stylesheet" type="text/css" href="../ozBase/themes/default/oz-panel.css">
		<link rel="stylesheet" type="text/css" href="../ozBase/themes/default/oz-layout.css">
		<script>
			function layout(){
				//第一种方法
				$("body").layout();
				//$("#main-center").layout();
				//第二种方法
				//new $.oz.layout({},$("#main-center")[0]);
			}
			function showPanel(){
				$("#panel1").panel({
					title:"hello",
					closable:true,
					maximizable:true,
					minimizable:true,
					collapsible:true,
					width:300,
					height:500
				});
				$("#panel2").panel();
			}
			$(function(){
				layout();
			});
		</script>
	</head>
<body class="{layout:{border:11}}">
	<div class="oz-layout-north {layoutRegion:{split:true,margins:'0 0 5 0',title:'显示logo信息',height:80}}" style="background:#efefef;">
		<p>a</p><p>a</p><p>a</p><p>a</p>
	</div>
	<div class="oz-layout-south {layoutRegion:{split:true,margins:'5 0 0 0',title:'显示版权信息',height:40}}" style="background:#efefef;">
		south
	</div>
	<div class="oz-layout-east {layoutRegion:{split:true,margins:'0 0 0 5',title:'通知',width:200,iconCls:'icon-ok'}}" style="background:#efefef;">
		east
	</div>
	<div class="oz-layout-west {layoutRegion:{split:true,margins:'0 5 0 0',title:'功能菜单',width:200,iconCls:'icon-search'}}" style="background:#efefef;">
		west
	</div>
	<div class="oz-layout-center {layoutRegion:{margins:'0 0 0 0',title:'首页区'}}" style="">
		afsdf
	</div>
	<div id="panel1">panel1</div>
	<div id="panel2" class="{panel:{title:'功能菜单',left:400,top:0,width:300,height:500}}">panel2</div>
</body>
</html>