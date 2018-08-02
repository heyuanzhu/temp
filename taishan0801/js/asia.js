$(document).ready(function(){
	 /* some static variable */
    var isPc = getOsType() == 'pc' ? true : false ;//是否pc
     var pageConClass = '.index_warp,.rankin_wrap,.joking,.lottery';//页面
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
                'width':'640px',
                'overflow':'scroll',
                'min-height':$(window).height()/ratio
            });
        };
        isPc ? setTrans() : '';
    }
    useTransForm();
	
});

function getUrlParam(name){  
		    //构造一个含有目标参数的正则表达式对象  
		    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
		    //匹配目标参数  
		    var r = window.location.search.substr(1).match(reg);  
		    //返回参数值  
		    if (r!=null) return unescape(r[2]);  
		    return null;  
		} 
