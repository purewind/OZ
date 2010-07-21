/**
 * oz工具条
 * 
 * 版本: 1.0.0
 * 作者：dragon 2010-07-21
 * 依赖：jquery、jquery-tmpl
 */
if(typeof OZ == "undefined") OZ={};
OZ.TB = function(config){
	if(ozlog.profileEnable) ozlog.profile("OZ.TB-->create instance");
	this.init(config);
	this.render();
	if(ozlog.profileEnable) ozlog.profile("OZ.TB-->create instance");
};
OZ.TB.prototype = {
	/** 初始化 */
	init: function(config){
		$.extend(this, config);

		// 默认配置
		var dc = OZ.TB.DC;
		for(var item in dc){
			if(typeof this[item] == "undefined") this[item] = dc[item];
		}
		// 按钮默认配置
		for(var i = 0;i<this.buttons.length;i++){
			// 如果按钮为字符串或分隔条则转换为标准格式
			if(typeof this.buttons[i] == "string"){
				if(this.buttons[i] == "|"){
					this.buttons[i] = {type:"seperator"};
				}else{
					this.buttons[i] = {text:this.buttons[i]};
				}
			}
			//使用容器id加索引号后缀作为按钮的默认id
			if(!this.buttons[i].id)
				this.buttons[i].id = this.id + "-btn" + i;
			if(typeof this.buttons[i].disabled == "undefined")
				this.buttons[i].disabled = false;
			if(ozlog.debugEnable)ozlog.debug("OZ.TB-->#" + this.id + " btns[" + i + "].text=" + this.buttons[i].text);
		}
		
		// 如果容器不存在则自动生成
		var container = $("#" + this.id)[0];
		if(container){
			this.container = $(container);
			if(container.className != this.cls) this.container.addClass(this.cls);// 更新容器的样式
		}else{
			this.container = $(OZ.TB.Template.CONTAINER.format(this.id,this.cls,"oz-tb-text-align-"+this.buttonAlign));
			this.container.unselectable();
		}
	},
	/** 渲染 */
	render: function(){
		var tplData = {
			alignCls: "oz-btns-align-" + this.buttonAlign,
			btns: ""
		};
		//按钮集
		for(var i = 0;i<this.buttons.length;i++){
			if(this.buttons[i].type == "seperator"){//按钮分隔条
				tplData.btns += OZ.TB.Template.BTN_SEPERATOR.format(this.buttons[i].id);
			}else if(this.buttons[i].type == "search"){//搜索按钮
				if(!(this.buttons[i].location))this.buttons[i].location = "right";//默认为右侧放置
				
				if(this.buttons[i].location == "inner"){
					tplData.btns += this.getSearchBtnHtml(this.buttons[i]);
				}
			}else{//一般按钮
				this.buttons[i].type = "button";//默认为一般按钮
				tplData.btns += OZ.TB.Template.BTN.format(
					this.buttons[i].id,
					this.buttons[i].hidden ? "oz-btn oz-btn-hidden" : "oz-btn",
					this.buttons[i].iconCls ? OZ.TB.Template.BTN_ICON.format(this.buttons[i].iconCls) : "",
					this.buttons[i].text ? OZ.TB.Template.BTN_TEXT.format(this.buttons[i].text) : ""
				);
			}
		}
		
		//处理放在右侧的搜索按钮
		var searchBtns='';
		for(var i = 0;i<this.buttons.length;i++){
			if(this.buttons[i].type == "search" && this.buttons[i].location == "right"){//搜索按钮(进处理放在右侧的情况)
				searchBtns += this.getSearchBtnHtml(this.buttons[i]);
			}
		}
		if(searchBtns.length > 0){
			searchBtns = OZ.TB.Template.INNER.format("oz-btns-align-right",searchBtns);
		}
		// 构建完整的DOM
		this.container.append(OZ.TB.Template.INNER.format(tplData.alignCls,tplData.btns) + searchBtns);
		// 绑定事件处理
		this.bindEvents();
		// 显示
		this.show();
	},
	/** 判断是否处于显示状态 */
	isVisible: function(){
		return this.container.css("display") != "none";
	},
	/**  */
	getSearchBtnHtml: function(btnConfig){
		btnConfig.btns = (btnConfig.btns || "search");//默认只显示1个搜索按钮
		var searchBtnTypes = btnConfig.btns.split(",");
		var html = "";
		if(jQuery.inArray("search",searchBtnTypes)!= -1){
			html += OZ.TB.Template.BTN_SEARCH_BTN.format("simple","搜索");
		}
		if(jQuery.inArray("advance",searchBtnTypes)!= -1){
			html += OZ.TB.Template.BTN_SEARCH_BTN.format("advance","高级搜索");
		}
		if(jQuery.inArray("clean",searchBtnTypes)!= -1){
			html += OZ.TB.Template.BTN_SEARCH_BTN.format("clean","清空");
		}
		html = OZ.TB.Template.BTN_SEARCH.format(
			btnConfig.id,
			btnConfig.hidden ? "oz-btn oz-btn-hidden" : "oz-btn",
			btnConfig.value || "",
			html
		);
		//alert(html);
		return html;
	},
	/** 显示 */
	show: function(){
		if(!this.isVisible()) this.container.css("display","block");
	},
	/** 销毁 */
	destroy: function(){
		this.container.empty();
		this.container.remove();
		if(ozlog.infoEnable)
			ozlog.info("OZ.TB-->destory #" + this.id);
	},
	/** private:绑定事件处理 */
	bindEvents: function(){
		var _this = this;
		var btn;
		for(var i = 0;i<this.buttons.length;i++){
			btn = $("#" + this.buttons[i].id,this.container);
			if(!this.buttons[i].disabled){
				if(this.buttons[i].type == "button"){//普通按钮
					btn.mouseover(function(e){
						$(this).attr("class","oz-btn oz-btn-over");
					}).mouseout(function(e){
						$(this).attr("class","oz-btn");
					}).mousedown(function(e){
						$(this).attr("class","oz-btn oz-btn-click");
					});
					var handler = this.buttons[i].handler;
					if(typeof handler == "function"){
						btn.click(handler);
					}else if(typeof handler == "string"){
						if(typeof (window[handler])== "function"){
							btn.click(window[handler]);
						}
					}
				}else if(this.buttons[i].type == "search"){//搜索按钮
					this.bindSearchEvents(btn,$(this),this.buttons[i]);
				}
			}else{
				btn.attr("class","oz-btn oz-btn-disabled");
			}
		}
	},
	/** private:绑定搜索按钮的事件处理 */
	bindSearchEvents: function(btn,tb,btnConfig){
		//input控件
		var _input = btn.find("input");
		_input.keyup(function(e){
            if(e.keyCode == 13){
            	if(typeof btnConfig.onEnter == "function")
           			btnConfig.onEnter.call(_input,_input.val());
            	else if(typeof btnConfig.onSearch == "function")
           			btnConfig.onSearch.call(_input,_input.val());
           }
		});
		
		//搜索按钮
		var searchBtn = btn.find("span.simple");
		searchBtn.mouseover(function(e){
			searchBtn.attr("class","searchIcon simple overSimple");
		}).mouseout(function(e){
			searchBtn.attr("class","searchIcon simple");
		}).mousedown(function(e){
			searchBtn.attr("class","searchIcon simple clickSimple");
        	if(typeof btnConfig.onSearch == "function")
       			btnConfig.onSearch.call(searchBtn,_input.val());
		});
		
		//高级搜索按钮
		var advanceSearchBtn = btn.find("span.advance");
		advanceSearchBtn.mouseover(function(e){
			advanceSearchBtn.attr("class","searchIcon advance overAdvance");
		}).mouseout(function(e){
			advanceSearchBtn.attr("class","searchIcon advance");
		}).mousedown(function(e){
			advanceSearchBtn.attr("class","searchIcon advance clickAdvance");
        	if(typeof btnConfig.onAdvance == "function")
       			btnConfig.onAdvance.call(advanceSearchBtn,_input.val());
		});
		
		//清除按钮
		var cleanBtn = btn.find("span.clean");
		cleanBtn.mouseover(function(e){
			cleanBtn.attr("class","searchIcon clean overClean");
		}).mouseout(function(e){
			cleanBtn.attr("class","searchIcon clean");
		}).mousedown(function(e){
			cleanBtn.attr("class","searchIcon clean clickClean");
        	if(typeof btnConfig.onClean == "function")
        		var oldValue = _input.val();
        		 _input.val("");
       			btnConfig.onClean.call(cleanBtn,oldValue);
		});
	},
	getButton: function(buttonId){
		return $("#" + buttonId, this.container);
	},
	bindButtonHandler: function(buttonId, handler){
		return this.unBindButtonHandler(buttonId).click(handler);
	},
	unBindButtonHandler: function(buttonId){
		return $("#" + buttonId, this.container).unbind("click");
	},
	/** 隐藏指定的按钮，若buttonIds未定义或为空则隐藏所有按钮 */
	hideButtons: function(buttonIds){
		buttonIds = buttonIds || [];
		if(buttonIds.length == 0){
			for(var i=0;i<this.buttons.length;i++){
				$("#" + this.buttons[i].id, this.container).hide();
			}
		}else{
			for(var i=0;i<buttonIds.length;i++){
				$("#" + buttonIds[i], this.container).hide();
			}
		}
		this.hideRepeatSeperators();
		return this;
	},
	/** 显示指定的按钮，若buttonIds未定义或为空则显示所有按钮 */
	showButtons: function(buttonIds){
		buttonIds = buttonIds || [];
		if(buttonIds.length == 0){
			for(var i=0;i<this.buttons.length;i++){
				$("#" + this.buttons[i].id, this.container).show();
			}
		}else{
			for(var i=0;i<buttonIds.length;i++){
				$("#" + buttonIds[i], this.container).show();
			}
		}
		return this;
	},
	/** 如果出现连续的两个分隔条，则自动处理为只显示第一个 */
	hideRepeatSeperators: function(){
		//找出第1个可见分隔条
		var first = -1;
		for(var i=0;i<this.buttons.length;i++){
			if(this.buttons[i].type == "seperator"
				&& $("#" + this.buttons[i].id + ":visible", this.container).length > 0){
				first = i;
				break;
			}
		}
		if(first == -1 || first == this.buttons.length - 1) return;
		
		while (true){
			//找出紧接着的下一个可见分隔条
			var secend = -1;
			for(var j=first + 1;j<this.buttons.length;j++){
				if(this.buttons[j].type == "seperator"
					&& $("#" + this.buttons[j].id + ":visible", this.container).length > 0){
					secend = j;
					break;
				}
			}
			if(secend == -1) return;
			
			//从first到secend做判断处理
			if(!this.dealInner(first,secend)){
				first = secend;
			}
		}
	},
	/** private */
	dealInner:function(first,secend){
		//alert("first=" + first + ";secend=" + secend);
		var allHide = true;
		for(var k=first+1;k<secend;k++){
			if($("#" + this.buttons[k].id + ":visible", this.container).length > 0){
				allHide = false;
				break;
			}
		}
		if(allHide){
			$("#" + this.buttons[secend].id, this.container).hide();
			return true;
		}else{
			return false;
		}
	}
};

