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
    my.showLoading({
      content: '加载中...',
      delay: 1000,
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
