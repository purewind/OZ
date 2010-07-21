<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>OZ Core</title>
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
				$("#panel1").tabPanel({
					width:600,
					height:500
				});
			}
			$(function(){
				showPanel();
				$("#panel1").tabPanel("add",{	
					title:"view",
					closable:true,
					maximizable:true,
					minimizable:true,
					collapsible:true,
					fit:true,
					selected:true,
					content:'<iframe scrolling="no" frameborder="0"  src="../view/view.htm" style="width:100%;height:100%;"></iframe>'
				});

				$("#panel1").tabPanel("add",{	
					id:"abc",
					title:"layout",
					closable:true,
					maximizable:true,
					minimizable:true,
					collapsible:true,
					fit:true,
					content:'<iframe scrolling="no" frameborder="0"  src="../layout/layout.jsp" style="width:100%;height:100%;"></iframe>'
				});
			});
			function justPanel(a){
				if(a){
					$("#panel1").tabPanel("resize",{width:700,height:600}); 
				}else{
					$("#panel1").tabPanel("resize",{width:600,height:500});
				} 
			}
		</script>
	</head>
<body class="">
	<div id="panel1" ></div>
	<button onclick="justPanel(1);">max</button><button onclick="justPanel(0);">min</button>
</body>
</html>