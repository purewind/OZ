jQuery(function($){
	var tb01 = new OZ.TB({
		id: 'tbContainer01',
	    buttons: ["|",
		    {text: '新建', disabled: true},
		    {text: '保存', handler: function(){
		    	alert('点击保存按钮！');
		    }},
		    {text: '编辑', handler: function(){
		    	alert('点击编辑按钮！');
		    }},
		    "|",
		    {text: '删除', handler: function(){
		    	alert('点击删除按钮！');
		    }},
		    {text: '搜索', handler: function(){
		    	alert('点击搜索按钮！');
		    }},
		    {text: '刷新', handler: function(){
		    	alert('点击刷新按钮！');
		    	tb01.showButtons(['hiddenBtn']);
		    }},
		    {id:'hiddenBtn',text: '隐藏',hidden:true, handler: function(){
		    	alert('点击隐藏按钮！');
		    	tb01.hideButtons(['hiddenBtn']);
		    }}
	    ],
	    /* left--左对齐、center--居中对齐、right--右对齐 */
		buttonAlign: "left"
	});
	var tb02 = new OZ.TB({
		id: 'tbContainer02',
	    buttons: ["|",
		    {text: '新建', iconCls: 'oz-icon-new', disabled: true},
		    {text: '保存', iconCls: 'oz-icon-save', handler: function(){
		    	alert('点击保存按钮！');
		    }},
		    {text: '编辑', iconCls: 'oz-icon-edit', handler: function(){
		    	alert('点击编辑按钮！');
		    }},
		    "|",
		    {text: '删除', iconCls: 'oz-icon-delete', handler: function(){
		    	alert('点击删除按钮！');
		    }},
		    {text: '搜索', iconCls: 'oz-icon-search', handler: function(){
		    	alert('点击搜索按钮！');
		    }},
		    {text: '刷新', iconCls: 'oz-icon-refresh', handler: function(){
		    	alert('点击刷新按钮！');
		    }}
	    ],
		buttonAlign: "right"
	});
	var tb03 = new OZ.TB({
		id: 'tbContainer03',
	    buttons: ["|",
		    {text: '新建', iconCls: 'oz-icon-new', disabled: true},
		    {text: '保存', iconCls: 'oz-icon-save', handler: function(){
		    	alert('点击保存按钮！');
		    }},
		    {text: '编辑', iconCls: 'oz-icon-edit', handler: function(){
		    	alert('点击编辑按钮！');
		    }},
		    "|",
		    {text: '删除', iconCls: 'oz-icon-delete', handler: function(){
		    	alert('点击删除按钮！');
		    }},
		    {text: '搜索', iconCls: 'oz-icon-search', handler: function(){
		    	alert('点击搜索按钮！');
		    }},
		    {text: '刷新', iconCls: 'oz-icon-refresh', handler: function(){
		    	alert('点击刷新按钮！');
		    }}
	    ],
		buttonAlign: "center"
	});
});