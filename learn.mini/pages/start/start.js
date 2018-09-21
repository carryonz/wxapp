//login.js
//获取应用实例
const { UserAPI } = require('../../api/index');
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userName: '',
    password: '',
    passwordTwo: '',
    login: true
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },
  register: function (event) {
    console.log(event)
    if (this.data.password !== this.data.passwordTwo){
      wx.showModal({
        title: '提示',
        content: '两次密码不一致', 
        showCancel: false,
        duration: 1000
      })
    }else{
      //请求数据
      var params = new Object();
      params.userName = this.data.userName
      params.password = this.data.password
      UserAPI.register({ ...params }).then(res => {
        wx.showToast({
          title: '注册成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        this.setData({
          login: false
        })
        console.log(this.data.login)
      }).catch(err => {
        console.log('错了')
      })
    }
  },
  login: function (event) {
    console.log(event)
    //请求数据
    var params = new Object();
    params.userName = this.data.userName
    params.password = this.data.password
    UserAPI.login({ ...params }).then(res => {
      wx.switchTab({
        url: '/pages/index/index',
      });
    }).catch(err => {
      console.log('错了')
    })
  },
  listenerUsernameInput: function (val) {
    this.setData({
      userName: val.detail.value
    })
  },
  listenerPasswordInput: function (val) {
    this.setData({
      password: val.detail.value
    })
  },
  listenerPasswordTwoInput: function (val) {
    this.setData({
      passwordTwo: val.detail.value
    })
  },
  toLogin: function () {
    this.setData({
      login: true
    })
  },
  toRegister: function () {
    this.setData({
      login: false
    })
  }
});
