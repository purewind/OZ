jQuery(function($){
	thisPage.init();
});

var thisPage = {
	init: function(){
		//设置grid高度为充满整个屏幕
		$("#page-center").height($("#page").height()-$("#page-top").height()).show();
	
		//窗口大小变动后自动调整grid的
		$(window).resize(function(){
			$("#page-center").height(10);
			$("#page-center").height($("#page").height()-$("#page-top").height());
			$("#grid").datagrid("resize");
		});
		
		thisPage.initTB();
		thisPage.initGrid();
		//$("#page-center").show();
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
			    }},
			    {type:'search',btns:"search,advance,clean",
			    	onSearch:function(value){
		    			ozlog.info("onSearch:value="+value);
			    	},
			    	onAdvance:function(value){
			    		ozlog.info("onAdvance:value="+value);
			    	},
			    	onClean:function(value){
			    		ozlog.info("onClean:value="+value);
		    	}}
		    ]
		});
	},
	initGrid: function(){
		$('#grid').datagrid( {
			url: 'view.json',
			idField: 'id',
			frozenColumns: [[ 
			    {field: 'code',checkbox: true}, 
			    {field: 'subject',title: '标题',width: 150,sortable: true,formatter:function(value){
					return '<a href="#" onclick="window.open(\'\../form/form.htm\',\'_blank\')"><b>'+value+'</b></a>';
				}}
			]],
			columns: [[
			    {field: 'fileDate',title: '发布日期',width: 90,sortable: true},
			    {field: 'content',title: '内容',width: 300}
			]],
			sortName: 'id',
			sortOrder: 'asc',
			fit: true,
			width:500,height:300,
			nowrap: false,
			striped: true,
			remoteSort: false,
			pagination: true,
			rownumbers: true,
			onDblClickRow: function(rowIndex,rowData){
				alert(rowData.subject);
			},
			onLoadSuccess: function(){
				//$("#page-center").show();
			}
		});
	}
};
