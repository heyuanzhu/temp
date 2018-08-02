(function($){
	var host = getActivityHost();

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
            $("#newCover").remove();
        }
	});

	$.fn.extend({
		"myScroll" : function(options){
		//默认配置
			var defaults = {
				speed:40,  //滚动速度,值越大速度越慢
				rowHeight:66//每行的高度
			};
			//var _this = $(this);
			var timer2 = null;
			var opts = $.extend({}, defaults, options),intId = [];
			//marquee(opt.obj,sh);
			function marquee(obj, step){
				obj.find(".table-list").animate({
					marginTop: '-=1'
				},0,function(){
					var s = Math.abs(parseInt($(this).css("margin-top")));
					if(s >= step){
						$(this).find(".libox").slice(0, 1).appendTo($(this));
						$(this).css("margin-top", 0);
					}
				});
			}

			//this.each(function(i){

				var sh = opts["rowHeight"],speed = opts["speed"],_this = $(this);

			 	timer2 = setInterval(function(){
					if(_this.find(".table-list").height()<=_this.height()){
						clearInterval(timer2);
					}else{
						marquee(_this, sh);
					}
				}, speed);

		//	});

		},

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


/* 修改成功后请调用此方法返回个人信息
function backPCenter(){
    setCookie('reload',1);
    history.back();
}
*/



(function(){
	var html = document.documentElement;
	var hWidth = html.getBoundingClientRect().width;
	if(hWidth==0 && isFrame()){
		hWidth = 318;
	}
	html.style.fontSize = hWidth/15 + "px";
})();

$(document).ready(function(){

	 /* some static variable */
    var isPc = getOsType() == 'pc' ? true : false ;//是否pc
    var pageConClass = '.index_warp .con';//页面
	//alert(1);
    var ratio = 320/750;//比例

    $(pageConClass).removeAttr('style');//首次加载移除

    if($('.pmyprize').length > 0 || $('.shopview').length > 0){
        if(isPc){
            $(pageConClass).removeAttr('style');//首次加载移除
        }
    }else{
        $(pageConClass).removeAttr('style');//首次加载移除
    }

		/*
    if (top.location == location) {
			 //is_weixn();
		}
		*/
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



		useTransForm();



});
