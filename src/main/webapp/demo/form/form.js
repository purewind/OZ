jQuery(function($){
	thisPage.init();
});

var thisPage = {
	init: function(){
		//设置form高度为充满整个屏幕
		$("#page-center").height($("#page").height()-$("#page-top").height()).show();
	
		//窗口大小变动后自动调整form高度
		$(window).resize(function(){
			$("#page-center").height(10).height($("#page").height()-$("#page-top"));
		});
		
		thisPage.initTB();
	},
	initTB: function(){
		var tb = new OZ.TB({
			id: 'toolbar',
		    buttons: ["|",
			    {text: '新建', iconCls: 'oz-icon-new', disabled: true},
			    {text: '保存', iconCls: 'oz-icon-save', handler: function(){
			    	ozlog.info("点击保存按钮！");
			    }},
			    {text: '编辑', iconCls: 'oz-icon-edit', handler: function(){
			    	ozlog.info("点击编辑按钮！");
			    }},
			    "|",
			    {text: '删除', iconCls: 'oz-icon-delete', handler: function(){
			    	ozlog.info("点击删除按钮！");
			    }},
			    {text: '搜索', iconCls: 'oz-icon-search', handler: function(){
			    	ozlog.info("点击搜索按钮！");
			    }},
			    {text: '刷新', iconCls: 'oz-icon-refresh', handler: function(){
			    	ozlog.info("点击刷新按钮！");
			    }}
		    ]
		});
	}
};