/**
 * 个人中心 - 我的奖品(我的奖品,我的积分共用)
 */


var campaignId , giftId , lotteryRecordId , isUserInfo/** 是否是用户个人信息过来的 */ ;

/**
 * 预加载
 */
$(function(){
	if (top.location == location) {
		campaignId = getParameterByName("c") ;
		giftId = getParameterByName("g") ;
		lotteryRecordId = getParameterByName("l") ;
		isUserInfo = getParameterByName("t") ;
		
		document.title = '物流信息';
		
		//先隐藏
		$("#myLogistics").hide() ;
		$("#editLogistics").hide() ;
		$('input,select').on('focus', function () {
	        $('meta[name=viewport]').attr('content', 'width=750,user-scalable=no');
	    });
		checkUserExtInfo() ;
	}
}) ;


/**
 * 先校验用户是否填写过个人信息
 */
function checkUserExtInfo(){
	
	$.ajax({
		url: basePath + "/standard/checkUserExt.do" , 
		data: { "campaignId" : campaignId } ,
		type : 'post' ,
		success : function(result){
			var info = eval('(' + result + ')') ;
			if( info.flag ){
				getUserExtInfo() ;
			}else{
				if( info.msg == "noLogin" ){
					window.location.href = "login.html?time=" + new Date().getTime() ; 
				}else{
					editLogisticsInfo() ;
				}
			}
		}, error : function(error){
			
		}
	});
}

/**
 * 获取个人信息
 */
function getUserExtInfo(){
	
	$.ajax({
		url: basePath + "/tsBeer/tempSearchRegisterInfo.do" , 
		data: { "campaignId" : campaignId } ,
		type : 'post' ,
		success : function(result){
			var info = eval('(' + result + ')') ;
			if( info.flag && ( info.msg.resultMsg && info.msg.resultMsg.length > 2 ) ){
				var addressInfo = eval('(' + info.msg.resultMsg + ')') ;
				getLogisticsInfo(addressInfo) ;
			}else{
				if( info.msg == "noLogin" ){
					window.location.href = "login.html?time=" + new Date().getTime() ; 
				}else{
					editLogisticsInfo() ;
				}
			}
		}, error : function(error){
			
		}
	});
}

/**
 * 展示个人物流信息
 */
function getLogisticsInfo(info){
	//先隐藏
	$("#myLogistics").show() ;
	$("#editLogistics").hide() ;
	
	//先清空后加入
	$("#myName").empty() ; // 收货人名字
	$("#myPhone").empty() ; // 收货人手机
	$("#myPCC").empty() ; // 省市区拼接
	$("#myAddress").empty() ;// 详细地址
	
	$("#myName").html(info.name) ; // 收货人名字
	$("#myAddress").html(info.address) ;// 详细地址
	$("#myPhone").html(info.phone) ; // 收货人手机
	if( info.province ){//省
		$("#myPCC").append(info.province) ;
		if( info.cities ){//市
			$("#myPCC").append(" " + info.cities) ;
			if( info.county ){//区
				$("#myPCC").append(" " + info.county) ;
				if( info.town ){//镇
					$("#myPCC").append(" " + info.town) ;
				}
			}
		}
	}
	
	//查询是否已发货
	$.ajax({
		url: basePath + "/tsBeer/getLogisticsInfo.do" , 
		data: { "campaignId" : campaignId , "lotteryRecordId" : lotteryRecordId , "giftId" : giftId } ,
		type : 'post' ,
		success : function(result){
			var data = eval('(' + result + ')') ;
			$("#showExpress").empty() ; // 物流公司
			$("#showExpressNo").empty() ; // 物流单号
			
			if( data.flag ){
				$("#showSend").show() ;
				//补充值
				$("#showExpress").html(data.msg.express) ; // 物流公司
				$("#showExpressNo").html(data.msg.expressNo) ; // 物流单号
			}else{
				if( data.msg == "noLogin" ){
					window.location.href = "login.html?time=" + new Date().getTime() ;
				}else{
					$("#showNoSend").show() ;
				}
			}
		}, error : function(error){
			
		}
	});
}

/**
 * 显示编辑信息
 */
function editLogisticsInfo(){
	//先隐藏
	$("#showLogistics").hide() ;
	$("#editLogistics").show() ;
	getProvinceList() ;
}

//获取省份列表
function getProvinceList(){
	$("#extProvince").empty();
	$.ajax({
	    type:"post",
        url:"/address/getProvince.do",
        data:{"a":""},
        success:function(data){         
        	var info = data.message ;
        	for( var i = 0 ; i < info.length ; i++ ){
        		$("#extProvince").append('<option value="' + info[i].id + '">' + info[i].name + '</option>');
        	}
        },
        error:""
   });
}

//获取区域列表
function getCityList(provinceId){
	$("#extCity").empty();
	$.ajax({
	    type:"post",
        url:"/address/getCityByProvinceId.do",
        data:{"provinceId":provinceId},
        success:function(data){     
        	var info = data.message ;
        	for( var i = 0 ; i < info.length ; i++ ){
        		$("#extCity").append('<option value="' + info[i].id + '">' + info[i].name + '</option>');
        	}
        },
        error:""
   });
}

//获取区县列表
function getCountyList(cityId){
	$("#extCounty").empty();
	$.ajax({
	    type:"post",
        url:"/address/getCountyByCityId.do",
        data:{"cityId":cityId},
        success:function(data){         
        	var info = data.message ;
        	for( var i = 0 ; i < info.length ; i++ ){
        		$("#extCounty").append('<option value="' + info[i].id + '">' + info[i].name + '</option>');
        	}
        },
        error:""
   });
}

/* 保存收货物流信息  */
function saveLogisticsInfo() {

	if (campaignId == null || campaignId == "") {
		$.alert("模板出错，活动id不存在");
		return;
	}

	var username = $.trim($("#extName").val());
	var address = $.trim($("#extAddress").val());
	var phone = $.trim($("#extPhone").val());
	var editProvince = $.trim($("#extProvince").val());
	var editCity = $.trim($("#extCity").val());
	var editCounty = $.trim($("#extCounty").val());
	
	if ( !username ) {
		alert("收货人姓名不能为空");
		return;
	}
	
	if( !editProvince || !editCity || !editCounty ){
		alert("请选择省市区信息");
		return;
	}
	
	if ( !address ) {
		alert("收货地址不能为空");
		return;
	}
	
	var PhoneReg = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])[0-9]{8}$/ ; //手机正则  
	if ( !phone ) {
		alert("收件人手机不能为空");
		return;
	}
	
	if( !PhoneReg.test(phone) ){
		alert('请填写正确的手机号码!');
		return;
	}
	
	$.ajax({
		type : "post",
		url : basePath + "/templateActivity/tempSaveExtInfo.do",
		data : {
			"campaignId" : campaignId ,
			"17" : username ,
			"29" : phone , //收件人手机
			"28" : editProvince , // 省
			"59" : editCity , // 市
			"60" : editCounty , // 区
			"61" : 0 , // 镇
			"27" : address
		},
		dataType : "jsonp",
		jsonp : 'jsoncallback',
//		beforeSend : function() {
//			vlstatInitLE(this.url, this.data);
//		},
		success : function(data) {
			if (data.status) {
				//保存成功 - 切换显示
				checkUserExtInfo() ;
				if( isUserInfo && isUserInfo == "i" ){
					window.name = "refresh" ; // 回退后页面刷新一次 , 其它时候加载页面不刷新
					history.back(-1) ; //回退到上一页
				}
			} else {
				alert(data.message) ;
			}
		},
		error : function() {
			alert("操作错误！");
		}
	});
}