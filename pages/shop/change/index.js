// pages/shop/change/index.js
var app = getApp();
var util = require("../../../utils/util.js");
var Tenant = require("../../../service/tenant.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    sys: app.globalData.sys,
    leftValue: 360,
    topValue: 560,
    animation: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   

    this.setData({
      tenantIdNow: wx.getStorageSync('tenantIdNow')
    })
    new Tenant(res => {
      this.setData({
        shopList: res.body
      })
      //只有一个店铺的时候，默认进入第一个店铺
      if (res.body.length == 1 && options.from == 'login') {
        wx.showLoading({
          title: '进入店铺中'
        })
        wx.setStorageSync('tenantIdNow', res.body[0].id) //缓存当前选中店铺，下次进入列表高亮√
        this.setData({
          tenantIdNow: res.body[0].id
        })
        new Tenant(resSe => {
          wx.setStorageSync('tenantNameNow', res.body[0].name) //切换店铺后存储店铺名
          wx.setStorageSync('memberIdNow', resSe.body.member.id) //切换店铺后存储会员id
          // wx.setStorageSync('access_token', resSe.body.token.access_token) //切换店铺后更换access_token
          wx.reLaunch({
            url: '/pages/index/index_v1'
          })
        }).select({
          tenantId: res.body[0].id,
          deliveryCenterId: ''
        })
      }
    }).tenantList()


    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        var X = res.windowWidth - 70;
        var Y = res.windowHeight - 130;
        _this.setData({
          leftValue: X,
          topValue: Y,
          // animation:true
        });
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

  },
  //选择店铺进行切换
  choose: function(e) {
    wx.showLoading({
      title: '进入店铺中'
    })
    wx.setStorageSync('tenantIdNow', e.currentTarget.dataset.id) //缓存当前选中店铺，下次进入列表高亮√
    this.setData({
      tenantIdNow: e.currentTarget.dataset.id
    })
    new Tenant(res => {
      wx.setStorageSync('tenantNameNow', e.currentTarget.dataset.name) //切换店铺后存储店铺名称
      wx.setStorageSync('memberIdNow', res.body.member.id) //切换店铺后存储会员id
      // wx.setStorageSync('access_token', res.body.token.access_token) //切换店铺后更换access_token
      wx.reLaunch({
        url: '/pages/index/index_v1'
      })
    }).select({
      tenantId: e.currentTarget.dataset.id,
      deliveryCenterId: ''
    })
  },
  goMarket: function() {
    util.navigateTo({
      url: './../create/index'
    })
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

  }
})