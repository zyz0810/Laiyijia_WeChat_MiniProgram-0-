let app = getApp(),
  Tenant = require('../../../service/tenant'),
  Shelf = require('../../../service/shelf')
  // WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageLoad: false //页面加载完成
  },
  goPackageList() {
    wx.navigateTo({
      url: 'list',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.LOGIN_STATUS) {
      this.getData(options)
    } else {
      app.loginOkCallbackList.push(() => {
        this.getData(options)
      })
    }
  },
  getData(options) {
    var that = this
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      this.data.tenantId = scene.split("#")[0]
      this.data.shelfExtensionId = scene.split("#")[1]
      wx.setStorageSync('shelfExtensionId', scene.split("#")[1])
    } else {
      this.data.tenantId = options.tenantId
      if (options.extensionId) {
        wx.setStorageSync('shelfExtensionId', options.extensionId)
      }
      this.data.shelfExtensionId = options.extensionId ? options.extensionId : wx.getStorageSync('shelfExtensionId') ? wx.getStorageSync('shelfExtensionId') : ''
    }
    new Shelf(res => {

      let article = res.data.tenantIntroduce.replace(/(\<strong)/gi, function ($0, $1) {
        return {
          "<strong": '<strong style="font-weight: normal;" '
        }[$1];
      });
      this.setData({
        tenantData: res.data,
        pageLoad: true,
        mainColor: app.globalData.mainColor,
        // tenantIntroduce: res.data.tenantIntroduce
        tenantIntroduce: article
      })
      // var tenantIntroduce = res.data.tenantIntroduce ? res.data.tenantIntroduce.replace(/embed(?=\s+)/gi, 'video') : res.data.tenantIntroduce;
      // if (tenantIntroduce != null) {
      //   WxParse.wxParse('tenantIntroduce', 'html', tenantIntroduce, that, 5);
      // }
    }).tenant_info({
      tenantId: this.data.tenantId,
      extensionId: this.data.shelfExtensionId
    })
  },
  //进入订单列表
  goOrder() {
    wx.navigateTo({
      url: 'order',
    })
  },
  //进入品牌介绍详情
  goIntroduce() {
    wx.navigateTo({
      url: 'info',
    })
  },
  //进入货架套餐详情
  goView(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'view?id=' + id,
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
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          // wx.navigateTo({
            // url: '/pages/member/scope/index',
          // })
        }
      }
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: '来一架邀您加盟',
      path: 'pages/shelf/package/index?tenantId=' + app.globalData.tenantId + '&extensionId=' + app.globalData.memberInfo.id,
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //联系我们
  callUs: function() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.tenantData.linkMethod ? that.data.tenantData.linkMethod : '0551-67698098',
      success(res) {},
      fail(err) {
        if (err.errMsg.indexOf('cancel') === -1) {
          util.errShow(that.data.tenantData.linkMethod ? that.data.tenantData.linkMethod : '0551-67698098', 5000)
        }
      }
    })
  }
})