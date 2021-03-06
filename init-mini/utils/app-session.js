var app = getApp();
/**
 * 获取用户信息
 */
var _getUserinfo = function(){
    var userInfo = my.getStorageSync({key:app.basicParams.APP_USERINFO_SESSION}).data;

    return userInfo;
};

/**
 * 通过key获取值
 * @params key 
 */
var _getValueByKey = function(key){
    if (!key) {
        return ;
    }
    
    var userinfo = _getUserinfo();
    
    if(!userinfo){
    	return ;
    }
    return userinfo[key];
};

var _getToken = function(){
    return _getValueByKey("userTokenId");
}

module.exports = {

    /**
     * 从缓存获取token
     */
    getToken : _getToken,

    /**
     * 通过key获取对应信息
     */
    getUserInfoByKey : function(key){
        return _getValueByKey(key);
    },
    
    /**
     * 获取用户信息
     */
    getUserinfo : _getUserinfo,
    
    /**
     * 清楚用户信息
     */
    clearUserInfo : function(){
    	my.removeStorageSync({key: app.basicParams.APP_USERINFO_SESSION});
    },

    /**
     * 判断是否登录
     */
    loginCheck : function(){

      	if(_getUserinfo() && _getValueByKey("phone")){
         	return true;
      	}
       	return false;
    }
};