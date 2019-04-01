import _ from '/utils/underscore-extend.js';

Page({
  data: {
    imgArr : [],
    array: ['中国', '美国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国',
      },
      {
        id: 1,
        name: '中国',
      },
      {
        id: 2,
        name: '巴西',
      },
      {
        id: 3,
        name: '日本',
      },
    ],
    arrIndex: 0,
    index: 0

  },
  onLoad() {
  },
  onShow(){

  },
  //选择图片
  choseImg(){
    let data = this.data,
        imgArr = data.imgArr;
    my.chooseImage({
      success:(res)=>{
         imgArr.push(res.apFilePaths[0]);
         this.setData({
           imgArr : imgArr
         });
      }
    });
  },
  //删除图片
  removeImg(e){
    let data = this.data,
        imgArr = data.imgArr,
        index = e.currentTarget.dataset.index;
    imgArr.splice(index,1);
    this.setData({
      imgArr : imgArr
    })
  },
  //预览图片
  previewImg(e){
    let data = this.data,
        imgArr = data.imgArr,
        index = e.currentTarget.dataset.index,
        img = imgArr[index];
    my.previewImage({
      current: index,
      urls:imgArr,
    });
  }
});
