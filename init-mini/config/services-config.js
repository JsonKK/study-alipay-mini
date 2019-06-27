/**
 * 服务的配置
 * @author cyixiang@linewell.com
 * @since 2018-05-03
 */

var _ = require('../utils/underscore-extend.js');

// 通用接口配置	
var commonServiceConfig = {
};

var searchConfig = {
};


let servicesConfig = _.deepExtend(true, 
	commonServiceConfig, 
	searchConfig
);

module.exports = servicesConfig;