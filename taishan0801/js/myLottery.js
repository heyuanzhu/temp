/**
 * 个人中心 - 我的奖品(我的奖品,我的积分共用)
 */


var campaignId ;

/**
 * 分页获取用户中奖列表
 * 
 */
var currentPage = 0 , prizeType ;


/**
 * 预加载
 */
$(function(){
	if (top.location == location) {
		document.title = '我的奖品' ;
		campaignId = $("#campaignId").val() ;
		prizeType = getParameterByName("prizeType") ;
		var listHeight = $(window).height() - 100 - $('.bot').height();
	    $('.outer').height(listHeight).find('.scroll-container').css('min-height',listHeight+15+'px');

	    $('.scroll-container')[0].addEventListener('touchmove', function (e) {
	        e.preventDefault();
	    }, false);
	    function getLotteryHtml( lottery ){
	        var css , type = null ;

	        switch (parseInt(lottery.sourceId)) {
	            case 46: // 易赏
	                if( lottery.sendType == 'HF' ){// 话费流量
	                    css = "tel-fare" ;
	                }else if( lottery.sendType == 'YHQ' ||  lottery.sendType == 'DYP' ){// 优惠券, 电影票
	                    css = "coupon" ;
	                    type = "YHQ" ;
	                }else if( lottery.sendType == 'SW' ){ // 实物, 物流
	                    css = "entity-prize" ;
	                    type = "WL" ;
	                }else if( lottery.sendType == 'WX' ){ // 微信红包
	                    css = "red-packet" ;
	                }else if( lottery.sendType == 'JYK' ){
	                    css = "oil-card" ;
	                }else if( lottery.sendType == 'QB' ){
	                    css = "q-coin" ;
	                }
	                break;
	            case 47: // 特殊
	                if( lottery.giftType == '64' ){// 积分
	                    css = "integral" ;
	                }else if( lottery.giftType == '38' ){// 红包
	                    css = "red-packet" ;
	                }
	                break;
	            case 52: // 京东
	                //全是物流
	                css = "entity-prize" ;
	                type = "WL" ;
	                break;
	            case 53: // 自有
	                if( lottery.sendType == '58' ){// 串码
	                    css = "coupon" ;
	                    type = "CM" ;
	                }else if( lottery.sendType == '57' ){// 实物 , 自提
	                    css = "entity-prize" ;
	                    type = "ZT" ;
	                }else if( lottery.sendType == 'SW' ){ // 实物, 物流
	                    css = "entity-prize" ;
	                    type = "WL" ;
	                }else if( lottery.sendType == '63' ){ // 微信红包
	                    css = "red-packet" ;
	                }else if( lottery.sendType == '69' ){ // 微信红包-累计
	                    css = "red-packet" ;
	                }
	                break;
	            default:
	                break;
	        }

	        return getHtmlStr( css , type , lottery ) ;
	    }
	    function getHtmlStr( css , type , lottery ){
	        var html = '<li class="' + css + '">' ;
	        html = html + ('<div class="left"><img src="./images/prize_icons.png" /></div>') ;
	        html = html + ('<div class="middle">') ;
	        html = html + ('<div class="top">' + lottery.giftName + '</div>') ;
	        html = html + ('<div class="bottom">' + lottery.lotteryTime.split(".")[0] + '</div>') ;
	        html = html + ('</div>') ;
	        
	        //串码或者优惠券请求ajax,获取码信息
	        if( type == 'CM' || type == 'YHQ' ){
	            html = html + ('<div class="right"><a href="#" onclick="showReceiveCodeDiv(' + lottery.giftId
	            		+ ', ' + lottery.lotteryRecordId + ')">领取码</a></div>') ;
	        }

	        if( type == 'WL' ){
	            html = html + ('<div class="right"><a href="myLogistics.html?c='
	                    + campaignId + '&g=' + lottery.giftId + '&l='
	                    + lottery.lotteryRecordId + '&time=' + new Date().getTime() + '">物流信息</a></div>') ;
	        }

	        if( type == 'ZT' ){
	            html = html + ('<div class="right"><a href="qrStore.html?c='
	                    + campaignId + '&g=' + lottery.giftId + '&l='
	                    + lottery.lotteryRecordId + '&time=' + new Date().getTime() + '">领取码</a></div>') ;
	        }

	        html = html + ('</li>') ;

	        return html ;
	    }

	    var loadMore;
	    var config = {
	        refreshSelector: '#refresh',
	        loadingSelector:'.load8',
	        loadTip:'.load-tip p',
	        noMoreTipTxt:'没有更多数据了！',
	        bouncebottom: 100,
	        bouncetop: 135,
	        pageCount:15,
	        firstLoad: function (models) {//初次加载
	            for(var i in models){
	                $('.scroll-container ul').append(getLotteryHtml(models[i]));
	            }
	            loadMore.myScroll.refresh();//刷新iscroll
	            loadMore.config.ajax.$setup.data.currentPage += 1;
	        },
	        resoveNoData: function () {
	            $('.outer').css('display','none');
	            $('.outer2').css('display','block');
	        },
	        scroll: {
	            container: '.outer',
	            config: {
	                click: true,
	                probeType: 3,
	                deceleration:0.01,
//	                            bounce:false,
	            }
	        },
	        ajax: {
	            $setup: {
	                url: basePath + "/tsBeer/getLotteryList.do",
	                data:{ "campaignId" : campaignId , "currentPage" : currentPage , "prizeType" : prizeType },
	                dataType: 'json',
	            },
	            done: function (data) {
	                if(data.models.list.length > 0){
	                    for(var i in data.models.list){
	                        $('.scroll-container ul').append(getLotteryHtml(data.models.list[i]));
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
	        }
	    };
	    loadMore = new LoadMore(config);
	}
}) ;


function closeReceiveCodeDiv(){
	$("#receiveCodeDiv").hide() ;
}

function closeReceiveCodeDiv2(){
	$("#receiveCodePwdDiv").hide() ;
}

function showReceiveCodeDiv(giftId, lotteryRecordId){
	$.ajax({
		url: basePath + "/standard/getCode.do" , 
		data: {"campaignId": campaignId, "giftId": giftId, "lotteryRecordId": lotteryRecordId} ,
		async : false , 
		type : 'post' ,
		success : function(result){
			var data = eval('(' + result + ')') ;
			if( data.flag && data.msg ){
				var code = data.msg.split(",") ;
				if( code && code.length > 1 ){
					$("#receiveCode2").val(code[0]) ;
					$("#receivePwd").val(code[1]) ;
					$("#receiveCodePwdDiv").show() ;
				}else{
					$("#receiveCode").html(code[0]) ;
					$("#receiveCodeDiv").show() ;
				}
			}else{
				alert("暂无发奖信息, 请耐心等待发奖喔") ;
			}
		}, error : function(error){
			
		}
	});
}