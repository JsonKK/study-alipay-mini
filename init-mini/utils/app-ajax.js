/**
 * 请求方法
 */

var appSession = require('./app-session.js');
var underscore = require('./underscore-extend.js');
var app = getApp();
const servicesConfig = require('../config/services-config.js');
var appBasicParams = app.basicParams;
var serviceUrl = app.serviceUrl;
var appVersion = app.APP_VERSION;
var appId = appBasicParams.APP_ID;
var miniId = appBasicParams.miniId;
var siteId = appBasicParams.SITE_ID;

var localParamName = {
    // 设备id缓存名
    deviceId : 'temp_device_id',
    // 用户收集缓存名
    userActionParams : 'userActionParams',
    // openId缓存名
    openId : 'openId',
    // 交互返回失败提示
    errorMsg : '有点忙开个小差，稍后再试~'
}

/* 基础通信参数  */
var _authClient = function() {
	
	var deviceId = my.getStorageSync(localParamName.deviceId) || 'miniprogram';

    var userActionParams = my.getStorageSync(localParamName.userActionParams).data || {channelQrcodeId:''};
    
    var auth = {
		authParams : {
            timestamp : new Date().getTime(),
            token : appSession.getToken(),
			deviceId : deviceId,
            openId : appSession.getUserInfoByKey("openId") || ''
        },
        clientParams : {
          	os: "miniprogram",
            network: "",
			deviceId : deviceId,
            appVersion: appVersion
        },
        appId : appId,
        siteId: siteId,
        miniId:	miniId
    };
    auth = underscore.deepExtend(true, auth, userActionParams);
    
    return auth;
};

/**
 * 获取service
 * @param {Object} params
 */
var _getInterfaceUrl = function(params){
	var interfaceUrl;
	if(!params.otherParams){
		return servicesConfig[params["service"]];
	}
	for(var key in params.otherParams){
		interfaceUrl = (interfaceUrl || servicesConfig[params["service"]]).replace("{" +key + "}", params.otherParams[key]);
	}
	
	return interfaceUrl;
};

var _addUrlParam = function(data){
	
	var postData = "";
	for(var key in data){
		if(!postData){
			postData = key + "=" + data[key];
		}else{
			postData += "&" + key + "=" + data[key];
		}
	}
	
	return postData;
};

var appAjax = {

	/**
	 * 提交请求
	 * @param {Object} options
	 * service: ""			// 接口名
	 * data: "",			// 请求参数
	 * otherParams: "",		// 通过url传递的参数
	 * type : "",			// 请求类型
	 * success: "",			// 成功回调
	 * error: "",			// 失败回调
	 * complete: ""			// 完成回调
	 */	
	postJson : function(params) {
		
		var authClient =  _authClient();
		
		// 默认参数
		var defaultParams = {
			service : "",            // 服务的配置名称
			data : authClient, // 发送的data
			success : function(d){}, // 成功后回调
			error : null,   // 失败后回调
			autoShowWait : false,   // 自动显示菊花
			loadingText : "加载中...", // 加载的提示语
			autoCloseWait : true,  // 自动关闭菊花
			headers : {
				"base-params" : JSON.stringify(authClient),
				"token" : appSession.getToken() || ""
			}, // 额外参数，给少波用
			isAsync : true
		};
		var ajaxParams = underscore.deepExtend(true, defaultParams, params);
		
		if((ajaxParams.type == "GET" || ajaxParams.type == "DELETE") && ajaxParams.data && typeof(ajaxParams.data) == "object"){
			ajaxParams.data = _addUrlParam(ajaxParams.data);
		}
		
		// rest请求路径
		ajaxParams["url"] = serviceUrl + _getInterfaceUrl(ajaxParams);
		
		// 是否展示loading
		if(ajaxParams.autoShowWait && my.showLoading) {
			my.showLoading({
				content : ajaxParams.loadingText
			});
		}
	    my.request({
	        url : ajaxParams.url,
	        headers : ajaxParams.headers,
	        method : ajaxParams["type"] || 'POST',
	        data : ajaxParams.data,
	        success: function( res ) {
	            if(!res || !res.data){
	                return;
	            }
	            if(res.data.status == 1){
	                ajaxParams.success(res.data.content, res);
	            }else{
                var message = res.data.message ? res.data.message : "有点忙开个小差，稍后再试~";
                if(ajaxParams.error){
                  ajaxParams.error(message, res);
                }else{
                  my.showToast({
                      content: message,
                      type : "none",
                      duration: 2000
                  });
                }
	        	  }
	        },
	        fail: function(res) {
	        	var message = res.data && (res.data.message ? res.data.message : "有点忙开个小差，稍后再试~");
	           	ajaxParams.error && ajaxParams.error(message, res);
	        },
	        complete : function() {
	        	
	        	// 关闭loading
	        	if(ajaxParams.autoShowWait && my.hideLoading) {
	        		my.hideLoading();
	        	}
	        }
	    });

	}
};

module.exports = appAjax;