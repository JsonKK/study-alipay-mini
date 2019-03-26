const app = getApp();

Page({
  onShow(options){
    let a = options;
    let is = my.canIUse('page.$spliceData');
    let page = getCurrentPages();
  },
  data: {
    inputValue: '',
  },

  onBlur(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  add() {
    app.todos = app.todos.concat([
      {
        text: this.data.inputValue,
        compeleted: false,
      },
    ]);

    my.navigateBack();
  },
});
