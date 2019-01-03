var app = getApp();
var touchDot = 0;//触摸时的原点
var time = 0;//  时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理 时间记录
var nth = 0;// 设置活动菜单的index
var nthMax = 5;//活动菜单的最大个数
var tmpFlag = true;// 判断左右华东超出菜单最大值时不再执行滑动事件
var zuo = false;
var you = false;
Page({
  data: {
    currentTab: 0,
    books: [],
    hidden: false,
    showDialog: false,
    is_dots: true,
    swiper_data_num: 0,
    swiperCurrent: 0,
    swiper_style: 1,
    userid:'',
    navelid:'',
    chapterid:'',
    iscollect: false, //false是没有收藏,true是已经收藏
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.iscollect);
    console.log(options);
    var that = this;
    that.setData({
      navelid: options.navelid,
      chapterid: options.chapterid
    })
    if (options.chapterid==null)
    {
      console.log("从书架和小说详情页面进入的");
      // console.log(that.data.navelid);
      that.fetchBookData()
    //调用应用实例的方法获取全局数据
    }
    else
    {
      console.log("从目录进入的");
      wx.getStorage({
        key: 'wxuserid',
        success: function (res) {
          that.setData({
            userid: res.data
          })
          wx.request({
            url: "http://172.25.53.30:8050/read/Catalog_Chapter",
            data: {
              userid: that.data.userid,
              novelid: that.data.navelid,
              chapterid: that.data.chapterid
            },
            success: function (res) {
              that.setData({
                wh: res.data.ChapterContent,
                ChapterName: res.data.ChapterName,
                hidden: true
              })
              if (wx.pageScrollTo) {
                wx.pageScrollTo({
                  scrollTop: 0
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                })
              }
            }
          });
        }
      })
    }
  },
  redirectToDetail: function (e) {
    var id = e.currentTarget.Id,
      url = "../MY/MY";
    wx.navigateTo({
      url: url
    })
  },
  //
  fetchBookData: function (res) {
    var self = this;
    wx.getStorage({
     key: 'wxuserid',
     success: function (res) {
       self.setData({
         userid: res.data
       })
       self.setData({
         hidden: false
       })
       wx.request({
         url: "http://172.25.53.30:8050/read/ReadsingShow",
         data: {
           userid: self.data.userid,
           novelid: self.data.navelid
         },
         success: function (res) {
           self.setData({
             wh: res.data.ChapterContent,
             ChapterName: res.data.ChapterName,
             hidden: true,
             chapterid: res.data.ChapterNum
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
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function (e) {
    var touchMove = e.touches[0].pageX;
    //console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10) {
      if (tmpFlag && nth < nthMax) { //每次移动中且滑动时不超过最大值 只执行一次
        zuo = true
        
        //  this.getNews(name); // 获取新闻列表
        // this.setData({ menu: tmp }); // 更新菜单
      }
    }
    // 向右滑动
    if (touchMove - touchDot >= 40 && time < 10) {
      //if (tmpFlag && nth > 0) {
     // nth = --nth < 0 ? 0 : nth;
      you = true
      //}
    }
    // touchDot = touchMove; //每移动一次把上一次的点作为原点（好像没啥用）
  },
  // 触摸结束事件
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true; // 回复滑动事件
   // console.log('下');
    if (zuo) {
     // console.log('下');
      this.nextchapter();
      zuo = false
    }
    if (you) {
    //  console.log('上');
      this.previousChapter();
      you = false
    }
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
  //点击目录
  catalog:function(e)
  {
    var id = e.currentTarget.id
    var url = "../Catalog/Catalog?novelid="+id;
    wx.navigateTo({
      url: url
    })
  },
  //上一章
  previousChapter:function(e){
    var self=this;
    wx.request({
      url: "http://172.25.53.30:8050/read/PrevChapter",
      data: {
        userid: self.data.userid,
        novelid: self.data.navelid,
        chapterid: self.data.chapterid

      },
      success: function (res) {
        self.setData({
          wh: res.data.ChapterContent,
          ChapterName: res.data.ChapterName,
          hidden: true,
          chapterid: res.data.ChapterNum
        })
        if (wx.pageScrollTo) {
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
      }
    });
  },
  //点击改变阅读背景颜色
  changeBg:function(e)
  {
    switch (e.currentTarget.dataset.index) {
      case '0':
        this.setData({
          viewBg: 'rgb(101, 230, 159)'
        })
        break;
      case '1':
        this.setData({
          viewBg: 'cornsilk'
        })
        break;
      case '2':
        this.setData({
          viewBg: 'lightpink'
        })
        break;
      case '3':
        this.setData({
          viewBg: '#aaa'
        })
        break;
    }
  },
  //点击页面，弹出上下框
  onClickButton: function (e) {
    let that = this;
     wx.request({
       url: "http://172.25.53.30:8050/collectAPI/Collection",
      data: {
        userid: this.data.userid,
        novelid: this.data.navelid,
      },
      success: function (res) {
        console.log(res)
        if (res.data==1)
        {
          that.setData({
            iscollect:true
          })
        }
        else
        {
        }
      }
    });
    switch (e.currentTarget.dataset.index) {
      case '0':
        that.setData({
          showDialog: !this.data.showDialog
        });
        break;
    }
  },
  onClickdiaView: function () {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
//改变屏幕亮度
  changeScreenLight: function (e) {
    var that = this;
    //滑动拉杆获得值
    wx.setScreenBrightness({
      value: parseFloat(e.detail.value).toFixed(1)
    })

    //给屏幕亮度赋值
    wx.getScreenBrightness({
      success: function (res) {
        that.setData({
          ScreenBrightness: res.value
        })
      }
    })
  },
  //点击目录图片
  skipdirectory:function(e)
  {
    var url = "../Catalog/Catalog?novelid=" + this.data.navelid;
    wx.navigateTo({
      url: url
    })

  },

  //收藏小说图片
  onCollectionTap:function(e)
  {
    var that=this;
    this.setData({
      iscollect:!this.data.iscollect
    })
    console.log(this.data.iscollect)
    wx.request({
      url: "http://172.25.53.30:8050/collectAPI/ChangesCollect",
      data: {
        userid: this.data.userid,
        novelid: this.data.navelid,
        iscollect: this.data.iscollect
      },
      success: function (res) {
        console.log("收藏返回的值"+res)
        if (that.data.iscollect)
        {
          //弹窗
          wx.showToast({
            title: '收藏成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
        else
        {
          //弹窗
          wx.showToast({
            title: '取消收藏',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
      }
    });
    
  },
  
  //点击下一章
nextchapter:function()
  {
    var self=this;
    wx.request({
      url: "http://172.25.53.30:8050/read/NextChapter",
      data: {
        userid: self.data.userid,
        novelid: self.data.navelid,
        chapterid: self.data.chapterid
      },
      success: function (res) {
        self.setData({
          wh: res.data.ChapterContent,
          ChapterName: res.data.ChapterName,
          hidden: true, 
          chapterid: res.data.ChapterNum
        })
        if (wx.pageScrollTo) {
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
      }
    });
  }
})
