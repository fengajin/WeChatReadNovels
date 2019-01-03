//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    showBadge: false,
    meList: [
      {
        text: '我的收藏',
        url: '../Collect/Collect'
      },
      {
        text: '最近阅读',
        url: '../RecentlyRead/RecentlyRead'
      },
      {
        text: '联系我们',
        url: '../Touch2/Touch'
      },
      {
        text: '关于小说',
        url: '../About/About'
      }
    ]
  },
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        //更新数据
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
  }
})
