let config = require('../utils/config')
let util = require('../utils/util')
let BASE_URL = config.BASE_URL

module.exports = class Ajax {
  constructor(fn = function() {}, errFn = function() {}) {
    this.fn = fn
    this.errFn = errFn
  }
  get(options) {
    this.request(options, 'GET')
  }
  post(options) {
    this.request(options, 'POST')
  }
  request(options, method = 'GET') {
    options = typeof options == 'string' ? {
      url: options
    } : options
    if (!/^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(options.url)) {
      options.url = BASE_URL + options.url
    }
    let _this = this
    wx.showNavigationBarLoading()
    wx.request({
      url: options.url,
      method: method,
      data: options.data,
      header: Object.assign({
        'Content-Type': 'application/x-www-form-urlencoded',
        'client_type': 'shelves_applet',
        'authorization': 'Bearer ' + wx.getStorageSync('access_token'),
        'Cache-Control': 'max-age=60' //60秒
      }, options.header),
      success(res) {
        //同个账号被挤下线后，让用户重新登录
        if (res.data.head.subMsg == "用户未登录"){
          wx.hideLoading()
          wx.showToast({
            icon:'none',
            title: '用户未登录或在其他地方登陆,请重新登录'
          })
          setTimeout(function(){
              wx.reLaunch({
                url: '/pages/login/index'
              })
          },2000)
          // wx.showModal({
          //   title: '',
          //   content: '用户未登录或在其他地方登陆,请重新登录',
          //   showCancel:false,
          //   confirmText:'重新登录',
          //   success:function(){
          //     wx.setStorageSync('access_token', '')
          //     wx.setStorageSync('submit', false)
          //     wx.setStorageSync('tenantIdNow', '')
          //     wx.reLaunch({
          //       url: '/pages/login/index'
          //     })
          //   }
          // })
        }else if (res.data.head.returnCode == 0 && res.data.head.subCode == 0) {
          _this.fn(res.data)
        } else if (res.data.head.returnCode != 0 && res.data.head.subCode == 0) {
          _this.errFn(res.data.head)
          !options.hideErrorTip ? util.errShow(res.data.head.returnMsg) : ''
        } else if (res.data.head.returnCode == 0 && res.data.head.subCode != 0) {
          _this.errFn(res.data.head)
          !options.hideErrorTip ? util.errShow(res.data.head.subMsg) : ''
        } else if (res.data.head.returnCode != 0 && res.data.head.subCode != 0){
          !options.hideErrorTip ? util.errShow(res.data.head.returnMsg) : ''
        }else{
            _this.errFn(res)
          !options.hideErrorTip ? util.errShow('服务器错误') : ''
        }
      },
      error(err) {
        _this.errFn(err)
        wx.getNetworkType({
          success: function(res) {
            var networkType = res.networkType
            if (networkType == 'none') {
              util.errShow('网络连接失败', 4000)
            } else {
              util.errShow('未知错误', 4000)
            }
          }
        })
      },
      complete(request, status) {
        if(request.errMsg.indexOf('timeout') > -1){
          wx.hideLoading()
          util.errShow('网络请求超时', 2000)
        }else if(request.errMsg.indexOf('fail')>-1){
          wx.hideLoading()
          wx.getNetworkType({
            success: function (res) {
              wx.hideLoading()
              var networkType = res.networkType
              if (networkType == 'none') {
                util.errShow('网络连接失败', 2000)
              } else {
                util.errShow('网络请求超时', 2000)
              }
            }
          })
        }
        wx.hideNavigationBarLoading()
      }
    })
  }
}