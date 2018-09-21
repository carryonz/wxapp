// pages/me/me.js
const app = getApp()
const { IntegralAPI } = require('../../api/index');
const { ArticleAPI } = require('../../api/index');

Page({
  data: {
    isQd: app.globalData.isQd
  },
  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo,
      version: app.globalData.version
    });
    this.checkScoreSign();
  },
  //检查签到
  checkScoreSign: function() {
    const accountId = app.globalData.userInfoId
    IntegralAPI.checkIntegral({ accountId }).then(res => {
      app.globalData.isQd = res.data
    }).catch(err => {
      console.log('错了')
    })
  },
  //查询用户信息
  userInfo: function(){
    wx.showModal({
      title: '欢迎~',
      content: app.globalData.userInfo.nickName,
      showCancel: false
    })
  },
  //签到
  scoresign: function () {
    const accountId = app.globalData.userInfoId
    const type = 0
    IntegralAPI.addIntegral({ accountId, type }).then(res => {
      this.setData({
        integral: res.data.integral,
        nowIntegral: res.data.nowIntegral,
        isQd: true
      })
      wx.showModal({
        title: '签到成功',
        content: '获得' + res.data.integral + '积分，当前积分为' + res.data.nowIntegral + '分！',
        showCancel: false
      })
    }).catch(err => {
      console.log('错了')
    })
  },
  //查看背包
  toBackpack: function () {
    wx.navigateTo({
      url: '/pages/backpack/backpack'
    })
  },
  //查看阅读历史
  toHistory: function(){
    const accountId = app.globalData.userInfoId
    const page = 0
    const size = app.globalData.userInfoId
    const sort = 'createTime'
    const direction = 'desc'
    ArticleAPI.findReadLog({ accountId, page, size, sort, direction }).then(res => {
      console.log(res)
      const obj = res.data
      app.globalData.history = obj
      const content = res.data.content
      for (var i = 0; i < content.length; i++) {
        content[i].createTime = this.formatTime(content[i].createTime)
      }
      wx.navigateTo({
        url: '/pages/readhistory/readhistory'
      })
    }).catch(err => {
      console.log('错了')
    })
  },
  //绑定手机
  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: app.globalData.token,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  //关于我们
  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '版权所有，盗版爆菊\n祝大家使用愉快！',
      showCancel: false
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
