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
$.widget("oz.splitbar",$.oz.mouse,{
	_render:function(){
		var self = this, o = this.options;
		this.target = o.target;
		this.orientation = o.orientation;
		this.placement = o.placement;
		this.width = o.width||5;
		this.maxSize = o.maxSize||500;
		this.minSize = o.minSize||10;
		
		this.element.addClass("layout-split layout-split-"+o.region).disableSelection();
				
		//设置方向样式
		if(this.orientation == POS.HORIZONTAL){
	        this.element.addClass("layout-split-h");
	    }else{
	        this.element.addClass("layout-split-v");
	    }
		//创建代理
 		var cls = 'layout-split-proxy' ;
 		this.proxy = $("<div/>").insertBefore(this.element)
 		.addClass(cls + " " +(o.orientation == POS.HORIZONTAL ? cls +'-h' : cls + '-v'))
 		.disableSelection().css({visibility:"hidden",display: "none"});
 		this._mouseInit();
	},
	_mouseStart: function(event) {
		var  o = this.options;
		//显示代理
		this.proxy.css(this.element.position()).css({visibility:"visible",display: "block"})
		.width(this.element.width()).height(this.element.height());
		//显示遮罩
		this.mark = $("<div></div>").addClass("layout-mask oz-drag-overlay").insertAfter(this.element).disableSelection()
		.css({visibility:"visible",display: "block",width:$(window).width(),height: $(window).height()})
		.show();
		//记录其实位置
		this.originalMousePosition = {x: event.pageX, y: event.pageY};
		this.proxyPosition = this.proxy.position();
		if(o.orientation == POS.HORIZONTAL){
			this.oldSize = o.target.element.width();
		}else{
			this.oldSize = o.target.element.height();
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
			this.target.resize({layout:true});
		}else{
			this.target.options.height = this.target.options.height+this.size;
			this.target.resize({layout:true});
		}
		this.setPosition();
		this.proxy.css({visibility:"hidden",display: "none"});
		if(this.mark){this.mark.remove();}
	},
	setPosition:function(){
		var o = this.target.options;
		var h = o.height,w = o.width,l = o.left||0,t = o.top||0;
		if(this.orientation == POS.HORIZONTAL){
			if(this.placement == POS.LEFT){
				this.element.css({width:this.width,height:h,top:t,left:l+w});
			}else{
				this.element.css({width:this.width,height:h,top:t,left:l-this.width});
			} 				
		}else{
			if(this.placement == POS.TOP){
				this.element.css({width:w,height:this.width,top:t+h,left:l});
			}else{
				this.element.css({width:w,height:this.width,top:t-this.width,left:l});
			} 				
		} 
	},
	disable:function(){
		if(this.options.disabled == true){
			return;
		}
		this._mouseDestroy();
		this.base();
	},
	enable:function(){
		if(this.options.disabled != true){
			return;
		}
		this._mouseInit();
		this.base();
	}
});
$.widget("oz.splitbar2",$.oz.splitbar,{
	_mapping:{
	 	north :"south",
		south : "north",
		east : "west",
		west : "east"
	},
	_render:function(){
		this.base();
		var o = this.options;
		this.collEl = $("<div/>").appendTo(this.element).addClass("oz-layout-mini oz-layout-mini-"+o.region).html("&#160;");
        this.collEl.hoverClass('oz-layout-mini-over');
        this.collEl.bind("click",{obj:this},this._onClick);       
	},
	_onClick:function(e){
		var obj = e.data.obj;
		obj.collEl.swapClass("oz-layout-mini-"+obj.options.region,"oz-layout-mini-"+obj._mapping[obj.options.region]);
		if(obj.isCollapsed == true){
			obj.isCollapsed = false;
			obj.target.expand();
			obj.enable();
		}else{
			obj.isCollapsed = true;
			obj.target.collapse();
			obj.disable();
		}
	}
});
$.widget("oz.layoutRegion",$.oz.panel,{
	options:{
		margins:"0 0 0 0",
		cmargins:"0 0 0 0",
		maxSize:500,
		minSize:30,
		split:false,
		collapsible:false
	},
	_render: function() {
		var self = this, o = this.options;
		o.fit = false;
		var c= o.collapsible;
		o.collapsible = false;
		this.base();
		o.collapsible = c;
		this.margins = parseMargins(o.margins);
		this.cmargins = parseMargins(o.cmargins);
		this.panel.addClass("oz-layout-region");
		this.layout = o.layout;
		
		if(o.split == true){
			this.splitbar = $('<div></div>');
			var splitType = o.collapsible == true?"splitbar2":"splitbar";
			this.splitbar.insertAfter(this.panel)[splitType]($.extend(this._splitSettings[o.region],
					{maxSize:o.maxSize,minSize:o.minSize,region:o.region,target:this}));
			this.element.bind("resize",function(){
				if(self.options.split == true){
					self.splitbar[splitType]("setPosition");
				}
			})
		}
		
	},
	resize:function(args){
		this.base(args);
		if(args && args.layout == true){
			this.layout.layout("layout");
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
    },
    collapse:function (){
		var o = this.options;
		o.original = {
				width: o.width,
				height: o.height
			};
		if(this._splitSettings[o.region].orientation == POS.HORIZONTAL){
			o.width = 0;
		}else{
			o.height = 0;
		}
		this.panel.css("visibility","hidden");
		this.resize({layout:true});
		o.collapsed = true;
		this._trigger("collapse");
	},		
	expand:function (){
		var o = this.options;
		var original = o.original;
		o.width = original.width;
		o.height = original.height;
		this.panel.css("visibility","visible");
		this.resize({layout:true});
		o.collapsed = false;
		this._trigger("expand");
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
                border: "none"
            });
        }
        el.addClass("oz-layout oz-layout-body");
        el.css({
        	position:"relative",
	    	overflow:"hidden",
	    	margin:0,
	    	padding:0
        });
		this.regions = {
            center:  $(".oz-layout-center:first",el).layoutRegion({region:"center",layout:this}),
            north : $(".oz-layout-north:first",el).layoutRegion({region:"north",layout:this}),
			south : $(".oz-layout-south:first",el).layoutRegion({region:"south",layout:this}),
			east : $(".oz-layout-east:first",el).layoutRegion({region:"east",layout:this}),
			west : $(".oz-layout-west:first",el).layoutRegion({region:"west",layout:this})
		};
		
		if (el[0].tagName == "BODY") {
			$(window).resize(function(){
				self.layout();
			});
		}else{
			if (o.fit == true) {el.bind("_resize."+this.widgetName,function() {self.layout();return false;});}
		}
	},
	_init:function(){
		this.layout();
	},
	layout:function(){
		var o = this.options;
		if (o.fit == true){
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
			$n.layoutRegion("resize",b);
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
        	$s.layoutRegion("resize",b);		
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
            $w.layoutRegion("resize",b); 
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
            $e.layoutRegion("resize",b);		
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
	       $c.layoutRegion("resize",centerBox);		
		}
		
		this._trigger("layout");
	}
});	

})(jQuery);