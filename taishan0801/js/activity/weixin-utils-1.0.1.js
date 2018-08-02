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
 	* 		<br/>defalult:debug:false,微信的debug模式
	*		<br/>scanQRCodeElementId:"scanQRCode",触发扫码动作的元素id
	*		<br/>activityElementId:"activityId",存储activityId的元素id
	*		<br/>weiXinSharePhotos:"weiXinSharePhotos",存储微信分享的图标的元素id
	*		<br/>weiXinShareDocuments:"weiXinShareDocuments",存储微信分享的内容描述的元素id
	*		<br/>weiXinShareTitle:"weiXinShareTitle",存储微信分享的标题的元素id
	*		<br/>weiXinShareLink:"weiXinShareLink",存储微信分享的链接的元素id
	*		<br/>getLocation:false,是否默认获取地理位置
	*		<br/>loopLocation:true,是否必须获取地理位置
	*
 * */
function weixinConfig(opt){
	var defaultOpt={
			debug:false,
			scanQRCodeElementId:"scanQRCode",
			activityElementId:"activityId",
			weiXinSharePhotos:"weiXinSharePhotos",
			weiXinShareDocuments:"weiXinShareDocuments",
			weiXinShareTitle:"weiXinShareTitle",
			weiXinShareLink:"weiXinShareLink",
			getLocation:false,
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
				if(opt.getLocation){
					weixinLocation();
				}				
				wx.ready(function(){
					//扫描二维码  
					if (($('#'+opt.scanQRCodeElementId) in window)) { 
						document.querySelector('#'+opt.scanQRCodeElementId).onclick = function () {
							wx.scanQRCode();
						};
					}					
					var WxSetImg = $.trim($('#'+opt.weiXinSharePhotos).val());  //自定义缩略图
					WxSetImg = WxSetImg || "";
					var WxSetWenan = $.trim($("#"+opt.weiXinShareDocuments).val());  //自定义文案
					WxSetWenan = WxSetWenan || "";
					var WxSetTitle = $.trim($("#"+opt.weiXinShareTitle).val());  //自定义标题
					WxSetTitle = WxSetTitle || "";
					var WxSetLink = $.trim($("#"+opt.weiXinShareLink).val());  //自定义分享链接
					WxSetLink = WxSetLink || "";
					if(WxSetImg!=""||WxSetWenan!=""||WxSetTitle!=""||WxSetLink!=""){
						// 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
					    wx.onMenuShareTimeline({
					    	 title: WxSetTitle, // 分享标题
					        imgUrl: WxSetImg,  // 分享图标
					        link:WxSetLink
					    });
					    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
					    wx.onMenuShareAppMessage({
					        title: WxSetTitle, // 分享标题
					        desc: WxSetWenan, // 分享描述
					        imgUrl: WxSetImg, // 分享图标
					        link:WxSetLink
					    });
					    
					    //获取“分享到QQ”按钮点击状态及自定义分享内容接口
					    wx.onMenuShareQQ({
					    	 title: WxSetTitle, // 分享标题
					         desc: WxSetWenan, // 分享描述
					         imgUrl: WxSetImg, // 分享图标
					         link:WxSetLink,
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
					        link:WxSetLink,
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
					        link:WxSetLink,
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
				//window.location.reload();
				
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
        	//window.location.reload();
        },
        error : function(data){
        	console.log("地址填写有误,获取地址定位失败");
        }
    });
}



