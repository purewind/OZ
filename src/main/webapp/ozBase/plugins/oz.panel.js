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
	        loadingMessage: "Loading..."
		},
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
			var el = this.element;
			var opts = this.options;
			var self = this;
			this.panel = this.element.addClass("panel-body").wrap('<div class="oz-panel"></div>').parent().css(opts.style).addClass(opts.cls);
			this.body = this.element.addClass(opts.bodyCls);
			if (opts.title && !opts.noheader){
				var header = $('<div class="panel-header"><div class="panel-title">'+opts.title+'</div></div>').addClass(opts.headerCls).prependTo(this.panel);
				if (opts.iconCls){
					header.find('.panel-title').addClass('panel-with-icon');
					$('<div class="panel-icon"></div>').addClass(opts.iconCls).appendTo(header);
				}
				var tool = $('<div class="panel-tool"></div>').appendTo(header);
				if (opts.closable){
					function onClose(){
						self.close();
						return false;
					}
					$('<div class="panel-tool-close"></div>').appendTo(tool).bind('click.'+this.widgetName, onClose);
				}
				if (opts.maximizable){
					function onMax(){
						if ($(this).hasClass('panel-tool-restore')){
							self.restore();
						} else {
							self.maximize();
						}
						return false;
					}
					$('<div class="panel-tool-max"></div>').appendTo(tool).bind('click.'+this.widgetName, onMax);
				}
				if (opts.minimizable){
					function onMin(){
						self.minimize();
						return false;
					}
					$('<div class="panel-tool-min"></div>').appendTo(tool).bind('click.'+this.widgetName, onMin);
				}
				if (opts.collapsible){
					function onToggle(event){
						if ($(this).hasClass('panel-tool-expand')){
							self.expand(true);
						} else {
							self.collapse(true);
						}
						return false;
					}
					$('<div class="panel-tool-collapse"></div>').appendTo(tool).bind('click.'+this.widgetName, onToggle);
				}
				if (opts.tools){
					for(var i=opts.tools.length-1; i>=0; i--){
						var t = $('<div></div>').addClass(opts.tools[i].iconCls).appendTo(tool);
						if (typeof opts.tools[i].handler  == "function"){
							t.bind('click.'+this.widgetName, $.proxy(opts.tools[i].handler,this));
						}
					}
				}
				tool.find('div').hover(
					function(){$(this).addClass('panel-tool-over');},
					function(){$(this).removeClass('panel-tool-over');}
				);
				this.body.removeClass('panel-body-noheader');
			} else {
				this.body.addClass('panel-body-noheader');
			}
			this.header = this.panel.find(">div.panel-header");	
			
			if (opts.border == true){
				this.header.removeClass('panel-header-noborder');
				this.body.removeClass('panel-body-noborder');
			} else {
				this.header.addClass('panel-header-noborder');
				this.body.addClass('panel-body-noborder');
			}
			this.panel.bind('_resize', function(){
				var opts = self.options;
				if (opts.fit == true){
					self.resize();
				}
				return false;
			});
		},
		_init:function(){
			var opts = this.options;
			if (opts.content){
				this.body.html(opts.content);
			}
			if (opts.doSize == true){
				this.panel.css('display','block');
				this.resize();
			}
			if (opts.closed == true){
				this.panel.hide();
			} else {
				this.open();
			}
		},
		resize:function(param){
			var opts = this.options;
			var panel = this.panel;
			var pheader = this.header;
			var pbody = this.body;
			
			if (param){
				if (param.width) opts.width = param.width;
				if (param.height) opts.height = param.height;
				if (param.left != null) opts.left = param.left;
				if (param.top != null) opts.top = param.top;
			}
			
			if (opts.fit == true){
				var p = this.panel.parent();
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
			this._trigger("resize");
			$(">div",this.body).triggerHandler('_resize');
		},
		setTitle:function(title){
			this.options.title = title;
			this.header.find('>div.panel-title').html(title);
			this._trigger("setTitle")
		},
		getSize:function(){
			return {
				left:this.options.left,
				top:this.options.top,
				width:this.options.width,
				height:this.options.height
			}
		},
		move:function(left,top){
			var o = this.options;
	        var el = this.panel;
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
			var tool = this.panel.find('>div.panel-header .panel-tool-collapse');
			if (tool.hasClass('panel-tool-expand')) return;
			if (this._trigger("boforeCollapse") === false) return;
			tool.addClass('panel-tool-expand');
			this.body.hide();
			opts.collapsed = true;
			this._trigger("collapse");
		},		
		expand:function (){
			var opts = this.options;
			var tool = this.panel.find('>div.panel-header .panel-tool-collapse');
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
			var tool = this.panel.find('>div.panel-header .panel-tool-max');
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
			this.resize();
			opts.minimized = false;
			opts.maximized = true;
			this._trigger("maximize");
		},		
		minimize : function (){
			var opts = this.options;
			this.panel.hide();
			opts.minimized = true;
			opts.maximized = false;
			this._trigger("minimize");
		},		
		restore:function (){
			var opts = this.options;
			var tool = this.panel.find('>div.panel-header .panel-tool-max');
			
			if (!tool.hasClass('panel-tool-restore')) return;
			
			this.panel.show();
			tool.removeClass('panel-tool-restore');
			var original = opts.original;
			opts.width = original.width;
			opts.height = original.height;
			opts.left = original.left;
			opts.top = original.top;
			opts.fit = original.fit;
			this.resize();
			opts.minimized = false;
			opts.maximized = false;
			this._trigger("restore");
		},
		close :function (forceClose){
			var opts = this.options;
			if(opts.closed === true){
				return;
			}
			if (forceClose != true){
				if (this._trigger("beforeClose") === false) return;
			}
			this.panel.hide();
			opts.closed = true;
			this._trigger("close");
		},
		open:function ( forceOpen){
			var opts = this.options;
			if(opts.closed === false){
				return;
			}
			if (forceOpen != true){
				if (this._trigger("beforeOpen") === false) return;
			}
			this.panel.show();
			opts.closed = false;
			this._trigger("open");
			if (opts.maximized == true) this.maximize();
			if (opts.minimized == true) this.minimize();
			if (opts.collapsed == true) this.collapse();
			if (!opts.collapsed){
				this._loadData();
			}
		},
		destroy:function (forceDestroy){
			var opts = this.options;
			if (forceDestroy != true){
				if (this._trigger("beforeDestroy") === false) return;
			}
			this.base();
			this.panel.remove();
			
		},
		_loadData:function(){
			var opts = this.options;
			if (opts.href && (!this.isLoaded || !opts.cache)){
				var self = this;
				this.isLoaded = false;
				var pbody = this.body;
				pbody.html($('<div class="panel-loading"></div>').html(opts.loadingMessage));
				pbody.load(opts.href, null, function(){
					self._trigger("loaded",{args:arguments});
					self.isLoaded = true;
				});
			}
		}
	});
})(jQuery);