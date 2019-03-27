const app = getApp();

Page({
  data: {},

  onLoad() {
    const info = app.todos;
    app.getUserInfo().then(
      user => {
        this.setData({
          user,
        });
      },
      () => {
        // 获取用户信息失败
      }
    );
  },

  onShow() {
    this.setData({ todos: app.todos });
  },

  onPullDownRefresh() {
    my.alert({
      title: '亲',
      content: '您本月的账单已出',
      buttonText: '我知道了',
      success: () => {
        my.alert({
          title: '用户点击了「我知道了」',
        });
        my.stopPullDownRefresh();
      },
    });
  },


  onTodoChanged(e) {
    const checkedTodos = e.detail.value;
    app.todos = app.todos.map(todo => ({
      ...todo,
      completed: checkedTodos.indexOf(todo.text) > -1,
    }));
    this.setData({ todos: app.todos });
  },

  addTodo() {
    my.navigateTo({ url: '../add-todo/add-todo' });
  },
});
