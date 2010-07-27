(function($) {
	$.widget("oz.tree",{
		options:{
			url: null,
			animate: false,
			checkbox: false
		},
		_render:function(){
			var tree = this.element;
			tree.addClass('tree');
			
			this.children = [];
			
			initData(this.children, tree);
			
			function initData(d, tree){
				tree.find(">li").each(function() {
					var node = $(this);
					var item = 	$.extend({},$.metadata && $.metadata.get( this ,{type:"node",name:"node"}));
					item.text = node.find(">span").html();
					if (!item.text) {
						item.text = node.html();
					}
					item.checked = item.checked == "true";
					item.state = item.state || "open";
					var subTree = node.find(">ul");
					if (subTree.length) {
						item.children = [];
						initData(item.children, subTree);
					}
					d.push(item);
				});
			}
			this._renderChildren(this.element,this.children);
		},
		_init:function(){
			var opts = this.options;
			if (opts.data){
				
			}
			this._initTreeEvents();
			if (opts.url){
				this.request(this.element, {id:"-1"});
			}
		},
		_renderChildren:function(node,children){
			if (this.element == node) {
				node.empty();
			}
			var opts = this.options;
			function appendNodes(ul, children, depth){
				for(var i=0; i<children.length; i++){
					var li = $('<li></li>').appendTo(ul);
					var item = children[i];
					if (item.state != 'closed'){
						item.state = 'open';
					}
					//放标题
					var node = $('<div class="tree-node"></div>').appendTo(li);
					node.attr('node-id', item.id);
					
					
					$('<span class="tree-title"></span>').html(item.text).appendTo(node);
					if (opts.checkbox){
						if (item.checked){
							$('<span class="tree-checkbox tree-checkbox1"></span>').prependTo(node);
						} else {
							$('<span class="tree-checkbox tree-checkbox0"></span>').prependTo(node);
						}
					}
					if (item.children){
						var subul = $('<ul></ul>').appendTo(li);
						if (item.state == 'open'){
							$('<span class="tree-folder tree-folder-open"></span>').addClass(item.iconCls).prependTo(node);
							$('<span class="tree-hit tree-expanded"></span>').prependTo(node);
						} else {
							$('<span class="tree-folder"></span>').addClass(item.iconCls).prependTo(node);
							$('<span class="tree-hit tree-collapsed"></span>').prependTo(node);
							subul.css('display','none');
						}
						appendNodes(subul, item.children, depth+1);
					} else {
						if (item.state == 'closed'){
							$('<span class="tree-folder"></span>').addClass(item.iconCls).prependTo(node);
							$('<span class="tree-hit tree-collapsed"></span>').prependTo(node);
						} else {
							$('<span class="tree-file"></span>').addClass(item.iconCls).prependTo(node);
							$('<span class="tree-indent"></span>').prependTo(node);
						}
					}
					for(var j=0; j<depth; j++){
						$('<span class="tree-indent"></span>').prependTo(node);
					}
					item.rendered = true;
					$.data(node[0], 'tree-node', item);
				}
			}
			//获取深度
			var depth = $(node).prev().find('>span.tree-indent,>span.tree-hit').length;
			appendNodes(node, children, depth);
			
		},
		_initTreeEvents:function(){
			var opts = this.options;
			var tree = this.element;
			var self = this;
			$('.tree-node', tree).live('dblclick.tree', function(){
				$('.tree-node-selected', tree).removeClass('tree-node-selected');
				$(this).addClass('tree-node-selected');
				
				if (opts.onDblClick){
					var target = this;	// the target HTML DIV element
					var data = $.data(this, 'tree-node');
					opts.onDblClick.call(this, $.extend({},data,{target: target}));
				}
			}).live('click.tree', function(){
				$('.tree-node-selected', tree).removeClass('tree-node-selected');
				$(this).addClass('tree-node-selected');
				
				if (opts.onClick){
					var target = this;	// the target HTML DIV element
					var data = $.data(this, 'tree-node');
					opts.onClick.call(this, $.extend({},data,{target: target}));
				}
//				return false;
			}).live('mouseenter.tree', function(){
				$(this).addClass('tree-node-hover');
				return false;
			}).live('mouseleave.tree', function(){
				$(this).removeClass('tree-node-hover');
				return false;
			});
			
			$('.tree-hit', tree).live('click.tree', function(){
				var node = $(this).parent();
				self.toggleNode(node);
				return false;
			}).live('mouseenter.tree', function(){
				if ($(this).hasClass('tree-expanded')){
					$(this).addClass('tree-expanded-hover');
				} else {
					$(this).addClass('tree-collapsed-hover');
				}
			}).live('mouseleave.tree', function(){
				if ($(this).hasClass('tree-expanded')){
					$(this).removeClass('tree-expanded-hover');
				} else {
					$(this).removeClass('tree-collapsed-hover');
				}
			});
			
			$('.tree-checkbox', tree).live('click.tree', function(){
				if ($(this).hasClass('tree-checkbox0')){
					$(this).removeClass('tree-checkbox0').addClass('tree-checkbox1');
				} else if ($(this).hasClass('tree-checkbox1')){
					$(this).removeClass('tree-checkbox1').addClass('tree-checkbox0');
				} else if ($(this).hasClass('tree-checkbox2')){
					$(this).removeClass('tree-checkbox2').addClass('tree-checkbox1');
				}
				setParentCheckbox($(this).parent());
				setChildCheckbox($(this).parent());
				return false;
			});
			
			var self = this;
			function setChildCheckbox(node){
				var childck = node.next().find('.tree-checkbox');
				childck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2')
				if (node.find('.tree-checkbox').hasClass('tree-checkbox1')){
					childck.addClass('tree-checkbox1');
				} else {
					childck.addClass('tree-checkbox0');
				}
			}
			
			function setParentCheckbox(node){
				var pnode = self.getParentNode(self.element, node[0]);
				if (pnode){
					var ck = $(pnode.target).find('.tree-checkbox');
					ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
					if (isAllSelected(node)){
						ck.addClass('tree-checkbox1');
					} else if (isAllNull(node)){
						ck.addClass('tree-checkbox0');
					} else {
						ck.addClass('tree-checkbox2');
					}
					setParentCheckbox($(pnode.target));
				}
				
				function isAllSelected(n){
					var ck = n.find('.tree-checkbox');
					if (ck.hasClass('tree-checkbox0') || ck.hasClass('tree-checkbox2')) return false;
					var b = true;
					n.parent().siblings().each(function(){
						if (!$(this).find('.tree-checkbox').hasClass('tree-checkbox1')){
							b = false;
						}
					});
					return b;
				}
				function isAllNull(n){
					var ck = n.find('.tree-checkbox');
					if (ck.hasClass('tree-checkbox1') || ck.hasClass('tree-checkbox2')) return false;
					var b = true;
					n.parent().siblings().each(function(){
						if (!$(this).find('.tree-checkbox').hasClass('tree-checkbox0')){
							b = false;
						}
					});
					return b;
				}
			}
		},
		toggleNode :function( node){
			var hit = $('>span.tree-hit', node);
			if (hit.length == 0) return;	// is a leaf node
			
			if (hit.hasClass('tree-expanded')){
				this.collapse(node);
			} else {
				this.expand(node);
			}
		},
		expand : function (node){
			var opts = this.options;
			
			var hit = $('>span.tree-hit', node);
			if (hit.length == 0) return;	// is a leaf node
			
			if (hit.hasClass('tree-collapsed')){
				hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
				hit.next().addClass('tree-folder-open');
				var ul = $(node).next();
				if (ul.length){
					if (opts.animate){
						ul.slideDown();
					} else {
						ul.css('display','block');
					}
				} else {
					var id = $.data($(node)[0], 'tree-node').id;
					var subul = $('<ul></ul>').insertAfter(node);
					this.request(subul, {id:id});	// request children nodes data
				}
			}
		},
		collapse : function (node){
			var opts = this.options;
			
			var hit = $('>span.tree-hit', node);
			if (hit.length == 0) return;	// is a leaf node
			
			if (hit.hasClass('tree-expanded')){
				hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
				hit.next().removeClass('tree-folder-open');
				if (opts.animate){
					$(node).next().slideUp();
				} else {
					$(node).next().css('display','none');
				}
			}
		},
		request:function(ul,param){
			var opts = this.options;
			if (!opts.url) return;
			var self = this;
			param = param || {};
			
			var folder = $(ul).prev().find('>span.tree-folder');
			folder.addClass('tree-loading');
			$.ajax({
				type: 'post',
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					folder.removeClass('tree-loading');
					self._renderChildren(ul, data);
					if (opts.onLoadSuccess){
						opts.onLoadSuccess.apply(this, arguments);
					}
				},
				error: function(){
					folder.removeClass('tree-loading');
					if (opts.onLoadError){
						opts.onLoadError.apply(this, arguments);
					}
				}
			});
		},
		isLeaf:function(param){
			var node = $(param);
			var hit = $('>span.tree-hit', node);
			return hit.length == 0;
		},
		selectNode:function(param){
			$('div.tree-node-selected', this.element).removeClass('tree-node-selected');
			$(param).addClass('tree-node-selected');
		}
	});
	
	$.oz.tree.implement({
		reload:function(){
			$(this.element).empty();
			this.request(this.element, {id:-1});
		},
		getParent :function (param){
			var node = $(param).parent().parent().prev();
			if (node.length){
				return $.extend({}, $.data(node[0], 'tree-node'), {
					target: node[0],
					checked: node.find('.tree-checkbox').hasClass('tree-checkbox1')
				});
			} else {
				return null;
			}
		},
		getChecked :function (){
			var nodes = [];
			this.element.find('.tree-checkbox1').each(function(){
				var node = $(this).parent();
				nodes.push($.extend({}, $.data(node[0], 'tree-node'), {
					target: node[0],
					checked: node.find('.tree-checkbox').hasClass('tree-checkbox1')
				}));
			});
			return nodes;
		},
		getSelected :function (){
			var node = this.element.find('div.tree-node-selected');
			if (node.length){
				return $.extend({}, $.data(node[0], 'tree-node'), {
					target: node[0],
					checked: node.find('.tree-checkbox').hasClass('tree-checkbox1')
				});
			} else {
				return null;
			}
		},
		getRoots:function(){
			var nodes = [];
			$(this.element).find(">li").each(function() {
				var node = $(this).find(">div.tree-node");
				nodes.push($.extend( {}, $.data(node[0], "tree-node"), {
					target : node[0],
					checked : node.find(".tree-checkbox").hasClass("tree-checkbox1")
				}));
			});
			return nodes;
		},
		getChildren:function(node){
			var children = [];
			if (node) {
				findChildren($(node));
			} else {
				var roots = this.getRoots();
				for ( var i = 0; i < roots.length; i++) {
					children.push(roots[i]);
					findChildren($(roots[i].target));
				}
			}
			function findChildren(node) {
				node.next().find("div.tree-node").each(
						function() {
							children.push($.extend( {}, $.data(this, "tree-node"), {
								target : this,
								checked : $(this).find(".tree-checkbox").hasClass(
										"tree-checkbox1")
							}));
						});
			}
			;
			return children;
		},
		collapseAll:function(){
			var nodes = this.getRoots();
			var self = this;
			$.each(nodes,function(){
				self.collapse(this.target);
				var children = self.getChildren(this.target);
				$.each(children,function(){
					self.collapse(this.target);
				})
			})
		},
		expandAll:function(){
			var nodes = this.getRoots();
			var self = this;
			$.each(nodes,function(){
				self.expand(this.target);
				var children = self.getChildren(this.target);
				$.each(children,function(){
					self.expand(this.target);
				})
			})
		},
		append : function (param){
			var node = $(param.parent);
			var ul = node.next();
			if (ul.length == 0){
				ul = $('<ul></ul>').insertAfter(node);
			}
			if (param.data && param.data.length){
				var nodeIcon = node.find('span.tree-file');
				if (nodeIcon.length){
					nodeIcon.removeClass('tree-file').addClass('tree-folder');
					var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
					if (hit.prev().length){
						hit.prev().remove();
					}
				}
			}
			this._renderChildren(ul, param.data);
		},
		remove :function (param){
			var node = $(param);
			var li = node.parent();
			var ul = li.parent();
			li.remove();
			if (ul.find('li').length == 0){
				var node = ul.prev();
				node.find('.tree-folder').removeClass('tree-folder').addClass('tree-file');
				node.find('.tree-hit').remove();
				$('<span class="tree-indent"></span>').prependTo(node);
				if (ul[0] != target){
					ul.remove();
				}
			}
		},
		update:function (options) {
			var node = $(options.target);
			var data = $.data(options.target, "tree-node");
			if (data.iconCls) {
				node.find(".tree-icon").removeClass(data.iconCls);
			}
			$.extend(data, options);
			$.data(options.target, "tree-node", data);
			node.attr("node-id", data.id);
			node.find(".tree-title").html(data.text);
			if (data.iconCls) {
				node.find(".tree-icon").addClass(data.iconCls);
			}
			var ck = node.find(".tree-checkbox");
			ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
			if (data.checked) {
				ck.addClass("tree-checkbox1");
			} else {
				ck.addClass("tree-checkbox0");
			}
		}
	})
	
})(jQuery);
