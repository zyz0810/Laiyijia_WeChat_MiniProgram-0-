// pages/login/index.js
let swiperAutoHeight = require("../../../template/swiper/swiper.js"),
  config = require('../../../utils/config'),
  app = getApp(),
  util = require("../../../utils/util.js")

Page(Object.assign({}, swiperAutoHeight, {

  /**
   * 页面的初始数据
   */
  data: {
    topImgs: {
      data: [{
        id: 5471,
        title: "您还没有添加标题！",
        image: "http://cdn.tiaohuo.com/upload/image/201801/bb63cd0c-6cf9-4bf3-8b4a-b11099314c19.png",
        url: null,
        adPosition: null,
        linkType: "product",
        linkId: null,
      }, {
        id: 5471,
        title: "您还没有添加标题！",
        image: "http://cdn.tiaohuo.com/upload/image/201904/68795f05-0c66-4ba8-9d5b-7b4a7d6bccc1.jpg",
        url: null,
        adPosition: null,
        linkType: "product",
        linkId: null,
      }],
      key: "image"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  goLogin: function () {
    util.navigateTo({
      url: './../../login/index'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))