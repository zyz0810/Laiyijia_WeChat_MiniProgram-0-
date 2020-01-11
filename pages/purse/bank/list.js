let app = getApp();
let Member = require('../../../service/member.js')
let config = require('../../../utils/config.js')
Page({
  data: {
    bankInfoList: []
  },
  onLoad: function() {},
  onShow: function() {
    var that = this;
    new Member(function(res) {
      that.setData({
        bankInfoList: res.body
      })
    }).myBankList()
  },

  //删除银行卡
  deleteCard: function(e) {
    var cardId = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '',
      content: '确认删除该银行卡？',
      success: function(res) {
        if (res.confirm) {
          new Member(function(res) {
            wx.showToast({
              icon: 'success',
              title: '删除成功'
            })
            that.onShow()
          }).deleteCard({
            id: cardId
          })
        }
      }
    })
  },
  //添加银行卡
  addBank: function() {
    wx.navigateTo({
      url: 'add',
    })
  }
});