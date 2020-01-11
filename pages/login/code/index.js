// pages/include/captcha/captcha.js

var util = require('../../../utils/util');
var Member = require('../../../service/member.js');
var Tenant = require("../../../service/tenant.js");
var countdown = util.countdown //验证码计时;
//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    focus: true,
    count: 60,
    tips: '60秒后重试',
    receivePhone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    countdown(this)
    var that = this;
    var phone = options.phone;
    this.setData({
      receivePhone: options.phone
    })
  },
  beFocus: function() {
    this.setData({
      focus: true
    })
  },
  codeInput: function(e) {
    var val = e.detail.value.toString();
    var that = this;
    this.setData({
      code: val
    })
    if (val.length == 4) {
      wx.showLoading({
        title: '登录中'
      })
      new Member(res => {
        wx.setStorageSync('access_token', res.body.token.access_token)
        wx.setStorageSync('submit', true)
        wx.setStorageSync('memberIdNow', res.body.member.id) //切换店铺后存储会员id
        //获取用户加盟的品牌
        new Tenant(res => {
          if (res.body > 0){
            wx.setStorageSync('tenantIdNow', res.body[0].id)
            wx.setStorageSync('tenantNameNow', res.body[0].name)
          }
        }).tenantList()
        wx.redirectTo({
          // url: '/pages/shop/change/index?from=login'
          url: '/pages/index/index',
        })
      }, function(e) {
        wx.hideLoading()
        console.log(e)
        if (e.subCode == '110102') {
          util.navigateTo({
            url: '/pages/shop/register/index'
          })
        }
      }, ).loginByVerifyCode({
        mobile: that.data.receivePhone,
        verifyCode: that.data.code
      })
    }

  },

  //重新发送验证码
  sendAgain: function() {
    var that = this;
    if (this.data.count == 60) {
      new Member(res => {
        wx.showToast({
          title: '发送成功'
        })
        countdown(that);
      }).getVerifyCode({
        mobile: that.data.receivePhone
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请稍后再试',
      })
    }

  }



})