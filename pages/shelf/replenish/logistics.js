let app = getApp(),
  Shelf = require('../../../service/shelf'),
  util = require("../../../utils/util.js")
Page({
  data: {
    list: [],
    no: ''
  },
  onLoad: function(options) {
    this.setData({
      no: options.no,
      mainColor: '#ff4008',
      name: options.name
    })
    new Shelf(res => {
      this.setData({
        dataList: JSON.parse(res.body)
      })
    }).logistic({
      no: options.no
    })
  }
})