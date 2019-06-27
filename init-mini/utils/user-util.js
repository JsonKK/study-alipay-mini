/**
 * 全局信息工具
 * 
 * @author lsj
 * @since 2018-07-11
 */

// 对象工具
var _ = require('./underscore-extend.js');
var tips = require("./tips.js");

/**
 * 基础通讯参数
 * arguments:explain
 */
var _authClient = function (app) {

	if (!app) {
		return;
	}

	let deviceId = my.getStorageSync("temp_device_id").data;
	let basicParams = app.basicParams;
	let appVersion = app.APP_VERSION,
		appId = basicParams.APP_ID,
		miniId = basicParams.miniId,
		siteId = basicParams.SITE_ID;
	// 基础参数不存在
	if (!appVersion || !appId || !miniId || !siteId) {
		return false;
	}
	let userActionParams = my.getStorageSync('userActionParams').data || { channelQrcodeId: '' };

	let auth = {
		authParams: {
			timestamp: new Date().getTime(),
			token: localOperates.getToken(),
			deviceId: deviceId,
			openId: localOperates.getValueByKey("openId") || ''
		},
		clientParams: {
			os: "miniprogram",
			network: "",
			deviceId: deviceId,
			appVersion: appVersion
		},
		appId: appId,
		siteId: siteId,
		miniId: miniId
	};
	auth = _.deepExtend(true, auth, userActionParams);
	return auth

}

// 日志类型枚举
const BehaviorLogType = {
	//	INTERFACE : 1,		// 访问接口
	OPEN_PAGE: 2,		// 页面访问
	CLOSE_PAGE: 3, 	// 关闭页面
	START_UP: 4,		// 打开应用
	SHUT_DOWN: 5,		// 关闭应用
	CLICK: 6,			// 点击
	SLIP: 7			// 滑动
};

// 二维码类型枚举
const MiniQrcodeType = {
	WXACODE: 1,			// 小程序码
	QRCODE: 2,				// 小程序二维码
	SETUP_MINI_QRCODE: 3	// 可设置小程序码
};

// 本地全局参数
const params = {
	channelName: "st",
	cacheName: "userActionParams",
	notFirstOpen: "notFirstOpen",
	barringArr: [
		{
			pageName: "pages/my/bind-phone",
			filter: ["page", "pageData"]
		}
	]
}

var localOperates = {

	/**
	 * 获取页面信息
	 */
	pagesInfo: function () {
		var currentPages = getCurrentPages();						// 访问历史
		var currentPage = currentPages[currentPages.length - 1];	// 当前页面信息
		var options = currentPage.options;							// 当前页面参数

		return {
			pages: currentPages || [],
			currentPage: currentPage || {},
			options: options || {}
		};
	},

	/**
	 * 获取当前页面的路径（带参数）
	 * @param {Object} pageObj
	 */
	getPageUrl: function (pageObj) {
		let path = pageObj.route,
			paramObj = pageObj.options,
			filterPageObj = _.where(params.barringArr, { pageName: path });

		if (_.isEmpty(paramObj)) {
			return path;
		}

		for (var i in paramObj) {
			if (i != params.channelName) {
				// 如果满足过滤页面的特定参数，不增加在url路径上返回
				if (filterPageObj.length > 0 && filterPageObj[0].filter.indexOf(i) > -1) {
					continue;
				}
				path = localOperates.addUrlParam(i, paramObj[i], path);
			}
		}

		return path;
	},

	/**
	 * 添加URL的参数
	 * @param name   名称
	 * @param value  值
	 * @param url    链接地址
	 */
	addUrlParam: function (name, value, url) {
		if (!value) {
			return url;
		}
		var tmpUrl = url;

		// 判断是否已经有其他参数
		if (tmpUrl.indexOf("?") >= 0) {
			tmpUrl += "&";
		} else {
			tmpUrl += "?";
		}
		tmpUrl += name + "=" + value;

		return tmpUrl;
	},

	/**
	 * 获取前一个页面的路径（带参数）
	 * @param {Array} pagesArr
	 */
	getPrePageUrl: function (pagesArr) {
		return pagesArr && pagesArr.length >= 2 ? localOperates.getPageUrl(pagesArr[pagesArr.length - 2]) : "";
	},

	/**
	 * 通过key获取值
	 * @params key 
	 */
	getValueByKey: function (key) {
		if (!key) {
			return;
		}

		var userinfo = this.getUserinfo();

		if (!userinfo) {
			return;
		}
		return userinfo[key];
	},

	getToken: function () {
		return this.getValueByKey("userTokenId");
	},

	/**
	 * 获取用户信息
	 */
	getUserinfo: function () {
		var userInfo = my.getStorageSync({ key: privateMethods.appBasicParams.APP_USERINFO_SESSION }).data;

		return userInfo;
	}
}

