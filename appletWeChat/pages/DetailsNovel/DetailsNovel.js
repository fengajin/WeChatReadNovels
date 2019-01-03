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
    navelid:'',
    userid:'',
    isWatch:false
  },

  //开始阅读toContent
  //url链接到wx页
  toContent: function () { 
    var that = this
    wx.navigateTo({
      url: '../Read/Read?navelid=' + that.data.navelid
    })
  },

  //评论commentsbtn
  //url链接到wx页
  commentsbtn: function () {
    var that = this
    wx.navigateTo({
      url: '/pages/Comments/Comments?navelid=' + that.data.navelid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      navelid: options.navelid
    })
    wx.getStorage({
      key: 'wxuserid',
      success: function (res) {
        that.setData({
          userid: res.data,
       
        })
       
          wx.request({
            url: 'http://172.25.53.30:8050/detailsNovel/IsBookRack',
            data:{
              userid: that.data.userid,
              novelid: that.data.navelid,
            },
            success:function(res)
            {
              console.log(res)
              if(res.data==1)
              {
                that.setData({
                  isWatch:true
                })
              }
              else
              {}
            }
          })
    
        //调用小说详情WebApi
        wx.request({
          url: "http://172.25.53.30:8050/detailsNovel/GetDetailsNovel",
          data: {
            Id: that.data.navelid
          },
          success: function (res) {
            that.setData({
              detailsNovel: res.data
            })
          }
        })

        //调用小说最新章节WebApi
        wx.request({
          url: "http://172.25.53.30:8050/detailsNovel/GetChapters",
          data: {
            Id: that.data.navelid
          },
          success: function (res) {
            that.setData({
              chapters: res.data
            })
          }
        })

        //调用小说评论WebApi
        wx.request({
          url: 'http://172.25.53.30:8050/detailsNovel/GetComments',
          data: {
            Id: that.data.navelid
          },
          success: function (res) {
            that.setData({
              comments: res.data
            })
          }
        })

        //加入阅读日志表
        wx.request({
          url: 'http://172.25.53.30:8050/readinglogApi/GetReadinglogsById',
          method: 'get',
          data: {
            Novelid: that.data.navelid,
            Userid: that.data.userid
          },
          success: function (res) {
            if (res > 0) {}
            else {}
          }
        })
      }
    })
  },

  /**
  * 简介 收起/展开按钮点击事件
  */
  ellipsis() {
    _page = this;
    let value = !this.data.ellipsis;
    _page.setData({
      ellipsis: value
    })
  },
  //跳转到目录
  redrecturl: function (e) {
    var id = e.currentTarget.id
    console.log(id);
    var url = "../Catalog/Catalog?novelid="+id;
    wx.navigateTo({
      url: url
    })
  },
  
  //加入书架
  toggleWatch: function (e) {
    var that = this;
    //获取缓存中的用户id
    wx.getStorage({
      key: 'wxuserid',
      success: function (res) {
        that.setData({
          userid: res.data,
          isWatch:true
        })
        console.log(e.currentTarget.id);
        var novelid = e.currentTarget.id;//获取显示界面的view值
        console.log(novelid);
        //获取当前时间
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        var n = timestamp * 1000;
        var date = new Date(n);
        var timea = date;
        wx.request({
          url: "http://172.25.53.30:8050/detailsNovel/bookrackAdd",
          method: 'POST',
          data: { UserId: that.data.userid, NovelId: that.data.navelid, CreateTime: timea, ModifyTime: timea, },
          success: function (data) {
            console.log(data.data)
            if (data.data > 0) {
              //成功弹窗
              wx.showToast({
                title: '成功',
                icon: 'succes',
                duration: 1000,
                mask: true
              })
            }
          }
        })
      }
    })
  },
})