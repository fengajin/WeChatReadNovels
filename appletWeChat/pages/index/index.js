//index.js
//获取应用实例
var app = getApp();
var config = require('../../utils/config');
var url = config.url;
var util = require('../../utils/util');
var db = require('../../utils/db');

Page({
  data: {
   
    inputValue: '',
    userId:'',
    title_disabled: true,//控制修改表头名字
    management_good: false,
    select_all: false,
    middlearr: [],
  items:[]
    
  },


  // 跳转到小说阅读界面
  getInput: function (e) {
    console.log(e.currentTarget.dataset.bookid);
    var id = e.currentTarget.dataset.bookid
    var url = "../Read/Read?navelid=";
    wx.navigateTo({
      url: url + id
    })
  },

  //点击事件
  /*handleClick: function () {
    var that = this;
    console.log(that.data.viewvalueid);
    var viewid = that.data.viewvalueid;//获取显示界面的view值
    wx.navigateTo({
      url: '/pages/DetailsNovel/DetailsNovel?navelid=' + that.data.viewid
    })
  },*/
  // 改变类目的名字
  change_classname: function () {
    let that = this;
    that.setData({
      title_disabled: !that.data.title_disabled,
    });
    //  这里自动获取焦点
  },
  finish_classname: function () {
    let that = this;
    that.setData({
      title_disabled: !that.data.title_disabled,
    })
  },
  // 管理商品
  management: function () {
    let that = this;
    that.setData({
      management_good: true,
    })
  },
  finish_management: function () {
    let that = this;
    that.setData({
      management_good: false,
    })
  },
  // 选择
  select: function (e) {
    var that = this;
    let arr2 = [];
    if (that.data.management_good == false) {
      return;
    } else {
      var arr = that.data.items;
      var index = e.currentTarget.dataset.id;
      arr[index].Checked = !arr[index].Checked;
      console.log(arr);


      for (let i = 0; i < arr.length; i++) {
        if (arr[i].Checked) {
          arr2.push(arr[i])
        }
      };
      that.setData({
        items: arr,
        middlearr: arr2
      })
    }
  },
  // 删除   
  deleteitem: function (e) {
    var that = this;
    var viewid = [];//获取显示界面的view值
    let arr = that.data.items;
    let arr2 = [];
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].Checked == false) {
        arr2.push(arr[i]);
      }
      else
      {
        
        viewid.push(arr[i].Id)
       
      }
    }
    that.setData({
      items: arr2,
      middlearr: []
    })
    console.log(viewid)
    console.log('ww');
    console.log(e);

    wx.request({
      url: "http://172.25.53.30:8050/bookrack/bookrackdelete",
      data: {
        Id: viewid.toString()
      },
      success: function (datas) {
        
       
      }
    })

  },
  // 全选
  select_all: function () {
    let that = this;
    that.setData({
      select_all: !that.data.select_all
    })
    if (that.data.select_all) {
      let arr = that.data.items;
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].Checked == true) {
          arr2.push(arr[i]);
        } else {
          arr[i].Checked = true;
          arr2.push(arr[i]);
        }
      }
      that.setData({
        items: arr2,
        middlearr: arr2
      })
    }
  },
  // 取消全选
  select_none: function () {
    let that = this;
    that.setData({
      select_all: !that.data.select_all
    })
    let arr = that.data.items;
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
      arr[i].Checked = false;
      arr2.push(arr[i]);
    }
    that.setData({
      items: arr2,
      middlearr: []
    })
  },

  //长按事件
  handleLongPress: function (e) {
    console.log(e.currentTarget.id);
    var that = this;
    var viewid = e.currentTarget.id;//获取显示界面的view值
    wx.showModal({
      title: '提示',
      content: '确定要删除此本小说吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          //调用小说书架WebApi
          wx.request({
            url: "http://172.25.53.30:8050/bookrack/bookrackdelete",
            data: {
              Id: viewid
            },
            success: function (datas) {
             
              if (datas.data > 0) {
              
                //成功弹窗
                wx.showToast({
                  title: '成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
                })
                that.loadbookStrack();
                //用onLoad周期方法重新加载，实现当前页面的刷新
                //onLoad();
               
              }
            }
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          
        }
        that.setData({
          
        });
      }
    })
  },
   //获取该用户存到书架的小说
  loadbookStrack:function(e){
    var that=this;
    //调用小说书架WebApi
    wx.request({
      url: "http://172.25.53.30:8050/bookrack/getbookracks",
      data: {
        userId: that.data.userid
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          items: res.data

        })
        console.log(that.data.items)

      }
    })
  },
  inputChange: function (e) {
    this.data.inputValue = e.detail.value;
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    console.log('每次点击')
    this.loadbookStrack();
  },
  onLoad: function (options) {
    
    var that = this;
    wx.getStorage({
      key: 'wxuserid',
      success: function (res) {
        console.log(res.data)
        that.setData({
          userid: res.data
        })
        //调用小说书架WebApi
        wx.request({
          url: "http://172.25.53.30:8050/bookrack/getbookracks",
          data: {
            userId: that.data.userid
          },
          success: function (res) {
            console.log(res.data)
            that.setData({
              items: res.data

            })
              console.log(that.data.items)
         
          }
        })
      }
    })
  

    //1.获取用户的基本信息，查询数据库获取用户的工号，并使用缓存存在本机
    //var openid = wx.getStorageSync('openid');

    /*如何获取工号
    var options={
      url:config.clubApi.get,
      data:{
        appkey: config.appKey,
        key: openid,
        type:'userMapping'
      }
    }
    util.request(options).then(res=>{
      //获取到工号
      console.log(res.data.result.value);
    })*/

    //以下这段都是有用的，不要删除。以后做个界面，用户第一次使用的时候就要输入自己的工号，然后把工号和openid存到mapping表里
    // if (openid) {
    //   wx.checkSession({
    //     success: function (e) {
    //       //登录态未过期
    //     },
    //     fail: function () {
    //       //登录态过期
    //       wx.login({
    //         success: function (res) {
    //           if (res.code) {
    //             db.getOpenId(res.code).then(res => {
    //               console.log(res);
    //               var openid = res.data.openid;
    //               var expires_in = res.data.expires_in;
    //               var session_key = res.data.session_key;

    //               for (var key in res.data) {
    //                 // console.log(key);
    //                 // console.log(res.data[key]);
    //                 wx.setStorage({
    //                   key: key,
    //                   data: res.data[key]
    //                 });
    //               };
    //             });
    //           }
    //         },
    //         fail: function () {
    //           console.log('login fail')
    //         },
    //         complete: function () {
    //           // complete
    //         }
    //       });
    //     }
    //   })

    // } else {

    //   wx.login({
    //     success: function (res) {
    //       if (res.code) {
    //         db.getOpenId(res.code).then(res => {
    //           console.log(res);
    //           var openid = res.data.openid;
    //           var expires_in = res.data.expires_in;
    //           var session_key = res.data.session_key;

    //           for (var key in res.data) {
    //             // console.log(key);
    //             // console.log(res.data[key]);
    //             wx.setStorage({
    //               key: key,
    //               data: res.data[key]
    //             });
    //           };
    //         });
    //       }
    //     },
    //     fail: function () {
    //       console.log('login fail')
    //     },
    //     complete: function () {
    //       // complete
    //     }
    //   });

    // };

  }
})
