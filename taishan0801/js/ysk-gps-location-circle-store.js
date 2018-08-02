/**
 * 此js应用, 用于处理手机端GPS 定位获取用户的地址信息
 * 注 : 此js为循环获取用户地址. 直到用户允许获取为止
 * @author Jedi.liu
 * @date   2016-09-05
 */

//全局变量  - 依次分别是 : 省份Id , 市Id , 经度 , 纬度 ;
var provinceId , cityId , address , latd , lngt ;

//定义腾讯地图全局变量
var geocoder, map, marker = null;

/**
 * 预加载信息
 */
$(document).ready(function(){
	getGPRS();
    //如果微信获取不到经纬度则使用H5的方式获取地址信息
}) 

function getGPRS(){
	var pi = getCookie('provinceId') ;
	var ci = getCookie('cityId') ;
	var ad = getCookie('address') ;
	var lt = getCookie('latd') ;
	var lg = getCookie('lngt') ;
	if( !pi || !ci || !ad || !lt || !lg ){
	    //使用微信api获取用户经纬度
	    weChatService() ;
	}else{
		provinceId = pi ;
		cityId = ci ;
		address = ad ;
		latd = lt ;
		lngt = lg ;
		loding();
	}
	
}

/**
 * 微信信息的以及调用的配置服务
 */
function weChatService(){
	wx.ready(function(){
    	wx.getLocation({
    	    success: function (res) {
    	        // 根据经纬度获取用户详细地址信息
    	        codeLatLng( res.latitude , res.longitude );
    	    },
    	    cancel: function (res) {
    	    	//console.log('用户拒绝授权获取地理位置');
    	    	alert('允许获取地理位置，才能匹配所在地区的活动') ;
    	    	//用户拒绝, 重复获取
    	    	weChatService() ;
    	    }
    	});
    });
}

/**
 * 如果微信获取不到经纬度则使用H5的方式获取地址信息
 */
function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position){
	// 根据经纬度获取用户详细地址信息
    var address = codeLatLng( position.coords.latitude , position.coords.longitude );
}

/**
 * 根据经纬度调用腾讯地图获取详细地址信息
 * @param lat
 * @param lng
 */
function codeLatLng( lat , lng ) {
	//地址和经纬度之间进行转换服务
    geocoder = new qq.maps.Geocoder();
    
    var latLng = new qq.maps.LatLng(lat, lng);
    latd = lat ;
    lngt = lng ;
    //对指定经纬度进行解析
    geocoder.getAddress(latLng);
    //设置服务请求成功的回调函数
    geocoder.setComplete(function(result) {
    	var address1 = result.detail.addressComponents ;
    	address = address1.province + address1.city + address1.district + address1.street ;
    	var address2 = {"province":address1.province,"city":address1.city,"district":address1.district,"street":address1.street} ;
        getAddressInfoIdByName(address1) ;
    });
    //若服务请求失败，则运行以下函数
    geocoder.setError(function() {
    	console.log("出错了，请输入正确的经纬度！！！");
    });
}

/**
 * 根据地址详细信息获取相应的Id信息
 * @param dataInfo 此参数为json格式 例如-> {"province":"江苏","city":"南京","district":"...","street":"..."}
 */
function getAddressInfoIdByName(dataInfo){
	$.ajax({
        type : "post",
        url : basePath + "/address/getAddIdByName.do",
        data : dataInfo ,
        dataType : "jsonp",
        jsonp : 'jsoncallback',
        async : false ,
        success : function(data) {
        	provinceId = data.message.provinceId ; 
        	cityId = data.message.cityId ;
        	
        	//设置cookie, 中奖页直接从cookie中获取
			setCookie("provinceId", provinceId);
			setCookie("cityId",cityId);
			setCookie("address",address);
			setCookie("latd",latd);
			setCookie("lngt",lngt);
			loding();
        },error : function(data){
        	alert("-----------");
        	console.log("地址填写有误,获取地址Id失败");
        }
    });
}

