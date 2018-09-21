//app.js
const { UserAPI } = require('/api/index');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              //保存唯一标识
              this.globalData.signature = res.signature
              //保存到数据库
              var params = new Object();
              params = res.userInfo
              params.signature = res.signature
              UserAPI.saveUserInfo(params).then(res => {
                this.globalData.userInfoId = res.data.id
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    }),
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求    
          console.log(res.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
    //用户
    userInfo: null,
    userInfoId: null,
    //假唯一标识
    signature: null,
    //文章内容
    contentObj: null,
    firstColor: 'rgb(234, 234, 239)',
    //历史数据
    history: null,
    //签到
    isQd: false,
    //分页
    page: {
      size: 10
    },
    //版本
    version: '1.0.0'
  }
})
