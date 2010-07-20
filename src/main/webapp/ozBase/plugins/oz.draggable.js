(function($) {
	$.widget("oz.mouse",{
		options:{
			proxy:null,
			cancel: null,
			distance: 1,
			delay: 0
		},
		_create: function() {
			if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
				this.element[0].style.position = 'relative';
			(this.options.addClasses && this.element.addClass("oz-draggable"));
			(this.options.disabled && this.element.addClass("oz-draggable-disabled"));

			this._mouseInit();

		},
		_mouseInit: function() {
			var self = this;	
			this.element.bind('mousedown', function(e) {
				return self._mouseDown(e);
			});
			if ($.browser.msie) {
				this._mouseUnselectable = this.el.attr('unselectable');
				this.element.attr('unselectable', 'on');
			}
			this.started = false;
		},
		destroy: function() {
			if(!this.element.data('draggable')) return;
			this.element
				.removeData("draggable")
				.unbind(".draggable")
				.removeClass("ui-draggable"
					+ " ui-draggable-dragging"
					+ " ui-draggable-disabled");
			this._mouseDestroy();
			return this;
		},
		_mouseDestroy: function() {
			this.element.unbind();
			($.browser.msie
				&& this.element.attr('unselectable', this._mouseUnselectable));
		},
		_mouseDown: function(e) {
			(this._mouseStarted && this._mouseUp(e));		
			this._mouseDownEvent = e;		
			var self = this,
				btnIsLeft = (e.which == 1),
				elIsCancel = (typeof this.cancel == "string" ? $(e.target).parents().add(e.target).filter(this.cancel).length : false);
			if (!btnIsLeft || elIsCancel || !this._trigger('mouseCapture',e)) {
				return true;
			}
			this.mouseDelayMet = !this.delay;
			if (!this.mouseDelayMet) {
				this._mouseDelayTimer = setTimeout(function() {
					self.mouseDelayMet = true;
				}, this.delay);
			}
			if (this._mouseDistanceMet(e) && this._mouseDelayMet(e)) {
				this._mouseStarted = (this._trigger('mouseStart', e) !== false);
				if (!this._mouseStarted) {
					e.preventDefault();
					return true;
				}
			}		
			this._mouseMoveDelegate = function(e) {
				return self._mouseMove(e);
			};
			this._mouseUpDelegate = function(e) {
				return self._mouseUp(e);
			};
			$(document)
				.bind('mousemove', this._mouseMoveDelegate)
				.bind('mouseup', this._mouseUpDelegate);
			
			return false;
		},	
		_mouseMove: function(e) {
			if ($.browser.msie && !e.button) {
				return this._mouseUp(e);
			}
			if (this._mouseStarted) {
				this._trigger('mouseDrag',e);
				return false;
			}
			if (this._mouseDistanceMet(e) && this._mouseDelayMet(e)) {
				this._mouseStarted =
					(this._trigger('mouseStart', this._mouseDownEvent, e) !== false);
				(this._mouseStarted ? this._trigger('mouseDrag',e) : this._mouseUp(e));
			}
			
			return !this._mouseStarted;
		},	
		_mouseUp: function(e) {
			$(document)
				.unbind('mousemove', this._mouseMoveDelegate)
				.unbind('mouseup', this._mouseUpDelegate);
			
			if (this._mouseStarted) {
				this._mouseStarted = false;
				this._trigger('mouseStop',e)
			}
			
			return false;
		},	
		_mouseDistanceMet: function(e) {
			return (Math.max(
					Math.abs(this._mouseDownEvent.pageX - e.pageX),
					Math.abs(this._mouseDownEvent.pageY - e.pageY)
				) >= this.distance
			);
		},	
		_mouseDelayMet: function(e) {
			return this.mouseDelayMet;
		}
	});
})(jQuery);