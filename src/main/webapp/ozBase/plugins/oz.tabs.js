(function($) {
	var tabsId = 0;
	$.widget("oz.tabPanel",{
		options:{
	        width: "auto",
	        height: "auto",
	        left: null,
	        top: null,
	        doSize:true,
	        border:true,
	        maxtab:25
		},
		_tabs:[],
		_idSP:"-",
		_idSeed:0,
		_parseStyle:function(){
			var t = this.element;
			return {
				width: (parseInt(t.css('width')) || undefined),
				height: (parseInt(t.css('height')) || undefined),
				left: (parseInt(t.css('left')) || undefined),
				top: (parseInt(t.css('top')) || undefined)
			}
		},
		_render: function() {	
			this.id = this.options.id||"tabs-"+tabsId++;
			var el = this.element;
			var opts = this.options;
			var self = this;
			this.element.addClass("tabs-panel").wrapInner('<div class="tabs-body"></div>');
			this.body = this.element.find(">div.tabs-body");	
			
			$("<div class='tabs-header'><div class='tabs-scroller-left'></div><div class='tabs-scroller-right'></div><div class='tabs-strip-wrap'><ul class='tabs-strip'><li class='tabs-edge'/><div class='clear'/></ul></div><div class='tabs-strip-spacer'/></div>")
			.prependTo(this.element);
			
			this.header=this.element.find(">div.tabs-header");	
			
			if (opts.border == true){
				this.header.removeClass('tabs-header-noborder');
				this.body.removeClass('tabs-body-noborder');
			} else {
				this.header.addClass('tabs-header-noborder');
				this.body.addClass('tabs-body-noborder');
			}

            this.stripWrap = $(".tabs-strip-wrap",this.tbct);
            this.stripSpacer = $(".tabs-strip-spacer",this.tbct);
            this.strip = $(".tabs-strip",this.stripWrap);
     		this.edge =$(".tabs-edge",this.strip);
     		this.rendered = true;
     		
			this.element.bind('_resize', function(){
				var opts = self.options;
				if (opts.fit == true){
					self.resize();
				}
				return false;
			});
		},
		_init:function(){
			var opts = this.options;
			if (opts.doSize == true){
				this.element.css('display','block');
				this.resize();
			}
		},
		resize:function(param){
			var opts = this.options;
			var panel = this.element;
			var header = this.header;
			var body = this.body;
			if (param){
				if (param.width) opts.width = param.width;
				if (param.height) opts.height = param.height;
				if (param.left != null) opts.left = param.left;
				if (param.top != null) opts.top = param.top;
			}
			if (opts.fit === true){
				var p = panel.parent();
				opts.width = p.width();
				opts.height = p.height();
			}
			
			panel.css({
				left: opts.left,
				top: opts.top
			});
			
			if (!isNaN(opts.width)){
				if ($.boxModel == true){
					panel.width(opts.width - (panel.outerWidth() - panel.width()));
					header.width(panel.width() - (header.outerWidth() - header.width()));
					body.width(panel.width() - (body.outerWidth() - body.width()));
				} else {
					panel.width(opts.width);
					header.width(panel.width());
					body.width(panel.width());
				}
			} else {
				panel.width('auto');
				body.width('auto');
			}
			if (!isNaN(opts.height)){
				if ($.boxModel == true){
					panel.height(opts.height - (panel.outerHeight() - panel.height()));
					body.height(panel.height() - header.outerHeight() - (body.outerHeight() - body.height()));
				} else {
					panel.height(opts.height);
					body.height(panel.height() - header.outerHeight());
				}
			} else {
				body.height('auto');
			}
			panel.css('height', null);
			$(">div",this.body).trigger('_resize');
		},
		add:function(config,active){
			if(config.id){			
				var tab = this.activeTab(config.id);
		        if(tab){return;}
			}
	        // 判断是否可以新建一个窗口
	        if(this.options.maxtab == -1 || this._tabs.length >= this.options.maxtab){
				//TODO  添加事件
	        	//this.fireEvent("maxtab",this,config);
				return;
				
			}
	        
			var panel = $('<div></div>').attr('title', config.title).appendTo(this.body);
			
			this._tabs.push(panel);
			
			this._createTab(panel,config);
			
		},
		close:function(tabId){
			var o = this.findTab(tabId,true);
			if(o){
				var d = o.panel("option","opener");
				if(d){this.activeTab(d.panel("option","id"))};
				o.remove();
			}
		},
		findTab:function(tabId,remove){
			for ( var i = 0; i < this._tabs.length; i++) {
				var tab = this._tabs[i];
				if(tab.panel("option","id")==tabId){
					if (remove) {
						this._tabs.splice(i, 1);
					}
					return tab;
				}
			}
			return null;
		},
		activeTab:function(tabId){
			var t = this.findTab(tabId);
			if(t){
				var a = this.getActive();
				if(a){
					a.panel("close");
					a.panel("option","tab").removeClass("tabs-selected");
				};
				t.panel("open");
				t.panel("option","tab").addClass("tabs-selected");
				return t;
			}
			return null;
		},
		getActive:function(){
			for ( var i = 0; i < this._tabs.length; i++) {
				var tab = this._tabs[i];
				if(tab.panel("option","closed") != true){
					return tab;
				}
			}
			return null;
		},
		_createTab:function(panel,config){
			config = $.extend(true,{
				id: null,
				icoCls:'',
		        title: "无标题",
		        content:'',
		        opener: this.getActive(),
		        refresh: false,
		        tabTip: '',
		        selected:false,
		        noheader:true,
		        border:false,
				closable: false,
				height: 'auto',
				width: 'auto'
		    },config);
			
			config.id = config.id || 'gen-tabs-panel' + this._idSeed++;
			
			
			var tabHtml =['<li><a class="tabs-strip-close" onclick="return false;"></a>',
			                 '<a class="tabs-right" href="#" onclick="return false;"><em class="tabs-left">',
			                 '<span class="tabs-strip-inner"><span class="tabs-strip-text '+config.icoCls+'\">'+config.title+'</span></span>',
			                 '</em></a></li>'].join("");
	        var tab = $(tabHtml).attr({title:config.tabTip}).insertBefore($("li:last",this.strip));
	        
	        panel.panel(config);
	        
	        // 创建一个新的窗口
			if(config.selected == true)
				this.defaultTabId = config.id;
			
			var self  = this;
			if(config.icoCls){
				tab.addClass("tabs-with-icon");
			}      
			if(config.closable){
				tab.addClass("tabs-strip-closable");
			}
			
			tab.hoverClass("tabs-strip-over");
			config.tab=tab;
			panel.bind("remove.panel", function(){alert(0);tab.remove();});
			panel.bind("disable.panel", function(){tab.addClass("oz-item-disabled")});
			panel.bind("enable.panel", function(){tab.removeClass("oz-item-disabled")});
			panel.bind("titlechange.panel",function(p,title){$(".tabs-strip-inner>span",tab).text(title);});
			
			$.data(tab[0],"tabs.id",config.id);
			
			panel.panel("option","tab",tab);
			
			//this.delegateUpdates();
			
			if (config.selected == true) {
				this.activeTab(config.id);
			}else{
				panel.panel("close");
			}
			
			 tab.bind("click.tabs",function(){
				var id = $(this).data("tabs.id");
				self.activeTab(id);
		     })
		}
	});
})(jQuery);