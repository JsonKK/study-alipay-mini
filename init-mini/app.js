var _ = require("./utils/underscore.js");
var userUtil = require('./utils/user-util.js');
App({
	serviceUrl: "https://rest.ihxjr.com",
	h5Url: "https://m.ihxjr.com",
	staticUrl: "https://s.ihxjr.com",
	uploadUrl: "https://image.innochina.com",

	// 系统版本号
	// 2019-01-31(增加专享价、转赠流程)
	APP_VERSION: "0.0.0",

	// 基础参数(只能作为只读参数使用)
	basicParams : userUtil.appBasicParams(),

	// 业务参数(使用本参数时，需在各自页面拷贝一份，请不要覆盖全局变量)
	businessParams : {
		DEFAULT_USER_HEADER: "./img/user-header-default.png",
		shareInfo : {
			indexTitle : "分享标题",
			//oss通用后缀
			ossResize : "?x-oss-process=image/format,jpg/quality,Q_80"
		},
		// 是否是Iphone X
		isIphoneX: false,
		// 列表翻页基础数据
		datalistParam : function(){
			return {
				type: "DOWN",
				lastdate:0,
				pageSize:20
			};
		},
		// 下拉
	    scrollDown: "DOWN",
	    // 上拉
	    scrollUp: "UP",
	    // 下拉提示语
	    pullRefresh: {
	      up: {
	        contentinit: "上拉显示更多",
	        contentrefresh: "正在加载...",
	        contentnomore: "没有更多数据了"
	      }
	    }
	},
	/**
	 * 检查更新
	 */
	checkUpdate: function() {

		// 版本兼容
		if(!my.getUpdateManager) {
			return;
		}
		// 更新
		const updateManager = my.getUpdateManager();
		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
			console.log(res.hasUpdate);
		});

		updateManager.onUpdateReady(function() {
			my.showModal({
				title: "更新提示",
				content: "新版本已经准备好，是否重启应用？",
				success: function(res) {
					if(res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});

		});

		updateManager.onUpdateFailed(function() {
			// 新的版本下载失败
			console.log("新版本下载失败");
		});
	},
	onLaunch(options){

		// 检查更新
		this.checkUpdate();

		if(options && options.scene) {
			this.scene = options.scene;
		}

	},
	onShow(options) {

		let that = this;
		my.getSystemInfo({
			success: res => {
				// console.log("手机信息res"+res.model)  
				let modelmes = res.model;
				if(modelmes.search("iPhone X") != -1) {
					that.businessParams.isIphoneX = true;
				}

			}
		});

		// 对外提供场景值
		if(options && options.scene) {
			this.scene = options.scene;
		}
	}
});
