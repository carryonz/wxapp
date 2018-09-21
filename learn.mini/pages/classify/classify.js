// page/one/index.js
const { ArticleAPI } = require('../../api/index');
const app = getApp()

Page({
  data: {
    open: false,
    mark: 0,
    newmark: 0,
    classtype: [{ id: 0, classname: '语文' },
                { id: 1, classname: '数学' },
                { id: 2, classname: '英语' },
                { id: 3, classname: '物理' },
                { id: 4, classname: '化学' },
                { id: 5, classname: '生物' },
                { id: 6, classname: '政治' },
                { id: 7, classname: '地理' }],
    istoright: true,
    styletype: [{ id: 0, color: 'rgb(255, 255, 255)', name: '河白' },
                { id: 1, color: 'rgb(250, 249, 222)', name: '杏仁黄' },
                { id: 2, color: 'rgb(255, 242, 226)', name: '秋叶褐' },
                { id: 3, color: 'rgb(253, 230, 224)', name: '胭脂红' },
                { id: 4, color: 'rgb(227, 237, 205)', name: '青草绿' },
                { id: 5, color: 'rgb(220, 226, 241)', name: '海天蓝' },
                { id: 6, color: 'rgb(233, 235, 254)', name: '葛巾紫' },
                { id: 7, color: 'rgb(234, 234, 239)', name: '极光灰' }],
    firstName: '默认',
    firstColor: 'rgb(234, 234, 239)',
    selectStyle: true,
    selectArea: false
  },
  onReachBottom() {
    console.log('onReachBottom')
  },
  //更换背景颜色
  clickColor: function () {
    var selectStyle = this.data.selectStyle;
    if (selectStyle == true) {
      this.setData({
        selectArea: true,
        selectStyle: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectStyle: true,
      })
    }
  },
  //点击切换科目
  mySelect: function (e) {
    this.setData({
      firstName: e.target.dataset.obj.name,
      firstColor: e.target.dataset.obj.color,
      selectStyle: true,
      selectArea: false,
    })
  },
  tap_ch_class: function (e) {
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  },
  tap_start: function (e) {
    // touchstart事件
    this.data.mark = this.data.newmark = e.touches[0].pageX;
  },
  tap_drag: function (e) {
    // touchmove事件
    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;
    if (this.data.mark < this.data.newmark) {
      this.istoright = true;
    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      this.istoright = false;

    }
    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {
    // touchend事件
    this.data.mark = 0;
    this.data.newmark = 0;
    if (this.istoright) {
      this.setData({
        open: true
      });
    } else {
      this.setData({
        open: false
      });
    }
  },
  //根据选择id获取科目内容
  goToClass: function (event){
    this.data.viewid = event.currentTarget.id;
    var params = new Object();
    params.type = event.currentTarget.id;
    params.direction = 'desc';
    params.page = 0;
    //请求数据
    ArticleAPI.findByPage({ ...params }).then(res => {
      console.log(res)
      const content = res.data.content;
      for (var i = 0; i<content.length; i++){
        content[i].createTime = this.formatTime(content[i].createTime)
      }
      this.setData({
        content
      });
    }).catch(err =>{
      console.log('错了')
    })
  },
  //根据内容id，展示内容
  toContent: function (event) {
    app.globalData.contentObj = event.currentTarget.dataset.obj;
    app.globalData.firstColor = this.data.firstColor;
    wx.navigateTo({
      url: '/pages/content/content'
    })
  },
  //数据转化  
  formatNumber(n) {  
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  /** 
   * 时间戳转化为年 月 日 时 分 秒 
   * number: 传入时间戳 
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
  */  
  formatTime(number) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    var format = 'Y-M-D h:m:s';

    var date = new Date(number);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));

    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    returnArr.push(this.formatNumber(date.getSeconds()));

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  }
})
