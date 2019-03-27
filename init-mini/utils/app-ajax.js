/**
 * 请求方法
 */

var appSession = require('./app-session.js');
var underscore = require('./underscore-extend.js');
const servicesConfig = require('../config/services-config.js');
const CONSTANTS = require('../config/constants.js');

var isLoadingButton = false;
var tempLoading = {};

/* 基础通信参数  */
var _authClient = function() {
	var deviceId = "miniprogram";

	var auth = {
		authParams: {
			timestamp: new Date().getTime(),
			deviceId: deviceId,
		},
		clientParams: {
			os: "mini",
			network: "",
			deviceId: deviceId,
			appVersion: CONSTANTS.APP_VERSION
		},
		openId: appSession.getUserInfoByKey("openId") || '',
		appId: CONSTANTS.APP_ID,
		areaCode: CONSTANTS.AREA_CODE,
		miniId: CONSTANTS.MINI_ID
	};

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
		ajaxParams["url"] = CONSTANTS["SERVICE_URL"] + _getInterfaceUrl(ajaxParams);
		
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

	},
	
	/**
     * 上下拉
     */
    datalistParam: function() {
      return {
        lastdate: 0,
        pageSize: 20,
        type: "DOWN" // DOWN UP
      };
    },
    
    // 下拉
    scrollDown: "DOWN",
    // 上拉
    scrollUp: "UP"
};

module.exports = appAjax;