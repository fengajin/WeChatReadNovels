// pages/RecentlyRead/RecentlyRead.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Reads: [],
    hidden: false,
    userid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchBookData()
  	//调用应用实例的方法获取全局数据
  },
  redirectToDetail: function (event) {
    
    var id = event.currentTarget.id;
    console.log(id);
    var url = "../Read/Read?navelid="+id;
    wx.navigateTo({
      url: url
    })
  },
  //
  fetchBookData: function (e) {
    var self = this;
    wx.getStorage({
      key: 'wxuserid',
      success: function (res) {
       
        self.setData({
          hidden: false,
          userid: res.data
        })
        console.log(self.data.userid)
        wx.request({
          url: "http://172.25.53.30:8050/readsApi/GetReads",
          data: {
            wx_userid: res.data
          },
          success: function (res) {
            self.setData({
              Reads: res.data,
              hidden: true
            })
          }
        });
      }
    })
  }
})