var app = getApp();
Page({
  data: {
    currentTab: 0,
    books: [],
    hidden: false,
    img_data: [
      {
        "title": "图片一",
        "img_url": "https://www.23us.so/files/article/image/9/9579/9579s.jpg",
      },
      {
        "title": "图片二",
        "img_url": "https://www.23us.so/files/article/image/29/29340/29340s.jpg"
      },
      {
        "title": "图片三",
        "img_url": "https://www.23us.so/files/article/image/0/43/43s.jpg"
      },
      {
        "title": "图片四",
        "img_url": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=695582683,841739501&fm=26&gp=0.jpg"
      },
      {
        "title": "图片五",
        "img_url": "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2324929717,895684471&fm=26&gp=0.jpg"
      }
    ],
    is_dots: true,
    swiper_data_num: 0,
    swiperCurrent: 0,
    swiper_style: 1,
    GetNovel:function(option){
      wx.switchTab({
        url: '../MY/MY'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchBookData()
    //调用应用实例的方法获取全局数据
  },
  redirectToDetail: function (e) {
    var id = e.currentTarget.id
   var url = "../DetailsNovel/DetailsNovel?navelid=";
    wx.navigateTo({
      url: url + id
   })
  },
  //获取微信精选
  fetchBookData: function (query) {
    var self = this;
    self.setData({
      hidden: false
    })
    //获取所有小说
    wx.request({
      url: "http://172.25.53.30:8050/novel/GetNovelsAll",
      data: {
        wx_userid: '2'
      },
      success: function (res) {
        self.setData({
          zmf: res.data,
          hidden: true
        })
      }
    });
    //获取男生小说
    wx.request({
      url: "http://172.25.53.30:8050/novel/GetNovelsMan",
      data: {
        wx_userid: '2'
      },
      success: function (res) {
        self.setData({
          zmf1: res.data,
          hidden: true
        })
      }
    });
    //获取女生小说
    wx.request({
      url: "http://172.25.53.30:8050/novel/GetNovelsMen",
      data: {
        wx_userid: '2'
      },
      success: function (res) {
        self.setData({
          zmf2: res.data,
          hidden: true
        })
      }
    });
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
  //改变轮播图样式
  chang_swiper_style: function (e) {
    var s_id = e.currentTarget.id;
    if (s_id == 2 || s_id == 3 || s_id == 4) {
      this.setData({ is_dots: false });
    } else if (s_id == 1) {
      this.setData({ is_dots: true });
    }
    this.setData({ swiper_style: s_id });
  },

  navigateDetail: function (e) {
    var navelid = e.currentTarget.dataset.aid;//获取显示界面的Id值
    console.log(navelid)
    wx.navigateTo({
      url: '/pages/DetailsNovel/DetailsNovel?navelid=' + e.currentTarget.dataset.aid
    })
  }

})
