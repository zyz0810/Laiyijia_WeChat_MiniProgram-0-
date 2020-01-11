// pages/shelf/package/orderPay.js
var app = getApp(),
  Shelf = require("../../../service/shelf.js"),
  Order = require("../../../service/order.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quantity: '1',
    amount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.id
    this.setData({
      mainColor: app.globalData.mainColor,
      mobile: app.globalData.memberInfo.mobile,
      name: app.globalData.memberInfo.displayName,
      quantity: options.quantity,
    })

    new Shelf(res => {
      this.setData({
        info: res.data,
        amount: options.quantity * res.data.salePrice
      })
    }).confirm({
      id: options.id,
      count: options.quantity
    })
  },
  revisenum(e) {
    let stype = e.currentTarget.dataset.type,
      that = this,
      min = 1,
      max = 99,
      quantity = parseInt(this.data.quantity)
    switch (stype) {
      case 'input':
        quantity = (!isNaN(e.detail.value) && e.detail.value >= min && e.detail.value <= max) ? e.detail.value : this.data.quantity
        that.calcAmount(quantity)
        break;
      case 'add':
        quantity = quantity + 1 <= max ? (quantity < min ? min : ++quantity) : max
        if (quantity == max) {
          wx.showToast({
            title: '限购99',
          })
        }
        that.calcAmount(quantity)
        break;
      case 'reduce':
        quantity = quantity - 1 < min ? 1 : --quantity
        that.calcAmount(quantity)
        break;
    }
    this.setData({
      quantity: quantity
    })
  },
  calcAmount(num) {
    this.setData({
      amount: (num * this.data.info.salePrice).toFixed(2)
    })
  },
  //输入手机号
  mobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  formSubmit() {
    var that = this
    if (!(/^1\d{10}$/.test(that.data.mobile))) {
      util.errShow('手机号格式错误');
    } else {
      wx.showLoading({
        title: '订单提交中'
      })
      new Shelf(res => {
        new Order(submitData => {
          wx.hideLoading()
          wx.requestPayment({
            'timeStamp': submitData.data.timeStamp,
            'nonceStr': submitData.data.nonceStr,
            'package': submitData.data.package,
            'signType': submitData.data.signType,
            'paySign': submitData.data.paySign,
            'success': function(paySucc) {
              wx.redirectTo({
                url: "/pages/pay/success?sn=" + res.data.paymentSn,
              })
            },
            'fail': function() {
              wx.redirectTo({
                url: "order",
              })
            }
          })
        }).paymentSubmit({
          paymentPluginId: 'chinaumsAppletPayPlugin',
          sn: res.data.paymentSn
        })
      }).createOrder({
        id: that.data.id,
        count: that.data.quantity,
        tenantId: app.globalData.tenantId,
        extensionId: wx.getStorageSync('shelfExtensionId'),
        mobile: this.data.mobile
      })
    }
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