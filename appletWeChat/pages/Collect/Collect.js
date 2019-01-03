var app = getApp();
Page({
  data: {
    currentTab: 0,
    books: [],
    hidden: false,
    is_dots: true,
    swiper_data_num: 0,
    swiperCurrent: 0,
    swiper_style: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchBookData()
    //调用应用实例的方法获取全局数据
  },
  redirectToDetail: function (e) {
    console.log(id);
    var id = e.currentTarget.Id,
      url = "../MY/MY";
    wx.navigateTo({
      url: url
    })
  },
  //显示所有的收藏
  fetchBookData: function (res) {
    var self = this;
    self.setData({
      hidden: false
    })
    wx.getStorage({
      key: 'wxuserid',
      success: function (res) {
        console.log(res.data)
        wx.request({
          url: "http://172.25.53.30:8050/collectAPI/GetCollect",
          data: {
            wx_userid: res.data
          },
          success: function (res) {
            self.setData({
              zmf2: res.data,
              hidden: true
            })
          }
        });
      }
    })
 
    /* wx.getstorage({
       key: 'wxuserid',
       success:function(res){
         wx.request({
 
           url: "http://localhost:3975/GetCollect",
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
     })*/
  },

  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  clickTab: function (e) { var that = this; if (this.data.currentTab === e.target.dataset.current) { return false; } else { that.setData({ currentTab: e.target.dataset.current }) } },

  swiperChange: function (e) {
    this.setData({ swiperCurrent: e.detail.current });
  },

})
