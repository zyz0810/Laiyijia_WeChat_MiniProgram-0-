// pages/index/home.js
let app = getApp(),
  Member = require("../../service/member.js"),
  Shelf = require("../../service/shelf.js"),
  Census = require("../../service/census.js"),
  Tenant = require("../../service/tenant.js"),
  Product = require("../../service/product.js"),
  Course = require("../../service/course.js"),
  config = require('../../utils/config'),
  util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSwiper: 0,
    showActivityRule: false,
    currentIndex: 0,
    show: false,
    productList: [],
    courseList: [],
    heightPage: "auto",
    isx: /iphone10|iphone x/i.test(wx.getSystemInfoSync().model),
    imgTop: '5vw',
    animation: false,
    canvasHide: true,
    showAction: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    new Product(function(res) {
      that.setData({
        productList: res.body
      })
    }).specialOffersProductList()


    new Course(function(res) {
      that.setData({
        tagList: res.body.tagList
      })
      var courseList = []
      res.body.tagList.forEach((u, i) => {
        courseList.push(courseGet(u.id))
      })
      // 统一更新数据
      Promise.all(courseList).then((valuse) => {
        that.setData({
          courseList: valuse
        })
      });
      function courseGet(id) {
        return new Promise((resolve, reject) => {
          new Course(function (data) {
            resolve(data.body);
          }).newCourseList({
            tagId: id
          })
        })
      }


      // for (var i = 0; i < res.body.tagList.length; i++) {
      //   console.log(i + "=" + res.body.tagList[i].id)
      //   new Course(function(data) {
      //     console.log(data.body)
      //     courseList.push(data.body)
      //     that.setData({
      //       courseList: courseList
      //     })
      //   }).newCourseList({
      //     tagId: res.body.tagList[i].id
      //   })
      // }

    

    }).tagList()



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  goTaobao: function(e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: e.currentTarget.dataset.name,
      success: function(res) {
        wx.hideToast()
        var productList = that.data.productList
        productList[e.currentTarget.dataset.index].show = !productList[e.currentTarget.dataset.index].show
        that.setData({
          productList: productList
        })
      }
    });
  },
  closeBijia: function(e) {
    var productList = this.data.productList
    productList[e.currentTarget.dataset.index].show = !this.data.productList[e.currentTarget.dataset.index].show
    this.setData({
      productList: productList
    })
  },
  swiperChangeDot: function(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentSwiper: index
    })
  },
  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  clickShowRule() {
    this.setData({
      showActivityRule: true,
      heightPage: '100vh'
    })
  },
  closeRule() {
    this.setData({
      showActivityRule: false,
      heightPage: "auto"
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.setData({
      imageWidth: 375,
      imageHeight: 667
    })
    //背景图片临时地址下载
    wx.downloadFile({
      url: 'https://cdn.laiyijia.com/upload/image/202001/9e50f77b-2cdb-439d-b774-7f5cd514cc1b.png',
      success: function(res2) {
        that.data.shareBg = res2.tempFilePath
      }
    })
    new Tenant(function(res) {
      that.setData({
        auditStatus: res.body.auditStatus
      })
    }).getShopOwnerDeliveryCenter()
  },
  goMiniProgram: function(e) {
    var that = this
    wx.navigateToMiniProgram({
      // appId: 'wx1854eb32a95e1e37', //测试环境小程序appid
      appId: 'wx2077547f21716759', //生产环境小程序appid
      path: 'pages/index/index?memberIdTenant=' + wx.getStorageSync('memberIdNow'), //跳转关联小程序app.json配置里面的地址
      extraData: { //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
        // id: e.currentTarget.dataset.id
      },
      //**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） 
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log('跳转成功')
      }
    })
  },
  goProduct: function(e) {
    var that = this
    wx.navigateToMiniProgram({
      // appId: 'wx1854eb32a95e1e37', //测试环境小程序appid
      appId: 'wx2077547f21716759', //生产环境小程序appid
      path: 'pages/product/details/detailsB?id=' + e.currentTarget.dataset.id + '&tag=specialOffersProduct&first=' + e.currentTarget.dataset.first + '&second=' + e.currentTarget.dataset.second + '&memberIdTenant=' + wx.getStorageSync('memberIdNow'), //跳转关联小程序app.json配置里面的地址
      extraData: { //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
        id: e.currentTarget.dataset.id
      },
      //**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） 
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  goCourse: function(e) {
    wx.navigateTo({
      url: '/pages/course/view?id=' + e.currentTarget.dataset.id
    })
  },
  toWatch: function() {
    if (this.data.auditStatus == 0) {
      wx.showToast({
        title: '正在审核中，请耐心等候~',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/shop/register/edit'
      })
    }

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
      new Member(resa => {
        // new Shelf(resa => {
        this.data.shareMobile = resa.body.mobile
        this.data.shareName = resa.body.name
        //获取小程序码图片临时地址
        if (resa.body && resa.body.qrcodeUrl) {

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
        }
      }).shareB2BApplet()
      // }).shareShelvesPackage({})
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
    var that = this
    new Product(function(res) {
      that.setData({
        productList: res.body
      })
    }).specialOffersProductList()
    new Course(function(res) {
      wx.stopPullDownRefresh()
      that.setData({
        tagList: res.body.tagList,
        currentSwiper: 0
      })
      var courseList = []
      res.body.tagList.forEach((u, i) => {
        courseList.push(courseGet(u.id))
      })
      // 统一更新数据
      Promise.all(courseList).then((valuse) => {
        that.setData({
          courseList: valuse
        })
      });
      function courseGet(id) {
        return new Promise((resolve, reject) => {
          new Course(function (data) {
            resolve(data.body);
          }).newCourseList({
            tagId: id
          })
        })
      }
      // for (var i = 0; i < res.body.tagList.length; i++) {

      //   console.log(i + "=" + res.body.tagList[i].id)
      //   new Course(function(data) {
      //     console.log(data.body)
      //     courseList.push(data.body)
      //     that.setData({
      //       courseList: courseList
      //     })
      //   }).newCourseList({
      //     tagId: res.body.tagList[i].id
      //   })
      // }
    }).tagList()
    new Tenant(function(res) {
      that.setData({
        auditStatus: res.body.auditStatus
      })
    }).getShopOwnerDeliveryCenter()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})