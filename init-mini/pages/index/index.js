var appUser = require('../../utils/app-user');
Page({
  data: {},
  onLoad() {
    appUser.myLogin((res)=>{
      let a = res;
    });
    
  },
  onShow(){
    
  }
});
