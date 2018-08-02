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

$(function(){
    /* some static variable */
    var isPc = getOsType() == 'pc' ? true : false ;//是否pc
    var pageConClass = '.pinfo,.pcenter,.pmyprize,.logisticsinfo,.pgender,.selfaward,.shopview,.ptransit,.pcontact,.p-age,.pname';//页面
    var ratio = 320/750;//比例

    //$(pageConClass).removeAttr('style');//首次加载移除

    if($('.pmyprize').length > 0 || $('.shopview').length > 0){
        if(isPc){
            $(pageConClass).removeAttr('style');//首次加载移除
        }
    }else{
        $(pageConClass).removeAttr('style');//首次加载移除
    }

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