// pages/login/login/index.js
let swiperAutoHeight = require("../../../template/swiper/swiper.js"),
  config = require('../../../utils/config'),
  Member = require('../../../service/member.js'),
  Tenant = require("../../../service/tenant.js"),
  app = getApp(),
  util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    active: false,
    deleteIcon: true
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

  //输入框变化
  bindChange: function(e) {
    var that = this
    var phone = e.detail.value.trim();
    that.setData({
      phone: phone
    })
  },
  deleteMobile: function() {
    this.setData({
      phone: ''
    })
  },

  //发送验证码
  getcode: function() {
    var that = this;
    if (!util.checkPhone(that.data.phone)) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      })
    } else {
      new Member(res => {
        util.navigateTo({
          url: './../code/index?phone=' + that.data.phone
        })
      }).getVerifyCode({
        mobile: that.data.phone
      })

    }

  },

  // 点击获取手机号快速登录
  getPhoneNumber(e) {
    if (e.detail.errMsg.indexOf('fail') > -1) {
      wx.showToast({
        icon: 'none',
        title: '授权失败'
      })
    } else {
      wx.showLoading({
        title: '登录中'
      })
      wx.checkSession({
        success: function(res) {
          console.log('checkSession有效')
          new Member(function(res) { //初始化登录
            wx.setStorageSync('access_token', res.body.token.access_token)
            wx.setStorageSync('submit', true)
            wx.redirectTo({
              // url: '/pages/shop/change/index',
              url: '/pages/index/index',
            })
          }, function(err) {
            console.log(err)
            console.log('失败重新登录')
            wx.setStorageSync('access_token', '')
            wx.hideLoading()
            wx.login({
              success: function(reswx) {
                new Member(function(res) { //初始化登录
                  wx.setStorageSync('access_token', res.body.token.access_token)
                  wx.setStorageSync('code', reswx.code)
                  wx.setStorageSync('submit', true)
                  //获取用户加盟的品牌
                  new Tenant(res => {
                    wx.setStorageSync('tenantIdNow', res.body[0].id)
                    wx.setStorageSync('tenantNameNow', res.body[0].name)
                  }).tenantList()
                  wx.redirectTo({
                    // url: '/pages/shop/change/index',
                    url: '/pages/index/index',
                  })
                }, function(err) {
                  console.log(err)
                  wx.setStorageSync('code', reswx.code)
                  wx.setStorageSync('access_token', '')
                  if (e.subCode == '110102') {
                    util.navigateTo({
                      url: '/pages/shop/register/index'
                    })
                  }
                }).login({
                  code: reswx.code,
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv
                })
              },
              fail: function(res) {},
              complete: function(res) {}
            })
          }).login({
            code: wx.getStorageSync('code'),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          })
        },
        fail: function(err) {
          console.log('无效的checkSession')
          wx.login({
            success: function(reswx) {
              new Member(function(res) { //初始化登录
                wx.setStorageSync('access_token', res.body.token.access_token)
                wx.setStorageSync('code', reswx.code)
                wx.setStorageSync('submit', true)
                wx.redirectTo({
                  // url: '/pages/shop/change/index',
                  url: '/pages/index/index',
                })
              }, function(err) {
                console.log(err)
                wx.setStorageSync('code', reswx.code)
                wx.setStorageSync('access_token', '')
                if (e.subCode == '110102') {
                  util.navigateTo({
                    url: '/pages/shop/register/index'
                  })
                }
              }).login({
                code: reswx.code,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
              })
            },
            fail: function(res) {},
            complete: function(res) {}
          })
        }
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
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '来一架',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})