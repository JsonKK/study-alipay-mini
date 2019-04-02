import _ from '/utils/underscore-extend.js';

Page({
  data: {
    imgArr : [],
    classArr: ['服装', '物品', '玩具', '化妆品'],
    classIndex: 0,
    priceRange:[],
    profitpriceRange:[],
    isPassPrice:true,
    rangeValue:30,
    username:'',
    goodsname:''
  },
  onLoad() {
  },
  onShow(){

  },
  // 增加
  addGoods(){
    let {imgArr,isPassPrice,username,goodsname} = this.data;
    if(!imgArr || imgArr.length == 0){
      my.showToast({
        content:'请上传图片'
      })
      return false;
    }
    if(isPassPrice){
      my.showToast({
        content:'请输入合适的的价格区间'
      })
      return false;
    }
    if(!username){
      my.showToast({
        content:'请输入联系人'
      })
      return false;
    }
    if(!goodsname){
      my.showToast({
        content:'请输入物品名称'
      })
      return false;
    }
  },
  // 处理表单文案
  disposeValue(e){
    let name = e.currentTarget.dataset.name,
        value = e.detail.value;
    this.setData({
      [name] : value
    });
    let t = e;
  },
  // 切换拖拽条
  changeSlider(e){
    this.setData({
      rangeValue : e.detail.value
    });
    this.profitpriceRange();
  },
  //让利价格
  profitpriceRange(){
    let priceRange = this.data.priceRange,
        profitpriceRange = this.data.profitpriceRange,
        rangeValue = this.data.rangeValue;
    profitpriceRange[0] = (priceRange[0] * rangeValue)/100;
    profitpriceRange[1] = (priceRange[1] * rangeValue)/100;
    this.setData({
      profitpriceRange : profitpriceRange
    });
  },
  // 校验价格区间
  verifyPrice(arr){
    if(_.isEmpty(arr) || !_.isArray(arr)){
      return false;
    }
    if(arr[1]-0>arr[0]-0){
      return true;
    }
    else{
      return false;
    }
  },
  //价格区间
  priceRange(e){
    let index = e.currentTarget.dataset.index,
        value = e.detail.value,
        arr = this.data.priceRange || [];
    arr[index] = value;
    let isPass = this.verifyPrice(arr);
    this.setData({
      priceRange : arr,
      isPassPrice : !isPass
    })
    if(isPass){
      this.profitpriceRange();
    }
    else{
      this.setData({
        profitpriceRange : []
      })
    }
  },
  //切换类目
  bindPickerChange(e){
    let val = e.detail.value;
    this.setData({
      classIndex : val
    })
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
