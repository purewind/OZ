var dlg1,dlg2,dlg3;
jQuery(function($){
	ozlog.toggle();
});

function fly(){
	OZ.Messager.fly("4秒后将自动向角落飞入消失");
}
function slide(){
	OZ.Messager.slide("4秒后将自动向下滑动消失");
}
function fade(){
	OZ.Messager.fade("4秒后将自动渐渐消失");
}
function fadeAndKeep(){
	OZ.Messager.fade("该信息是渐渐显示出来，不会自动消失了！<br/>aa<br/>aa<br/>aa<br/>aa<br/>aa<br/>aa",0,null,'auto');
}
function alert1(){
	OZ.Messager.alert('在这里显示一般提示信息！');
}
function alert2(){
	OZ.Messager.error('在这里显示错误信息！');
}
function alert3(){
	OZ.Messager.info('在这里显示提示信息！');
}
function alert4(){
	OZ.Messager.question('在这里显示提问信息！');
}
function alert5(){
	OZ.Messager.warn('在这里显示警告信息！<br/>aaa<br/>aaa<br/>aaa<br/>aaa<br/>aaa<br/>aaa');
}
function confirm1(){
	OZ.Messager.confirm('你确认要这样干吗?', 
		function(){
			ozlog.info("你点击了确认按钮");
		},
		function(){
			ozlog.info("你点击了取消按钮");
		}
	);
}
function prompt1(){
	OZ.Messager.prompt('请输入评论内容',
		function(value,oldValue){
			ozlog.info("你点击了确认按钮;<br/>新内容为：" + value+"<br/>原内容为："+oldValue);
		},
		function(){
			ozlog.info("你点击了取消按钮");
		},
		"请点击这里输入"
	);
}
function prompt2(){
	OZ.Messager.prompt('请输入评论内容',
		function(value,oldValue){
			ozlog.info("你点击了确认按钮;<br/>新内容为：" + value+"<br/>原内容为："+oldValue);
		},
		function(){
			ozlog.info("你点击了取消按钮");
		},null,true
	);
}
