(function($) {
	$.oz = $.oz || {};
	if ($.oz.version) {
		return;
	}

	$(function(){
		$.browser.msie && $.browser.version=="6.0" && $("body").addClass("oz-ie");
	})
	
	//实现oz的静态方法
	$.extend($.oz, {
		version: "1.0.0",
		contains: function(a, b) {
			return document.compareDocumentPosition
				? a.compareDocumentPosition(b) & 16
				: a !== b && a.contains(b);
		},

		hasScroll: function(el, a) {
			//If overflow is hidden, the element might have extra content, but the user wants to hide it
			if ($(el).css('overflow') == 'hidden') { return false; }

			var scroll = (a && a == 'left') ? 'scrollLeft' : 'scrollTop',
				has = false;

			if (el[scroll] > 0) { return true; }

			// TODO: determine which cases actually cause this to happen
			// if the element doesn't have the scroll set, see if it's possible to
			// set the scroll
			el[scroll] = 1;
			has = (el[scroll] > 0);
			el[scroll] = 0;
			return has;
		},

		isOverAxis: function(x, reference, size) {
			//Determines when x coordinate is over "b" element axis
			return (x > reference) && (x < (reference + size));
		},

		isOver: function(y, x, top, left, height, width) {
			//Determines when x, y coordinates is over "b" element
			return $.oz.isOverAxis(y, top, height) && $.oz.isOverAxis(x, left, width);
		}
	});

	var _remove = $.fn.remove;
	var _focus = $.fn.focus;

	//扩展JQuery对象的方法
	$.fn.extend({
		remove : function( selector, keepData ) {
			return this.each(function() {
				if ( !keepData ) {
					if ( !selector || $.filter( selector, [ this ] ).length ) {
						$( "*", this ).add( this ).each(function() {
							$( this ).triggerHandler( "remove" );
						});
					}
				}
				return _remove.call( $(this), selector, keepData );
			});
		},
		
		focus: function(delay, fn) {
			return typeof delay === 'number'
				? this.each(function() {
					var elem = this;
					setTimeout(function() {
						$(elem).focus();
						(fn && fn.call(elem));
					}, delay);
				})
				: _focus.apply(this, arguments);
		},
		
		enableSelection: function() {
			return this
				.attr('unselectable', 'off')
				.css('MozUserSelect', '');
		},

		disableSelection: function() {
			return this
				.attr('unselectable', 'on')
				.css('MozUserSelect', 'none');
		},

		scrollParent: function() {
			var scrollParent;
			if(($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
				scrollParent = this.parents().filter(function() {
					return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
				}).eq(0);
			} else {
				scrollParent = this.parents().filter(function() {
					return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
				}).eq(0);
			}

			return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
		},

		zIndex: function(zIndex) {
			if (zIndex !== undefined) {
				return this.css('zIndex', zIndex);
			}
			
			if (this.length) {
				var elem = $(this[0]), position, value;
				while (elem.length && elem[0] !== document) {
					// Ignore z-index if position is set to a value where z-index is ignored by the browser
					// This makes behavior of this function consistent across browsers
					// WebKit always returns auto if the element is positioned
					position = elem.css('position');
					if (position == 'absolute' || position == 'relative' || position == 'fixed')
					{
						// IE returns 0 when zIndex is not specified
						// other browsers return a string
						// we ignore the case of nested elements with an explicit value of 0
						// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
						value = parseInt(elem.css('zIndex'));
						if (!isNaN(value) && value != 0) {
							return value;
						}
					}
					elem = elem.parent();
				}
			}

			return 0;
		},
		hoverClass: function(className) {
			className = className || "hover";
			return this.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},
		swapClass: function(c1, c2) {
			var c1Elements = this.filter('.' + c1);
			this.filter('.' + c2).removeClass(c2).addClass(c1);
			c1Elements.removeClass(c1).addClass(c2);
			return this;
		},
		offsetsTo:function(el){
			var o = this.position();
	        var e = el.position();
	        return [o.left-e.left,o.top-e.top];
		}
	});

	//添加额外的JQuery选择器
	$.extend($.expr[':'], {
		data: function(elem, i, match) {
			return !!$.data(elem, match[3]);
		},
		focusable: function(element) {
			var nodeName = element.nodeName.toLowerCase(),
				tabIndex = $.attr(element, 'tabindex');
			return (/input|select|textarea|button|object/.test(nodeName)
				? !element.disabled
				: 'a' == nodeName || 'area' == nodeName
					? element.href || !isNaN(tabIndex)
					: !isNaN(tabIndex))
				// the element and all of its ancestors must be visible
				// the browser may report that the area is hidden
				&& !$(element)['area' == nodeName ? 'parents' : 'closest'](':hidden').length;
		},
		tabbable: function(element) {
			var tabIndex = $.attr(element, 'tabindex');
			return (isNaN(tabIndex) || tabIndex >= 0) && $(element).is(':focusable');
		}
	});
	
	
	//实现继承的核心
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\bbase\b/ : /.*/;
	var Class = function() {};// 空函数
	Class.extend = function(_instance, _static) {
		var extend = Class.prototype.extend;
		//创建属性(prototype)
		initializing = true;
		var proto = new this;
		extend.call(proto, _instance);
		initializing = false;
		//封装构造函数(constructor) ,当没有构造函数时,使其可以使用父类的构造函数
		var _constructor = proto.constructor;
		var klass = proto.constructor = function() {
			if (!initializing) {
				if (this._constructing || this.constructor == klass) { // instantiation
					this._constructing = true;
					_constructor.apply(this, arguments);
					delete this._constructing;
				} else if (arguments[0] != null) { // casting
					return (arguments[0].extend || extend).call(arguments[0], proto);
				}
			}
		};
		// 创建接口(interface)
		klass.ancestor = this;
		klass.extend = this.extend;
		klass.implement = this.implement;
		klass.prototype = proto;
		klass.toString = this.toString;
		klass.valueOf = function(type) {
			return (type == "object") ? klass : _constructor.valueOf();
		};
		extend.call(klass, _static);//静态方法
		// 初始化
		if (typeof klass.init == "function") klass.init();
		return klass;
	};
	Class.prototype = {	
		extend: function(source, value) {
			if (arguments.length > 1) { // extending with a name/value pair
				var ancestor = this[source];
				if (ancestor && (typeof value == "function") && // overriding a method?
					//比较valueOf()避开死循环
					(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
					fnTest.test(value)) {
					// get the underlying method
					var method = value.valueOf();
					//复写函数,使函数可以使用base来调用父类的属性(可以是函数也可以是属性)
					value = function() {
						var previous = this.base || Class.prototype.base;
						this.base = ancestor;
						var returnValue = method.apply(this, arguments);
						this.base = previous;
						return returnValue;
					};
					// point to the underlying method
					value.valueOf = function(type) {
						return (type == "object") ? value : method;
					};
					value.toString = Class.toString;
				}
				if(source == "options"){
					this[source] = $.extend(true,{},this[source],value);
				}else{
					this[source] = value;
				}
			} else if (source) { // extending with an object literal
				var extend = Class.prototype.extend;
				// if this object has a customised extend method then use it
				if (!initializing && typeof this != "function") {
					extend = this.extend || extend;
				}
				var proto = {toSource: null};
				// do the "toString" and other methods manually
				var hidden = ["constructor", "toString", "valueOf"];
					// if we are prototyping then include the constructor
				var i = initializing ? 0 : 1;
				while (key = hidden[i++]) {
					if (source[key] != proto[key]) {
						extend.call(this, key, source[key]);
					}
				}
				// copy each of the source object's properties to this object
				for (var key in source) {
					if (!proto[key]) extend.call(this, key, source[key]);
				}
			}
			return this;
		},
		base: function() {
			// call this method from any other method to invoke that method's ancestor
		}
	};
	
	// 初始化基类
	Class = Class.extend({
		constructor: function() {
			this.extend(arguments[0]);
		}
	}, {
		ancestor: Object,
		version: "1.0",
		/**扩展*/
		implement: function() {
			for (var i = 0; i < arguments.length; i++) {
				if (typeof arguments[i] == "function") {
					// if it's a function, call it
					arguments[i](this.prototype);
				} else {
					// add the interface using the extend method
					this.prototype.extend(arguments[i]);
				}
			}
			return this;
		},
		toString: function() {
			return String(this.valueOf());
		}
	});
	
	
	//插件的核心
	$.widget = function( name, base, prototype ) {
		var namespace = name.split( "." )[ 0 ],
			fullName;
		name = name.split( "." )[ 1 ];
		fullName = namespace + "-" + name;

		if ( !prototype ) {
			prototype = base;
			base = $.Widget;
		}

		// 添加该插件的选择器，eg：$("div:oz-layout");
		$.expr[ ":" ][ fullName ] = function( elem ) {
			return !!$.data( elem, name );
		};
		//建立空间对象
		$[ namespace ] = $[ namespace ] || {};

		//创建空间中的插件
		$[ namespace ][ name ] = base.extend(
				$.extend( true,{
					namespace: namespace,
					widgetName: name,
					widgetBaseClass: fullName
				}, prototype 
		));

		$.widget.bridge( name, $[ namespace ][ name ] );
	};

	//构建JQuery的插件的代理方法
	$.widget.bridge = function( name, object ) {
		$.fn[ name ] = function( options ) {
			var isMethodCall = typeof options === "string",
				args = Array.prototype.slice.call( arguments, 1 ),
				returnValue = this;

			// 允许多个对象参数，汇总到一个options中
			options = !isMethodCall && args.length ?
				$.extend.apply( null, [ true, options ].concat(args) ) :
				options;

			// 防止调用内部函数
			if ( isMethodCall && (options.substring( 0, 1 ) === "_" || options === "constructor") ) {
				return returnValue;
			}

			if ( isMethodCall ) {
				this.each(function() {
					var instance = $.data( this, name ),
						methodValue = instance && $.isFunction( instance[options] ) ?
							instance[ options ].apply( instance, args ) :
							instance;
					if ( methodValue !== instance && methodValue !== undefined ) {
						returnValue = methodValue;
						return false;
					}
				});
			} else {
				this.each(function() {
					var instance = $.data( this, name );
					//如果已经创有实例，则再次设置参数来初始化对象。
					//如果没有，则创建具体实例。
					if ( instance ) {
						if ( options ) {
							instance.option( options );
						}
						instance._init();
					} else {
						$.data( this, name, new object( options, this ) );
					}
				});
			}

			return returnValue;
		};
	};
	
	
	//实现插件基类
	$.Widget = Class.extend({
		widgetName: "widget",
		options: {
			disabled: false
		},
		constructor: function(options, element) {
			if ( arguments.length ) {
				// $.widget.bridge 存储了实例，但是通过直接调用的时候，我们还是需要把该对象存储。
				this.element = $( element ).data( this.widgetName, this );
				//options的参数使用了metadata的插件获取class中的{widgetName:{option:1}}信息
				this.options = $.extend( true, {},
					this.options,this._parseStyle(),
					$.metadata && $.metadata.get( element )[ this.widgetName ],
					options );

				var self = this;
				this.element.bind( "remove." + this.widgetName, function() {
					self.destroy();
				});

				this._render();
				this._init();
			}
		},
		_parseStyle:function(){return {};},
		_render: function() {},
		_init: function() {},
		/**
		 * 销毁做的操作，移除对象所有绑定的事件和数据
		 */
		destroy: function() {
			this.element
				.unbind( "." + this.widgetName )
				.removeData( this.widgetName );
			this.widget()
				.unbind( "." + this.widgetName )
				.removeAttr( "aria-disabled" )
				.removeClass(
					this.widgetBaseClass + "-disabled " +
					"ui-state-disabled" );
		},
		/**
		 * 返回对象
		 */
		widget: function() {
			return this.element;
		},
		/**
		 * 设置对象的参数。
		 */
		option: function( key, value ) {
			var options = key,
				self = this;
			//无参数返回所有参数
			if ( arguments.length === 0 ) {
				// don't return a reference to the internal hash
				return $.extend( {}, self.options );
			}
			//字符：没有传值，返回对于值，传值，设置值。
			if  (typeof key === "string" ) {
				if ( value === undefined ) {
					return this.options[ key ];
				}
				options = {};
				options[ key ] = value;
			}
			//对象：设置属性到选项中。
			$.each( options, function( key, value ) {
				self._setOption( key, value );
			});

			return self;
		},
		_setOption: function( key, value ) {
			this.options[ key ] = value;

			if ( key === "disabled" ) {
				this.widget()
					[ value ? "addClass" : "removeClass"](
						this.widgetBaseClass + "-disabled" + " " +
						"oz-state-disabled" )
					.attr( "aria-disabled", value );
			}

			return this;
		},

		enable: function() {
			return this._setOption( "disabled", false );
		},
		disable: function() {
			return this._setOption( "disabled", true );
		},

		_trigger: function( type, event, data ) {
			var callback = this.options[ type ];
			
			event = $.Event( event );
			event.type = type;
			data = data || {};
			// copy original event properties over to the new event
			// this would happen if we could call $.event.fix instead of $.Event
			// but we don't have a way to force an event to be fixed multiple times
			if ( event.originalEvent ) {
				for ( var i = $.event.props.length, prop; i; ) {
					prop = $.event.props[ --i ];
					event[ prop ] = event.originalEvent[ prop ];
				}
			}

			this.element.trigger( event, data );

			return !( $.isFunction(callback) &&
				callback.call( this.element[0], event, data ) === false ||
				event.isDefaultPrevented() );
		},
		toString: function() {
			return String(widgetName+"="+this.valueOf());
		}
	});

})(jQuery);

/** 普通的字符串格式化函数 
 * 例：'<li class="{1}">{0}</li>'.format('test0','test1')
 *     的结果为'<li class="test1">test0</li>'
 */
String.format=function(format){
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};
String.prototype.format=function(){
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};

/** OZ通用工具方法
 * dragon 2010-07-21
 * singleton 
 * 依赖 无
 */
var OZ={
	/** 空函数 */
	emptyFn: function(){}
};

/** 调试控制台的幻象，实际的控制台见oz.log.js */
var ozlog = {
	debugEnable: false,infoEnable:false,warnEnable:	false,profileEnable: false,
	clear:OZ.emptyFn,debug:OZ.emptyFn,info:OZ.emptyFn,warn:OZ.emptyFn,error:OZ.emptyFn,
	profile:OZ.emptyFn,enable:OZ.emptyFn,disabled:OZ.emptyFn,show:OZ.emptyFn
};