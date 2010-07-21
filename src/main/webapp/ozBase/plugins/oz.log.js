/**
 * oz日志WebUI控件
 * 
 * 版本: 1.0 
 * 依赖：jquery、[jquery.ui.draggable]
 * 作者：dragon 2010-07-21
 */
 
/** 调试控制台 */
var ozlog = (function($){
	var msgTpl = '<li class="{1}"><span></span>{0} {2}</li>';
	var tpl = '<div id="ozlogPanel" class="oz-log" unselectable="on" onselectstart="return false;">'+
		'<div class="top">'+
			'<div class="leftSide"></div>'+
			'<div class="center"></div>'+
			'<div class="rightSide"></div>'+
		'</div>'+
		'<div id="ozlogHeader" class="header">'+
			'<div class="leftSide"></div>'+
			'<div class="left">'+
				'<span id="ozlog-btn-debug" class="debugDisabled" title="已禁用debug"></span>'+
				'<span id="ozlog-btn-info" class="info" title="已启用info"></span>'+
				'<span id="ozlog-btn-warn" class="warn" title="已启用warn"></span>'+
				'<span id="ozlog-btn-error" class="error" title="已启用error"></span>'+
				'<span id="ozlog-btn-profile" class="profile" title="已启用profile"></span>'+
			'</div>'+
			'<div class="right">'+
				'<span id="ozlog-btn-close" class="close" title="关闭"></span>'+
				'<span id="ozlog-btn-clear" class="clear" title="清空"></span>'+
				'<span id="ozlog-btn-desc" class="desc" title="切换方向"></span>'+
			'</div>'+
			'<div class="rightSide"></div>'+
		'</div>'+
		'<div class="content">'+
			'<div class="leftSide"></div>'+
			'<div class="center">'+
				'<ol id="ozlogContent"></ol>'+
			'</div>'+
			'<div class="rightSide"></div>'+
		'</div>'+
		'<div class="footer">'+
			'<div class="leftSide"></div>'+
			'<div class="center"></div>'+
			'<div class="rightSide"></div>'+
		'</div>'+
		'</div>';
		
	var num=0,panel,content;
	var unInit = true;
	var profiler = [];
	var desc = true;
	var visible = false;
	// 快捷键设置
	$(document).keyup(function(evt){
		if (evt.which == 36 && evt.metaKey) { //切换显示隐藏：Ctrl(metaKey) + Home(36)
			toggleShow();
		}else if(visible && evt.which == 39 && evt.metaKey){//切换位置：Ctrl(metaKey) + ->(39)
			//ozlog.info(evt.which + ";" + evt.metaKey);
		}
	});
	function toggleShow(){
		if(unInit) init();
		if (visible){
			panel.hide();
			visible = false;
		}else{
			panel.show();
			visible = true;
		}
	};
	
	// 初始化函数
	function init(){
		panel = $(tpl).appendTo("body").css("z-index",20000);
		content = $("#ozlogContent");
		unInit = false;
		
		// 绑定工具条事件
		$("#ozlog-btn-debug").click(function(){changeBtn("debug",this);});
		$("#ozlog-btn-info").click(function(){changeBtn("info",this);});
		$("#ozlog-btn-warn").click(function(){changeBtn("warn",this);});
		$("#ozlog-btn-error").click(function(){changeBtn("error",this);});
		$("#ozlog-btn-profile").click(function(){changeBtn("profile",this);});
		
		$("#ozlog-btn-clear").click(function(){ozlog.clear()});
		$("#ozlog-btn-close").click(function(){panel.hide();visible = false;});
		$("#ozlog-btn-desc").click(function(){changeBtn("desc",this);desc=!desc});
		
		visible=true;
		out("info","初始化日志控制台 " + new Date().toLocaleString());
		visible=false;
		
		// 使控制台可以移动
		try{$("#ozlogPanel").draggable({handle:"#ozlogHeader"})}catch(e){};
	};
	function changeBtn(type,source){
		if(source.className == type){
			source.className = type + "Disabled";
			source.title = "已禁用";
			out(type,"已禁用" + type);
			ozlog[type + "Enable"] = false;
			if(type=="profile")delete profiler["已禁用" + type];
		}else{
			source.className = type;
			source.title = "已启用" + type;
			ozlog[type + "Enable"] = true;
			out(type,"已启用" + type);
			if(type=="profile")delete profiler["已启用" + type];
		}
	};
	/** 第一个参数为类型（"debug"、"info"、"warn"、"error"、"profile"），第二个参数为调试信息，第三个参数开始为格式化的值 */
	function out(){
		if(unInit) init();
		if(ozlog[arguments[0] + "Enable"] && visible){
			var args = Array.prototype.slice.call(arguments, 1);
			var html = String.format(msgTpl,(++num),arguments[0],String.format.apply(null,args));
			if(desc){
				content.prepend(html);
				content.attr("scrollTop",0);
			}else{
				content.append(html);
				content.attr("scrollTop",content.attr("scrollHeight"));
			}
		}
	};
	return {
		debugEnable: false,
		infoEnable:	true,
		warnEnable:	true,
		profileEnable: true,
		debug:function(){
			out.apply(this,["debug"].concat(jQuery.makeArray(arguments)));
		},
		info:function(){
			out.apply(this,["info"].concat(jQuery.makeArray(arguments)));
		},
		warn:function(){
			out.apply(this,["warn"].concat(jQuery.makeArray(arguments)));
		},
		error:function(){
			out.apply(this,["error"].concat(jQuery.makeArray(arguments)));
		},
		profile:function(label){
			var currentTime = new Date(); //record the current time when profile() is executed
			
			if ( label == undefined || label == '' ) {
				out.apply(this,["error",'<b>错误:</b>必须为profile指定参数！']);
			}
			else if(profiler[label]) {
				out.apply(this,["profile",label + ": " + (currentTime-profiler[label]) + 'ms']
					.concat(jQuery.makeArray(Array.prototype.slice.call(arguments, 1))));
				delete profiler[label];
			}
			else{
				profiler[label] = currentTime;
				out.apply(this,["profile"].concat(jQuery.makeArray(arguments)));
			}
			return currentTime;
		},
		clear:function(){content.empty();num=0;},
		enable: function(type){
			$("#ozlog-btn-" + type).attr("class",type);
			ozlog[type + "Enable"] = true;
			return this;
		},
		disabled: function(type){
			$("#ozlog-btn-" + type).attr("class",type + "Disabled");
			ozlog[type + "Enable"] = false;
			return this;
		},
		toggle: function(){
			toggleShow();
			return this;
		}
	};
})(jQuery);
String.format=function(format){
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};