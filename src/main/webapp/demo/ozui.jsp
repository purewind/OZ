<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>OZ Web UI</title>
        <link rel="stylesheet" type="text/css" href="../ozBase/easyui/themes/icon.css">
		<link rel="stylesheet" type="text/css" href="../ozBase/themes/default/oz-panel.css">
		<link rel="stylesheet" type="text/css" href="../ozBase/themes/default/oz-layout.css">
		<link rel="stylesheet" type="text/css" href="../ozBase/themes/default/oz-tabs.css">
		<script type="text/javascript" src="../ozBase/jquery-1.4.2.min.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/jquery.metadata.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.core.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.panel.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.mouse.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.layout.js"></script>
		<script type="text/javascript" src="../ozBase/plugins/oz.tabs.js"></script>
		<script>
			function layout(){
				//第一种方法
				$("body").layout();
				//$("#main-center").layout();
				//第二种方法
				//new $.oz.layout({},$("#main-center")[0]);
			}
			function tabs(){
				$("#mainTabs").tabs();
				
			}
			$(function(){
				layout();
				tabs();
			});
			function addView(){
				$("#mainTabs").tabs("add",{	
					id:"View",
					title:"view",
					closable:true,
					maximizable:true,
					minimizable:true,
					collapsible:true,
					fit:true,
					content:'<iframe scrolling="auto" frameborder="0"  src="view/view.htm" style="width:100%;height:100%;"></iframe>'
				});
			}
			function addLayout(){
				$("#mainTabs").tabs("add",{	
					id:"layout",
					title:"layout",
					closable:true,
					maximizable:true,
					minimizable:true,
					collapsible:true,
					fit:true,
					selected:true,
					content:'<iframe scrolling="auto" frameborder="0"  src="layout/layout.jsp" style="width:100%;height:100%;"></iframe>'
				});
			}
			function addPanel(){
				$("#mainTabs").tabs("add",{	
					id:"panel",
					title:"panel",
					closable:true,
					maximizable:true,
					minimizable:true,
					collapsible:true,
					fit:true,
					content:'<iframe scrolling="auto" frameborder="0"  src="panel/panel.jsp" style="width:100%;height:100%;"></iframe>'
				});
			}
		</script>
	</head>
<body class="{layout:{border:11}}">
	<div  id="jjj" class="oz-layout-north {layoutRegion:{split:true,margins:'0 0 5 0',height:60}}" style="background:#efefef;">
		显示logo信息
	</div>
	<div class="oz-layout-south {layoutRegion:{split:true,margins:'5 0 0 0',height:20}}" style="background:#efefef;overflow: hidden;">
		<div style="text-align: right;padding: 3px;overflow: hidden;">广州嘉瑶软件</div>
	</div>
	<div class="oz-layout-east {layoutRegion:{split:true,margins:'0 0 0 5',title:'通知',width:200,iconCls:'icon-ok'}}" style="background:#efefef;">
		east
	</div>
	<div class="oz-layout-west {layoutRegion:{split:true,margins:'0 5 0 0',title:'功能菜单',width:200,iconCls:'icon-search'}}" style="background:#efefef;">
		<button onclick="addPanel();">addPanel</button><br/>
		<button onclick="addLayout()">addLayout</button><br/>
		<button onclick="addView()">addView</button><br/>
		<button onclick="$('#mainTabs').tabs('close','panel');">close panel</button>
	</div>
	<div class="oz-layout-center {layoutRegion:{margins:'0 0 0 0',border:false}}" style="overflow: hidden;">
		<div id="mainTabs" class="{tabs:{fit:true}}" style="display: none">
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
			<div title="首页1" class="{panel:{title:'首页1',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
		</div>
	</div>
</body>
</html>