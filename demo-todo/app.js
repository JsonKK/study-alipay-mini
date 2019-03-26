App({
  todos: [
    { text: 'sleepping', completed: true },
    { text: 'eatting', completed: true },
    { text: 'running', completed: false },
  ],

  userInfo: null,
  onShow(options){
    let a = options;
  },
  getUserInfo() {
    let info = this.todos;
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ['auth_user'],
        success: authcode => {
          console.info(authcode);

          my.getAuthUserInfo({
            success: res => {
              this.userInfo = res;
              resolve(this.userInfo);
            },
            fail: () => {
              reject({});
            },
          });
        },
        fail: () => {
          reject({});
        },
      });
    });
  },
});
