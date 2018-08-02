(function($){
	$.extend({
		alert:function(text){
			var h = $('<div id="defAlert"><div>' + text + '</div></div>');
			h.appendTo("body");
			h.ysLayerFixedShow();
			h.fadeIn(300);
			setTimeout(function(){h.fadeOut(300,function(){h.remove();})},2000);
		},
		"addCover":function(){
			if($("#newCover").length < 1 ){
				$("body").append("<div id='newCover' style='position:fixed;width:100%;height:100%;opacity:0.5;background:#000;top:0;left:0;z-index:200;filter:alpha(opacity=50);'></div>");
			}
		},
	
		"removeCover":function(){
			$("#newCover").each(function(i,e){
				$(e).remove();
			});
		},
		"ysAjax":function(opt){
			var def = {
				url:"",
				data:"",
				beforeSend:"",	
				success:"",
				error:"",
				complete:""
			}
			var option = $.extend(def,opt);
			$.ajax({
				type:"post",
                url:option.url,
                data: option.data,
                datatype:"json",
                beforeSend:function(){
                	$.isFunction(option.beforeSend) ? option.beforeSend() : "";
                },
                success:function(data){
                    //因为回调回来是字符串类型. 转换为 json object类型
                   	//data = eval("("+data+")");
                   	if(data){
	                   	switch(data.resultCode)
						{
						case "9999":
							$.alert("系统异常")
							break;
						case "0000":
						  	$.isFunction(option.success) ? option.success(data) : "";
							break;
						case "0001":
							$.alert("请先登录");
							break;
						case "0002":
							$.alert("参数异常");
							break;					
						case "1001":
							$.alert("串码已被使用");
							break;	
						case "1002":
							$.alert("串码无效");
							break;
						case "1003":
							$.alert("串码未激活");
							break;
						case "1004":
							$.alert("串码使用频率过高");
							break;
						case "2001":
							$.alert("活动未开始");
							break;
						case "2002":
							$.alert("活动已暂停");
							break;
						case "2003":
							$.alert("活动已关闭");
							break;
						case "3001":
							$.alert("请正确填写姓名");
							break;
						case "3002":
							$.alert("请正确选择性别");
							break;	
						case "3003":
							$.alert("请正确填写年龄");
							break;	
						case "3004":
							$.alert("请正确填写联系方式");
							break;	
						case "4001":
							$.alert("提现金额非法");
							break;
						case "4002":
							$.alert("余额不足");
							break;														 
						default:
						 	$.alert("系统异常");
						}
                   	}
                },
                error:function(data){
                	$.isFunction(option.error) ? option.error() : "";
                },
                complete:function(){
                	$.isFunction(option.complete) ? option.complete() : "";
                }
			});
		},
		// 修改个人信息
		"changeInfo":function(opt){
			 var data = {
    			data:"",
    			beforeSend:"",
    			success:function(data){
    				backPCenter();
    				//history.go(-1);
					//window.location.href = "myinfo.html";
					/*if(data){
	                    
	                }else{
	                    $.alert(data.resultMsg);
	                }*/
    			},
    			fail:"",
    			complete:""
            };          
            var option = $.extend(data, opt);
            //$('.save').off("click");
			$.ysAjax({
				url:basePath + "/tsBeer/tsModifyPersonalInfo.do",
				data:option.data,
				beforeSend:function(){
					$.isFunction(option.beforeSend) ? option.beforeSend() : "";	
				},
				success:function(data){
					//var data = data;
					 //$('.save').on("click",changeInfo);
                   	$.isFunction(option.success) ? option.success(data) : "";
                },
                error:function(){
                	$.isFunction(option.error) ? option.error() : "";
                },
                complete:function(){
                	$.isFunction(option.complete) ? option.complete() : "";
                }
			});
		}
	});
	
	$.fn.extend({
		"ysLayerFixedShow":function(position){
		var _this = $(this);
		var _position = position;
		
		setTimeout(function(){
			$(window).on("resize.dxlsc",function(){_this._ysLayerFixedShow(_position);}).resize();
		},50)
	
		//$(window).on("resize.dxlsc",function(){_this._ysLayerFixedShow(_position);}).resize();
	},
	
	"_ysLayerFixedShow":function(position){
		var _this = $(this);
		var def = {
			w:$(window).width()/2,
			h:($(window).height()/2) - 40,
			obj_w:_this.width()/2,
			obj_h:_this.height()/2,
			top:"auto",
			left:"auto",
			right:"auto",
			bottom:"auto",
		}
		if(_this.parent().css("position") == "relative"){
			var _thisRelative = _this.parent();
			def.w = _thisRelative.offset().left + (_thisRelative.width()/2);
		}
		_this.css("position","fixed");
		def.top = def.h - def.obj_h;
		def.top <= 0 ? def.top = 0 : "";
		def.left = def.w - def.obj_w;
		switch(position){
			case "top":def.top = 0;break
			case "left":def.left = 0;break
			case "right":def.left = "auto";def.right = 0;break
			case "bottom":def.top = "auto";def.bottom = 0;break
		}

		_this.css({"left":def.left,"top":def.top,"right":def.right,"bottom":def.bottom});
		return _this;
	},
	
	"yslLayerFixedHide":function(){
		var _this = $(this);
		_this.css("position","static");
		$(window).off("resize.dxlsc");
	},
		"tip":function(opt){
			var $this = $(this);
			//var left = $this.offset().left + $this.width() + 10;
			//var top = $this.offset().top - ($this.height()/2) - 5;
			
//			$(this).each()
			var def = {
				txt:"我是一个提示",
				pos:"right",
				width:"200px",
				top:0,
				left:0
			}
			var option = $.extend(def, opt);
			var flag = 0;
			
			$this.on("mouseover",function(e){
				var $eDom = $(this);
				e.stopPropagation();
				
				if(flag == 0){
					if(option.pos=="top"){
						$eDom.parent().append('<div class="tip-txt">' + option.txt + '<span class="arrow arrow-top"><em></em><i></i></span></div>');
						flag = 1;
					}else if(option.pos=="right"){
						$eDom.parent().append('<div class="tip-txt">' + option.txt + '<span class="arrow arrow-right"><em></em><i></i></span></div>');
						flag = 1;
					}else if(option.pos=="bottom"){
						$eDom.parent().append('<div class="tip-txt">' + option.txt + '<span class="arrow arrow-bottom"><em></em><i></i></span></div>');
						flag = 1;
					}else if(option.pos=="left"){
						$eDom.parent().append('<div class="tip-txt">' + option.txt + '<span class="arrow arrow-left"><em></em><i></i></span></div>');
						flag = 1;
					}
					
				}
					
				$(".tip-txt").css({
					   "background-color" : "#fff",
					   "width" : option.width,
					   "padding" : "10px",
					   "border":"1px solid #ddd",
					   "box-shadow":"1px 2px 8px #dcdcdc",
					   "top" : def.top,
					   "left" : def.left,
					   "z-index" : 100,
					   "font-size":"12px",
					   "color":"#999"
				});
				
				
			})
			
			
			$this.on("mouseout",function(e){
				var $eDom = $(this);
				e.stopPropagation();
				flag = 0;
				$eDom.parent().find(".tip-txt").remove();
			});
			
			
			$this.on("mousemove",function(e){
				var $eDom = $(this);
				e.stopPropagation();
				flag = 1;
			});		
			
		}

	})
})(jQuery);


