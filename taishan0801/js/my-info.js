/**
 * 个人信息
 */

/**
 * 预加载
 */
$(function(){
	if (top.location == location) {
		getMyInfo() ;
		getAddress();
		rallbackRefresh() ;
	}
}) ;

/**
 * 获取个人信息 - 头像,昵称等
 */
function getMyInfo(){
   var userData = {
		"campaignId" : $("#campaignId").val()
   }
   
   $.ajax({
	    type:"post",
        url:"/tsBeer/tsSearchPersonalInfo.do",
        data:userData,
        success:function(data){         
        	var info = data.models ;
        	$("#headPhoto").attr("src",info.headimgurl);
            $("#nickname").text(info.nickname);
            
            if( info.sex == '2' ){
            	$("#sexImg").attr("src","images/boy_03.png");
            	$("#sex").text("女");
            }else if( info.sex == '1' ){
            	$("#sexImg").attr("src","images/boy_03.png");
            	$("#sex").text("男");
            }else{
            	$("#sexImg").attr("src","images/boy_03.png");
            	$("#sex").text("未知");
            }
            
            $("#userId").text(info.registerMobile) ;
            $("#ageImg").text(info.age);
            $("#age").text(info.age);
            $("#phone").text(info.contactWay);
            $("#registerName").text(info.registerName);
        },
        error:""
   });    
}

/**
 * 获取地址信息
 */
function getAddress(){
	var userData = {
		"campaignId" : $("#campaignId").val()
    }
   
    $.ajax({
	    type:"post",
        url:"/tsBeer/getRegisterExt.do",
        data:userData,
        success:function(data){         
        	if( data && data.models && data.models.list ){
        		var info = data.models.list ;
        		for( var i = 0 ; i < info.length ; i++ ){
        			if( info[i].attrParameterId == "27" ){
        				$("#address").text(info[i].registerExtAttrValue) ;
        				continue ;
        			}
        		}
        		
        		$("#addressClick").attr("onclick" , "") ; //去掉事件
        		$("#addressClick").attr("class" , "sjaddnoseconbg") ; //去掉事件
        	}
        },
        error:""
    });  
}

/**
 * 跳转到修改信息页面
 */
function updateUserInfo(type){
	var v ;
	
	if( type == 'a' ){
		v = $("#age").html() ;
	}else if( type == 'n' ){
		v = encodeURI(encodeURI( $("#registerName").html() )) ;
	}else if( type == 'p' ){
		v = $("#phone").html() ;
	}else{
		return ;
	}
	
	location.href = "update_userInfo.html?t=" + type + "&v=" + v + 
					"&timer=" + new Date().getTime();
}


/**
 * 跳转到修改收货地址信息
 */
function toUpdateAddress(){
	location.href = 'myLogistics.html?c='
		+ $("#campaignId").val() + '&g=&l=&t=i&time=' + new Date().getTime() ;
}