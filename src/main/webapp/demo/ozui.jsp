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
		<link rel="stylesheet" type="text/css" href="../ozBase/themes/default/oz-log.css" />
		<link rel="stylesheet" type="text/css" href="../ozBase/themes/default/oz-tree.css" />
	</head>
<body>
	<div id="loading" style="position: absolute;width: 100%;height: 100%;left: 0;top: :0;background-color: #FFF;z-index: 100;">
		<div style="position:absolute; top:50%;margin-top:-10px;left: 50%;margin-left: -100px; ">loading...</div>
	</div>
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
		<ul id="menuTree">
			<li node="{href:'',fn:'addPanel'}"><span>addPanel</span></li>
			<li node="{href:'',fn:'addLayout'}"><span>addLayout</span></li>
			<li node="{href:'',fn:'addView'}"><span>addView</span></li>
			<li node="{href:'',fn:'addTabs'}"><span>addTabs</span></li>
			<li node="{href:'',fn:'addForm'}"><span>addForm</span></li>
			<li node="{href:'',fn:'closeOther'}"><span>closeOther</span></li>
			<li node="{href:'',fn:'closeAll'}"><span>closeAll</span></li>
		</ul>
	</div>
	<div class="oz-layout-center {layoutRegion:{margins:'0 0 0 0',border:false}}" style="overflow: hidden;">
		<div id="mainTabs" class="{tabs:{fit:true}}" style="display: none">
			<div class="{panel:{title:'首页',border:false,fit:true,iconCls:'oz-icon-firstTab'}}" style="overflow: hidden;">
				<iframe scrolling="auto" frameborder="0"  src="about:blank" style="width:100%;height:100%;"></iframe>
			</div>
		</div>
	</div>
</body>
<script type="text/javascript" src="../ozBase/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="../ozBase/plugins/jquery.metadata.js"></script>

<!-- jquery.ui的js也可以不引用，少了拖动调试控制台的功能而已 -->
<script type="text/javascript" src="../ozBase/jqueryui/plugins/jquery.ui.core.js"></script>
<script type="text/javascript" src="../ozBase/jqueryui/plugins/jquery.ui.widget.js"></script>
<script type="text/javascript" src="../ozBase/jqueryui/plugins/jquery.ui.mouse.js"></script>
<script type="text/javascript" src="../ozBase/jqueryui/plugins/jquery.ui.draggable.js"></script>

<script type="text/javascript" src="../ozBase/plugins/oz.log.js"></script>

<script type="text/javascript" src="../ozBase/plugins/oz.core.js"></script>
<script type="text/javascript" src="../ozBase/plugins/oz.mouse.js"></script>

<script type="text/javascript" src="../ozBase/plugins/oz.panel.js"></script>
<script type="text/javascript" src="../ozBase/plugins/oz.layout.js"></script>
<script type="text/javascript" src="../ozBase/plugins/oz.tabs.js"></script>
<script type="text/javascript" src="../ozBase/plugins/oz.tree.js"></script>
<script>
	$(function(){
		$("body").layout();
		$("#mainTabs").tabs();
		$("#menuTree").tree({onClick:function(data){
				eval(data.fn+"()");
			}
		});
		$("#loading").hide();
	});
	
	function addTab(id,title,src){
		$("#mainTabs").tabs("add",{	
			id:id,
			title:title,
			closable:true,
			iconCls:"oz-icon-default",
			border:false,
			content:'<iframe scrolling="auto" frameborder="0"  src="'+src+'" style="width:100%;height:100%;"></iframe>'
		});
	}
	function addView(){
		addTab("view","view","view/view.htm");
	}
	function addLayout(){
		addTab("layout","layout","layout/layout.jsp");
	}
	function addPanel(){
		addTab("panel","panel","panel/panel.jsp");
	}
	function addTabs(){
		addTab("tabs","tabs","tabs/tabs.jsp");
	}
	function addForm(){
		addTab("form","form","form/form.htm");
	}
	function closeOther(){
		$("#mainTabs").tabs("closeOther");
	}
	function closeAll(){
		$("#mainTabs").tabs("closeAll");
	}
</script>
</html>