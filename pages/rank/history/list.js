// pages/home/rank/list.js

let swiperAutoHeight = require("../../../template/swiper/swiper.js"),
  Tenant = require("../../../service/tenant.js"),
  member = require("../../../service/member.js"),
  Census = require("../../../service/census.js"),
  app = getApp(),
  util = require("../../../utils/util.js")
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
    new Census(res => {
      var rankList = res.body.records
      for (var i = 0; i < rankList.length; i++) {
        rankList[i].startDate = util.formatTimeTwo(rankList[i].startDate, 'Y/M/D h:m:s')
        rankList[i].endDate = util.formatTimeTwo(rankList[i].endDate, 'Y/M/D h:m:s')
      }
      this.setData({
        rankList: rankList
      })
    }).historySalesRanking({
      tenantId: wx.getStorageSync('tenantIdNow'),
      pageNumber: 1,
      pageSize: 100
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


  goRankDetail(e) {
    var activityId = e.currentTarget.dataset.id
    var rewardTemplateId = e.currentTarget.dataset.templete
    wx.navigateTo({
      url: 'view?activityId=' + activityId + '&rewardTemplateId=' + rewardTemplateId
    })
  }

})