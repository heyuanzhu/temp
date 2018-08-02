/**
 * 个人中心 
 */

var loadMore ;
var currentPage = 1 ;
/**
 * 预加载
 */
$(function(){
	getMyInfo() ;
	getGPRS() ;
	getProvinceList() ;
	
	var config = {
	    refreshSelector: '#refresh',
	    loadingSelector:'.load8',
	    loadTip:'.load-tip p',
	    noMoreTipTxt:'没有更多数据了！',
	    bouncebottom: 100,
	    bouncetop: 135,
	    pageCount:7	,
	    firstLoad: function (models) {//初次加载
	        for(var i in models){
	            $('.scroll-container table').append(getRankHtml(i,models[i]));
	        }
				        
	        loadMore.myScroll.refresh();//刷新iscroll
	        loadMore.config.ajax.$setup.data.currentPage += 1;
	    },
	    /*doFirstExtra:function(data){
	    	// TODO 排名
	   		$("#rank").html(data.models.ranking);
			$("#areaRank").html(data.models.areaRanking);
	    },*/
	    scroll: {
	        container: '.scroll-container',
	        config: {
	            click: true,
	            probeType: 3,
	            deceleration:0.01,
	        }
	    }
	    /*ajax: {
	        $setup: {
	            url:"/tsBeer/tsRanking.do",
	            data:{ "campaignId":$("#campaignId").val(),"cityId":$("#cityList").val(),"currentPage" : currentPage },
	            dataType: 'json',
	        },
	        done: function (data) {
	        	// TODO 排名
	        		$("#rank").html(data.models.ranking);
					$("#areaRank").html(data.models.areaRanking);
	            if(data.models.list.length > 0){
	                for(var i in data.models.list){
	                    $('.scroll-container table').append(getRankHtml(i,data.models.list[i]));
	                }
	                loadMore.config.ajax.$setup.data.currentPage += 1;
	                if(data.models.list.length < config.pageCount){
	                    return false;
	                }

	                return true;
	            }else if(data.models.list.length == 0){
	                return false;
	            }
	        },
	    }*/
	    //rank(id);
	};
	//loadMore = new LoadMore(config);
}) ;

/**
 * 获取个人信息 - 头像,昵称
 */
function getMyInfo(){
   var userData = {
		campaignId:$("#campaignId").val()
   }
   
   $.ajax({
	    type:"post",
        url:"/tsBeer/tsSearchPersonalInfo.do",
        data:userData,
        success:function(data){         
        	$("#headPhoto").attr("src",data.models.headimgurl);
            $("#nickname").text(data.models.nickname);
        },
        error:""
   });    
}

/**
 * 跳转到我的奖品
 */
function toMyLottery(){
	location.href = "myLottery.html?prizeType=ALL&timer=" + new Date().getTime();
}

/**
 * 跳转到我的红包
 */
function toMyHb(){
	location.href = "myredpag2.html?prizeType=WX&timer=" + new Date().getTime();
}

/**
 * 跳转到我的积分
 */
function toMyJf(){
	location.href = "myJf.html?prizeType=JF&timer=" + new Date().getTime();
}

/**
 * 跳转到我的信息
 */
function toMyInfo(){
	location.href = "my-info.html?timer=" + new Date().getTime();
}

/**
 * 跳转到活动规则
 */
function toRule(){
	location.href = "rule.html?timer=" + new Date().getTime();
}

/**
 * 跳转到积分商城
 */
function toJfMall(){
	window.location.href = 'http://www.1shang.com/jf-mall/95/index.html';
	/*$.ajax({
		url: basePath + "/tsBeer/getUserIfJfMall.do" , 
		data: { "campaignId" : $("#campaignId").val() } ,
		type : 'post' ,
		success : function(result){
			if( ( result.success == true || result.success == 'true' ) && result.models.jfMall.url ){
				window.location.href = result.models.jfMall.url ;
			}else{
				if( result.msg == "noLogin" ){
					window.location.href = "login.html?time=" + new Date().getTime() ; 
				}
			}
		}, error : function(error){
			
		}
	});*/
}

/**
 * 跳转到积分互动 - 老虎机
 */
function toJfInteraction(){
	//alert("功能正在开发中,敬请期待哟~") ;
	window.location.href = "jfSlot.html?time=" + new Date().getTime() ; 
}

/**
 * 显示排行榜
 */
function showRank(){
	alert("功能正在开发中,敬请期待哟~") ;
	
/*	var checkRegister = searchIsRegister() ;
	if( checkRegister == false || checkRegister == "false" ){
		alert("请先注册会员才能查看您的排行喔~") ;
		return ;
	}
	currentPage = 1 ;
	$("#rankDiv").show() ;
	getProvinceList() ;*/
}

/**
 * 关闭排行榜弹框
 */
function closeRank(){
	$("#rankDiv").hide() ;
}

/**
 * 用户注册
 */
function userRegister(){
	$.ajax({
		url:"/tsBeer/isRegister.do",
		type:"post",
		dataType:'json',
		data:{campaignId:$("#campaignId").val()},
		success:function(result){
			if( result.success == true || result.success == 'true' ){
				alert("您已注册过会员") ;
			}else{
				$("#registerDiv").show() ;
			}
		}
	})
}

/**
 * 关闭注册弹框
 */
function closeRegister(){
	$("#registerDiv").hide() ;
}

