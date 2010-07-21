jQuery(function($){
	var tb01 = new OZ.TB({
		id: 'tbContainer01',
	    buttons: ["|",
		    {text: '返回', iconCls: 'oz-icon-back', handler: function(){
	    		ozlog.info("点击返回按钮！");
		    }},
		    {text: '保存', iconCls: 'oz-icon-save', handler: function(){
		    	ozlog.info("点击保存按钮！");
		    }},
		    {text: '刷新', iconCls: 'oz-icon-refresh', handler: function(){
		    	ozlog.info("点击刷新按钮！");
		    }},
		    {type:'search',onSearch:function(value){
		    		ozlog.info("onSearch:value="+value);
		    	}
		    }
	    ]
	});
	var tb02 = new OZ.TB({
		id: 'tbContainer02',
	    buttons: ["|",
		    {text: '返回', handler: function(){
	    	ozlog.info("点击返回按钮！");
		    }},
		    {text: '保存', handler: function(){
		    	ozlog.info("点击保存按钮！");
		    }},
		    {text: '刷新', handler: function(){
		    	ozlog.info("点击刷新按钮！");
		    }},
		    {type:'search',value:"办公室",btns:"search,advance,clean",
		    	onSearch:function(value){
		    		ozlog.info("onSearch:value="+value);
		    	},
		    	onAdvance:function(value){
		    		ozlog.info("onAdvance:value="+value);
		    	},
		    	onClean:function(value){
		    		ozlog.info("onClean:value="+value);
		    	}
		    }
	    ]
	});
	var tb03 = new OZ.TB({
		id: 'tbContainer03',
	    buttons: ["|",
		    {text: '返回', handler: function(){
		    	alert('点击返回按钮！');
		    }},
		    {text: '保存', handler: function(){
		    	alert('点击保存按钮！');
		    }},"|",
		    {type:'search',location:"inner",value:"办公室",btns:"search,advance,clean",
		    	onEnter:function(value){
		    		ozlog.debug("onEnter:value="+value);
		    	},
		    	onSearch:function(value){
		    		ozlog.debug("onSearch:value="+value);
		    	},
		    	onAdvance:function(value){
		    		ozlog.debug("onAdvance:value="+value);
		    	},
		    	onClean:function(value){
		    		ozlog.debug("onClean:value="+value);
		    	}
		    },"|",
		    {text: '刷新', handler: function(){
		    	ozlog.info("点击刷新按钮！");
		    }}
	    ]
	});
});