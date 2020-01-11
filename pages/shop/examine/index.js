// pages/shop/examine/index.js
let app = getApp(),
  util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhengmian: '',
    fanmian: '',
    objectMultiArray: [],
    shopCategory:'请选择所属行业',
    longitudePage: 113.324520,
    latitudePage: 23.099994,
    markers: [{
      id: 0,
      iconPath: "../../images/icon_cur_position.png",
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getCategory()
    var that = this
    if (options.category){
      console.log(options.category) 
      var shopCategory = unescape(options.category)
      that.setData({
        shopCategory: shopCategory
      })      
    }else{
      console.log(555) 
    }
  },
  chooseCategory:function(){
    util.navigateTo({
      url: '/pages/shop/category/index',
    })
  },

  
  goMap:function(){
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var name = res.name
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude)
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28,
          name: name,
          success:function(data){
            console.log(data)
            that.setData({
              shopAdddress: data.address
            })
          }
        })
      },
      fail: function (err) {
        if (err.errMsg.indexOf('auth') > -1) {
          wx.showModal({
            title: '提示',
            content: '未授予定位权限，是否前往设置',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        that.setData({
          latitudePage: res.latitude,
          longitudePage: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  //上传正面照片
  uploadzheng: function() {
    var that = this;
    util.getUrlAfterUpload(function(data, tempFilePaths) {
      console.log(data)
      that.setData({
        fontUrl: data,
        zhengmian: tempFilePaths
      })
      that.checkFillout()
    }, '', '', '', 'idcard')
  },

  //上传反面照片
  uploadfan: function() {
    var that = this;
    util.getUrlAfterUpload(function(data, tempFilePaths) {
      that.setData({
        backUrl: data,
        fanmian: tempFilePaths
      }, '', '', '', 'idcard')
      that.checkFillout()
    })
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})