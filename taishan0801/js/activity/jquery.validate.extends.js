/**
 * 扩展jquery。validate
 * 
 */

/* 设置默认属性 */
$.validator.setDefaults({
	onfocusout : false,//失去焦点时不验证
	onkeyup : false,//keyup时不验证
	onclick : false,//单击时不验证
	focusInvalid : true,//验证失败时，是否将焦点移到第一个验证失败的元素上
	focusCleanup : false,//获得焦点时，取消提示
	showCount : 1,// 1表示只显示第一个错误
	errorElement : 'span',//html标签 span、em等
	errorPlacement : function(error, element) {
		
		if($(element).attr('data-error-type') && $(element).attr('data-error-type').indexOf('function:')==0){
			var func = $(element).attr('data-error-type').substring('function:'.length);
			func = eval(func);
			if(func) func($(error).html());
			$(error).hide();
			return;
		}
		
		$(error).hide();
		$.activity.settings.showErrorMsg(error.html());
	},
	highlight : function (element, errorClass, validClass){
		
	},
	unhighlight : function (element, errorClass, validClass){
		
	},
	afterHideErrors : function(errors){
		$(errors).hide();
	}
});



//手机号码验证
jQuery.validator.addMethod("mobile", function(value, element) {
	var mobile = /^0?1([3-9])\d{9}$/;
	if(!value||value==""){
		return false;
	}
	return this.optional(element) || (mobile.test(value));
}, "请正确填写您的手机号码"); 
