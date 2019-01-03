// pages/SearchPages/SearchPage.js
Page({
  data: {
    NovelName:'',
    sercherStorage: [],
    StorageFlag: false
  },
  onLoad: function (options) {
    this.openLocationsercher();
  },
  //文本库点击事件
  getInput: function (e) {
    //获取文本框输入的值
    this.setData({
      NovelName: e.detail.value
    })
  },
  searchClickEvent: function (e) {
    var that = this;
    //将文本框的值存入数组
    var searchData = that.data.sercherStorage;
    if (searchData.length==0)
    {
      console.log('数组中是空的');
      searchData.push({
        id: searchData.length,
        name: that.data.NovelName
      }) 
    }
    else
    {
      for (e in searchData) {
        if (searchData[e].name == that.data.NovelName) {
           break;
        }
        if (e == searchData.length-1) {
          if (searchData.length >= 5) {
            searchData[0].name = that.data.NovelName;
          }
          else
          {
            searchData.push({
              id: searchData.length,
              name: that.data.NovelName
            })
          }
        }
      }
      console.log(searchData);
    }
    //将数组searchData 赋值给sercherStorage
    that.setData({
      sercherStorage: searchData
    })
   wx.setStorage({
     key: 'searchData',
     data: searchData,
   })
    wx.request({
      url: 'http://172.25.53.30:8050/novel/searchPages',
      data: { NovelName: that.data.NovelName },
      method: 'get',
      success: function (e) {
        that.setData({
          zmf: e.data
        })
      }
    })
  },
   //清除缓存历史
 clearSearchStorage: function () {
    wx.removeStorageSync('searchData')
    this.setData({
      sercherStorage: [],
      StorageFlag: false,
    })
  },
  //打开历史记录列表
  openLocationsercher: function () { 
    this.setData({
      sercherStorage: wx.getStorageSync('searchData') || [],
      StorageFlag: true,
      listFlag: true,
    })
  },
  //点击历史记录反填
  tapSercherStorage: function (s) {
    var that=this;
    console.log(s.currentTarget.id)
    wx.getStorage({
      key: 'searchData',
      success: function (res) {
        console.log(res.data)
        that.setData({
          Jl: res.data,
          NovelName: res.data[s.currentTarget.id].name
        })
      }
    })
    }
})