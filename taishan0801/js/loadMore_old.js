/*
 * @description 加载更多插件，本工具依赖jquery及iscroll,请在调用前引入相应库并在页面加载完成后调用，调用此库需保证列表高度超过一屏，这样iscroll才会正常运行
 * @param {Object} config = {}
 * @property {Object} myScroll iscroll对象
 * @property {String} iScrollStatus 方向，指iscroll手势方向（手势向上为加载更多，手势向下为往上拉取值为'up'或'down'），应该动态获取
 * @property {Boolean} hasData 是否有数据
 * @property {Boolean} isLoading 是否正在加载中
 * @property {Object} config 配置项
 * @property {Function} initialized 初始化完成后回调
 *
 * @return {LoadMoreObject} LoadMore实例
 *
 * @author:jeff.shang<315545126@qq.com>
 * @date:2016-11-22
 * @constructor
 * */
function LoadMore(config) {
    this.myScroll;
    this.iScrollStatus = 'default';
    this.hasData;
    this.isLoading = false;
    this.leaved = true;

    this.config;
    this.initialized;
    this.userConfig = config;
    this.interval;
    this.totalSeconds = 0;

    /*
    * 开始计时
    * */
    this.startInterVal = function () {
        var self = this;
        self.interval = setInterval(function () {
            self.totalSeconds += 100;
        },100);
    };

    /*
    * 清除计时
    * */
    this.clearInterval = function () {
        var self = this;
        clearInterval(self.interval);
        this.totalSeconds = 0;
    };


    /*
    * @description 检查Config配置，如果参数有无throw错误，否则
    * @return {null|String} 如果有错误返回错误信息
    * */
    this.chekConfig = function(){
        var requiredFields = ['this.userConfig.bouncebottom','this.userConfig.bouncetop','this.userConfig.scroll','this.userConfig.scroll.container','this.userConfig.scroll.config','this.userConfig.scroll.config','this.userConfig.ajax','this.userConfig.ajax.$setup','this.userConfig.ajax.done',];
        var err = '';
        if(!this.userConfig || this.userConfig.constructor != Object){
            throw 'Please pass a valid argument!';
        }
        for(var i in requiredFields){
            eval('if(!'+requiredFields[i]+'){err = "please pass the ('+requiredFields[i].substr(21)+') argument";}');
        }
        return err ? err : null;
    };

    /*
    * @description 准备congfig配置项
    * @return {Object|null}
    * */
    this.prepareConfig = function () {
        var err = this.chekConfig();
        //抛出错误
        function throwErr (err){
            throw err;
        };
        if(err){
            throwErr(err);
            return null;
        }
        return this.userConfig;
    };

    /*
     * @description 设置config
     * @return {Boolean}
     * */
    this.setConfig = function () {
        var pconfig = this.prepareConfig();
        if(!pconfig){
            return false;//参数有误
        }
        this.config = pconfig;
        return true;
    };

    /*
     * @description 获取手势方向，函数中的this指向iscroll对象，iscroll.on('scroll',this.calculateDirection)为
     * @return {up|down}
     * */
    this.getScrollStatus = function () {
        if(this.myScroll.directionY == 1){//手势往上
            if((this.myScroll.maxScrollY - this.myScroll.y>>0) > this.config.bouncebottom){
                return this.iScrollStatus = 'bouncebottom';
            }else{
                return  this.iScrollStatus = 'justtop';
            }
        }else if(this.myScroll.directionY == -1){//手势往下
            if(this.myScroll.y>>0 > this.config.bouncetop){
                return  this.iScrollStatus = 'bouncetop';
            }else {
                return  this.iScrollStatus = 'justbottom';
            }
        }else{//0
            return  this.iScrollStatus = 'nomove';//未移动
        }
    };

    /*
     * @description 滚动到底部
     * */
    this.scrollToEnd = function () {
        this.myScroll.refresh();
        this.myScroll.scrollTo(0, this.myScroll.maxScrollY);
    };

    /*
     * @description 滚动到顶部
     * */
    this.scrollToTop = function () {
        this.myScroll.refresh();
        this.myScroll.scrollTo(0, 0);
    };

    this.showNomoreTips = function (callback){
        $(this.nomoreTips).show(0, function () {
            if(callback){
                callback();
            }
        });
    };

    this.showLoadingIcon = function(iconSelector,callback){
        $(iconSelector).show(0,function(){
            if(callback){
                callback();
            }
        });
    };

    this.hideLoadingIcon = function(iconSelector,callback){
        $(iconSelector).hide(0,function(){
            if(callback){
                callback();
            }
        });
    };

    this.resetSeconds = function (callback) {
        var self = this;

    };

    this.doAjax = function(loadType){
        var self = this;//指此对象
        var $deferred = $.ajax(self.config.ajax.$setup);
        $deferred.done(function (data) {
            function recursion(){
                function operateDom(){

                    var hasData = self.config.ajax.done(data);

                    self.isLoading = false;
                    iconSelector = loadType == 'bouncetop' ? self.config.refreshSelector : self.config.loadingSelector;

                    self.hideLoadingIcon(iconSelector);
                    if(!hasData){//没有数据了
                        $(self.config.loadTip).text(self.config.noMoreTipTxt).show();
                        return;
                    }else{
                        $(self.config.loadTip).show();
                    }
                    self.myScroll.refresh();
                }
                setTimeout(function () {
                    if(self.totalSeconds >= 1000){
                        //console.log('operateDom');
                        self.clearInterval();
                        operateDom();
                    }else {
                        //console.log('recursion');
                        recursion();
                    }
                },100);
            }
            recursion();
        });
    };

    this.loadData = function () {
        var self = this;//指此对象
        if(self.isLoading || !self.leaved){
            self.hideLoadingIcon();
            return;
        }

        if(self.getScrollStatus() == 'bouncebottom'){//加载更多
            self.leaved = false;self.isLoading = true;
            $(self.config.loadTip).hide();
            self.showLoadingIcon(self.config.loadingSelector, function () {
                self.scrollToEnd();
            });
            self.startInterVal();
            self.doAjax('bouncebottom');
        }else if(self.config.isNewAjaxParam){//其它滑动情况
        	self.leaved = true;self.isLoading = true;
            $(self.config.loadTip).hide();
            self.showLoadingIcon(self.config.loadingSelector, function () {
                self.scrollToEnd();
            });
            self.startInterVal();
            self.doAjax('bouncebottom');
        }else{
        	return;
        }
    };

    this.init = function(){
        var self = this;//指此对象
        if(!self.setConfig()){
            return;
        }

        /* 配置firstLoad参数之后表示首次加载 */
        if(self.config.firstLoad) {
            $.ajax(self.config.ajax.$setup).success(function (data) {
                if(data.models.list.length > 0){
                    self.config.firstLoad(data.models.list);
                    if(self.config.doFirstExtra){
                    	self.config.doFirstExtra(data);
                    }
                    if(data.models.list.length < self.config.pageCount){
                        $(self.config.loadTip).text(self.config.noMoreTipTxt).show();
                    }
                }else if(data.models.list.length == 0){
                    $(self.config.loadTip).text(self.config.noMoreTipTxt).show();
                    self.config.resoveNoData ? self.config.resoveNoData() : '';
                }
            });
            setTimeout(function () {
                //console.log($deferred);
            },2000);
        }


        this.myScroll = new IScroll(self.config.scroll.container, self.config.scroll.config);
        this.myScroll.on('scroll',function(scrollObj){
            self.loadData();
        });
        this.myScroll.on('scrollEnd', function (scrollObj) {
            //console.log('scrollEnd');
            self.leaved = true;
        });

    };
    this.init();

    /*
     * @description 初始化后改变ajax的请求参数
     * @return {true}
     * */
    this.setAjaxParams = function (params) {
        if(params && params.constructor == Object){
            this.config.ajax.$setup.data = params;
            this.config.isNewAjaxParam = true;
            return true;
        }
        throw 'Please pass a valid argument!';
    };
    
    this.destroy = function () {
        //this.myScroll.destroy();//删除iScroll对象
        for(var i in this){//删除各个属性
            delete this[i];
        }
    };
}