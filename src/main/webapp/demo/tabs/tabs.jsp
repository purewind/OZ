<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>OZ tabs</title>
        <link rel="stylesheet" type="text/css" href="../../ozBase/easyui/themes/icon.css">
        <link rel="stylesheet" type="text/css" href="../../ozBase/themes/default/oz-panel.css">
		<link rel="stylesheet" type="text/css" href="../../ozBase/themes/default/oz-tabs.css">
		<script type="text/javascript" src="../../ozBase/jquery-1.4.2.min.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/jquery.metadata.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.core.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.panel.js"></script>
		<script type="text/javascript" src="../../ozBase/plugins/oz.tabs.js"></script>
		<script>
			function showPanel(){
				$("#tabs1").tabs();
				$("#tabs2").tabs({
					width:600,
					height:500
				});
			}
			$(function(){
				showPanel();
				$("#tabs2").tabs("add",[{	
					title:"首页",
					maximizable:true,
					minimizable:true,
					collapsible:true,
					fit:true,
					selected:true,
					content:'OZ UI'
				},{	
					title:"view",
					maximizable:true,
					minimizable:true,
					collapsible:true,
					fit:true,
					content:'<iframe scrolling="no" frameborder="0"  src="../view/view.htm" style="width:100%;height:100%;"></iframe>'
				},
				{	
					id:"layout",
					title:"layout看来很快就好了良好健康护理asdfasdf ",
					closable:true,
					maximizable:true,
					minimizable:true,
					collapsible:true,
					fit:true,
					iconCls:'icon-add',
					content:'<iframe scrolling="no" frameborder="0"  src="../layout/layout.jsp" style="width:100%;height:100%;"></iframe>'
				}]);
			});
			function justPanel(a){
				if(a){
					$("#tabs1").tabs("resize",{width:700,height:600}); 
				}else{
					$("#tabs1").tabs("resize",{width:600,height:500});
				} 
			}
			function setTitle(){
				$("#tabss").panel("setTitle","abc");
			}
		</script>
	</head>
<body class="">
	<div id="tabs1" class="{tabs:{width:500,height:500}}" style="float: left;margin: 5px;">
		<div id="tabss" class="{panel:{title:'首页',border:false,fit:true,iconCls:'oz-icon-firstTab'}}">欢迎页</div>
		<div class="{panel:{title:'功能',border:false,fit:true,iconCls:'oz-icon-default'}}">功能1</div>
	</div>
	<div id="tabs2" style="float: left;margin: 5px;">
			<div class="{panel:{title:'abddddddd',iconCls:'icon-add'}}">adfadfadf</div>
	</div>
	<button onclick="justPanel(1);">max</button>
	<button onclick="justPanel(0);">min</button>
	<button onclick="setTitle();">setTitle</button>
</body>
</html>