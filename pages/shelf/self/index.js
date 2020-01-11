// pages/shelf/self/index.js
var app = getApp()
var Shelf = require('../../../service/shelf')
var util = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftValue: 360,
    topValue: 560,
    animation: false,
    shelvesList: [1],
    currentTab: 0,
    canvasHide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        var screenHeightRpx = (750 * res.windowHeight) / res.screenWidth
        var imgTop = (screenHeightRpx - 194 - 890) / 2
        var X = res.windowWidth - 100;
        var Y = res.windowHeight - 130;
        _this.setData({
          leftValue: X,
          topValue: Y,
          imgTop: imgTop + 'rpx'
          // animation:true
        });
      }
    })
    new Shelf(res => {
      this.data.total = res.body.total;
      this.data.size = res.body.size;
      this.data.page = res.body.page;
      this.data.pageIndex = 1;
      this.setData({
        shelvesList: res.body.records,
        memberIdNow: wx.getStorageSync('memberIdNow')
      })
    }).myShelves({
      // tenantId: wx.getStorageSync('tenantIdNow'),
      pageIndex: 1,
      pageSize: 10
    })

    //获取海报图片临时地址
    _this.setData({
      imageWidth: 375,
      imageHeight: 667
    })


    //背景图片临时地址下载
    wx.downloadFile({
      url: 'https://cdn.laiyijia.com/upload/image/201906/3321e236-1294-43d8-ade3-c0b8626374a3.png',
      success: function(res2) {
        _this.data.shareBg = res2.tempFilePath
      }
    })
  },
  tabTap: function(e) {
    if (e.currentTarget.dataset.tab == this.data.currentTab) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      currentTab: e.currentTarget.dataset.tab
    })
    this.onPullDownRefresh()
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
  //前往补货记录
  goReplenish(e) {
    var no = e.currentTarget.dataset.no
    var tenantId = e.currentTarget.dataset.tenantid
    wx.navigateTo({
      url: '../replenish/list?shelvesNo=' + no + '&tenantId=' + tenantId,
    })
  },
  //邀请好友赚钱
  inviteFriend(e) {
    let that = this
    this.setData({
      nav: false
    })
    if (e.detail.errMsg.indexOf('fail') > -1) {
      wx.showToast({
        title: '请授权用户信息!',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '海报生成中~',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 10000)
      //获取用户头像昵称
      that.setData({
        shareName: that.data.trueName ? that.data.trueName : wx.getStorageSync('tenantNameNow'),
        headImg: e.detail.userInfo.avatarUrl
      })
      new Shelf(resa => {
        this.data.shareMobile = resa.body.mobile
        this.data.shareName = resa.body.name
        //获取小程序码图片临时地址
        wx.downloadFile({
          url: resa.body.qrcodeUrl ? resa.body.qrcodeUrl.replace('http', 'https') : '',
          success: function(res) {
            that.data.qrcode = res.tempFilePath
            wx.downloadFile({
              url: e.detail.userInfo.avatarUrl,
              success: function(res) {
                that.setData({
                  headImg: res.tempFilePath,
                })
                that.setData({
                  canvasHide: false,
                  canvasw: that.data.imageWidth + 'px',
                  canvash: that.data.imageHeight + 'px'
                })
                var w = that.data.imageWidth;
                var h = that.data.imageHeight;
                const ctx = wx.createCanvasContext('myCanvas')
                ctx.beginPath()
                ctx.fillStyle = 'rgba(255, 255, 255, 0)';
                ctx.fillRect(0, 0, w, h)
                ctx.draw();
                // ctx.save();
                ctx.drawImage(that.data.shareBg, 0, 0, w, h) //商家海报底图
                ctx.save();
                // ctx.draw();
                //头像裁剪成圆形
                // ctx.arc(0.4 * w + 0.2 * w / 2, 0.05 * w + 0.2 * w / 2, 0.2 * w / 2, 0, 2 * Math.PI);
                // ctx.setStrokeStyle('#ffffff')
                // ctx.clip();
                ctx.drawImage(that.data.headImg, 0.12 * w, 0.1 * h, 0.2 * w, 0.2 * w) //头像
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
                //canvas推荐人昵称头像填充
                ctx.setTextAlign('left')
                ctx.setFillStyle('rgb(0,0, 0)')
                ctx.setFontSize(16)
                ctx.fillText(that.data.shareName, 0.4 * w, 0.14 * h)
                ctx.fillText(that.data.shareMobile, 0.4 * w, 0.19 * h)
                ctx.drawImage(that.data.qrcode, 0.2 * w, 0.45 * h, 0.6 * w, 0.6 * w)
                ctx.draw();
                setTimeout(function() {
                  //将cavas变成图片
                  wx.canvasToTempFilePath({
                    //通过id 指定是哪个canvas
                    canvasId: 'myCanvas',
                    success(res) {
                      wx.hideTabBar()
                      wx.hideLoading()
                      that.setData({
                        canvasHide: true,
                        showAction: true,
                        shareImageSrc: res.tempFilePath
                      })
                    }
                  })
                }, 500)
              }
            })
          }
        })
      }).shareShelvesPackage({
        // tenantId: wx.getStorageSync('tenantIdNow')
      })

    }

  },
  //关闭分享弹窗
  closeMask() {
    wx.showTabBar()
    this.setData({
      canvasHide: true,
      showAction: !this.data.showAction
    })
  },
  //保存图片
  saveImage() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImageSrc,
      success: function(res) {
        wx.showToast({
          title: '图片已保存相册',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {

      }
    })
  },
  // 防止滑动穿透
  stopPageScroll() {
    return false
  },
  goMarket: function() {
    util.navigateTo({
      url: './../market/index'
    })
  },
  //前往订单列表
  goOrderList(e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    console.log(id)
    wx.navigateTo({
      url: '/pages/order/list/index?deliveryCenterId=' + id + '&deliveryname=' + name,
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    //货架
    if (this.data.currentTab == 0) {
      new Shelf(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        this.data.size = res.body.size;
        this.data.page = res.body.page;
        this.data.pageIndex = 1;
        this.setData({
          shelvesList: res.body.records
        })
      }, function() {
        wx.hideLoading()
      }).myShelves({
        // tenantId: wx.getStorageSync('tenantIdNow'),
        pageIndex: 1,
        pageSize: 10
      })
    } else {
      new Shelf(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        this.data.size = res.body.size;
        this.data.page = res.body.page;
        this.data.pageIndex = 1;
        this.setData({
          shelvesList: res.body.records
        })
      }, function() {
        wx.hideLoading()
      }).developmentShelfList({
        // tenantId: wx.getStorageSync('tenantIdNow'),
        pageIndex: 1,
        pageSize: 10
      })
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.showNavigationBarLoading();
    var shelvesList = this.data.shelvesList;
    if (this.data.page > this.data.pageIndex) {
      if (this.data.currentTab == 0) {
        new Shelf(function(data) {
          wx.hideNavigationBarLoading() //完成停止加载
          if (data.body.page < data.body.current) {
            that.setData({
              tips: '没有更多啦~',
              showtips: false
            })
          } else {
            shelvesList = shelvesList.concat(data.body.records)
            that.setData({
              shelvesList: shelvesList,
              loading: false,
              tips: data.body.records.length < that.data.size ? '没有更多啦~' : '努力加载中',
              showtips: false
            })
          }
        }).myShelves({
          // tenantId: wx.getStorageSync('tenantIdNow'),
          pageIndex: ++that.data.pageIndex,
          pageSize: 10
        })
      } else {
        new Shelf(function(data) {
          wx.hideNavigationBarLoading() //完成停止加载
          if (data.body.page < data.body.current) {
            that.setData({
              tips: '没有更多啦~',
              showtips: false
            })
          } else {
            shelvesList = shelvesList.concat(data.body.records)
            that.setData({
              shelvesList: shelvesList,
              loading: false,
              tips: data.body.records.length < that.data.size ? '没有更多啦~' : '努力加载中',
              showtips: false
            })
          }
        }).developmentShelfList({
          // tenantId: wx.getStorageSync('tenantIdNow'),
          pageIndex: ++that.data.pageIndex,
          pageSize: 10
        })
      }
    } else {
      wx.hideNavigationBarLoading() //完成停止加载
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})