/** 全局配置 */
OZ.TB.DC = {
	/** 容器的css */
	cls: 'oz-tb',
	/** 按钮对齐方式："left"、"center"、"right" */
	buttonAlign: "left"
};

/** 结构模板 */
OZ.TB.Template = {
	/** 容器 0-containerId,1-containerCls,2-textAlign*/
	CONTAINER:'<div id="{0}" class="{1} {2}" style="display:none;" unselectable="on" onselectstart="return false;"></div>',
	/** 按钮 0-btnId,1-btnClass,2-btnIcon,3-btnText*/
	BTN:'<td id="{0}" class="{1}" type="button">'+
		'<div class="oz-btn-left"></div>'+
		'<div class="oz-btn-center">{2}{3}</div>'+
		'<div class="oz-btn-right"></div>'+
		'</td>',
	/** 按钮图标 0-btnIconCls*/
	BTN_ICON:'<span class="oz-btn-icon {0}"></span>',
	/** 按钮文字 0-text*/
	BTN_TEXT:'<span class="oz-btn-text">{0}</span>',
	/** 按钮分隔条 0-btnId*/
	BTN_SEPERATOR:'<td id="{0}" type="seperator"><span class="oz-btn-seperator" /></td>',
	/** 容器内部的HTML 0-alignCls,1-btns*/
	INNER:'<table cellspacing="1" cellpadding="0" border="0" class="{0}">'+
		'<tbody><tr>{1}</tr></tbody>'+
		'</table>',
	/** 搜索按钮 0-btnId,1-btnClass,2-searchValue,3-searchBtns*/
	BTN_SEARCH:'<td id="{0}" class="{1}" type="search">'+
		'<div><div class="oz-fc-search">'+
		'<input type="text" value="{2}" title="在此输入要搜索的内容"/>'+
		'{3}'+
		'</div></div>'+
		'</td>',
	/** 搜索按钮 0-searchBtnIconClass,1-searchBtnTip*/
	BTN_SEARCH_BTN:'<span class="searchIcon {0}" title="{1}"></span>'
};
OZ.Toolbar=OZ.TB;
