// pages/shelf/replenish/detail.js
var app = getApp()
var Shelf = require('../../../service/shelf')
var util = require("../../../utils/util")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    canClick: true
  },
  //查看物流信息
  goLogistics(e) {
    var no = e.currentTarget.dataset.no
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: 'logistics?no=' + no + '&name=' + name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.retrievalId = options.id
    new Shelf(res => {
      res.body.createDate = util.formatTimeTwo(res.body.createDate, 'Y/M/D h:m:s')
      res.body.productDelivery.signDate = res.body.productDelivery.signDate ? util.formatTimeTwo(res.body.productDelivery.signDate, 'Y/M/D h:m:s') : '--'
      if (res.body.productDelivery.status == 1) {
        for (var i = 0; i < res.body.productRetrievalItems.length; i++) {
          res.body.productRetrievalItems[i].signQuantity = res.body.productRetrievalItems[i].quantity
        }
      }
      this.setData({
        detailData: res.body,
        data: res.body.productRetrievalItems
      })
    }).detail({
      retrievalId: options.id
    })
  },
  //签收备注填写
  signRemark(e) {
    this.setData({
      signRemark: e.detail.value
    })
  },
  //签收数量修改
  changeCount(e) {
    var index = e.currentTarget.dataset.index
    var data = this.data.data
    data[index].signQuantity = e.detail.value ? e.detail.value : 0
    this.setData({
      data: data
    })
  },
  //复制补货单号到剪贴板
  clipboardData(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.sn,
      success(res) {}
    })
  },
  //签收按钮点击
  sign() {
    if (!this.data.canClick) {
      return
    }
    this.data.canClick = false
    wx.showLoading({
      title: '签收中',
    })
    new Shelf(res => {
      this.data.canClick = true
      wx.hideLoading()
      wx.showToast({
        title: '签收成功'
      })
      setTimeout(function() {
        wx.navigateBack({})
      }, 1500)
    }, function() {
      wx.hideLoading()
      this.data.canClick = true
    }).sign({
      retrievalId: this.data.retrievalId,
      items: JSON.stringify(this.data.data),
      remark: this.data.signRemark ? this.data.signRemark : '',
      tenantId: this.data.detailData.tenant.id
    })
  }
})