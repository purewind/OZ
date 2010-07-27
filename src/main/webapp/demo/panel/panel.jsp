<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>OZ Panel</title>
        <link rel="stylesheet" type="text/css" href="../../ozBase/easyui/themes/icon.css">
		<link rel="stylesheet" type="text/css" href="../../ozBase/themes/default/oz-panel.css">
		<script type="text/javascript" src="../../ozBase/jquery-1.4.2.min.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/jquery.metadata.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.core.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.panel.js"></script>
		<script>
			function showPanel(){
				$("#panel1").panel({
					title:"hello",
					fit:true
				});
				$("#panel2").panel();
				$("#panel1").panel("abc");
			}
			$(function(){
				showPanel();
			});
		</script>
	</head>
<body>
	<div style="width:300px;height:300px;border: 1px solid red;">
		<div id="panel1">
		<iframe scrolling="no" frameborder="0"  src="../view/view.htm" style="width:100%;height:100%;"></iframe>
		</div>
	</div>
	<div style="position: absolute;left: 400px;top: 10px;width:400px;height:300px;border: 1px solid red;overflow: auto;">
		<div id="panel2" class="{panel:{title:'功能菜单',maximizable:true,minimizable:true,closable:true,collapsible:true}}" style="width:300px;height:200px;">panel2</div>
	</div>
</body>
</html>