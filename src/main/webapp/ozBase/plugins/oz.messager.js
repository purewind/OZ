/**
 * oz消息框控件
 * 
 * 版本: 1.0 
 * 作者：dragon 2010-07-26
 * 依赖：jquery、jquery-easyui
 * 说明：对jquery-easyui消息框简单的封装，并将prompt方法扩展为支持多行文本输入
 */
 
if(typeof OZ == "undefined") OZ={};
OZ.Messager = {
    /** 提示框 
     * @param {String} msg 提示信息
     * @param {String} onOk [可选]点击确认按钮的回调函数
     * @param {String} title [可选]标题,默认为OZ.Messager.DEFAULT_TITLE
     * @param {String} icon [可选]显示的图标类型：error,question,info,warning，默认不显示图标
     */
    alert: function(msg, title, onOk, icon){
    	$.messager.alert(title||OZ.Messager.DEFAULT_TITLE, msg, icon, onOk);
    },
    /** 确认框 
     * @param {String} msg 提示信息
     * @param {String} onOk 点击确认|是按钮的回调函数
     * @param {String} onCancel [可选]点击取消|否按钮的回调函数
     * @param {String} title [可选]标题,默认为OZ.Messager.DEFAULT_TITLE
     */
    confirm: function(msg, onOk, onCancel, title){
    	$.messager.confirm(title||OZ.Messager.DEFAULT_TITLE, msg, function(value){
    		if (value){
    			if(typeof onOk == "function") onOk.call(this,true);
    		}else{
    			if(typeof onCancel == "function") onCancel.call(this,false);
    		}
    	});
    },
    /** 输入框 
     * @param {String} msg 提示信息
     * @param {String} onOk 点击确认按钮的回调函数
     * @param {String} onCancel [可选]点击取消按钮的回调函数
     * @param {String} value [可选]文本输入框默认显示的内容
     * @param {Boolean} multiline [可选]是否为多行文本输入，默认为false(单行文本输入)
     * @param {String} title [可选]标题,默认为OZ.Messager.DEFAULT_TITLE
     */
    prompt: function(msg, onOk, onCancel, value, multiline, title){
    	$.messager.prompt(title||OZ.Messager.DEFAULT_TITLE, msg, 
    		function(value,isOk,oldValue){
	    		if (isOk){
	    			if(typeof onOk == "function") onOk.call(this,value,oldValue);
	    		}else{
	    			if(typeof onCancel == "function") onCancel.call(this,value,oldValue);
	    		}
    		},
    		value, multiline
    	);
    },
    /** 信息提示框：提示框icon=info的简化使用版 */
    info: function(msg, title, onOk){
    	OZ.Messager.alert(msg, title, onOk, "info");
    },
    /** 信息警告框：提示框icon=warning的简化使用版 */
    warn: function(msg, title, onOk){
    	OZ.Messager.alert(msg, title, onOk, "warning");
    },
    /** 错误提示框：提示框icon=error的简化使用版 */
    error: function(msg, title, onOk){
    	OZ.Messager.alert(msg, title, onOk, "error");
    },
    /** 信息提问框：提示框icon=question的简化使用版 */
    question: function(msg, title, onOk){
    	OZ.Messager.alert(msg, title, onOk, "question");
    },
    /** 自动提醒框：显示在页面右下角并可以自动隐藏的消息提示框
     * @param {Object} config 配置对象
     * @config {String} showType 消息框弹出的动画类型：
     *     null,slide(底部滑出滑入),fade(右下角射出射入),show(慢慢出现消失)，默认为slide
     * @config {String} showSpeed 定义消息框自动隐藏的速度(单位为毫秒)，默认为600
     * @config {String} width 消息框的宽度，默认为250
     * @config {String} height 消息框的高度，默认为100
     * @config {String} msg 消息内容
     * @config {String} title 标题
     * @config {String} timeout 消息框显示的停留时间(单位为毫秒)，默认为4000，设为0则不会自动隐藏
     */
    show: function(config){
    	$.messager.show($.extend({title: OZ.Messager.DEFAULT_TITLE}, config));
    },
    /** 自动提醒框的slide简化使用版:滑出滑入效果 */
    slide: function(msg,timeout,width,height){
    	var c = {showType: 'slide',msg:msg};
    	if(typeof timeout != "undefined" && timeout != null)c.timeout=timeout;
    	if(typeof width != "undefined" && width != null)c.width=width;
    	if(typeof height != "undefined" && height != null)c.height=height;
    	OZ.Messager.show(c);
    },
    /** 自动提醒框的fade简化使用版：渐渐显示消失效果 */
    fade: function(msg,timeout,width,height){
    	var c = {showType: 'fade',msg:msg};
    	if(typeof timeout != "undefined" && timeout != null)c.timeout=timeout;
    	if(typeof width != "undefined" && width != null)c.width=width;
    	if(typeof height != "undefined" && height != null)c.height=height;
    	OZ.Messager.show(c);
    },
    /** 自动提醒框的show简化使用版：从角落飞出飞入效果 */
    fly: function(msg,timeout,width,height){
    	var c = {showType: 'show',msg:msg};
    	if(typeof timeout != "undefined" && timeout != null)c.timeout=timeout;
    	if(typeof width != "undefined" && width != null)c.width=width;
    	if(typeof height != "undefined" && height != null)c.height=height;
    	OZ.Messager.show(c);
    }
};
OZ.Msg = OZ.Messager;

/** 国际化 */
OZ.Messager.DEFAULT_TITLE = "系统提示";

/** 以下为改写$.messager.prompt的代码：增加多行文本输入和设置文本框默认值的支持 */
$.messager.prompt = function(title, msg, fn, value, multiline) {
	//这里是改写的部分代码
	var content = '<div class="messager-icon messager-question"></div>'
				+ '<div>' + msg + '</div>'
				+ '<br/>'
				+ '{0}'
				+ '<div style="clear:both;"/>';
	if(multiline){
		content=content.format('<textarea class="messager-input">'+(value || '')+'</textarea>');
	}else{
		content=content.format('<input class="messager-input" type="text" value="'+(value || "")+'"/>');
	}
	var oldValue=value;
	
	var buttons = {};
	buttons[$.messager.defaults.ok] = function(){
		win.window('close');
		if (fn){
			fn($('.messager-input', win).val(),true,oldValue);
			return false;
		}
	};
	buttons[$.messager.defaults.cancel] = function(){
		win.window('close');
		if (fn){
			fn($('.messager-input', win).val(),false,oldValue);
			return false;
		}
	};
	var win = createDialog(title,content,buttons);
	
	/**
	 * create a dialog, when dialog is closed destroy it
	 */
	function createDialog(title, content, buttons){
		var win = $('<div class="messager-body"></div>').appendTo('body');
		win.append(content);
		if (buttons){
			var tb = $('<div class="messager-button"></div>').appendTo(win);
			for(var label in buttons){
				$('<a></a>').attr('href', 'javascript:void(0)').text(label)
							.css('margin-left', 10)
							.bind('click', eval(buttons[label]))
							.appendTo(tb).linkbutton();
			}
		}
		win.window({
			title: title,
			width: 300,
			height: 'auto',
			modal: true,
			collapsible: false,
			minimizable: false,
			maximizable: false,
			resizable: false,
			onClose: function(){
				setTimeout(function(){
					win.window('destroy');
				}, 100);
			}
		});
		return win;
	}
};
