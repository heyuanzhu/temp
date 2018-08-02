
/** 奖品发放类型 */
var prizeSendType = {
		'HF':'话费',
		'LL':'流量',
		'WL':'物流',
		'ZT':'自提',
		'YHQ':'优惠券',
		'JYK':'加油卡',
		'ZZJ':'转账金',
		'WX':'微信红包',
		'WZ':'微信转账',
		'QQ':'Q币',
		'DYP':'电影票',
		'CODE':'串码'
	};

/** 序列化表单 */
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

/** iframe引入 */
function isFrame(){
	return top.location != location;
}

/**
 * 获取请求参数
 * 
 * 从url中提取参数，因此post提交参数无法获取
 * 
 * url中的中文参数必须使用escape编码，否则会出现乱码
 * 
 * @param name
 * @returns
 */
function getParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

/**
 * 将阿拉伯数字转为汉字一、二、三
 * 
 * @param num
 */
function numToChinese(num){
	if (!/^\d*(\.\d*)?$/.test(num)) { 
		throw "Number is wrong!"; 
	} 
	var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九"); 
	var BB = new Array("", "十", "百", "千", "万", "亿", "点", ""); 
	var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = ""; 
	for (var i = a[0].length - 1; i >= 0; i--) { 
		switch (k) { 
			case 0: 
				re = BB[7] + re; break; 
			case 4: 
				if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0])) 
				re = BB[4] + re; break; 
			case 8: re = BB[5] + re; BB[7] = BB[5]; k = 0; break; 
		} 
		if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re; 
		if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re; k++; 
	} 

	if (a.length > 1) //加上小数部分(如果有小数部分) 
	{ 
			re += BB[6]; 
		for (var i = 0; i < a[1].length; i++) {
			re += AA[a[1].charAt(i)]; 
		}
	} 
	return re; 
}

/**
 * 
 * 
 * @param html
 */
function gotoHtml(html){
	var timestamp = new Date().getTime();
	html = html.indexOf('?')==-1 ? (html + '?timestamp=' + timestamp) : (html + '&timestamp=' + timestamp);
	location.href=html;
}


/**
 * 
 * 
 * @param url
 * @param params
 */
function gotoUrl(url,params,target){
	//修复中文提交bug
	//create form
	var $form = $("<form></form>");
	$("body").append($form);
	
	if(target) $form.attr("target",target);
	
	$form.hide();
	$form.attr("method","post");
	$form.attr("action",url);
	
	//add params
	for(var name in params){
		if(url.indexOf(name+'=')!=-1) continue;
		if(typeof(params[name]) == 'string' || typeof(params[name]) == 'number'){
			//string
			addParam($form,name,params[name]);
		}else if(params[name] && params[name].push){
			//Array
			for(var i =0;i<params[name].length;i++){
				addParam($form,name,params[name][i]);
			}
		}
	}
	
	$form.submit();//submit
}

/**
 * 
 * @param form
 * @param name
 * @param value
 */
function addParam(form,name,value){
	var input = $("<input></input>");
	input.attr("name",name);
	input.attr("value",value);
	form.append(input);
}


/**
 * 保留小数位
 * 
 * @param num
 * @param point
 * @returns
 */
function getRound(num,point){
	 point = point == undefined ? 0 : point;
	 
	 point = point > 0 ? point : 0;
	 if(isNaN(num)) num = 0;
	 num = parseFloat(num);
	 var a = 1;
	 for(var i=0;i<point;i++){
	 a = a*10;
	 }
	 var num1 = num * a;
	 var num2 = Math.round(num1);//四舍五入
	 var num3 = num2/a + "";
	 num3 = num3.indexOf(".") != -1 ? num3 + '00000000000000000000' : num3 + '.00000000000000000000';
	 
	 return num3.substring(0,num3.indexOf(".")+1+point);
}

/** 生成32位随机字符串 */
function getRandomStr(){
	
	var dic = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var len = dic.length;
	
	var result = '';
	
	for(var i=0;i<32;i++){
		var index = parseInt(Math.random()*len);
		result = result + dic.charAt(index);
	}
	
	return result;
}

/** 获取uv字符串 */
function getUvCookie(path){
	return $.cookie("uniqueVisitor",{expires:365,path:path});
}

function setUvCookie(uniqueVisitor,path){
	$.cookie("uniqueVisitor",uniqueVisitor,{expires:365,path:path});
}

//删除cookie
function removeUvCookie(path){
	$.cookie("uniqueVisitor", '', { expires: -1 ,path:path});
}

/**
 * 显示demo，用于站点编辑时显示demo数据
 * 
 */
function showDemo(){
	$('.template-demo').show();
}

function hideDemo(){
	$('.template-demo').hide();
}

/**
 * 复制到剪切板
 * 
 * @param text
 * @returns {Boolean}
 */
function copyToClipboard(text) {
      if (window.clipboardData) {
        window.clipboardData.clearData();
        clipboardData.setData("Text", text);
        return true;
      } else if (navigator.userAgent.indexOf("Opera") != -1) {
        window.location = text;
        return true;
      } else if (window.netscape) {
        try {
          netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
          return false;
        }
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) return false;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans) return false;
        trans.addDataFlavor("text/unicode");
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = text;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip) return false;
        clip.setData(trans, null, clipid.kGlobalClipboard);
      }
};// end copyToClipboard

/**
 * 倒计时
 * 
 * @param options
 * 			options.beginTime 倒计时开始时间，毫秒数
 * 			show 显示时间函数 function(days,hours,minutes,seconds){} days-天数,hours-小时,minutes-分钟,seconds-秒
 * 			end 倒计时结束时处理函数 function(){}
 * 			
 */
function CountDown(options){
	
	options = options || {};
	
	var defaultOptions = {
		beginTime : new Date().getTime(),//开始时间
		show : function(days,hours,minutes,seconds){},//显示时间
		end : function(){}//计时结束
	};
	
	options = $.extend(defaultOptions,options);
	
	//计算时间
	function calTime(){
		var currentTime = new Date().getTime();
		var lastTime = options.beginTime - currentTime;
		if(lastTime <= 0){
			options.end();
		}else{
			var oneDay = 24 * 3600 * 1000;
			var oneHour = 3600 * 1000;
			var oneMinute = 60 * 1000;
			var days = parseInt(lastTime/oneDay);
			lastTime = lastTime - days * oneDay;
			var hours = parseInt(lastTime/oneHour);
			lastTime = lastTime - hours * oneHour;
			var minutes = parseInt(lastTime/oneMinute);
			lastTime = lastTime - minutes * oneMinute;
			var seconds = parseInt(lastTime/1000);
			options.show(days,hours,minutes,seconds);
			setTimeout(function(){
				calTime();
			},1000);
		}
	};//end calTime
	
	calTime();
	
};

/**
 * 获取date类型
 * 
 * @param datetime yyyy-MM-dd HH:mm:ss
 */
function getDateTime(datetime){
	
	var date = new Date();
	
	var arr1 = datetime.split(' ');
	var arr2 = arr1[0].split('-');
	var arr3 = arr1[1].split(':');
	
	var year = parseInt(arr2[0]);
	var month = parseInt(arr2[1]);
	var day = parseInt(arr2[2]);
	var hours = parseInt(arr3[0]);
	var monutes = parseInt(arr3[1]);
	var seconds = parseInt(arr3[2]);
	
	date.setFullYear(year, month-1, day);
	date.setHours(hours, monutes, seconds, 0);
	
	return date;
}



