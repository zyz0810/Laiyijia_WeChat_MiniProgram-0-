// pages/purse/bank/code.js
var app = getApp()
var Member = require("../../../service/member.js")
var util = require("../../../utils/util")
var countdown = util.countdown //验证码计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgBtn: '#9CE6BF',
    count: 60,
    tips: '60s后重试'
  },
  captcha(e) {
    console.log(e)
    this.setData({
      captcha: e.detail.value
    })
    if (e.detail.value.length == 4) {
      this.setData({
        bgBtn: '#1AAD19'
      })
    } else {
      this.setData({
        bgBtn: '#9CE6BF'
      })
    }
  },
  //发送验证码
  getcode: function() {
    var that = this;
    if (this.data.count == 60) {
      new Member(function() {
        countdown(that);
      }).getVerifyCode({
        mobile: that.data.mobile
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请稍后再试',
      })
    }

  },
  submit: function() {
    var that = this
    new Member(res => {
      wx.navigateBack({
        delta: 3
      })
    }).bankAdd({
      cardNo: that.data.cardNo,
      mobile: that.data.mobile,
      verifyCode: this.data.captcha,
      branchBank: this.data.branchBank,
      branchBankCode: this.data.branchBankCode,
      branchBankAddress: this.data.branchBankAddress,
      branchBankTel: this.data.branchBankTel
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.branchBank = options.branchBank
    this.data.branchBankCode = options.branchBankCode
    this.data.branchBankAddress = options.branchBankAddress
    this.data.branchBankTel = options.branchBankTel
    this.setData({
      cardNo: options.cardNo,
      mobile: options.mobile,
    })
    new Member(res => {
      countdown(this)
    }).getVerifyCode({
      mobile: options.mobile
    })
  }
})