/**
 * oz对话框控件
 * 
 * 版本: 1.0 
 * 作者：dragon 2010-07-24
 * 依赖：jquery、jquery-easyui
 * 说明：对jquery-easyui对话框简单的封装，提供对iframe(url)、确定按钮(onOk)、
 *      取消按钮(onCancle)、关闭按钮(onClose)的直接支持
 * 
 * @param {Object} config 对话框配置 
 * @config {String} id 对话框的id
 * @config {String} url 对话框内容为iframe时的src
 * @config {String} html 对话框内容的html，如果设置了url该参数会被忽略
 * 
 * @config {Number} width 对话框宽度
 * @config {Number|String} height 对话框高度,设为'auto'则根据内容大小自动调整对话框高度
 * @config {Boolean} resizable 对话框是否支持改变大小，默认为true
 * @config {Boolean} modal 是否为模式对话框，默认为true
 * @config {Function} onOk 默认的确认按钮对应的回调函数,函数的第一个参数为点击确认按钮所执行iframe内函数的返回值
 * @config {Function} onCancel 默认的取消按钮对应的回调函数
 * @config {Array} buttons 对话框底部显示的操作按钮，默认情况下(设为null)自动构建确定、取消按钮
 *     如果为iframe内容，通过button的fnName属性设置所调用的iframe函数名称，
 *     该函数的返回值会传递到按钮定义的处理函数的第一个参数；
 *     如果该函数返回false，对话框将保留显示状态，否则对话框会被销毁
 */
 
if(typeof OZ == "undefined") OZ={};
OZ.Dialog = function(config){
	if(ozlog.profileEnable) ozlog.profile("OZ.Dialog-->create instance");
	//设置默认值
	config = jQuery.extend({id:"DLG"+OZ.Dialog.NewId++},OZ.Dialog.DC,config);
	this.id=config.id;
	this.config=config;
	
	//如果已经存在则先删除
	if($("#" + config.id).length > 0)$("#" + config.id).dialog("destroy");
	
	if(!config.buttons){	//使用默认按钮
		config.buttons = this._defaultButtons();
	}else{					//自定义按钮
		for(var i=0;i<config.buttons.length;i++){
			if(config.buttons[i].fnName){//重构按钮函数
				config.buttons[i].handler=this._wrapBtnHandlerForIframe(config.id,config.buttons[i].handler,config.buttons[i].fnName);
			}
		}
	}
	
	//创建对话框
	var region;
	if(config.url){
		region = OZ.Dialog.Template.IFRAME.format(config.id,"DLGIFRAME"+config.id,config.url);
	}else{
		region = OZ.Dialog.Template.HTML.format(config.id,config.html||"");
	}
	$(region).appendTo($("body")).dialog(config);
	
	//修正easyui的对话框激活到前段的bug(可惜对iframe没效)
	$("#" + config.id).parent().click(function(){
		$("#" + config.id).dialog("open");
	});
	
	if(ozlog.profileEnable) ozlog.profile("OZ.Dialog-->create instance");
};
OZ.Dialog.prototype = {
	/** 创建系统默认的对话框按钮：确认按钮、取消按钮 */
	_defaultButtons: function(){
		if(ozlog.debugEnable) ozlog.debug("OZ.Dialog-->_defaultButtons");
	    var buttons = [];
		if(typeof this.config.onOk == "function"){
			var btn = {text:OZ.Dialog.OK,iconCls:'icon-ok'};
			if(this.config.url){//对iframe特殊处理：先获取iframe内函数ozDlgOkFn的返回值
				ozlog.info(this.config.url);
				btn.handler=this._wrapBtnHandlerForIframe(this.id,this.config.onOk,"ozDlgOkFn");
			}else{
				btn.handler=this.config.onOk;
			}
			buttons.push(btn);
		}
		if(typeof this.config.onCancel == "function"){
			buttons.push({
				text:OZ.Dialog.CANCEL,
				iconCls:'icon-cancel',
				handler:this.config.onCancel
			});
		}
		return buttons;
	},
	/**
	 * private 为iframe包装对话框按钮处理函数，通过在按钮中配置fnName属性的值
	 *
	 * @param {String} dlgId 对话框ID
	 * @param {String} fnName 要调用的iframe内的函数名
	 * @param {Function} btnOrigionFn 定义的原按钮处理函数
	 * @return {Function} 构建好的处理函数
	 */
	_wrapBtnHandlerForIframe: function(dlgId,btnOrigionFn,iframeFnName) {
		ozlog.info(dlgId);
		ozlog.info(iframeFnName);
	    var btnHandler = function(){
	        // 获取函数的返回值
	        var contentWindow = $('#'+"DLGIFRAME"+dlgId).get(0).contentWindow;
	        var fn = contentWindow[iframeFnName];
	        if (typeof fn == "function"){
	            var value = fn.call(dlgId);// 获取返回值
				ozlog.info("call '"+iframeFnName + "' return value=" + value);
	            if(value !== false){  // 只有返回值不恒等于false情况下才关闭对话框并调用回调函数
	            	if(btnOrigionFn.call(dlgId,value) !== false){
	            		$('#'+dlgId).dialog("destroy");
	            	}
            	}else{
    				ozlog.info("origion handler not run because return value===false");
            	}
	        }else{
	            ozlog.warn("no '" + iframeFnName + "' function defined in dialog's iframe");
	        }
	    };
		//ozlog.info("" + btnHandler);
	    return btnHandler;
	},
	/** 以指定的url重新加载对话 */
	setUrl:function(url){
		$('#'+"DLGIFRAME"+this.id).attr("src",url);
	},
	/** 以指定的html内容重新加载对话 */
	setHtml:function(html){
		$('#' + this.id).find('.dialog-content').html(html);
	},
	/** 设置对话框标题 */
	setTitle:function(title){
		$('#' + this.id).dialog("setTitle",title);
	},
	/** 重新设置对话框的大小和位置：options={width:?,height:?,left:?,top:?} */
	resize:function(options){
		$('#' + this.id).dialog("resize",options);
	},
	/** 重新打开对话框 */
	open:function(){
		$('#' + this.id).dialog("open");
	},
	/** 关闭对话框 */
	close:function(){
		$('#' + this.id).dialog("close");
	},
	/** 彻底销毁对话框 */
	destroy:function(){
		$('#' + this.id).dialog("destroy");
	}
};

/** 全局配置 */
OZ.Dialog.DC = {
	/** 图标 */
	iconCls: "oz-icon16",
	height: 'auto',width: 300,resizable: true,modal: true,shadow:false,draggable:true
};
OZ.Dialog.NewId = 0;

/** 结构模板 */
OZ.Dialog.Template = {
	/** 内容为iframe时的构造模板 */
	IFRAME:'<div id="{0}" style="overflow:hidden;"><iframe id="{1}" src="{2}" frameborder="0" scrolling="auto" style="width:100%;height:100%;border:0;"></iframe></div>',
	/** 内容为iframe时的构造模板 */
	HTML:'<div id="{0}">{1}</div>'
};

/** 国际化 */
OZ.Dialog.OK = "确定";
OZ.Dialog.CANCEL = "取消";
