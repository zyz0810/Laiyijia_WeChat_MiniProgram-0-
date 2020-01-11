// pages/shelf/replenish/list.js
var app = getApp()
var Shelf = require('../../../service/shelf')
var util = require("../../../utils/util")
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
    this.data.shelvesNo = options.shelvesNo
    this.data.tenantId = options.tenantId
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.pageIndex) {
      new Shelf(res => {
        this.data.total = res.body.total;
        this.data.size = res.body.size;
        this.data.page = res.body.page;
        this.data.pageIndex = 1;
        for (var i = 0; i < res.body.records.length; i++) {
          res.body.records[i].createDate = util.formatTimeTwo(res.body.records[i].createDate, 'Y/M/D h:m:s')
        }
        this.setData({
          listData: res.body.records
        })
      }).query({
        // tenantId: wx.getStorageSync('tenantIdNow'),
        tenantId: this.data.tenantId,
        shelvesNo: this.data.shelvesNo,
        page: 1,
        pageSize: this.data.pageIndex * this.data.size
      })
    } else {
      new Shelf(res => {
        this.data.total = res.body.total;
        this.data.size = res.body.size;
        this.data.page = res.body.page;
        this.data.pageIndex = 1;
        if (res.body.records.length == 0) {
          this.setData({
            tips: '没有更多啦~',
            showtips: false
          })
        }
        for (var i = 0; i < res.body.records.length; i++) {
          res.body.records[i].createDate = util.formatTimeTwo(res.body.records[i].createDate, 'Y/M/D h:m:s')
        }
        this.setData({
          listData: res.body.records
        })
      }).query({
        // tenantId: wx.getStorageSync('tenantIdNow'),
        tenantId:this.data.tenantId,
        tenantId: this.data.tenantId,
        shelvesNo: this.data.shelvesNo,
        page: 1,
        pageSize: 10
      })
    }
  },

  //查看补货详情
  goDetail(e) {
    wx.navigateTo({
      url: 'detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    //货架
    new Shelf(res => {
      wx.stopPullDownRefresh()
      this.data.size = res.body.size;
      this.data.page = res.body.page;
      this.data.pageIndex = 1;
      if (res.body.records.length == 0) {
        this.setData({
          tips: '没有更多啦~',
          showtips: false
        })
      }
      for (var i = 0; i < res.body.records.length; i++) {
        res.body.records[i].createDate = util.formatTimeTwo(res.body.records[i].createDate, 'Y/M/D h:m:s')
      }
      this.setData({
        listData: res.body.records
      })
    }).query({
      // tenantId: wx.getStorageSync('tenantIdNow'),
      tenantId:this.data.tenantId,
      shelvesNo: this.data.shelvesNo,
      page: 1,
      pageSize: 10
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.showNavigationBarLoading();
    var listData = this.data.listData;
    if (this.data.page > this.data.pageIndex) {
      new Shelf(function(data) {
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
          listData = listData.concat(data.body.records)
          that.setData({
            listData: listData,
            loading: false,
            tips: data.body.records.length < that.data.size ? '没有更多啦~' : '努力加载中',
            showtips: false
          })
        }
      }).query({
        // tenantId: wx.getStorageSync('tenantIdNow'),
        tenantId:this.data.tenantId,
        shelvesNo: this.data.shelvesNo,
        page: ++that.data.pageIndex,
        pageSize: 10
      })
    } else {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  }
})