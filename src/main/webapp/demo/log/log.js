var si,repeat=100,t = 4;
jQuery(function($){
	ozlog.toggle();
    // 添加几条测试日志
	ozlog.debug("hello!I'm logger.");
	ozlog.info("this is an info message");
	ozlog.warn("this is an warn message");
	ozlog.error("this is an error message");
	ozlog.profile("profile test");
	setTimeout('ozlog.profile("profile test")',repeat);
	
	$("#btnDebug").click(function(){
		if(!ozlog.debugEnable)ozlog.enable("debug");
		window.setTimeout('ozlogTest()',500);
	});
	
	$("#btnProfile").click(function(){
		if(!ozlog.profileEnable)ozlog.enable("profile");
		window.setTimeout('ozlogTest_profile()',repeat);
	});
});
var num = 0;
function ozlogTest(){
	if(num < 4){
		num++;
		ozlog.debug("run debug test " + num);
		window.setTimeout('ozlogTest()',repeat);
	}else{
		num = 0;
	}
};
var num1 = 0;
function ozlogTest_profile(){
	if(num1 < 4){
		num1++;
		ozlog.profile("run profile test");
		window.setTimeout('ozlogTest_profile()',repeat);
	}else{
		num1 = 0;
	}
};
