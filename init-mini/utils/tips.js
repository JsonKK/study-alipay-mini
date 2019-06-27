
/**
 * 提示语
 * @param {Object} text
 */
var toast = function(that, text){
	if(!that){
		return;
	}
	!text && (text = "有点忙开个小差，稍后再试~");
	
	that.setData({
		showTips : true,
		text : text
	})
	
	return setTimeout(function(){
		that.setData({
			showTips : false,
			text : ""
		})
	}, 3000);
}

/**
 * 提示下载
 */
var downloadTips = function() {
	// wx.showModal({
 //    	title: '',
 //      	content: '更多操作请到应用市场搜索“华夏匠人”下载使用。',
 //    	showCancel: false
 //    });
	my.navigateTo({
 		url : "../download/download-hint"
 	});
};

/**
 * 吐司提示
 * @param {Object} content
 */
var tipToast = function(content) {
	my.showToast({
    	title: "",
      	content: content || "有点忙开个小差，稍后再试~"
    });
};

module.exports = {
    
    toast : toast,
    downloadTips : downloadTips,
    tipToast: tipToast
};
