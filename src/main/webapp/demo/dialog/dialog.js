function resize() {
	dlg1.resize( {
		title : 'New Title',
		width : 350,
		modal : true,
		shadow : false,
		closed : false,
		height : 250
	});
	dlg1.open();
}
function create1(){
	dlg1 = new OZ.Dialog({
		id:"d1",width:300,height:200,left:300,top:10,modal:false,
		title:"html对话框",
		html:"html对话框",
		onOk:function(value){
			ozlog.info("click dlg1's ok:value=" + value);
		},onCancel:function(value){
			ozlog.info("click dlg1's cancel");
		}
	});
}
function open1() {
	dlg1.open();
}
function close1(){
	dlg1.close();
}
function destroy1() {
	dlg1.destroy();
}
function create2(){
	dlg2 = new OZ.Dialog({
		id:"d2",width:300,height:200,left:300,top:220,modal:false,
		title:"iframe对话框",
		url:"iframe.htm",
		onOk:function(value){
			ozlog.info("click dlg2's ok:value=" + value);
		}
	});
}
function open2(){
	dlg2.open();
}
function close2(){
	dlg2.close();
}
function destroy2(){
	dlg2.destroy();
}
function create3(){
	dlg3 = new OZ.Dialog({
		id:"d3",width:300,height:200,left:610,top:10,modal:false,
		title:"自定义按钮对话框1",
		url:"iframe.htm",
		buttons:[
		    {text:"提交",fnName:"ozDlgSpecFn",handler:function(value){
		    	ozlog.info("click dlg3's 提交:value=" + value);
		    }},{text:"执行",handler:function(){
		    	ozlog.info("click dlg3's 执行");
		    }}
		]
	});
}
var dlg1,dlg2,dlg3;
jQuery(function($){
	ozlog.toggle();
	create1();
	create2();
	create3();
});