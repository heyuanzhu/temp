/**
 * 修改用户信息
 */

var type , inputValue , campaignId ;

/**
 * 预加载
 */
$(function(){
	if (top.location == location) {
		campaignId = $("#campaignId").val() ;
		type = getParameterByName("t") ;
		inputValue = getParameterByName("v") ;
		hideAllDiv() ;
		showTypeDiv() ;
	}
}) ;

/**
 * 隐藏页面上所有的div
 */
function hideAllDiv(){
	$('input,select').on('focus', function () {
        $('meta[name=viewport]').attr('content', 'width=750,user-scalable=no');
    });
	$("#realNameDiv").hide() ;
	$("#ageDiv").hide() ;
	$("#phoneDiv").hide() ;
}

/**
 * 显示type对应的div
 */
function showTypeDiv(){
	switch (type) {
	case "n":
		$("#realNameDiv").show() ;
		$("#realName").val(decodeURI(inputValue)) ;
		document.title = '修改真实姓名';
		break;
	case "s":
		$("#sexDiv").show() ;
		if( inputValue == 1 || inputValue == 1 ){
			$("#male").attr("checked","checked");
		}
		if( inputValue == 2 || inputValue == 2 ){
			$("#female").attr("checked","checked");
		}
		document.title = '修改性别';
		break;
	case "a":
		$("#ageDiv").show() ;
		$("#age").val(inputValue) ;
		document.title = '修改年龄';
		break;
	case "p":
		$("#phoneDiv").show() ;
		$("#phone").val(inputValue) ;
		document.title = '修改联系方式';
		break;
	default:
		break;
	}
}

/**
 * 保存真实姓名
 */
function saveRealName(){
	var realName = $.trim($("#realName").val()) ;
	
	if( !realName ){
		$('#nameErr').text('请填真实姓名!');
		return ;
	}
	
	if( realName.length > 30 ){
		$('#anameErr').text('真实姓名长度不能超过30!');
		return ;
	}
	
	var url = basePath + "/tsBeer/updateBaseInfo.do" ;
	var data = {
		"campaignId" : campaignId ,
		"registerName" : realName	
	} ;
	
	saveAjax(url , data) ;
}

/**
 * 保存年龄
 */
function saveAge(){
	var age = $.trim($("#age").val()) ;
	
	if( !age ){
		$('#ageErr').text('请填写年龄!');
		return ;
	}
	
	var re = /^[0-9]*[1-9][0-9]*$/ ;
	
	if( !re.test(age) ){
		$('#ageErr').text('年龄为大于0的正整数!');
		return ;
	}
	
	if( age > 300 ){
		$('#ageErr').text('请规范填写年龄!');
		return ;
	}
	
	var url = basePath + "/tsBeer/updateBaseInfo.do" ;
	var data = {
		"campaignId" : campaignId ,
		"age" : age	
	} ;
	
	saveAjax(url , data) ;
}

/**
 * 保存联系方式
 */
function savePhone(){
	var phone = $.trim($("#phone").val()) ;
	var PhoneReg = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])[0-9]{8}$/ ; //手机正则
	
	if( !phone ){
		$('#phoneErr').text('请填写手机号码!');
		return ;
	}
	
	if( !PhoneReg.test(phone) ){
		$('#phoneErr').text('请填写正确的手机号码!');
		return;
	}
	
	var url = basePath + "/tsBeer/updateBaseInfo.do" ;
	var data = {
		"campaignId" : campaignId ,
		"contactWay" : phone	
	} ;
	
	saveAjax(url , data) ;
}

/**
 * 保存的ajax请求
 * @param url
 * @param data
 */
function saveAjax(url , data){
	$.ajax({
		url: url , 
		data: data ,
		type : 'post' ,
//		beforeSend : function() {
//			vlstatInitLE(this.url, this.data);
//		},
		success : function(result){
			var info = eval('(' + result + ')') ;
			
			if( info.flag ){
				window.name = "refresh" ; // 回退后页面刷新一次 , 其它时候加载页面不刷新
				history.back(-1) ; //回退到上一页
			}else if( info.msg == "noLogin" ){
				alert("未登录, 请先登录后再操作") ;
				window.location.href = "login.html?time=" + new Date().getTime() ;  
			}
		}, error : function(error){
			
		}
	});
}