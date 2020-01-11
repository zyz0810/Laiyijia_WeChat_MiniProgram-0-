// pages/shop/create/index.js
var app = getApp();
var util = require("../../../utils/util.js");
var member = require("../../../service/member.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopUser: '',
    shopName: '',
    checked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },
  checkboxChange: function(e) {
    let that = this
    if (e.detail.value == '') {
      that.setData({
        checked: false
      })
    } else {
      that.setData({
        checked: true
      })
    }
  },
  goAgreement: function() {
    wx.navigateTo({
      url: '/pages/agreement/index'
    })
  },

  name: function(e) {
    console.log(e)
    this.setData({
      shopName: e.detail.value
    })
  },

  user: function(e) {
    console.log(e)
    this.setData({
      shopUser: e.detail.value
    })
  },



  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  change: function(e) {
    var that = this
    if (that.data.shopUser == '') {
      wx.showToast({
        title: '请填写店铺主姓名',
        icon: 'none'
      })
    } else if (that.data.shopName == '') {
      wx.showToast({
        title: '请填写店铺名称',
        icon: 'none'
      })
    } else if (that.data.checked == false) {
      wx.showToast({
        title: '请先阅读并同意《服务协议》',
        icon: 'none'
      })
    } else {
      util.navigateTo({
        url: './../../shop/change/index'
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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