let aldstat = require("./utils/ald-stat.js");
let Member = require('/service/member.js')
let util = require('/utils/util.js')
let config = require('/utils/config.js')

App({
  globalData: {
    LOGIN_STATUS: false,
    sys: wx.getSystemInfoSync()
  },
  onShow(opData) {},
  loginOkCallbackList: [],
  onLaunch(opData) {
    //监测用户是否登录，是否缓存token，是否选择了店铺，如果没有则进入登录页重新登录
    // if (!wx.getStorageSync('submit') || !wx.getStorageSync('access_token') || !wx.getStorageSync('tenantIdNow')) {
    //   wx.reLaunch({
    //     url: '/pages/login/index',
    //   })
    // }
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {

          
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    wx.login({
      success: function(res) {
        wx.setStorageSync('code', res.code)
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  onHide: function () {
    wx.setStorageSync('activity', false)
    console.log('切后台' + wx.getStorageSync('activity'))
  }
  
})