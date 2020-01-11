// pages/purse/freezing/list.js
var app = getApp()
var Balance = require('../../../service/balance.js')
var util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData()
  },
  initData() {
    //获取余额资料
    wx.stopPullDownRefresh()
    var that = this
    new Balance(res => {
      this.setData({
        freezeBalance: res.body.freezeBalance
      })
    }).memberBalance()
    new Balance(res => {
      var billList = res.body.records
      if (billList.length == 0) {
        that.setData({
          tips: '暂无账单数据~',
          showtips: false
        })
      }
      for (var i = 0; i < billList.length; i++) {
        billList[i].createDate = util.formatTimeTwo(billList[i].createDate, 'Y/M/D h:m:s')
      }
      this.data.total = res.body.total;
      this.data.size = res.body.size;
      this.data.page = res.body.page;
      this.data.pageIndex = 1;
      this.setData({
        billList: billList,
      })
    }).notInDeposits({
      pageIndex: 1,
      pageSize: 10
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
    this.initData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.showNavigationBarLoading();
    var pageModel = this.data.pageModel;
    var billList = this.data.billList;
    if (this.data.page > this.data.pageIndex) {
      new Balance(function(data) {
        wx.hideNavigationBarLoading() //完成停止加载
        if (data.body.page < data.body.current) {
          that.setData({
            tips: '没有更多啦~',
            showtips: false
          })
        } else {
          for (var i = 0; i < data.body.records.length; i++) {
            data.body.records[i].createDate = util.formatTimeTwo(data.body.records[i].createDate, 'Y/M/D h:m:s')
          }
          billList = billList.concat(data.body.records)
          that.setData({
            billList: billList,
            loading: false,
            tips: data.body.records.length < that.data.size ? '没有更多啦~' : '努力加载中',
            showtips: false
          })
        }
      }).notInDeposits({
        pageIndex: ++that.data.pageIndex,
        pageSize: 10
      })
    } else {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  }
})