//pc还是手机
function getOsType() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return "phone";
    } else {
        return "pc";
    }
};


//写cookie
function setCookie(name,value){
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};

//读cookie
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};

//删cookie
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
};


/* 修改成功后请调用此方法返回个人信息 */
function backPCenter(){
    setCookie('reload',1);
    history.back();
}


/*   判断是否在微信  */ 
/*function is_weixn(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)!="micromessenger") {  
       
    } 
} */

$(document).ready(function(){

	 /* some static variable */
    var isPc = getOsType() == 'pc' ? true : false ;//是否pc
    var pageConClass = '.pinfo,.pcenter,.pcontact,.p-age,.pname,.pgender,.pwait,.rule,.shopview,.index_warp,.rankin_wrap';//页面
    var ratio = 320/750;//比例

    $(pageConClass).removeAttr('style');//首次加载移除

    /*if($('.pmyprize').length > 0 || $('.shopview').length > 0){
        if(isPc){
            $(pageConClass).removeAttr('style');//首次加载移除
        }
    }else{
        $(pageConClass).removeAttr('style');//首次加载移除
    }*/

    /* 应用缩放 */
    function useTransForm(){
        var setTrans = function () {
            $('.container').css({
                'overflow':'visible'
            });
            $(pageConClass).css({
                transform:'scale('+ratio+','+ratio+')',
                'transform-origin':'0 0',
                'width':'750px',
                'overflow':'scroll',
                'min-height':$(window).height()/ratio
            });
        };
        isPc ? setTrans() : '';
    }

    if (top.location == location) {
		 //is_weixn();
	}
   
    useTransForm();
	
});
