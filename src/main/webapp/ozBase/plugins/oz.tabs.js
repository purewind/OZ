(function($) {
	
	if($.oz && $.oz.tabs){
		return;
	}
	
	var _idSeed = 0;
	
	$.widget("oz.tabs",{
		options:{
	        width: "auto",
	        height: "auto",
	        border:true,
	        maxtab:25,
	        pos:"top",
	        enableTabScroll:true,
	        tabWidth:0,
	        scrollIncrement:0,
	        plain:false,
	        _tabs:[]
		},
		_parseStyle:function(){
			var t = this.element;
			return {
				width: (parseInt(t.css('width')) || undefined),
				height: (parseInt(t.css('height')) || undefined)
			}
		},
		_render: function() {
			var el = this.element;
			var opts = this.options;
			var self = this;
			this.tbctBaseCls = this.options.pos=="top"?"header":"footer";
			this.element.addClass("tabs-panel").wrapInner('<div class="tabs-body tabs-body-'+this.options.pos+'"></div>');
			this.body = this.element.find(">div.tabs-body");	
			
			this.tbct = $("<div class='tabs-"+this.tbctBaseCls+"'><div class='tabs-scroller-left'></div><div class='tabs-scroller-right'></div><div class='tabs-strip-wrap'><ul class='tabs-strip tabs-strip-"+this.options.pos+"'><li class='tabs-edge'/><div class='oz-clear'/></ul></div></div>");
			
			if(this.options.pos=="top"){
				this.body.before(this.tbct);
			}else{
				this.body.after(this.tbct);
			}
			
			
			
			if(this.options.plain){
				this.tbct.addClass("tabs-"+this.tbctBaseCls+"-plain");
			}
			if (opts.border == true){
				this.tbct.removeClass('tabs-"+this.tbctBaseCls+"-noborder');
				this.body.removeClass('tabs-body-noborder');
			} else {
				this.tbct.addClass('tabs-"+this.tbctBaseCls+"-noborder');
				this.body.addClass('tabs-body-noborder');
			}
            this.stripWrap = $(".tabs-strip-wrap",this.tbct);
            if(this.options.pos=="top"){
            	this.stripWrap.after("<div class='tabs-strip-spacer'/>");
            }else{
            	this.stripWrap.before("<div class='tabs-strip-spacer'/>");
            }
            this.stripSpacer = $(".tabs-strip-spacer",this.tbct);
            this.strip = $(".tabs-strip",this.stripWrap);
     		this.edge =$(".tabs-edge",this.strip);
     		this.rendered = true;
     		
     		
     		this.scrollLeft = $(".tabs-scroller-left",this.tbct).disableSelection().hoverClass("tabs-scroller-left-over")
     		.bind("click",$.proxy(this,"_onScrollLeft"));
     		this.scrollRight = $(".tabs-scroller-right",this.tbct).disableSelection().hoverClass("tabs-scroller-right-over")
     		.bind("click",$.proxy(this,"_onScrollRight"));
     		
			this.element.bind('_resize', function(){
				var opts = self.options;
				if (opts.fit == true){
					self.resize();
					//激活当前活动窗口的调整事件
					self.getActive()&&self.getActive().trigger('_resize');
				}
				return false;
			});
		},
		_init:function(){
			this.element.css('display','block');
			this.resize();
			var self = this;
			$(">div", this.body).each(function() {
    			var pp = $(this);
    			self.options._tabs.push(pp);
    			self._createTab(pp,$.metadata && $.metadata.get( this )["panel"]);
    		});
		},
		resize:function(param){
			var opts = this.options;
			var panel = this.element;
			var tbct = this.tbct;
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
			if (!isNaN(opts.width)){
				if ($.boxModel == true){
					panel.width(opts.width - (panel.outerWidth() - panel.width()));
					tbct.width(panel.width() - (tbct.outerWidth() - tbct.width()));
					body.width(panel.width() - (body.outerWidth() - body.width()));
				} else {
					panel.width(opts.width);
					tbct.width(panel.width());
					body.width(panel.width());
				}
			} else {
				panel.width('auto');
				body.width('auto');
			}
			if (!isNaN(opts.height)){
				if ($.boxModel == true){
					panel.height(opts.height - (panel.outerHeight() - panel.height()));
					body.height(panel.height() - tbct.outerHeight() - (body.outerHeight() - body.height()));
				} else {
					panel.height(opts.height);
					body.height(panel.height() - tbct.outerHeight());
				}
			} else {
				body.height('auto');
			}
			panel.css('height', null);
			for ( var i = 0; i < this.options._tabs.length; i++) {
				var tab = this.options._tabs[i];
				tab.panel("option","doResize",true);
			}
			this._autoScrollTabs();
		},
		add:function(config,active){
			var self = this;
			if( $.isArray(config)){
				$.each(config,function(a){self.add(this,a);},[active]);
				return;
			}
			if(config.id){			
				var tab = this.activeTab(config.id);
		        if(tab){return;}
			}
	        // 判断是否可以新建一个窗口
	        if(this.options.maxtab == -1 || this.options._tabs.length >= this.options.maxtab){
				//TODO  添加事件
	        	//this.fireEvent("maxtab",this,config);
				return;
			}
			var panel = $('<div></div>').attr('title', config.title).appendTo(this.body);
			
			this.options._tabs.push(panel);
			
			this._createTab(panel,config);
			
		},
		close:function(tabId){
			var o = this.findTab(tabId,true);
			if(o){
				var op = null;
				var d = o.panel("option","opener");
				if(d){
					var op = this.activeTab(d);
				}
				if(!op){
					if(this.options._tabs.length>0){
						this.activeTab(this.options._tabs[0].panel("option","id"));
					}
				}
				o.remove();
			}
		},
		findTab:function(tabId,remove){
			for ( var i = 0; i < this.options._tabs.length; i++) {
				var tab = this.options._tabs[i];
				if(tab.panel("option","id")==tabId){
					if (remove) {
						this.options._tabs.splice(i, 1);
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
				if(t==a) return;
				if(a){
					a.panel("close");
					a.panel("option","tab").removeClass("tabs-strip-active");
				};
				t.panel("open");
				t.panel("option","tab").addClass("tabs-strip-active");
				if(t.panel("option","doResize")){
					t.trigger('_resize');
					t.panel("option","doResize",false);
				}
				if(this.scrolling){
		            this.scrollToTab(t);
		        }
				return t;
			}
			return null;
		},
		getActive:function(){
			for ( var i = 0; i < this.options._tabs.length; i++) {
				var tab = this.options._tabs[i];
				if(tab.panel("option","closed") != true){
					return tab;
				}
			}
			return null;
		},
		_createTab:function(panel,config){
			var act = this.getActive();
			config = $.extend(true,{
				id: null,
				iconCls:'',
		        title: "无标题",
		        content:'',
		        opener: act?act.panel("option","id"):null,
		        refresh: false,
		        tabTip: '',
		        selected:false,
		        noheader:true,
				closable: false,
				height: 'auto',
				width: 'auto'
		    },config);
			
			config.id = config.id || 'gen-tabs-panel' + _idSeed++;
			
			var tabHtml =['<li><a class="tabs-strip-close" onclick="return false;"></a>',
			                 '<a class="tabs-right" href="#" onclick="return false;"><em class="tabs-left">',
			                 '<span class="tabs-strip-inner"><span class="tabs-strip-text '+config.iconCls+'\">'+config.title+'</span></span>',
			                 '</em></a></li>'].join("");
	        var tab = $(tabHtml).attr({title:config.tabTip}).insertBefore($("li:last",this.strip));
	        
	        panel.panel(config);
	        
			var self  = this;
			if(config.iconCls){
				tab.addClass("tabs-with-icon");
			}      
			if(config.closable){
				tab.addClass("tabs-strip-closable");
				$(".tabs-strip-close",tab).bind("click.tabs",function(){
					self.close(config.id);
				})
			}
			tab.hoverClass("tabs-strip-over");
			
			if(this.options.tabWidth > 0){
	        	if ($.boxModel == true) {
	        		tab.width(this.options.tabWidth - (tab.outerWidth(true) - tab.width()));
	        	}else{
	        		tab.width(this.options.tabWidth);
	        	}
	        }
			$.data(tab[0],"tabs.id",config.id);
			tab.bind("click.tabs",function(){
				var id = $(this).data("tabs.id");
				self.activeTab(id);
		     })
		     
			panel.bind("remove.panel", function(){tab.remove();});
			panel.bind("disable.panel", function(){tab.addClass("oz-item-disabled")});
			panel.bind("enable.panel", function(){tab.removeClass("oz-item-disabled")});
			panel.bind("setTitle.panel",function(){$(".tabs-strip-inner>span",tab).text($(this).panel("option","title"));});
			panel.panel("option","tab",tab);
			
			this._autoScrollTabs();
			this.activeTab(config.id);
			if(this.options._tabs.length==1){
				this.resize();
			}
		},
		scrollToTab : function(item){
	        if(!item){ return; }
	        var tab = item.panel("option","tab");
	        var pos = this._getScrollPos(), area = this._getScrollArea();
	        var left = tab.position().left + pos;
	        var right = left + tab.outerWidth(true);
	        if(left < pos){
	            this._scrollTo(left);
	        }else if(right > (pos + area)){
	            this._scrollTo(right - area);
	        }
	    },
	    _autoScrollTabs : function(){
	        var count = this.tabCount;
	        var ow = this.tbct.outerWidth();
	        var tw = this.tbct.width();
	        var stripWrap = this.stripWrap;
	        var cw = stripWrap.outerWidth();
	        var pos = this._getScrollPos();
	        var l = this.edge.position().left + pos;
	        if(l <= tw){
	        	stripWrap.scrollLeft(0);
	        	stripWrap.width(tw);
	            if(this.scrolling){
	                this.scrolling = false;
	                this.tbct.removeClass('tabs-scrolling');
	            }
	        }else{
	            if(!this.scrolling){
	                this.tbct.addClass('tabs-scrolling');
	            }
	            if ($.boxModel == true) {
	            	stripWrap.css('left',2);
				} else {
					stripWrap.css('left',0);
				}
	            stripWrap.width(tw-this.scrollLeft.width()-this.scrollRight.width());
	            this.scrolling = true;
	            if(pos > (l-tw)){
	            	stripWrap.scrollLeft(l-tw);
	            }else{
	                this.scrollToTab(this.getActive());
	            }
	            this._updateScrollButtons();
	        }
	    },
	    _getScrollWidth : function(){
	        return this.edge.position().left + this._getScrollPos();
	    },
	    _getScrollPos : function(){
	        return this.stripWrap.scrollLeft();
	    },
	    _getScrollArea : function(){
	        return this.stripWrap.width();
	    },
	    _getScrollIncrement : function(){
	    	return this.options.scrollIncrement || this.options.tabWidth || this.lastTabWidth || 100;
	    },
	    _scrollTo : function(pos){
        	this.stripWrap.scrollLeft(pos);
            this._updateScrollButtons();
	    },
	    _onScrollRight : function(){
	    	if(this.scrollRight.hasClass("tabs-scroller-right-disabled")) return;
	        var sw = this._getScrollWidth()-this._getScrollArea();
	        var pos = this._getScrollPos();
	        var s = Math.min(sw, pos + this._getScrollIncrement());
	        if(s != pos){
	            this._scrollTo(s);
	        }
	    },
	    _onScrollLeft : function(){
	    	if(this.scrollLeft.hasClass("tabs-scroller-left-disabled")) return;
	        var pos = this._getScrollPos();
	        var s = Math.max(0, pos - this._getScrollIncrement());
	        if(s != pos){
	            this._scrollTo(s);
	        }
	    },
	    _updateScrollButtons : function(){
	        var pos = this._getScrollPos();
	        //alert([pos,this._getScrollArea(),this._getScrollWidth(),this._getScrollArea()-this._getScrollWidth()])
	        this.scrollLeft[pos == 0 || pos == 1 ? 'addClass' : 'removeClass']('tabs-scroller-left-disabled');
	        this.scrollRight[pos >= (this._getScrollWidth()-this._getScrollArea()) ? 'addClass' : 'removeClass']('tabs-scroller-right-disabled');
	    }
	});
})(jQuery);