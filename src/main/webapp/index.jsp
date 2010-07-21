<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>OZ Index</title>
		<link rel="stylesheet" type="text/css" href="ozBase/easyui/themes/default/easyui.css">
		<link rel="stylesheet" type="text/css" href="ozBase/easyui/themes/icon.css">
		<script type="text/javascript" src="ozBase/jquery-1.4.2.min.js"></script>
		<script type="text/javascript" src="ozBase/easyui/jquery.easyui.min.js"></script>
	<script>
		function addmenu(){
			var header = $('.layout-expand .layout-button-down').parent().parent();
			var menu = $('<div style="position:absolute;left:0;top:0;background:#fafafa;"></div>').appendTo(header);
			var btn = $('<a href="#">test</a>').appendTo(menu);
			btn.menubutton({
				menu:'#mymenu'
			});
		}
		var index= 0 ;
		function addTab(title){
			index++;
			$('.easyui-tabs').tabs('add',{
				id:"tab"+index,
				title:title,
				content:'<iframe scrolling="yes" frameborder="0"  src="demo/view/view.htm" style="width:100%;height:100%;"></iframe>',
				iconCls:'icon-save',
				closable:true
			});
		}
		$(function(){
			$("#pTree").tree({
				url: 'data/tree_data.json',
				onClick:function(node){
					$(this).tree('toggle', node.target);
					addTab(node.text);
				}
			})
		})
	</script>
</head>
<body class="easyui-layout">
	<div id="mymenu" style="width:150px;">
		<div>item1</div>
		<div>item2</div>
	</div>
		<div region="north" style="height:60px;border-bottom: 5px solid #D2E0F2;">
			logo
		</div>
		<div region="south" style="height:40px;border-top: 5px solid #D2E0F2">
			power by oz
		</div>
		<div region="west" icon="icon-reload" title="Tree Menu" split="true" style="width:180px;">
			<ul id="pTree"></ul>
		</div>
		<div region="east" split="true" title="West Menu" style="width:200px;padding1:1px;overflow:hidden;">
			<div class="easyui-accordion" fit="true" border="false">
				<div title="Title1" style="overflow:auto;">
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content12</p><p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content12</p><p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content1</p>
					<p>content12</p>
				</div>
				<div title="Title2" selected="true" style="padding:10px;">
					content2
					<a href="#" onclick="addmenu()">addmenu</a>
				</div>
				<div title="Title3">
					content3
				</div>
			</div>
		</div>
		<div region="center" style="overflow:hidden;">
			<div class="easyui-tabs" fit="true" border="false">
				<div title="首页" style="padding:20px;overflow:hidden;"> 
					<div style="margin-top:20px;">
						<h3>jQuery EasyUI framework help you build your web page easily.</h3>
						<li>easyui is a collection of user-interface plugin based on jQuery.</li> 
						<li>using easyui you don't write many javascript code, instead you defines user-interface by writing some HTML markup.</li> 
						<li>easyui is very easy but powerful.</li> 
					</div>
				</div>
				<div title="Grid" closable="true">
					<iframe scrolling="yes" frameborder="0"  src="demo/view/view.htm" style="width:100%;height:100%;"></iframe>
				</div>
				<div title="Layout" icon="icon-reload" closable="true" style="overflow:hidden;">
					<iframe scrolling="yes" frameborder="0"  src="demo/layout/layout.jsp" style="width:100%;height:100%;"></iframe>
				</div>
			</div>
		</div>
</body>
</html>