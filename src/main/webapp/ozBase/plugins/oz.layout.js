(function($) {
	var parseMargins = function(v){
	    var ms = v.split(' ');
	    var len = ms.length;
	    if(len == 1){
	        ms[1] = ms[0];
	        ms[2] = ms[0];
	        ms[3] = ms[0];
	    }
	    if(len == 2){
	        ms[2] = ms[0];
	        ms[3] = ms[1];
	    }
	    return {
	        top:parseInt(ms[0], 10) || 0,
	        right:parseInt(ms[1], 10) || 0,
	        bottom:parseInt(ms[2], 10) || 0,
	        left:parseInt(ms[3], 10) || 0
	    };
	};
	var POS = {
		VERTICAL : 1,
		HORIZONTAL : 2,
		LEFT : 1,
		RIGHT :2,
		TOP : 3,
		BOTTOM: 4
	}
	$.widget("oz.splitBar",$.oz.mouse,{
		_render:function(){
			this.target = this.options.target;
			this.orientation = this.options.orientation;
			this.placement = this.options.placement;
			this.width = this.options.width;
			this.maxSize = this.options.maxSize||500;
			this.minSize = this.options.minSize||10;
			
			//设置方向样式
			if(this.orientation == POS.HORIZONTAL){
		        this.element.addClass("layout-split-h");
		    }else{
		        this.element.addClass("layout-split-v");
		    }
			//创建代理
	 		var cls = 'layout-split-proxy' ;
	 		this.proxy = $("<div/>").insertBefore(this.element)
	 		.addClass(cls + " " +(this.options.orientation == POS.HORIZONTAL ? cls +'-h' : cls + '-v'))
	 		.disableSelection().css({visibility:"hidden",display: "none"});
	 		this._mouseInit();
		},
		_mouseStart: function(event) {
			//显示代理
			this.proxy.css(this.element.position()).css({visibility:"visible",display: "block"})
			.width(this.element.width()).height(this.element.height());
			//显示遮罩
			this.mark = $("<div></div>").addClass("oz-drag-overlay").insertAfter(this.resizeEl).disableSelection()
			.css({visibility:"visible",display: "block",width:$(window).width(),height: $(window).height()})
			.show();
			//记录其实位置
			this.originalMousePosition = {x: event.pageX, y: event.pageY};
			this.proxyPosition = this.proxy.position();
			if(this.options.orientation == POS.HORIZONTAL){
				this.oldSize = this.options.target.element.width();
			}else{
				this.oldSize = this.options.target.element.height();
			}
			
			if(this.placement == POS.RIGHT || this.placement == POS.BOTTOM){
				this.activeMinSize = this.oldSize - this.maxSize;
				this.activeMaxSize = this.oldSize - this.minSize;
			}else{
				this.activeMinSize = this.minSize - this.oldSize;
				this.activeMaxSize = this.maxSize - this.oldSize;
			}
		},
		_mouseDrag: function(e) {
			var pos = {x:e.pageX,y:e.pageY};
			var smp = this.originalMousePosition;
			if(this.options.orientation == POS.HORIZONTAL){
				var size = (pos.x - smp.x);
				if(this.activeMinSize > size || this.activeMaxSize < size) return;
				this.size = size;
				this.proxy.css("left",this.proxyPosition.left + this.size)
			}else{
				var size = (pos.y - smp.y);
				if(this.activeMinSize > size || this.activeMaxSize < size) return;
				this.size = size;
				this.proxy.css("top",this.proxyPosition.top+ this.size)
			}
		},
		_mouseStop: function(e) {
			if(this.placement == POS.RIGHT || this.placement == POS.BOTTOM){
				this.size = -(this.size);
			}
			if(this.options.orientation == POS.HORIZONTAL){
				this.target.options.width = this.target.options.width+this.size;
				this.target.setSize({layout:true});
			}else{
				this.target.options.height = this.target.options.height+this.size;
				this.target.setSize({layout:true});
			}
			this.setPosition();
			this.proxy.css({visibility:"hidden",display: "none"});
			if(this.mark){this.mark.remove();}
		},
		setPosition:function(){
			var opts = this.target.options;
			var h = opts.height,w = opts.width,l = opts.left||0,t = opts.top||0;
			if(this.orientation == POS.HORIZONTAL){
				if(this.placement == POS.LEFT){
					this.element.css({width:5,height:h,top:t,left:l+w});
				}else{
					this.element.css({width:5,height:h,top:t,left:l-5});
				} 				
			}else{
				if(this.placement == POS.TOP){
					this.element.css({width:w,height:5,top:t+h,left:l});
				}else{
					this.element.css({width:w,height:5,top:t-5,left:l});
				} 				
			} 
		}
	});
	
	$.widget("oz.layoutRegion",$.oz.panel,{
		options:{
			margins:"0 0 0 0",
			cmargins:"0 0 0 0",
			maxSize:500,
			minSize:30
		},
		_render: function() {
			this.options.fit = false;
			this.base();
			var opts = this.options;
			var self = this;
			this.margins = parseMargins(this.options.margins);
			this.cmargins = parseMargins(this.options.cmargins);
			this.element.addClass("layout-panel");
			this.layout = this.options.layout;
			
			if(this.options.split == true){
				this.splitBar = $('<div></div>');
				this.splitBar.insertAfter(this.element).splitBar($.extend(this._splitSettings[this.options.region],
						{maxSize:this.options.maxSize,minSize:this.options.minSize,target:this}));
			}
			
		},
		setSize:function(args){
			this.base(args);
			if(args && args.layout == true){
				this.layout.layout("layout");
			}
			if(this.options.split == true){
				this.splitBar.splitBar("setPosition");
			}
		},
		getMargins:function(){
			return this.isCollapsed && this.cmargins ? this.cmargins : this.margins;
		},
		_splitSettings : {
	        north : {
	            orientation: POS.VERTICAL,
	            placement: POS.TOP
	        },
	        south : {
	            orientation: POS.VERTICAL,
	            placement: POS.BOTTOM
	        },
	        east : {
	            orientation: POS.HORIZONTAL,
	            placement: POS.RIGHT
	        },
	        west : {
	            orientation: POS.HORIZONTAL,
	            placement: POS.LEFT
	        }
	    }
	});
	$.widget("oz.layout",{
		options: {
			fit:false
		},
		_render: function() {
			var self = this, o = this.options,el = this.element;
	        if (el[0].tagName == "BODY") {
	            $("html").css({
	                height: "100%",
	                overflow: "hidden"
	            });
	            $("body").css({
	                height: "100%",
	                overflow: "hidden",
	                border: "none"
	            });
	        }
	        el.addClass("oz-layout");
	        el.css({
	            margin: 0,
	            padding: 0
	        });
	        
	        $("<div class=\"layout-split-proxy-h\"></div>").appendTo(el);
	        $("<div class=\"layout-split-proxy-v\"></div>").appendTo(el);
	        
			this.regions = {
	            center:  $(".oz-layout-center:first",el).layoutRegion({region:"center",layout:this}),
	            north : $(".oz-layout-north:first",el).layoutRegion({region:"north",layout:this}),
				south : $(".oz-layout-south:first",el).layoutRegion({region:"south",layout:this}),
				east : $(".oz-layout-east:first",el).layoutRegion({region:"east",layout:this}),
				west : $(".oz-layout-west:first",el).layoutRegion({region:"west",layout:this})
			};
			el.bind("_resize",
			        function() {
			            if (o.fit == true) {
			            	self.layout();
			            }
			            return false;
			        });
		
			$(window).resize(function(){
				self.layout();
			});
		},
		_init:function(){
			this.layout();
		},
		layout:function(){
			var opts = this.options;
			if (opts.fit == true){
				var p = this.element.parent();
				this.element.width(p.width()).height(p.height());
			}
			
			var w = this.element.width(), h = this.element.height();
        	var centerW = w, centerH = h, centerY = 0, centerX = 0;
        	var $n = this.regions.north, $s = this.regions.south, $w = this.regions.west, $e = this.regions.east, $c = this.regions.center;

        	//北		
			if ($n.length) {
				var b = $n.layoutRegion("getSize");
				var m = $n.layoutRegion("getMargins");
				b.width = w - (m.left+m.right);
	            b.left = m.left;
	            b.top = m.top;
	            centerY = b.height + m.top + m.bottom;
	            centerH -= centerY;
				$n.layoutRegion("setSize",b);
			}		
			//南	
			if ($s.length) {
				var b = $s.layoutRegion("getSize");
				var m = $s.layoutRegion("getMargins");
	            b.width = w - (m.left+m.right);
	            b.left = m.left;
	            var totalHeight = (b.height + m.top + m.bottom);
	            b.top = h - totalHeight + m.top;
	            centerH -= totalHeight;
            	$s.layoutRegion("setSize",b);		
			}
			//西
			if ($w.length) {
				var b = $w.layoutRegion("getSize");
				var m = $w.layoutRegion("getMargins");
	            b.height = centerH - (m.top+m.bottom);
	            b.left = m.left;
	            b.top = centerY + m.top;
	            var totalWidth = (b.width + m.left + m.right);
	            centerX += totalWidth;
	            centerW -= totalWidth;
	            $w.layoutRegion("setSize",b); 
			}		
			//东
			if ($e.length) {
				var b = $e.layoutRegion("getSize");
				var m = $e.layoutRegion("getMargins");
		        b.height = centerH - (m.top+m.bottom);
	            var totalWidth = (b.width + m.left + m.right);
	            b.left = w - totalWidth + m.left;
	            b.top = centerY + m.top;
	            centerW -= totalWidth;
	            $e.layoutRegion("setSize",b);		
			}
			//中
			if ($c.length) {
	            var m = $c.layoutRegion("getMargins");
		        var centerBox = {
		            left: centerX + m.left,
		            top: centerY + m.top,
		            width: centerW - (m.left+m.right),
		            height: centerH - (m.top+m.bottom)
		        };
		       $c.layoutRegion("setSize",centerBox);		
			}
		}
	});	
})(jQuery);