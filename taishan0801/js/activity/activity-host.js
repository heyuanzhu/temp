/*
 * 定义活动域名 
 */
//var host = 'http://127.0.0.1:8180/links-software-web-activity';

var host = getRootPath();

function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPath=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
   
    if(curWwwPath.indexOf('links-software-web-activity')!=-1){
    	localhostPath = localhostPath + '/links-software-web-activity'
    }
    
    return localhostPath;
};

/**
 * 获取当前页面url
 * 
 * @returns
 */
function getCurrentUrl(){
	var curWwwPath=window.document.location.href;
	return curWwwPath;
}

/**
 * 获取活动跟目录
 * 
 * 例如 ：http://127.0.0.1:8180/links-software-web-activity/1/
 * 
 * @returns {String}
 */
function getActivityHost(){
	return host + '/' + $('#activityId').val() + '/';
}

