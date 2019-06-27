var appAjax = require('./app-ajax.js');
var appSession = require("./app-session.js");
var constants = require("../config/constants")
var app = getApp();

var remote = {

	/**
	 * 绑定手机
	 * @param {Object} phone
	 * @param {Object} _callback
	 */
	_bindUserPhone: function (phone, _callback) {
		appAjax.postJson({
			service: "BIND_PHONE",
			data: {
				phone: phone
			},
			success: function (ret) {
				_callback && _callback(ret);
			}
		});
	}
};

var privateMethods = {

	/**
	 * 登录
	 * @param {Object} callback
	 */
	_login: function (callback) {

		my.showLoading({
			content: '登录中'
		});

		my.getAuthCode({
			scopes: ['auth_user'],
			success: function (data) {

				my.getAuthUserInfo({
					success: function (res) {
						// 登录
						appAjax.postJson({
							service: "LOGIN",
							data: {
								authCode: data.authCode,
								userName: res.nickName,
								photoUrl: res.avatar
							},
							success: function (result) {
								// 缓存用户信息
								appUser.saveLoginInfo(result || {});
								// 回调
								callback && callback(result.dto || {});
							}
						});
					},
					fail: function (e) {
						my.hideLoading();
					}
				});
			},
			fail:function(data){
				my.hideLoading();
			}

		})
	}
}

var appUser = {

	/**
	 * 需要登录的跳转
	 * page为空不能传null 要 ""
	 */
	loginRedirect: function (page, callback) {

		// 是否有登录
		if (!appSession.loginCheck()) {
			appUser.login(function (result) {
				if (result && !result.phone) {
					my.navigateTo({
						url: '../register/bind-phone?page=' + page
					})
				} else {
					my.navigateTo({
						url: page
					})
				}

				// 支持回调
				callback && callback();
			});
		} else {
			my.navigateTo({
				url: page
			})
		}
	},

	/**
	 * 需要登录的操作
	 * @param page  操作页 page为空不能传null 要 ""
	 * @param callback
	 */
	loginHandle: function (page, callback) {

		// 是否有登录
		if (!appSession.loginCheck()) {
			appUser.login(function (result) {

				callback && callback();

				// if (result && !result.phone) {
				//    	my.navigateTo({
				//      	url: "../register/bind-phone?page=" + page
				//    	});
				// } else {
				//    callback && callback();
				// }
			});
		} else {
			callback && callback();
		}
	},

	bindPhone: remote._bindUserPhone,

	/**
	 * 登录
	 * @param {Object} successCallback
	 * @param {Object} failCallback
	 */
	login: function (callback, failCallback) {
		var that = this;

		// 查看是否授权
		privateMethods._login(callback);
	},

	/**
	 * 退出登录
	 */
	logOut: function (callback) {
		var that = this;
		my.confirm({
			title: '',
			content: '确定要退出您的账号？',
			success: function (res) {
				if (res.confirm) {

					// 清理用户信息
					appSession.clearUserInfo();
					callback && callback();
				}
			}
		});
	},

	/**
	 * 登录
	 * @param {Object} callback
	 * @param {Object} failCallback
	 */
	myLogin: function (callback, failCallback) {

		appUser.login(function (result) {
			// if (result && !result.phone) {
			//      		my.navigateTo({
			//          		url: '../register/bind-phone'
			//        		})
			//      		return;
			//      	}

			callback && callback(result || {});
		}, failCallback);
	},

	/**
	 * 保存用户信息
	 * @param {Object} result
	 */
	saveLoginInfo: function (result) {

		var data = result.userBaseDTO || {};

		// 用户头像
		if (!data.photoUrl) {
			result.thirdInfoDTO && result.thirdInfoDTO.headimgurl && (data.photoUrl = result.thirdInfoDTO.headimgurl);
		}

		result.dto && result.dto.userTokenId && (data.userTokenId = result.dto.userTokenId);

		result.thirdUnid && (data.thirdUnid = result.thirdUnid);

		result.openId && (data.openId = result.openId);

		my.setStorageSync(constants.APP_USERINFO_SESSION, data);
	}
};

module.exports = appUser;