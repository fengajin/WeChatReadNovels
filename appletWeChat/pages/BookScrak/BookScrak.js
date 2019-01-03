//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    zxy1: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log("书库页面内初始化");
    var that = this;
    wx.request({
      url: 'http://172.25.53.30:8050/types/getTypes',
      method: 'get',
      data: {},
      success: function (res) {
        that.setData({
          zxy: res.data
        })
      }
    })

    wx.request({
      url: 'http://172.25.53.30:8050/bookScark/GetAllNovels',
      method: 'get',
      data: {},
      success: function (res) {
        that.setData({
          zxy1: res.data
        })
      }
    })
  },


  onSelectTag: function (e) {
    var that = this;
    var ids = e.currentTarget.dataset.ids;
    console.log(ids);
    wx.request({
      url: 'http://172.25.53.30:8050/bookScark/GetNovelsByIds',
      data: { typeids: ids },
      method: 'get',
      success: function (e) {
        that.setData({
          zxy1: e.data
        })
        console.log(zxy1);
      }
    })
  },




  onSelectNovel: function (e) {
    var that = this;
    wx.request({
      url: 'http://172.25.53.30:8050/bookScark/GetNovelsByNovelState',
      data: { NovelState: 1 },
      method: 'get',
      success: function (e) {
        that.setData({
          zxy1: e.data
        })
        console.log(zxy1);
      }
    })
  },




  navigateDetail: function (e) {
    var navelid = e.currentTarget.dataset.aid;//获取显示界面的Id值
    wx.navigateTo({
      url: '/pages/DetailsNovel/DetailsNovel?navelid=' + e.currentTarget.dataset.aid
    })
  },










})