$('#cityList').on('change',function(){
	var val = $(this).val();
	$("#rankTable")[0].innerHTML ="";
	loadMore.setAjaxParams({ campaignId:$("#campaignId").val(),cityId:val,"currentPage" : 1 });
	loadMore.loadData();
});

function getRankHtml(i,rank){
	var name='';
	if(rank.register_name!=null&&rank.register_name!=undefined)
		name=rank.register_name;
	var str="<tr><td>第"+ (parseInt(i)+ parseInt(1))+"名</td><td>"+rank.register_mobile+"</td><td>"+name+"</td></tr>";
	return str;
}

function register(){
	var registerPhone=$("#registerPhone").val();
	var registerName=$("#registerName").val();
//		var sex=$("input[name='sex']:checked").val();
	var position=$("#position").val();
	var authCode=$("#mobileCode").val();
	var campaignId=$("#campaignId").val();
	
	if (registerPhone == "") {
		alert("手机号不能为空");
		return false;
	}
	var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
	if (!reg.test(registerPhone)) {
		alert("手机号码有误，请重填");
		return false;
	}	
	if (registerName == "") {
		alert("姓名不能为空");
		return false;
	}
	var reg = /^[\u4e00-\u9fa5]{1,5}$|^[A-Za-z]{1,50}$/; //验证规则
	if (!reg.test(registerName)) {
		alert("请输入正确的姓名");
		return false;
	}
	if (position == "") {
		alert("职位不能为空");
		return false;
	}
	if (authCode == "") {
		alert("验证码不能为空");
		return false;
	}
	data={registerName:registerName,registerPhone:registerPhone,position:position,authCode:authCode,campaignId:campaignId};
	$.ajax({
		url:"/tsBeer/registerUser.do",
		type:"post",
		dataType:'json',
		data:data,
		success:function(result){
			//根据resultcode的值来判断弹出框
			resultCode = result.resultCode;
				if(result.success=='true'){
					alert("注册成功");
					$('.cover').hide();
				}else
					{
					alert(result.resultMsg);
					}
		}
	});
}

function rank(id)
{
	currentPage = 1 ;
	var campaignId=$("#campaignId").val();
	var data;
	$.ajax({
		url:"/tsBeer/tsRanking.do",
		type:"post",
		dataType:'json',
		data:{
			campaignId:campaignId,cityId:id,"currentPage" : currentPage 
		},
		success:function(result){
			if(result.success == true || result.success == 'true'){
				$("#rank").html(result.models.ranking);
				$("#areaRank").html(result.models.areaRanking);
				var str="";
				$("#rankTable")[0].innerHTML ="";
				var rankingList=result.models.list;
				if(rankingList.length>0)
					{
						for(i=0;i<rankingList.length;i++){
							var name='';
							if(rankingList[i].register_name!=null&&rankingList[i].register_name!=undefined)
								name=rankingList[i].register_name;
								str+="<tr><td>第"+ (parseInt(i)+ parseInt(1))+"名</td><td>"+rankingList[i].register_mobile+"</td><td>"+name+"</td></tr>";
						}
					}
						$("#rankTable").append(str);
						  loadMore.config.ajax.$setup.data.currentPage += 1;
			}else{
			}
		}
	});
}

function sendCode(){
	//	var campaignId=$("#campaignId").val();
	var mobile = $.trim($("#registerPhone").val());
	
	$.ajax({
		type:"post",
		url: "/tsBeer/sendSms.do",
		data:{mobile:mobile},
		success:function(data){
			if(data.status){
				alert(data.message)
			}else{
				alert(data.message);
			}
			
		},
		error : function() {
			alert("操作错误");
		}
	});
}


//	获取所有省份表
function getProvinceList(){
	$.ajax({
		url:"/tsBeer/getProvinceList.do",
		type:"post",
		dataType:'json',
		success:function(result){
			var provinceStr="";
			$("#provinceList").html="";
			if(result.success == true || result.success == 'true'){
				var provinceList=result.models.provinceList;
				for(var i=0;i<provinceList.length;i++){
			
					provinceStr+="<option value="+provinceList[i].id+">"+provinceList[i].name+"</option>";
				}
					$("#provinceList").append(provinceStr);
			}else{
				
			}
		}
	});
}

//	根据省份改变，修改城市列表
function changeCityList(id){
	$.ajax({
		url:"/tsBeer/changeCityList.do",
		type:"post",
		dataType:'json',
		data:{
			provinceId:id
		},
		success:function(result){
			var cityStr="<option  value='' >所在市</option>";
			$("#cityList")[0].innerHTML ="";
			if(result.success == true || result.success == 'true'){
				var cityList=result.models.cityList;
				for(var i=0;i<cityList.length;i++){
					cityStr+="<option  value="+cityList[i].id+">"+cityList[i].name+"</option>";
				}
				$("#cityList").append(cityStr);
			}
		}
	});
}

/**
 * 查询是否注册registerBaseInfo,若有则显示排名页面，否则不显示
 */
function searchIsRegister(){
	var flag = false;
	$.ajax({
		url:"/tsBeer/isRegister.do",
		type:"post",
		dataType:'json',
		async:false,
		data:{campaignId:$("#campaignId").val()},
		success:function(result){
			flag=result.success;
		}
	}) ;
	return flag;
}