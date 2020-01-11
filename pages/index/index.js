// pages/index/index.js
let app = getApp(),
  Member = require("../../service/member.js"),
  Shelf = require("../../service/shelf.js"),
  Census = require("../../service/census.js"),
  Tenant = require("../../service/tenant.js"),
  config = require('../../utils/config'),
  util = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '0',
    sys: app.globalData.sys,
    nav: false,
    member: false,
    rise: false,
    tenantName: '',
    activityName: '',
    totalAmount: '',
    rankingList: [1],
    showMoreRank: false,
    showMoreRankOne: false,
    showMoreRankTwo: false,
    animation: false,
    canvasHide: true,
    showAction: false,
    imgTop: '5vw',
    myTime: null,
    myTimeTwo: '',
    nanjirenTime: '',
    activityShow: false,
    activityEffective: false,
    currentIndex: 3,
    isx: /iphone10|iphone x/i.test(wx.getSystemInfoSync().model),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // wx.setNavigationBarTitle({
    //   title: wx.getStorageSync('tenantNameNow') ? wx.getStorageSync('tenantNameNow') : '来一架 '
    // })
    // wx.setStorageSync('tenantIdNow','67008')
    //获取海报图片临时地址
    that.setData({
      imageWidth: 375,
      imageHeight: 667
    })
    wx.getSystemInfo({
      success: function(res) {
        var screenHeightRpx = (750 * res.windowHeight) / res.screenWidth
        var imgTop = (screenHeightRpx - 194 - 890) / 2
        that.setData({
          imgTop: imgTop + 'rpx'
        })
      },
    })

    //获取用户加盟的品牌
    new Tenant(res => {
      if (res.body == ''){
        wx.setStorageSync('isIndependent', false)
        that.setData({
          showTabber: true
        })
      }else{
        wx.setStorageSync('tenantIdNow', res.body[0].id)
        wx.setStorageSync('tenantNameNow', res.body[0].name)
        this.setData({
          shopList: res.body,
          tenantIdNow: res.body[0].id,
          tenantNameNow: res.body[0].name
        })
        this.getRank(wx.getStorageSync('tenantIdNow'))
        for (var i = 0; i < res.body.length; i++) {
          if (res.body[i].isIndependent == false) {
            wx.setStorageSync('isIndependent', false)
            that.setData({
              showTabber: true
            })
          }
          if (res.body[i].id == 66786) {
            that.getRankNanjiren(66786)
            that.setData({
              activityShow: true
            })
            wx.setStorageSync('activity', true)
          }
        }
      }

     
    }).tenantList()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    // if (wx.getStorageSync('submit') && wx.getStorageSync('access_token') && wx.getStorageSync('tenantIdNow')) {
    if (wx.getStorageSync('submit') && wx.getStorageSync('access_token')) {
      this.setData({
        member: true
      })
      this.getData()
    }



    //获取用户加盟的品牌
    new Tenant(res => {

      // for (var i = 0; i < res.body.length; i++) {
      //   if (res.body[i].id == 66786) {
      //     if (wx.getStorageSync('activity') == false) {
      //       console.log('货到首页')
      //       that.setData({
      //         activityShow: true
      //       })
      //       that.getRankNanjiren(66786)
      //       wx.setStorageSync('activity', true)
      //     }
      //   }
      // }
      function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {

        for (var i = 0; i < arraytosearch.length; i++) {
          if (arraytosearch[i][key] == valuetosearch) {
            return i;
          }
        }
        return null;
      }
      var index = functiontofindIndexByKeyValue(res.body, "id", 66786);
      if (index != null) {
        if (wx.getStorageSync('activity') == false) {
          that.setData({
            activityShow: true
          })
          that.getRankNanjiren(66786)
          wx.setStorageSync('activity', true)
        }
      } else {
        wx.setStorageSync('activity', true)
      }


    }).tenantList()


  },
  getData() {
    var that = this
    //今日统计数据
    new Census(res => {
      this.setData({
        todayCensus: res.body
      })
    }).index({
      // tenantId: wx.getStorageSync('tenantIdNow'),
      timeIntervalEnum: 'TODAY'
    })
    //累计统计数据
    new Census(res => {
      wx.stopPullDownRefresh()
      this.setData({
        totalCensus: res.body
      })
    }).index({
      // tenantId: wx.getStorageSync('tenantIdNow'),
      timeIntervalEnum: 'TOTAL'
    })
    //实名认证状态
    new Member(res => {
      this.data.authStatus = res.body.authStatus
      this.data.trueName = res.body.name ? res.body.name : ''
    }).getRealNameStatus({
      // tenantId: wx.getStorageSync('tenantIdNow')
    })

    // this.getRank(wx.getStorageSync('tenantIdNow'))

    //背景图片临时地址下载
    wx.downloadFile({
      url: 'https://cdn.laiyijia.com/upload/image/201906/3321e236-1294-43d8-ade3-c0b8626374a3.png',
      success: function(res2) {
        that.data.shareBg = res2.tempFilePath
      }
    })

  },

  getRank(tenantId) {
    var that = this
    //激励活动统计
    new Census(res => {
      clearInterval(that.data.myTime);
      this.setData({
        rankData: res.body
      })
      let start_time = "2019/12/09 00:00:00";

      if (res.body.shelvesIncentiveViewDTO) {
        let activityEffective = res.body.shelvesIncentiveViewDTO.startDate / 1000 - Date.parse(new Date(start_time)) / 1000
        if (activityEffective > 0) {
          that.setData({
            activityEffective: true
          })
        }

        function time1() {
          var beginDate = res.body.shelvesIncentiveViewDTO.startDate
          var endDate = res.body.shelvesIncentiveViewDTO.endDate
          // 活动是否已经开始
          var totalSecond = beginDate / 1000 - Date.parse(new Date()) / 1000;
          // 活动是否已经结束
          var endSecond = endDate / 1000 - Date.parse(new Date()) / 1000;
          //活动剩余时间
          var goTime = (endDate - Date.parse(new Date())) / 1000
          var allSecond = (endDate - beginDate) / 1000
          var percent = ((goTime / allSecond) * 100)
          that.setData({
            percent: percent
          })
          // 秒数
          var second = endSecond;
          // 天数位
          var day = Math.floor(second / 3600 / 24);
          var dayStr = day.toString();
          // 小时位
          // var hr = Math.floor(second / 3600);
          var hr = Math.floor((second - day * 3600 * 24) / 3600);
          var hrStr = hr.toString();
          if (hrStr.length == 1) hrStr = '0' + hrStr;
          // 分钟位
          // var min = Math.floor((second - hr * 3600) / 60);
          var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
          var minStr = min.toString();
          if (minStr.length == 1) minStr = '0' + minStr;
          // 秒位
          // var sec = second - hr * 3600 - min * 60;
          var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
          var secStr = sec.toString();
          if (secStr.length == 1) secStr = '0' + secStr;
          totalSecond--;
          var timeStap = []
          if (goTime < 0) {
            // clearInterval(that.myTime)
            that.setData({
              'timeStap.countDownDay': '00',
              'timeStap.countDownHour': '00',
              'timeStap.countDownMinute': '00',
              'timeStap.countDownSecond': '00',
              'rankData.activityStatus': 'FINISHED',
              finish: true
            });
          } else {
            that.setData({
              'timeStap.countDownDay': dayStr,
              'timeStap.countDownHour': hrStr,
              'timeStap.countDownMinute': minStr,
              'timeStap.countDownSecond': secStr,
              finish: false
            });
          }
        }
        time1();
        that.data.myTime = setInterval(time1, 1000)
        if (res.body.shelvesIncentiveViewDTO.id) {
          //激励活动排名列表
          new Census(data => {
            this.setData({
              rankingList: data.body
            })
            if (data.body.rankingList.length >= 3) {
              this.setData({
                showMoreRank: true
              })
            } else {
              this.setData({
                showMoreRank: false
              })
            }
          }).shelvesRankingList({
            tenantId: tenantId,
            activityId: res.body.shelvesIncentiveViewDTO.id,
            rewardTemplateId: res.body.shelvesIncentiveViewDTO.rewardTemplateId,
            pageNumber: 1,
            pageSize: 3
          })
        } else {
          this.setData({
            rankingList: []
          })
        }
      } else {
        this.setData({
          showMoreRank: false,
          rankingList: []
        })
      }


    }).shelvesRanking({
      tenantId: tenantId
    })
  },
  // 南极人活动
  getRankNanjiren(tenantId) {
    var that = this
    //激励活动统计
    new Census(res => {
      this.setData({
        rankDataNanjiren: res.body
      })
    }).shelvesRanking({
      tenantId: tenantId
    })
  },

  showMoreRankOne() {
    //激励活动排名列表
    new Census(data => {
      this.setData({
        rankingList: data.body,
        showMoreRankOne: false
      })
    }).shelvesRankingList({
      tenantId: 67008,
      // tenantId: wx.getStorageSync('tenantIdNow'),
      activityId: this.data.rankData.shelvesIncentiveViewDTO.id,
      rewardTemplateId: this.data.rankData.shelvesIncentiveViewDTO.rewardTemplateId,
      pageNumber: 1,
      pageSize: 1000
    })
  },
  showMoreRankTwo() {
    //激励活动排名列表
    new Census(data => {
      this.setData({
        rankingListTwo: data.body,
        showMoreRankTwo: false
      })
    }).shelvesRankingList({
      tenantId: 66786,
      // tenantId: wx.getStorageSync('tenantIdNow'),
      activityId: this.data.rankDataTwo.shelvesIncentiveViewDTO.id,
      rewardTemplateId: this.data.rankDataTwo.shelvesIncentiveViewDTO.rewardTemplateId,
      pageNumber: 1,
      pageSize: 1000
    })
  },
  showMoreRank() {
    //激励活动排名列表
    new Census(data => {
      this.setData({
        rankingList: data.body,
        showMoreRank: false
      })
    }).shelvesRankingList({
      // tenantId: 67008,
      tenantId: wx.getStorageSync('tenantIdNow'),
      activityId: this.data.rankData.shelvesIncentiveViewDTO.id,
      rewardTemplateId: this.data.rankData.shelvesIncentiveViewDTO.rewardTemplateId,
      pageNumber: 1,
      pageSize: 1000
    })
  },
  member: function() {
    this.setData({
      member: true
    })
  },
  goOrder: function() {
    util.navigateTo({
      url: './../order/list/index'
    })
  },
  onHide: function() {
    clearInterval(this.data.myTime)
    this.setData({
      activityShow: false
    })
  },
  onUnload: function() {
    clearInterval(this.data.myTime)
    this.setData({
      activityShow: false
    })
  },
  //前往倒计时排名
  goRank: function() {
    if (this.data.rankData.shelvesIncentiveViewDTO) {
      util.navigateTo({
        url: './../rank/view/index?activityId=' + this.data.rankData.shelvesIncentiveViewDTO.id + '&rewardTemplateId=' + this.data.rankData.shelvesIncentiveViewDTO.rewardTemplateId
      })
    } else {
      util.errShow('暂无排名活动')
    }
  },
  //前往倒计时排名
  goRankNanjiren: function() {
    var that = this
    if (this.data.rankDataNanjiren.shelvesIncentiveViewDTO) {
      wx.setStorageSync('tenantIdNow', 66786)
      wx.setStorageSync('tenantNameNow', that.data.rankDataNanjiren.shelvesIncentiveViewDTO.tenantName)
      this.getRank(66786)
      // clearInterval(this.data.myTime)
      this.setData({
        tenantIdNow: 66786,
        tenantNameNow: that.data.rankDataNanjiren.shelvesIncentiveViewDTO.tenantName,
        activityEffective: false
      })
      util.navigateTo({
        url: './../rank/view/index?activityId=' + this.data.rankDataNanjiren.shelvesIncentiveViewDTO.id + '&rewardTemplateId=' + this.data.rankDataNanjiren.shelvesIncentiveViewDTO.rewardTemplateId
      })
    } else {
      util.errShow('暂无排名活动')
    }
  },
  //前往倒计时排名
  goRankTwo: function() {
    if (this.data.rankDataTwo.shelvesIncentiveViewDTO) {
      util.navigateTo({
        url: './../rank/view/index?activityId=' + this.data.rankDataTwo.shelvesIncentiveViewDTO.id + '&rewardTemplateId=' + this.data.rankDataTwo.shelvesIncentiveViewDTO.rewardTemplateId
      })
    } else {
      util.errShow('暂无排名活动')
    }
  },
  shelfSelf: function() {
    util.navigateTo({
      url: './../shelf/self/index'
    })
  },
  //加盟品牌
  shelfMarket: function() {
    util.errShow('敬请期待')
    // util.navigateTo({
    //   url: './../shelf/market/index'
    // })
  },
  //武道大会
  myTeam: function() {
    // util.errShow('敬请期待')
    util.navigateTo({
      url: './../team/index'
    })
  },
  tabClick: function(e) {
    var index = e.currentTarget.dataset.id
    this.setData({
      currentTab: index
    })
  },
  changeRank: function(e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.setStorageSync('tenantIdNow', id)
    wx.setStorageSync('tenantNameNow', name)
    this.getRank(id)
    // clearInterval(this.data.myTime)
    this.setData({
      tenantIdNow: id,
      tenantNameNow: name,
      activityEffective: false
    })
  },
  //前往钱包页
  goPurse: function(e) {
    util.navigateTo({
      url: './../purse/index'
    })
  },
  //关闭个人中心右边弹窗
  nav_toggle: function() {
    this.setData({
      nav: false
    })
  },
  //点开个人中心右边弹窗
  showNav: function() {
    this.setData({
      nav: true
    })
  },
  //切换品牌
  changeShop: function() {
    util.navigateTo({
      url: './../shop/change/index?from=index'
    })
  },
  //我的银行卡
  myCard: function() {
    if (this.data.authStatus == 0) {
      wx.showToast({
        icon: 'none',
        title: '实名认证后可使用银行卡功能'
      })
      setTimeout(function() {
        util.navigateTo({
          url: '/pages/purse/auth/index',
        })
      }, 1500)
    } else if (this.data.authStatus == 1) {
      wx.showToast({
        icon: 'none',
        title: '实名认证审核中，请耐心等待'
      })
    } else if (this.data.authStatus == 3) {
      wx.showToast({
        icon: 'none',
        title: '审核未通过，请重新提交审核'
      })
      setTimeout(function() {
        util.navigateTo({
          url: '/pages/purse/auth/index',
        })
      }, 1500)
    } else {
      util.navigateTo({
        url: './../purse/bank/list'
      })
    }
  },
  //添加员工
  addTeamer: function() {
    util.navigateTo({
      url: './../team/index'
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
  closeActivity() {
    this.setData({
      activityShow: !this.data.activityShow
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
  //创建店铺
  goCreate: function() {
    util.navigateTo({
      url: './../shop/create/index'
    })
  },
  goExamine: function() {
    util.navigateTo({
      url: './../shop/examine/index'
    })
  },
  //退出登录
  signOut() {
    wx.showLoading({
      title: '正在退出中',
    })
    new Member(res => {
      wx.setStorageSync('access_token', '')
      wx.setStorageSync('submit', false)
      // wx.setStorageSync('tenantIdNow', '')
      wx.reLaunch({
        url: '/pages/login/index'
      })
    }).logout()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    this.getData()
    // 传入字符串 str ，数组 arr
    function isStrInArray(str, arr) {
      let n = arr.length;
      for (let i = 0; i < n; i++) {
        if (arr[i].isIndependent == str) {
          return true;
        }
      }
      return false;
    }
    //获取用户加盟的品牌
    new Tenant(res => {
      

      if (res.body == '') {
        wx.setStorageSync('isIndependent', false)
        that.setData({
          showTabber: true
        })
      }else{
        wx.setStorageSync('tenantIdNow', res.body[0].id)
        wx.setStorageSync('tenantNameNow', res.body[0].name)
        this.setData({
          shopList: res.body,
          tenantIdNow: res.body[0].id,
          tenantNameNow: res.body[0].name
        })
        this.getRank(wx.getStorageSync('tenantIdNow'))
        if (isStrInArray(false, res.body) == true) {
          wx.setStorageSync('isIndependent', false)
          that.setData({
            showTabber: true
          })
        } else {
          wx.setStorageSync('isIndependent', true)
          that.setData({
            showTabber: false
          })
        }
        for (var i = 0; i < res.body.length; i++) {
          if (res.body[i].id == 66786) {
            that.getRankNanjiren(66786)
            that.setData({
              activityShow: true
            })
            wx.setStorageSync('activity', true)
          }
        }
      }
      
      
    }).tenantList()
  },


 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '来一架',
      path: '/pages/index/index',
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
  }
})