// pages/readhistory/readhistory.js
const app = getApp()
const { ArticleAPI } = require('../../api/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      history: app.globalData.history,
      firstColor: app.globalData.firstColor
    })
  },
  //根据内容id，展示内容
  toContent: function (event) {
    //请求数据
    const id = event.currentTarget.dataset.obj.articleId
    ArticleAPI.findById({ id }).then(res => {
      app.globalData.contentObj = res.data;
    }).catch(err => {
      console.log('错了')
    })
    wx.navigateTo({
      url: '/pages/content/content'
    })
  },
})
