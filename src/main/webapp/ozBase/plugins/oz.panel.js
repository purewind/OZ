(function($) {
	$.widget("oz.panel",{
		options:{
		 	title: null,
	        iconCls: null,
	        width: "auto",
	        height: "auto",
	        left: null,
	        top: null,
	        cls: null,
	        headerCls: null,
	        bodyCls: null,
	        style: {},
	        href: null,
	        cache: true,
	        fit: false,
	        border: true,
	        doSize: true,
	        noheader: false,
	        content: null,
	        collapsible: false,
	        minimizable: false,
	        maximizable: false,
	        closable: false,
	        collapsed: false,
	        minimized: false,
	        maximized: false,
	        closed: false,
	        tools: [],
	        href: null,
	        loadingMessage: "Loading...",
	        onLoad: function() {},
	        onBeforeOpen: function() {},
	        onOpen: function() {},
	        onBeforeClose: function() {},
	        onClose: function() {},
	        onBeforeDestroy: function() {},
	        onDestroy: function() {},
	        onResize: function(_59, _5a) {},
	        onMove: function(_5b, top) {},
	        onMaximize: function() {},
	        onRestore: function() {},
	        onMinimize: function() {},
	        onBeforeCollapse: function() {},
	        onBeforeExpand: function() {},
	        onCollapse: function() {},
	        onExpand: function() {}
		},
		_render: function() {	
			var opts = this.options;
			var self = this;
			this.element.addClass("oz-panel");
			this.element.wrapInner('<div class="panel-warp"></div>');
			this.wrap = this.element.find(">div.panel-warp");
			this.wrap.wrapInner($('<div class="panel-body"></div>'));	
			this.body = this.wrap.find(">div.panel-body");
			if (opts.title && !opts.noheader){
				var header = $('<div class="panel-header"><div class="panel-title">'+opts.title+'</div></div>').insertBefore(this.body);
				if (opts.iconCls){
					header.find('.panel-title').addClass('panel-with-icon');
					$('<div class="panel-icon"></div>').addClass(opts.iconCls).appendTo(header);
				}
				var tool = $('<div class="panel-tool"></div>').appendTo(header);
				if (opts.closable){
					$('<div class="panel-tool-close"></div>').appendTo(tool).bind('click.panel', onClose);
				}
				if (opts.maximizable){
					$('<div class="panel-tool-max"></div>').appendTo(tool).bind('click.panel', onMax);
				}
				if (opts.minimizable){
					$('<div class="panel-tool-min"></div>').appendTo(tool).bind('click.panel', onMin);
				}
				if (opts.collapsible){
					$('<div class="panel-tool-collapse"></div>').appendTo(tool).bind('click.panel', onToggle);
				}
				if (opts.tools){
					for(var i=opts.tools.length-1; i>=0; i--){
						var t = $('<div></div>').addClass(opts.tools[i].iconCls).appendTo(tool);
						if (opts.tools[i].handler){
							t.bind('click.panel', eval(opts.tools[i].handler));
						}
					}
				}
				tool.find('div').hover(
					function(){$(this).addClass('panel-tool-over');},
					function(){$(this).removeClass('panel-tool-over');}
				);
				this.body.removeClass('panel-body-noheader');
				

				function onToggle(event){
					if ($(this).hasClass('panel-tool-expand')){
						self.expand(true);
					} else {
						self.collapse(true);
					}
					return false;
				}
				
				function onMin(){
					self.minimize();
					return false;
				}
				
				function onMax(){
					if ($(this).hasClass('panel-tool-restore')){
						self.restore();
					} else {
						self.maximize();
					}
					return false;
				}
				
				function onClose(){
					self.close();
					return false;
				}
				
			} else {
				this.body.addClass('panel-body-noheader');
			}
			this.header = this.wrap.find(">div.panel-header");	
			
			if (opts.border == true){
				this.wrap.find('>div.panel-header').removeClass('panel-header-noborder');
				this.wrap.find('>div.panel-body').removeClass('panel-body-noborder');
			} else {
				this.wrap.find('>div.panel-header').addClass('panel-header-noborder');
				this.wrap.find('>div.panel-body').addClass('panel-body-noborder');
			}
			
//			this.element.bind('_resize', function(){
//				var opts = self.options;
//				if (opts.fit == true){
//					self.setSize();
//				}
//				return false;
//			});
		},
		_init:function(){
			var opts = this.options;
			if (opts.doSize == true){
				this.element.css('display','block');
				this.setSize();
			}
			if (opts.closed == true){
				this.element.hide();
			} else {
				this.open();
			}
		},
		setSize:function(param){
			
			var opts = this.options;
			var panel = this.element;
			var pheader = this.header;
			var pbody = this.body;
			
			if (param){
				if (param.width) opts.width = param.width;
				if (param.height) opts.height = param.height;
				if (param.left != null) opts.left = param.left;
				if (param.top != null) opts.top = param.top;
			}
			
			if (opts.fit == true){
				var p = panel.parent();
				opts.width = p.width();
				opts.height = p.height();
			}
			panel.css({
				left: opts.left,
				top: opts.top
			});
			panel.css(opts.style);
			panel.addClass(opts.cls);
			pheader.addClass(opts.headerCls);
			pbody.addClass(opts.bodyCls);
			
			if (!isNaN(opts.width)){
				if ($.boxModel == true){
					panel.width(opts.width - (panel.outerWidth() - panel.width()));
					pheader.width(panel.width() - (pheader.outerWidth() - pheader.width()));
					pbody.width(panel.width() - (pbody.outerWidth() - pbody.width()));
				} else {
					panel.width(opts.width);
					pheader.width(panel.width());
					pbody.width(panel.width());
				}
			} else {
				panel.width('auto');
				pbody.width('auto');
			}
			if (!isNaN(opts.height)){
				if ($.boxModel == true){
					panel.height(opts.height - (panel.outerHeight() - panel.height()));
					pbody.height(panel.height() - pheader.outerHeight() - (pbody.outerHeight() - pbody.height()));
				} else {
					panel.height(opts.height);
					pbody.height(panel.height() - pheader.outerHeight());
				}
			} else {
				pbody.height('auto');
			}
			panel.css('height', null);
			this._trigger("_rezise");
			this.wrap.find('>div.panel-body>div').triggerHandler('_resize');
		},
		setTitle:function(title){
			this.options.title = title;
			this.header.find('div.panel-title').html(title);
		},
		getSize:function(){
			return {
				left:this.options.left,
				top:this.options.top,
				width:this.element.outerWidth(),
				height:this.element.outerHeight()
			}
		},
		move:function(left,top){
			var o = this.options;
	        var el = this.element;
            if (left) {
                o.left = left;
            }
            if (top) {
                o.top = top;
            }
	        el.css({
	            left: o.left,
	            top: o.top
	        });
	        this._trigger("move",{left:o.left,top:o.top})
		},
		collapse:function (){
			var opts = this.options;
			var tool = this.wrap.find('>div.panel-header .panel-tool-collapse');
			if (tool.hasClass('panel-tool-expand')) return;
			if (this._trigger("boforeCollapse") === false) return;
			tool.addClass('panel-tool-expand');
			this.body.hide();
			opts.collapsed = true;
			this._trigger("collapse");
		},		
		expand:function (){
			var opts = this.options;
			var tool = this.wrap.find('>div.panel-header .panel-tool-collapse');
			if (!tool.hasClass('panel-tool-expand')) return;
			if (this._trigger("beforeExpand") === false) return;
			tool.removeClass('panel-tool-expand');
			this.body.show();
			opts.collapsed = false;
			this._trigger("expand");
			this._loadData();
		},
		maximize:function (){
			var opts = this.options;
			var tool = this.wrap.find('>div.panel-header .panel-tool-max');
			if (tool.hasClass('panel-tool-restore')) return;
			tool.addClass('panel-tool-restore');
			
			this.options.original = {
				width: opts.width,
				height: opts.height,
				left: opts.left,
				top: opts.top,
				fit: opts.fit
			};
			opts.left = 0;
			opts.top = 0;
			opts.fit = true;
			this.setSize();
			opts.minimized = false;
			opts.maximized = true;
			this._trigger("maximize");
		},		
		minimize : function (){
			var opts = this.options;
			this.element.hide();
			opts.minimized = true;
			opts.maximized = false;
			this._trigger("minimize");
		},		
		restore:function (){
			var opts = this.options;
			var tool = this.wrap.find('>div.panel-header .panel-tool-max');
			
			if (!tool.hasClass('panel-tool-restore')) return;
			
			this.element.show();
			tool.removeClass('panel-tool-restore');
			var original = opts.original;
			opts.width = original.width;
			opts.height = original.height;
			opts.left = original.left;
			opts.top = original.top;
			opts.fit = original.fit;
			this.setSize();
			opts.minimized = false;
			opts.maximized = false;
			this._trigger("restore");
		},
		close :function (forceClose){
			var opts = this.options;
			if (forceClose != true){
				if (this._trigger("beforeClose") === false) return;
			}
			this.element.hide();
			opts.closed = true;
			this._trigger("close");
		},
		open:function ( forceOpen){
			var opts = this.options;
			if (forceOpen != true){
				if (this._trigger("beforeOpen") === false) return;
			}
			this.element.show();
			opts.closed = false;
			this._trigger("open");
			if (opts.maximized == true) this.maximize();
			if (opts.minimized == true) this.minimize();
			if (opts.collapsed == true) this.collapse();
			
			if (!opts.collapsed){
				this._loadData();
			}
		},
		_loadData:function(){
			var opts = this.options;
			var self = this;
			if (opts.href && (!this.isLoaded || !opts.cache)){
				this.isLoaded = false;
				var pbody = this.body;
				pbody.html($('<div class="panel-loading"></div>').html(opts.loadingMessage));
				pbody.load(opts.href, null, function(){
					self._trigger("load",{args:arguments});
					self.isLoaded = true;
				});
			}
		}
	});
})(jQuery);