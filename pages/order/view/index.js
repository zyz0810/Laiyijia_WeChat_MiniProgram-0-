//获取应用实例
var app = getApp()
var Order = require('../../../service/order.js')
var util = require('../../../utils/util')
var util = require("../../../utils/util.js")
var config = require("../../../utils/config.js")

var getData = function(that, id) {
  var details = []
  new Order((data) => {
    details = data.body;
    var baseUrl = config.BASE_URL;
    var logType = ''
    var log = []
    for (var i = 0; i < details.orderLogs.length; i++) {
      details.orderLogs[i].createDate = util.formatTimeTwo(details.orderLogs[i].createDate, 'Y/M/D h:m:s')
      if (logType !== details.orderLogs[i].type) {
        log.push(details.orderLogs[i])
      }
      logType = details.orderLogs[i].type
    }
    details.orderLogs = log
    that.setData({
      details: details,
      pickUpcodeUrl: baseUrl + details.pickUpCodeUrl
    })
  }).tradeDetail({
    tradeId: id
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      mainColor: '#E50012'
    })
    var id = options.id
    this.setData({
      id: id
    })
    getData(this, id)
  }
})