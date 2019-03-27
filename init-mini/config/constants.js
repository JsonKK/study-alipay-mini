/**
 * 常量配置
 */
var _ = require('../utils/underscore-extend.js');

//const RESOURCE_URL = "http://192.168.131.92:60301"; // 静态资源

// 服务连接配置
var serviceConfig = {

    SERVICE_URL: "https://apigw.qztqz.com", // 正式环境
    // SERVICE_URL: "http://59.61.216.120:18888", // 映射外网测试环境
	// SERVICE_URL: "http://192.168.15.78:8888", // 测试环境
    // SERVICE_URL: "http://192.168.131.149:8888", // lcy
//	SERVICE_URL: "http://192.168.131.101:8888", // sl
//	SERVICE_URL: "http://192.168.131.49:8888", // yxj
//	SERVICE_URL: "http://192.168.131.90:8888", // pdh

    // 正式环境
    // H5_URL: "https://H5.qztqz.com",
    // THIRD_URL: "https://third.qztqz.com", // 第三方h5

    // 测试环境
	// H5_URL: "http://59.61.216.125:18081",
	// THIRD_URL: "http://59.61.216.125:18087", // 第三方h5

//	RESOURCE_URL: RESOURCE_URL, // 静态资源
//	RESOURCE_IMAGE_URL: RESOURCE_URL + "/wx-mini/qztong", // 静态资源图片
	
	// oss上传url
	OSS_UPLOADER_URL : "https://qztong.oss-cn-shenzhen.aliyuncs.com"
};

// 应用信息配置
var versionInfoConfig = {
	APP_VERSION: "1.0.0",
	
	PROJECT_NAME : "泉州通",

	// 城市通2.0
//	APP_ID: "30668e7f8bc64e96992bbe7be26bc20a",			// 对应后台项目id
//	AREA_CODE : "330400",								// 预留
//	MINI_ID : "ae1ec80fadfe4b359c7c3881663f1e9d"			// APP_ID下对应的小程序（前后台约定）

	// 泉州通2.0
	APP_ID: "bac90cd7f8214e27a5c34e6679eb7f86",				// 对应后台项目id
	AREA_CODE: "350500", 									// 预留
	MINI_ID: "1604240e37384713abe7cffe96f60328" 			// APP_ID下对应的小程序（前后台约定）

	// 演示用
//	APP_ID: "267204254faf4ac3b514ca97b913ec0e",			// 对应后台项目id
//  AREA_CODE: "350500", 								// 预留
//  MINI_ID: "97c7145369eb4e8ca72d6503cb1278b6" 			// APP_ID下对应的小程序（前后台约定）    
};

// 存储配置
var storageConfig = {
	APP_USERINFO_SESSION: "_app_userinfo_session"
};

// 默认图片
var defaultImages = {
	DEFAULT_USER_HEADER: "../../img/user-header-default.png",
};

// 通用提示语
var commonMessageConfig = {

	// 空提示语
	EMPTY_MSG: "来，客官请坐！",

	// 网络问题提示语
	NETWORK_ERROR_TIPS: "网络不给力，请稍后再试~"

};

// 所有配置
var constants = _.deepExtend(true,
	serviceConfig,
	versionInfoConfig,
	storageConfig,
	defaultImages,
	commonMessageConfig
);

module.exports = constants;