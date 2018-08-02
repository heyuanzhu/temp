/*
 * 微信操作选项
 * 
 * @version 1.0.0
 * @author chen.yong
 * @date 2017-04-06
 * 
 */
/**
 * 判断是否在微信浏览器中打开
 * @returns {true:是微信浏览器，flase:不是微信浏览器}
 */
function is_weixn(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
        return true;  
    } else {  
        return false;  
    }  
} 
/**
 * @Param opt
 * 提供默认设置：
 * <br/>defalult:debug:false,
	*		<br/>scanQRCodeElementId:"scanQRCode",
	*		<br/>activityElementId:"activityId",
	*		<br/>weiXinSharePhotos:"weiXinSharePhotos",
	*		<br/>weiXinShareDocuments:"weiXinShareDocuments",
	*		<br/>weiXinShareTitle:"weiXinShareTitle"
	*		<br/>loopLocation:true
 * */
function weixinConfig(opt){
	var defaultOpt={
			debug:false,
			scanQRCodeElementId:"scanQRCode",
			activityElementId:"activityId",
			weiXinSharePhotos:"weiXinSharePhotos",
			weiXinShareDocuments:"weiXinShareDocuments",
			weiXinShareTitle:"weiXinShareTitle",
			loopLocation:true
			
	};	
	if(!is_weixn()) return;	
	opt=$.extend(defaultOpt,opt);	
	$.ajax({
		type : "post",
		url : host+"/weixinActivity/wxJsSdkConfig",
		data:{link:window.location.href,activityId:$("#"+opt.activityElementId).val()},
		dataType : 'json',
		success : function(data) {
			if(data.success){				
				wx.config({
				    debug: opt.debug, 
				    appId: data.datas.appId, 
				    timestamp: data.datas.timestamp, 
				    nonceStr: data.datas.nonceStr, 
				    signature: data.datas.signature,
				    jsApiList: ['scanQRCode','onMenuShareTimeline', 'onMenuShareAppMessage','onMenuShareQQ',
				                'onMenuShareWeibo','onMenuShareQZone', 'getLocation'] 
				});
				//地理位置获取 
				weixinLocation();
				wx.ready(function(){
					//扫描二维码  
					if (($('#'+opt.scanQRCodeElementId) in window)) { 
						document.querySelector('#'+opt.scanQRCodeElementId).onclick = function () {
							wx.scanQRCode();
						};
					}					
					var WxSetImg = $.trim($('#'+opt.weiXinSharePhotos).attr("src"));  //自定义缩略图
					WxSetImg = WxSetImg || "";
					var WxSetWenan = $.trim($("#"+opt.weiXinShareDocuments).text());  //自定义文案
					WxSetWenan = WxSetWenan || "";
					var WxSetTitle = $.trim($("#"+opt.weiXinShareTitle).text());  //自定义标题
					WxSetTitle = WxSetTitle || "";
					if(WxSetImg!=""||WxSetWenan!=""||WxSetTitle!=""){
						// 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
					    wx.onMenuShareTimeline({
					    	 title: WxSetTitle, // 分享标题
					        imgUrl: WxSetImg  // 分享图标
					    });
					    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
					    wx.onMenuShareAppMessage({
					        title: WxSetTitle, // 分享标题
					        desc: WxSetWenan, // 分享描述
					        imgUrl: WxSetImg, // 分享图标
					    });
					    
					    //获取“分享到QQ”按钮点击状态及自定义分享内容接口
					    wx.onMenuShareQQ({
					    	 title: WxSetTitle, // 分享标题
					         desc: WxSetWenan, // 分享描述
					         imgUrl: WxSetImg, // 分享图标
					        success: function () { 
					           // 用户确认分享后执行的回调函数
					        },
					        cancel: function () { 
					           // 用户取消分享后执行的回调函数
					        }
					    });
					    
					    //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
					    wx.onMenuShareWeibo({
					        title: WxSetTitle, // 分享标题
					        desc: WxSetWenan, // 分享描述
					        imgUrl: WxSetImg, // 分享图标
					        success: function () { 
					           // 用户确认分享后执行的回调函数
					        },
					        cancel: function () { 
					            // 用户取消分享后执行的回调函数
					        }
					    });
					    
					    //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
					    wx.onMenuShareQZone({
					        title: WxSetTitle, // 分享标题
					        desc: WxSetWenan, // 分享描述
					        imgUrl: WxSetImg, // 分享图标
					        success: function () { 
					           // 用户确认分享后执行的回调函数
					        },
					        cancel: function () { 
					            // 用户取消分享后执行的回调函数
					        }
					    });
					}
				});
			}else{
				$.alert(data.message);
			}
		},
		error : function(e) {
			console.log("jssdk加载失败！");
		}
	});
}
/**
 * 获取用户的地理位置
 * */
function weixinLocation(opt){
	wx.ready(function(){
		wx.getLocation({
		    success: function (res) {
		        // 根据经纬度获取用户详细地址信息
		    	postLocation( res );
		    },
		    cancel: function (res) {
		    	if(opt.loopLocation){
		    		alert('允许获取地理位置，才能匹配所在地区的活动') ;
			    	//用户拒绝, 重复获取
		    		weixinLocation(opt) ;
		    	}			    	
		    }
		});
	});
}

/**
 * 根据地址详细信息获取相应的Id信息
 * @param res 参考微信jssdk文档：
 *     success: function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        var speed = res.speed; // 速度，以米/每秒计
        var accuracy = res.accuracy; // 位置精度
    }
 */
function postLocation(res){
	$.ajax({
        type : "post",
        url : host + "/commons/setLocation",
        data : res ,
        dataType : "json",        
        async : false ,
        success:function(data){
        	
        },
        error : function(data){
        	console.log("地址填写有误,获取地址定位失败");
        }
    });
}