var remoteOperate = {

	/**
	 * 请求数据
	 * app:app.js对象
	 */
	_postUserJson: function (app, url, data = {}, success, fail) {
		if (!app) {
			return;
		}
		let serviceUrl = app.serviceUrl,
			authClient = _authClient(app);
		url = serviceUrl + url;
		data = _.deepExtend(true, data, authClient);
		my.request({
			url: url,
			header: {
				'content-type': 'application/json',
			},
			method: 'POST',
			data: data,
			success: function (res) {
				if (!res || !res.data) {
					return;
				}
				if (res.data.status == 1) {
					success && success(res.data.content, res);
				} else {
					var message = res.data.message ? res.data.message : "有点忙开个小差，稍后再试~";
					if (fail) {
						fail(message, res);
					}
				}
			},
			fail: function (res) {
				var message = res.data && (res.data.message ? res.data.message : "有点忙开个小差，稍后再试~");
				fail && fail(message, res);
			},
			complete: function () {
			}
		});
	}
}

// 私有方法
var privateMethods = {

	/**
	 * 获取页面url
	 * arguments:explain
	 */
	getCurrentUrl: function (type) {
		var pageStack = getCurrentPages();
		if (_.isEmpty(pageStack)) {
			return;
		}
		var thisPage;
		if (pageStack.length > 1) {
			thisPage = pageStack[pageStack.length - 1];
		} else {
			thisPage = pageStack[0];
		}

		var baseUrl = thisPage.route;
		var paramObj = thisPage.options;
		var params = "";

		if (_.isEmpty(paramObj) || type == 1) {
			return baseUrl;
		} else {
			for (var i in paramObj) {
				if (params.indexOf("?") >= 0) {
					params += "&";
				} else {
					params += "?";
				}
				params += i + "=" + paramObj[i];
			}
		}

		return baseUrl + params;
	},

	/**
	 * 用户信息增加phone
	 * arguments:explain
	 */
	bindLocalPhone: function (app, msg, callback) {
		let userInfo = localOperates.getUserinfo();
		if (!userInfo || !msg) {
			return;
		}
		userInfo.phone = msg.phone;

		// 设置缓存
		my.setStorage(privateMethods.appBasicParams.APP_USERINFO_SESSION, userInfo);

		callback && callback();
	},

	/**
	 * 用户登陆
	 * type: 1 onlaunch,2 onshow,3 不考虑版本只调用一次登陆
	 */
	userLogin: function (type, app, callback) {
		// 兼容 bug: iOS/Android 6.3.30，在 App.onLaunch 调用 wx.login 会出现异常；
		let version = "6.3.3",
			// loginCheck = appSession.loginCheck(),
			authClient = _authClient(app),
			that = this,
			postData = {};
		if (!app || !authClient) {
			return;
		}
	},

	/**
	 * 翻页变量
	 * arguments:explain
	 */
	appBasicParams: function () {
		let basicParams = {
			APP_USERINFO_SESSION: "_app_userinfo_session"
		};

		Object.defineProperty(basicParams, 'APP_ID', {
			writable: false,
			value: "300000000000000001"
		});

		Object.defineProperty(basicParams, 'SITE_ID', {
			writable: false,
			value: "100000"
		});

		// 生成小程序码所需id
		Object.defineProperty(basicParams, 'miniId', {
			writable: false,
			value: "696425ada740410992bfc1a1208e2195"
		});

		// h5图片文件夹
		Object.defineProperty(basicParams, 'resourceUrl', {
			writable: false,
			value: '/h5/images/mini-gift-img'
		});
		return basicParams;
	}

};

module.exports = {

	// 用户登陆
	userLogin: privateMethods.userLogin,

	// 绑定手机到本地缓存
	bindLocalPhone: privateMethods.bindLocalPhone,

	// app基础参数
	appBasicParams: privateMethods.appBasicParams
};
