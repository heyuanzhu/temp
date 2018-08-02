/*
 * 开发者模式 
 * 
 * @Version 1.0.0
 * @author chen.yong 
 * @date 2017-04-04
 * 
 */

(function($){
	
	$.extend({
		activityDevModel : {
			
			/** 基本配置 */
			settings : {
				results : {}
			},
			
			/** 设置result */
			setResult : function(action,result){
				this.settings.results[action]=result;
			},
			
			/** 设置默认值 */
			getResult : function(action){
				if(this.settings.results[action]) {
					return this.settings.results[action];
				}else {
					throw 'Not found result for action "'+action+'"';
				}
			}
			
		} //end $.activity
	});
	
	var defaultResult = {success:true,code:'10000',message:'开发者模式-成功',datas:{}};
	
	//记录日志
	$.activityDevModel.setResult('/activity/log',$.extend({},defaultResult));
	//活动参与
	$.activityDevModel.setResult('/activity/lottery',$.extend({},defaultResult,{
		datas : {
			activityLotteryId : 1,
			activityPrizePackage : '一等奖',
			activityPrizePackageId : 1,
			uuid : 'abcdefghijklmnopqrstuvwxyz'
		}
	}));
	//加载中奖列表
	$.activityDevModel.setResult('/activity/loadAwardPrize',$.extend({},defaultResult,{
		datas : {
			activityPrizePackage : '800',
			activityPrizePackageId : 1,
			activityPrizeList : 
			[
			 	{
			 		activityPrizeId : 1,
			 		prizeName : '微信红包1元',
			 		prizeId : 1,
			 		prizePrice : 1,
			 		prizeValue : 1,
			 		imageUrl : 'images/list_pag.png'
			 	},
			 	{
			 		activityPrizeId : 2,
			 		prizeName : '5元话费',
			 		prizeId : 2,
			 		prizePrice : 5,
			 		prizeValue : 5,
			 		imageUrl : 'images/list_pag.png'
			 	},
			 	{
			 		activityPrizeId : 3,
			 		prizeName : '500积分',
			 		prizeId : 3,
			 		prizePrice : 5,
			 		prizeValue : 5,
			 		imageUrl : 'images/list_pag.png'
			 	}
			]
		}
	}));
	
	//加载消费者信息
	$.activityDevModel.setResult('/activity/loadRegisterInfo',$.extend({},defaultResult,{
		datas : {
			activityRegister : {
				name : '测试人员',
				wxNick : 'test',
				wxHeadUrl : 'images/headpiciconbig.png',
				wxOpenId : 'abcdefghijklmnopqrstuvwxyz',
				ysWxOpenId : 'abcdefghijklmnopqrstuvwxyz',
				phone : '18600000000',
				sex : 1,
				age : 30 ,
				email : 'user.test@link-e.com'
			},
			wxBalance : 100,
			jfBalance : 1000000,
			jfUnit : '积分'
		}
	}));
	
	//保存消费者信息
	$.activityDevModel.setResult('/activity/saveRegisterInfo',$.extend({},defaultResult));
	
	//加载微信红包明细列表
	$.activityDevModel.setResult('/activity/loadWxDetail',$.extend({},defaultResult,{
		datas : {
			page : {
				currentPage : 1,
				totalResult : 100,
				showCount : 5,
				list : 
				[
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'SEND',
				 		createTime : '2017-04-06 11:16:00'
				 	},
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'out',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'out',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},
					 {
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},
					 {
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'WXLJ',
				 		detailType : 'in',
				 		operateType : 'PRIZE',
				 		createTime : '2017-04-06 11:16:00'
				 	}
				]
			}
		}
	}));
	
	//加载积分明细列表
	$.activityDevModel.setResult('/activity/loadJfDetail',$.extend({},defaultResult,{
		datas : {
			page : {
				currentPage : 1,
				totalResult : 100,
				showCount : 5,
				list : 
				[
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'in',
				 		jfActivityType : 'HD',
				 		jfActivityName : '泰山啤酒',
				 		createTime : '2017-04-06 11:16:00'
				 	},
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'out',
				 		jfActivityType : 'HD',
				 		jfActivityName : '泰山啤酒',
				 		createTime : '2017-04-06 11:16:00'
				 	},
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'in',
				 		jfActivityType : 'HD',
				 		jfActivityName : '泰山啤酒',
				 		createTime : '2017-04-06 11:16:00'
				 	},
				 	{
				 		amount : 10,
				 		balance : 100,
				 		type : 'out',
				 		jfActivityType : 'HD',
				 		jfActivityName : '泰山啤酒',
				 		createTime : '2017-04-06 11:16:00'
				 	},{
				 		amount : 10,
				 		balance : 100,
				 		type : 'in',
				 		jfActivityType : 'HD',
				 		jfActivityName : '泰山啤酒',
				 		createTime : '2017-04-06 11:16:00'
				 	}
				]
			}
		}
		
	}));
	
	
	//加载排行榜
	$.activityDevModel.setResult('/activity/loadRanking',$.extend({},defaultResult,{
		datas : {
			list : 
			[
			 	{
			 		name : '用户1',
			 		count : 1000
			 	},
			 	{
			 		name : '用户2',
			 		count : 990
			 	},
			 	{
			 		name : '用户3',
			 		count : 980
			 	},
			 	{
			 		name : '用户4',
			 		count : 970
			 	},
			 	{
			 		name : '用户5',
			 		count : 960
			 	},
			 	{
			 		name : '用户6',
			 		count : 950
			 	},
			 	{
			 		name : '用户7',
			 		count : 940
			 	},
			 	{
			 		name : '用户8',
			 		count : 930
			 	},
			 	{
			 		name : '用户9',
			 		count : 920
			 	},
			 	{
			 		name : '用户10',
			 		count : 910
			 	}
			]
		}
		
	}));
	
	//加载串码查询次数列表
	$.activityDevModel.setResult('/activity/loadSearchList',$.extend({},defaultResult,{
		datas : {
			activityName : '泰山啤酒',
			activityIamgeUrl : 'images/photo.png',
			searchCount : 10,
			list : 
			[
			 	{
			 		createTime : '2017-04-16 11:23:00'
			 	},
			 	{
			 		createTime : '2017-04-16 11:24:00'
			 	},
			 	{
			 		createTime : '2017-04-16 11:25:00'
			 	}
			]
		}
		
	}));
	
	//加载奖品列表
	$.activityDevModel.setResult('/activity/loadPrizeList',$.extend({},defaultResult,{
		datas : {
			page : {
				currentPage : 1,
				totalResult : 100,
				showCount : 5,
				totalPage:20,
				list : 
				[
				 	{
				 		prizeName : '1元微信红包',
				 		imageUrl : 'image/defaultPrize.png',
				 		remark : '1元微信红包',
				 		createTime : '2017-04-06 11:16:00',
				 		state : 'ING'
				 	},
				 	{
				 		prizeName : '1元微信红包',
				 		imageUrl : 'image/defaultPrize.png',
				 		remark : '1元微信红包',
				 		createTime : '2017-04-06 11:16:00',
				 		state : 'CHECK'
				 	},
				 	{
				 		prizeName : '1元微信红包',
				 		imageUrl : 'image/defaultPrize.png',
				 		remark : '1元微信红包',
				 		createTime : '2017-04-06 11:16:00',
				 		state : 'INI'
				 	},
				 	{
				 		prizeName : '1元微信红包',
				 		imageUrl : 'image/defaultPrize.png',
				 		remark : '1元微信红包',
				 		createTime : '2017-04-06 11:16:00',
				 		state : 'SUC'
				 	},{
				 		prizeName : '1元微信红包',
				 		imageUrl : 'image/defaultPrize.png',
				 		remark : '1元微信红包',
				 		createTime : '2017-04-06 11:16:00',
				 		state : 'ERR'
				 	},{
				 		prizeName : '1元微信红包',
				 		imageUrl : 'image/defaultPrize.png',
				 		remark : '1元微信红包',
				 		createTime : '2017-04-06 11:16:00',
				 		state : 'ERR'
				 	}
				]
			}
		}
	}));
	
	
	//加载微信账户信息
	$.activityDevModel.setResult('/activity/loadWxAccount',$.extend({},defaultResult,{
		datas : {
			balance : 1000,
			total : 1500,
			type : 'WXZT'
		}
	}));
	
	//微信红包自提
	$.activityDevModel.setResult('/activity/sendWxzt',$.extend({},defaultResult));
	
	
})(jQuery);

