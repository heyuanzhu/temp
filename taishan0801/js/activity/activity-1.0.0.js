
/*
 * 活动jsApi
 * 
 * @Version 1.0.0
 * @author chen.yong 
 * @date 2017-04-04
 * 
 */
(function($){
	
	$.extend({
		activity : {
			
			/** 基本配置 */
			settings : {
				host : undefined,//活动域名
				debug : false ,//debug模式，debug模式下会打印日志
				devModel : false //开发者模式，开发者模式下，不再调用$.ajax()发起远程请求，而是使用默认数据
			},
			
			/** 设置默认值 */
			setDefaults : function(settings){
				this.settings = $.extend(this.settings,settings||{});
			},
			
			
			/** 初始化 */
			init : function(settings){
				this.settings.showErrorMsg = this.showErrorMsg;//错误消息
				this.settings.showSuccessMsg = this.showSuccessMsg;//显示成功消息
				this.settings.notLogin = this.notLogin;//登录失效或者未登录时处理函数
				this.settings.ajax = this.ajax;//ajax调用
			},
			
			/**
			 * ajax远程调用 
			 * 
			 * @param options 请求参数
			 * 			<br>options.data ajax请求参数
			 * 			<br>options.sucFunc 请求成功处理，该方法会被options.success覆盖 function(datas){}
			 * 			<br>option.errFunc 请求失败处理，业务请求失败，即result.success为false function(msg,errorCode){}
			 * 			<br>options.notLogin 用户登录失效处理，该方法会被options.success覆盖 function(msg){}
			 * 			<br>options.action 请求action
			 * 			<br>options.success 请求成功处理函数，$.ajax.success function(result){}
			 * 			<br>options.error 请求失败处理函数，$.ajax.error function(e){}
			 */
			ajax : function(options){
				_this = this;
				
				if(!options.action) return;//未配置action
				
				options.errFunc = options.errFunc || _this.settings.showErrorMsg;
				
				//默认请求成功处理
				options.success = options.success || function(result){
					
					if(_this.settings.debug) console.log(result);
					
					if(result.success){
						if(options.sucFunc) options.sucFunc.call(_this,result.datas);
					}else if('E00608002'==result.code){//登录失效
						if(options.notLogin) options.notLogin.call(_this,result.message,result.code);
						else if(_this.settings.notLogin) _this.settings.notLogin.call(_this,result.message,result.code);
					}else{
						if(options.errFunc) options.errFunc.call(_this,result.message,result.code);
					}
				};
				
				//默认请求失败处理
				options.error = options.error || function(e){
					
					if(_this.settings.debug) console.log(e);
					
					if(_this.settings.showErrorMsg) _this.settings.showErrorMsg.call(_this,'请求失败');
				};
				
				//请求参数
				options.data = options.data || {};
				options.async = options.async || true;
				options.complete = options.complete || function(){};
				
				/* 开启了开发者模式，系统会跳过远程请求，直接从$.activityDevModel获取结果，开发者模式仅限调试过程使用，开发者模式需要引入activity-dev.js */
				if(_this.settings.devModel==true && $.activityDevModel){
					var result = $.activityDevModel.getResult(options.action);
					if(_this.settings.debug) console.log(result);
					options.sucFunc.call(_this,result.datas);
					options.complete.call(_this);
					return;
				}
				
				if(!_this.settings.host) return;//未配置活动域名
				
				var url = _this.settings.host + options.action;
				
				$.ajax({
					url : url,
					type : 'post',
					data : options.data,
					dataType : 'json',
					async : options.async,
					success : options.success,
					error : options.error,
					complete : function(){
						options.complete.call(_this);
					}
				});
				
			},
			
			/**
			 * 记录日志
			 * 
			 * @param options 参数
			 * 			options.data 请求参数
			 * 
			 */
			log : function(options){
				options.action = '/activity/log';
				options.success = function(result){};
				options.error = function(e){};
				this.ajax(options);
			},
			
			/**
			 * 参与活动
			 * 
			 * @param options
			 * 			<br>options.data 参数
			 * 				<br>options.data.activityId 活动id
			 * 				<br>options.data.activityEntryCode 动作code
			 * 			<br>options.sucFunc 请求成功处理函数 function(datas){}			
			 * 				<br>datas.activityLoggeryId 参与记录id
			 * 				<br>datas.activityPrizePackage 奖项名称，如果不存在或者为null表示未中奖
			 * 				<br>datas.activityPrizePackageId 奖项id，如果不存在或者为null表示未中奖
			 * 				<br>datas.uuid 请求uuid
			 * @returns
			 */
			lottery : function(options){
				options.action = '/activity/lottery';
				this.ajax(options);
			}, //end $.activity.lottery
			
			
			
			/**
			 * 加载中奖奖项和奖品
			 * 
			 * 该方法会验证消费者登录状态，session超时无法查询到结果
			 * 
			 * @param options
			 * 			<br>options.data 调用参数
			 * 				<br>data.activityId 活动id
			 * 				<br>data.activityLotteryId 参与记录id
			 * 		 	<br>options.sucFunc 请求成功时处理函数,function(datas){}
			 *	 			<br>datas.activityPrizePackage 奖项名称
			 *	 			<br>datas.activityPrizePackageId 奖项id
			 *	 			<br>datas.activityPrizeList 奖品列表，List
			 *	 			<br>datas.activityPrizeList.activityPrizeId 活动奖品id
			 *	 			<br>datas.activityPrizeList.prizeName 奖品名称
			 *	 			<br>datas.activityPrizeList.prizeId 奖品名称
			 *	 			<br>datas.activityPrizeList.prizePrice 奖品价格
			 *	 			<br>datas.activityPrizeList.prizeValue 奖品面额
			 *	 			<br>datas.activityPrizeList.imageUrl 奖品图片
			 * 			<br>options.notLogin 登录超时提示 function(msg){}
			 * 				<br>msg 系统响应消息
			 * 
			 */
			loadAwardPrize : function(options){
				options.action = '/activity/loadAwardPrize';
				this.ajax(options);
			},// end $.activity.loadAwardPrize
			
			/**
			 * 加载消费者信息
			 * 
			 * 该方法会验证消费者登录状态，session超时无法查询到结果
			 * 
			 * @param options
			 * 			<br>options.data 参数
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.activityRegister 活动消费者，Object
			 * 					<br>datas.activityRegister.name 消费者姓名
			 * 					<br>datas.activityRegister.wxNick 微信昵称
			 * 					<br>datas.activityRegister.wxHeadUrl 微信头像url
			 * 					<br>datas.activityRegister.wxOpenId 微信openId 
			 * 					<br>datas.activityRegister.ysWxOpenId 易赏微信openId
			 * 					<br>datas.activityRegister.phone 手机号码
			 * 					<br>datas.activityRegister.sex 性别0-未知，1-男，2-女
			 * 					<br>datas.activityRegister.age 年龄
			 * 					<br>datas.activityRegister.email 邮箱
			 * 				<br>datas.wxBalance 微信红包余额
			 * 				<br>datas.jfBalance 积分账户余额
			 * 				<br>datas.jfUnit 积分名称
			 * 			<br>options.notLogin 登录失效处理 function(msg){}
			 * 				<br>msg 系统响应消息
			 * 
			 */
			loadRegisterInfo : function(options){
				options.action = '/activity/loadRegisterInfo';
				this.ajax(options);
			},// end $.activity.loadRegisterInfo
			
			
			/**
			 * 保存消费者信息
			 * 
			 * 该方法会验证消费者登录状态，session超时无法查询到结果
			 * 
			 * @param options
			 * 			<br>options.data 参数
			 * 				<br>data.name 消费者姓名
			 * 				<br>data.phone 消费者手机号码
			 * 				<br>data.sex 消费者性别
			 * 				<br>data.age 消费者年龄
			 * 				<br>data.extendParams 其他信息，json对象{}，例如data.extendParams={};data.extendParams.recAddress='南京东路160号';
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 			<br>options.notLogin 登录失效处理 function(msg){}
			 * 				<br>msg 系统响应消息
			 * 
			 */
			saveRegisterInfo : function(options){
				options.action = '/activity/saveRegisterInfo';
				this.ajax(options);
			},// end $.activity.saveRegisterInfo
			
			/**
			 * 加载微信红包明细
			 * 
			 * 该方法会验证消费者登录状态，session超时无法查询到结果
			 * 
			 * @param options
			 * 			<br>options.data 参数
			 * 				<br>options.data['page.currentPage'] 当前页码，非必填，默认1
			 * 				<br>options.data['page.showCount'] 每页显示数量，非必填，默认15
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.page 微信红包明细-分页对象
			 * 				<br>datas.page.currentPage 当前页码
			 * 				<br>datas.page.totalResult 总数量
			 * 				<br>datas.page.showCount 每页显示数量
			 * 				<br>datas.page.list 微信红包明细列表 List
			 * 					<br>datas.page.list.amount 金额 
			 * 					<br>datas.page.list.balance 账户余额 
			 * 					<br>datas.page.list.type 账户类型 WXLJ--微信红包-累计,WXZT-微信红包-自提
			 * 					<br>datas.page.list.detailType 明细类型,in-入账,out-出账
			 * 					<br>datas.page.list.operateType 操作类型,PRIZE-活动抽奖，SNED自动发奖,GET消费者自提,RETURN退回账户
			 * 					<br>datas.page.list.createTime 创建时间yyyy-MM-dd HH:mm:ss
			 * 			<br>options.notLogin 登录失效处理 function(msg){}
			 * 				<br>msg 系统响应消息
			 * 
			 */
			loadWxDetail : function(options){
				options.action = '/activity/loadWxDetail';
				this.ajax(options);
			},// end $.activity.loadWxDetail
			
			
			/**
			 * 加载积分账户明细，如果有多个积分账户，加载第一个账户明细
			 * 
			 * 该方法会验证消费者登录状态，session超时无法查询到结果
			 * 
			 * @param options
			 * 			<br>options.data 参数
			 * 				<br>options.data['page.currentPage'] 当前页码，非必填，默认1
			 * 				<br>options.data['page.showCount'] 每页显示数量，非必填，默认15
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.page 微信红包明细-分页对象
			 * 				<br>datas.page.currentPage 当前页码
			 * 				<br>datas.page.totalResult 总数量
			 * 				<br>datas.page.showCount 每页显示数量
			 * 				<br>datas.page.list 微信红包明细列表 List
			 * 					<br>datas.page.list.amount 金额 
			 * 					<br>datas.page.list.amount.type 明细类型,in-入账,out-出账
			 * 					<br>datas.page.list.amount.jfActivityType 积分活动类型，HD-活动,JF-积分商城活动
			 * 					<br>datas.page.list.amount.jfActivityName 积分活动名称
			 * 					<br>datas.page.list.amount.createTime 创建时间yyyy-MM-dd HH:mm:ss
			 * 			<br>options.notLogin 登录失效处理 function(msg){}
			 * 				<br>msg 系统响应消息
			 * 
			 */
			loadJfDetail : function(options){
				options.action = '/activity/loadJfDetail';
				this.ajax(options);
			},// end $.activity.loadJfDetail
			
			
			/**
			 * 加载积分账户明细，如果有多个积分账户，加载第一个账户明细
			 * 
			 * 该方法会验证消费者登录状态，session超时无法查询到结果
			 * 
			 * @param options
			 * 			<br>options.data 参数
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.list 排行榜列表
			 * 					<br>datas.list.name 用户名 
			 * 					<br>datas.list.count 计数
			 * 			<br>options.notLogin 登录失效处理 function(msg){}
			 * 				<br>msg 系统响应消息
			 * 
			 */
			loadRanking : function(options){
				options.action = '/activity/loadRanking';
				this.ajax(options);
			},// end $.activity.loadRanking
			
			
			/**
			 * 加载串码查询记录
			 * 
			 * @param options
			 * 			<br>options.data 参数
			 * 				<br>options.data.activityId 活动id
			 * 				<br>options.data.code 串码
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.list 排行榜列表，最多3条记录
			 * 					<br>datas.list.createTime 查询时间
			 * 				<br>datas.activityName 活动名称
			 * 				<br>datas.activityIamgeUrl 活动图片
			 * 				<br>datas.searchCount 查询次数
			 */
			loadSearchList : function(options){
				options.action = '/activity/loadSearchList';
				this.ajax(options);
			},// end $.activity.loadSearchList
			
			
			/**
			 * 加载奖品列表
			 * 
			 * 该方法会验证消费者登录状态，session超时无法查询到结果
			 * 
			 * @param options
			 * 			<br>options.data 参数
			 * 				<br>options['page.currentPage'] 当前页，非必填，默认第1页
			 * 				<br>options['page.showCount'] 每页加载条数，非必填，默认15条
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.page 微信红包明细-分页对象
			 * 				<br>datas.page.currentPage 当前页码
			 * 				<br>datas.page.totalResult 总数量
			 * 				<br>datas.page.showCount 每页显示数量
			 * 				<br>datas.page.list 微信红包明细列表 List
			 * 				<br>datas.page.list 奖品列表
			 * 					<br>datas.page.list.prizeName 奖品名称	
			 * 					<br>datas.page.list.imageUrl 奖品图片
			 * 					<br>datas.page.list.remark 奖品描述，备注
			 * 					<br>datas.page.list.createTime 中奖时间
			 * 					<br>datas.page.list.state 状态 INI-待处理,CHECK-待审核,ING-发奖中,SUC-发奖成功,ERR-发奖失败
			 *			<br>options.notLogin 登录失效处理 function(msg){}
			 * 				<br>msg 系统响应消息
			 * 
			 */
			loadPrizeList : function(options){
				options.action='/activity/loadPrizeList';
				this.ajax(options);
			},// end $.activity.loadPrizeList
			
			
			/**
			 * 加载微信账户信息
			 * 
			 * @param options 参数
			 * 		<br>options.data 参数
			 * 		<br>options.sucFunc 加载成功处理 function(datas){}
			 * 			<br>datas.balance 账户余额
			 * 			<br>datas.total 累计账户总额
			 * 			<br>datas.type 微信账户类型 WXLJ-累计，小额红包累计，满1元自动发放，不能自提，WXZT-自提，需要用户自提操作
			 *		<br>options.notLogin 登录失效处理 function(msg){}
			 * 			<br>msg 系统响应消息
			 * 
			 */
			loadWxAccount : function(options){
				options.action='/activity/loadWxAccount';
				this.ajax(options);
			},// end $.activity.loadWxAccount
			
			
			/**
			 * 微信红包自提
			 * 
			 * @param options 参数
			 * 		<br>options.data 参数
			 * 			<br>options.data.amount 提取金额，1-200，最多两位小数
			 * 		<br>options.sucFunc 加载成功处理 function(datas){}
			 *		<br>options.notLogin 登录失效处理 function(msg){}
			 * 			<br>msg 系统响应消息
			 * 
			 */
			sendWxzt : function(options){
				options.action='/activity/sendWxzt';
				this.ajax(options);
			},// end $.activity.loadWxAccount
			
			
			/**
			 * 增加访问记录
			 * 
			 * @param options
			 * 
			 */
			addPageView : function(options){
				try{
					options = options || {};
					options.data = options.data || {};
					var activityId = $('#activityId').val();
					if(!activityId) return;
					var sessionId = getUvCookie();//acttivity-utils.js
					if(!sessionId) {
						sessionId = getRandomStr();//acttivity-utils.js
						setUvCookie(sessionId);
					}
					var url = getCurrentUrl();//acttivity-host.js
					
					options.data.activityId = activityId;
					options.data.sessionId = sessionId;
					options.data.url = options.data.url || url;
					
					options.action='/activity/addPageView';
					this.ajax(options);
				}catch(e){
					
				}
			},
			
			
			/**
			 * 加载中奖奖品详情
			 * 
			 * @param options 参数
			 * 		<br>options.data 参数
			 * 			<br>options.data.activityId 活动id
			 * 			<br>options.data.activityLotteryDetailId 中奖记录id
			 * 		<br>options.sucFunc 加载成功处理 function(datas){}
			 * 			<br>datas.activityPrize 奖品信息
			 * 				<br>datas.activityPrize.prizeName 奖品名称
			 * 				<br>datas.activityPrize.imageUrl 奖品图片
			 * 				<br>datas.activityPrize.sendType 奖品发放类型 HF-话费,LL-流量,JYK-加油卡,YHQ-优惠券,WL-物流,ZT-自提,其他类型参考prizeSendType(activity-utils.js)
			 * 			<br>datas.extendParams 其他信息，其他信息都不是必填项，可能返回null或者不返回
			 * 				<br>datas.extendParams.phone 手机号码
			 * 				<br>datas.extendParams.couponCode 优惠券码(优惠券类)，卡号卡密(优惠券类)，自提码(自提类)、code码(code码类型)等
			 * 				<br>datas.extendParams.ztUrl 自提码核销链接(自提类)
			 * 				<br>datas.extendParams.storeList 门店列表(自提类)，list
			 * 				<br>datas.extendParams.recName 收货人姓名（物流类）
			 * 				<br>datas.extendParams.recPhone 收货人手机号码（物流类）
			 * 				<br>datas.extendParams.province 收货人地址--省份（物流类）
			 * 				<br>datas.extendParams.provinceId 省份id（物流类）
			 * 				<br>datas.extendParams.city 收货人地址--城市（物流类）
			 * 				<br>datas.extendParams.cityId 城市id（物流类）
			 * 				<br>datas.extendParams.county 收货人地址--县（物流类）
			 * 				<br>datas.extendParams.countyId 县id（物流类）
			 * 				<br>datas.extendParams.town 收货人地址--镇（物流类）
			 * 				<br>datas.extendParams.townId 镇id（物流类）
			 * 				<br>datas.extendParams.address 收货人详细地址（物流类）
			 * 				<br>datas.extendParams.qq qq号码（Q币类）
			 *		<br>options.notLogin 登录失效处理 function(msg){}
			 * 			<br>msg 系统响应消息
			 * 
			 */
			loadPrizeDetail : function(options){
				options.action='/activity/loadPrizeDetail';
				this.ajax(options);
			},// end $.activity.loadWxAccount
			
			
			/**
			 * 加载省份列表
			 * 
			 * @param options
			 * 			<br>options.data 请求数据
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.list 省份列表
			 * 				<br>datas.list.name 省份名称
			 * 				<br>datas.list.provinceId 省份id
			 */
			loadProvinceList : function(options){
				options.action='/commons/loadProvinceList';
				this.ajax(options);
			},// 
			
			
			/**
			 * 加载城市列表
			 * 
			 * @param options
			 * 			<br>options.data 请求数据
			 * 				<br>options.data.provinceId 城市id
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.list 城市列表
			 * 				<br>datas.list.name 省份名称
			 * 				<br>datas.list.cityId 城市id
			 */
			loadCityList : function(options){
				options.action='/commons/loadCityList';
				this.ajax(options);
			},// 
			
			/**
			 * 加载县列表
			 * 
			 * @param options
			 * 			<br>options.data 请求数据
			 * 				<br>options.data.cityId 省份id
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.list 县列表
			 * 				<br>datas.list.name 省份名称
			 * 				<br>datas.list.countyId 县id
			 */
			loadCountyList : function(options){
				options.action='/commons/loadCountyList';
				this.ajax(options);
			},// 
			
			/**
			 * 加载镇列表
			 * 
			 * @param options
			 * 			<br>options.data 请求数据
			 * 				<br>options.data.countyId 县id
			 * 			<br>options.sucFunc 加载成功处理 function(datas){}
			 * 				<br>datas.list 乡镇列表
			 * 				<br>datas.list.name 省份名称
			 * 				<br>datas.list.townId 乡镇id
			 */
			loadTownList : function(options){
				options.action='/commons/loadTownList';
				this.ajax(options);
			},// 
			
			
			/**
			 * 初始化省市区下拉框
			 * 
			 * @param options
			 * 			<br>options.province 省份select元素
			 * 			<br>options.city 市select元素
			 * 			<br>options.county 县select元素
			 * 			<br>options.town 镇select元素
			 * 
			 */
			initialArea : function(options){
				
				var _this = this;
				var _selectProvince = $(options.province);
				var _selectCity = $(options.city);
				var _selectCounty = $(options.county);
				var _selectTown = $(options.town);
				
				//加载城市列表
				function loadCityList(provinceId){
					
					if(_selectCity.length==0) return;
					_selectCity.empty();
					_selectCity.show();
					_this.loadCityList({
						data : {
							provinceId : provinceId,
						},
						sucFunc : function(datas){
							for(var i=0;i<datas.list.length;i++){
								var city = datas.list[i];
								_selectCity.append('<option value="'+city.cityId+'">'+city.name+'</option>');
							}
							
							var cityId = _selectCity.val();
							if(cityId == null || cityId == 0 || cityId=='') return;
							loadCountyList(cityId);
						}
					});
				};
				
				//加载县列表
				function loadCountyList(cityId){
					
					if(_selectCounty.length==0) return;
					_selectCounty.empty();
					
					_this.loadCountyList({
						data : {
							cityId : cityId,
						},
						sucFunc : function(datas){
							
							if(datas.list.length==0) {
								_selectCounty.hide();
								return;
							}
							
							_selectCounty.show();
							
							for(var i=0;i<datas.list.length;i++){
								var county = datas.list[i];
								_selectCounty.append('<option value="'+county.countyId+'">'+county.name+'</option>');
							}
							
							var countyId = _selectCounty.val();
							if(countyId == null || countyId == 0 || countyId=='') return;
							loadTownList(countyId);
						}
					});
				};
				
				//加载镇列表
				function loadTownList(countyId){
					
					if(_selectTown.length==0) return;
					_selectTown.empty();
					
					_this.loadTownList({
						data : {
							countyId : countyId,
						},
						sucFunc : function(datas){
							
							if(datas.list.length==0) {
								_selectTown.hide();
								return;
							}
							
							_selectTown.show();
							
							for(var i=0;i<datas.list.length;i++){
								var town = datas.list[i];
								_selectTown.append('<option value="'+town.townId+'">'+town.name+'</option>');
							}
						}
					});
				};
				
				//初始化省
				if(_selectProvince.length>0){
					_this.loadProvinceList({
						sucFunc : function(datas){
							
							for(var i=0;i<datas.list.length;i++){
								var province = datas.list[i];
								_selectProvince.append('<option value="'+province.provinceId+'">'+province.name+'</option>');
							}
							var provinceId = _selectProvince.val();
							loadCityList(provinceId);
						}
					});
					
					_selectProvince.change(function(){
						var provinceId = $(this).val();
						loadCityList(provinceId);
					});
				};
				
				if(_selectCity.length>0){
					
					_selectCity.change(function(){
						var cityId = $(this).val();
						if(cityId == null ||cityId == 0 || cityId=='') return;
						loadCountyList(cityId);
					});
				}
				
				if(_selectCounty.length>0){
					
					_selectCounty.change(function(){
						var countyId = $(this).val();
						if(countyId == null || countyId == 0 || countyId=='') return;
						loadTownList(countyId);
					});
				}
				
				
			},// 
			
			
			/**
			 * 消费者未登录或者登录失效提示
			 * 
			 * @param msg 提示信息
			 * 
			 */
			notLogin : function(msg,errorCode){
				
				//this.showErrorMsg(msg,errorCode);
				// 重新获取授权
				if(!this.settings.host) return;
				var currentUrl = getCurrentUrl();//activity-host.js
				var wxUrl = this.settings.host + '/weixinActivity/ysWxAuthorize';
				gotoUrl(wxUrl,{
					activityId : $('#activityId').val(),
					uri : currentUrl
				})
				
			},
			
			/**
			 * 错误提示
			 * 
			 * @param msg 提示信息
			 * 
			 */
			showErrorMsg : function(msg,errorCode){
				if(errorCode) msg = msg+"[错误:"+errorCode+"]";
				$.alert(msg);
			},//end $.activity.showErrorMsg
			
			/**
			 * 错误提示
			 * 
			 * @param msg 提示信息
			 * 
			 */
			showSuccessMsg : function(msg,sucFunc){
				$.alert(msg);
				if(sucFunc) sucFunc.call(this);
			}//end $.activity.showErrorMsg
			
		} //end $.activity
	});
	
	//初始化配置
	$.activity.init();
	
	//设置host，依赖activity-host.js
	if(host){
		//设置默认配置
		$.activity.setDefaults({
			host : host
		});
		
	}
	
	//记录PV
	$.activity.addPageView();
	
})(jQuery);

