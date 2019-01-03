// detail.js
let _page;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
    author: null, // 书籍作者
    hits: null, // 点击量
    id:null,//小说Id
    imgPath : null,//小说封面路径
    intro:null,//小说内容简介
    novelName:null,//小说名称
    novelState: null, //小说状态(连载1/完结0)
    num: null, //字数*/
    //文字是否收起,默认收起
    ellipsis: true,
    navelid: '',
    userid: '',
    chapterid: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options.navelid)
    that.setData({
      navelid: options.novelid
    })
    //调用小说章节目录WebApi
    wx.request({
      url: "http://172.25.53.30:8050/read/CatalogShow",
      data: {
        novelid: options.novelid
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          chapters: res.data
        })
      }
    })
  },
  toggleWatch:function(e){
    console.log(e.currentTarget.id)
    var that = this
    wx.navigateTo({
      //url: '../Read/Read?navelid=' + that.data.navelid + '&chapterid=' + e.currentTarget.id
       url: '../Read/Read?chapterid=' + e.currentTarget.id + '&navelid=' + that.data.navelid
    })
  }
})