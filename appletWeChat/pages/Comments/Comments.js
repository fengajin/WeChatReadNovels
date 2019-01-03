// Comments.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ellipsis: true,
    navelid: null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      navelid: options.navelid
    })
    that.GetComments();
    //调用小说评论WebApi
    // wx.request({
    //   url: 'http://172.25.30.53:8050/commentsWebApi/getComments',
    //   data: {
    //     Id: that.options.navelid
    //   },
    //   success: function (res) {
    //     that.setData({
    //       comments: res.data
    //     })
    //   }
    // })
  },
//获取所有评论
GetComments:function(){
  var that=this;
  //调用小说评论WebApi
  wx.request({
    url: 'http://172.25.53.30:8050/commentsWebApi/getComments',
    data: {
      Id: that.data.navelid
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        comments: res.data
      })
    }
  })
},
  //获取textarea的值
  getInput: function (e) {
    this.setData({
      commentstext: e.detail.value
    })
  },
  
  //添加吐槽
  commentsAdd: function (e) {
    var that = this;
    console.log(that.data.commentstext);
    var content = that.data.commentstext;//获取显示界面的text值
    
    var novelid = that.options.navelid;//获取小说Id值
    //获取当前时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var timea = date;
    console.log(timea)
    wx.getStorage({
      key: 'wxuserid',
      success: function (res) {
        console.log(res.data)
        that.setData({
          userid: res.data
        });
        if(content != null){
          wx.request({
            url: "http://172.25.53.30:8050/commentsWebApi/commentsAdd",
            method: 'POST',
            data: { Content: content, Timea: timea, Novelid: novelid, Userid: that.data.userid },
            success: function (res) {
              console.log(res)
              that.GetComments();
            }
          })
        }
      }
    })
  }
})