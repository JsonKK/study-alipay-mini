/**
 * 服务的配置
 * @author cyixiang@linewell.com
 * @since 2018-05-03
 */

var _ = require('../utils/underscore-extend.js');

// 通用接口配置	
var commonServiceConfig = {
	
	// 登录接口
	LOGIN : "/tongplatform/base/user-sso/v1/mini/user/login",
	
	// 手机登录
	PHONE_LOGIN : "/tongplatform/base/user-sso/v1/mini/user/verify-code-login",
	
	// 用户信息登录
	USER_INFO_LOGIN : "/tongplatform/base/user-sso/v1/mini/user/wechat-login",
	
	// 天气
	WEATHER : "/tongplatform/common/third-party-extranet/v1/weather/now-weather",
	
	// 分享回调
	SHARE : "/user/share/share-callback",
	
	// 注册
	REGISTER : "/user/miniRegister",
	
	// 获取验证码
	GET_VERIFY_CODE : "/tongplatform/base/user-sso/v1/mini/user/bind-verify-code/{phone}",
	
	// 获取token
	GET_UPLOAD_TOKEN : "/tongplatform/common/third-party-extranet/v1/alioss/token-for-pc"
};

var searchConfig = {
	
	// 获取水印关键词
	GET_SEARCH_PLACEHOLDER_KEYWORD : "/tongplatform/common/generalconfig/v1/mini/keywords/getKeyword",
	
	// 获取热搜关键词
	GET_HOT_SEARCH_KEYWORD : "/tongplatform/common/generalconfig/v1/mini/keywords/listHotKeywords",
	
	// 获取资讯列表
	GET_SEARCH_INFORMATION_LIST : "/tongplatform/business/content/v1/article/search",
	
	// 获取服务列表
	GET_SEARCH_SERVICE_LIST : "/tongplatform/support/service/v1/service/list-search",
	
	// 获取直播列表
	GET_SEARCH_LIVE_LIST : "/tongplatform/common/article/v1/lives/search",
	
	// 获取直播详情
	GET_LIVE_INFO : "/tongplatform/common/article/v1/lives/{id}"
};



// 随手拍相关
var patServiceConfig = {
	
	// 获取主题列表
	GET_PAT_TOPIC_LIST : "/tongplatform/business/snapshot/v1/snapshot-topic/list-top-level-topic",
	
	// 获取主题下随手拍列表
	GET_PAT_LIST : "/tongplatform/business/snapshot/v1/snapshot/list",
	
	// 保存随手拍
	SNAPSHOT_SAVE : "/tongplatform/business/snapshot/v1/snapshot/",
	
	// 获取我的随手拍
	GET_MY_SNAPSHOT_LIST : "/tongplatform/business/snapshot/v1/snapshot/list-my",
	
	// 获取随手拍详情
	GET_SNAPSHOT_DETAIL : "/tongplatform/business/snapshot/v1/snapshot/detail/{id}",
	
	// 获取随手拍评论
	GET_SNAPSHOT_DETAIL_COMMENT : "/tongplatform/business/snapshot/v1/social-comment/list-social-comment",
	
	// 获取随手拍配置
	GET_SNAPSHOT_PUBLISH_CONFIG : "/tongplatform/business/snapshot/v1/manage/configs/get",
	
};


let servicesConfig = _.deepExtend(true, 
	commonServiceConfig, 
	searchConfig
);

module.exports = servicesConfig;