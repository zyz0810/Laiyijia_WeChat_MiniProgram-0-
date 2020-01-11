//获取应用实例
var app = getApp()
var Order = require('../../../service/order')
var Tenant = require('../../../service/tenant')
var util = require('../../../utils/util')
var util = require("../../../utils/util")

Page(Object.assign({}, {
  data: {
    winHeight: 0, //设备高度度
    ALL: [], //全部
    SHIPPED: [], //待支付
    COMPLETED: [], //待签收
    currentTab: 0, //显示全部
    ALLTips: '下拉刷新',
    SHIPPEDTips: '下拉刷新',
    COMPLETEDTips: '下拉刷新',
    sType: ['ALL', 'SHIPPED', 'COMPLETED'],
    scroll: [0, 0, 0, 0, 0],
    deliveryCenterId: '',
    showModalMask: false
  },

  bindChange: function(e) { //滑动选项卡
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  swichNav: function(e) { //点击选项卡
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
      var index = e.currentTarget.dataset.current
      var sTypeList = this.data.sType
      paging(this, sTypeList[index], 'up', function() {}, this.data.begin, this.data.end, this.data.deliveryCenterId ? this.data.deliveryCenterId : '')
    }
  },
  touchstart: function(e) {
    this.data.startTouches = e.changedTouches[0]
  },
  touchmove: function(e) {
    this.data.moveTouches = e.changedTouches[0]
  },
  touchend: function(e) {
    let index = this.data.currentTab,
      sTypeList = this.data.sType,
      startTouch = this.data.startTouches,
      Y = e.changedTouches[0].pageY - startTouch.pageY,
      X = Math.abs(e.changedTouches[0].pageX - startTouch.pageX)

    if (this.data.scroll[index] > 10) {
      return false
    }
    this.data.endTouches = e.changedTouches[0]
    if (Y > 50 && X < 200) {
      if (wx.startPullDownRefresh) {
        wx.startPullDownRefresh()
        paging(this, sTypeList[index], 'up', function() {
          wx.stopPullDownRefresh()
        }, this.data.begin, this.data.end, this.data.deliveryCenterId ? this.data.deliveryCenterId : '')
      } else {
        wx.showLoading({
          title: '加载中...',
        })
        paging(this, sTypeList[index], 'up', function() {
          wx.hideLoading()
        }, this.data.begin, this.data.end, this.data.deliveryCenterId ? this.data.deliveryCenterId : '')
      }
    }
  },
  onPullDownRefresh() {
    // let index = this.data.currentTab,
    //   sTypeList = this.data.sType
    // paging(this, sTypeList[index], 'up', function() {
    wx.stopPullDownRefresh()
    // })
  },
  scroll: function(e) {
    let index = this.data.currentTab
    this.data.scroll[index] = e.detail.scrollTop
  },
  //选择门店
  guideChange: function(e) {
    var deliveryCenterId = this.data.deliveryCenterList[e.detail.value].id;
    var deliveryCenterList = this.data.deliveryCenterList
    this.setData({
      deliveryCenterId: deliveryCenterId > 0 ? deliveryCenterId : '',
      storeName: deliveryCenterList[e.detail.value].name + '▼'
    })
    this.dataLoadOrder()
  },
  lower: function() {
    var index = this.data.currentTab
    var sTypeList = this.data.sType
    paging(this, sTypeList[index], 'down', function() {}, this.data.begin, this.data.end, this.data.deliveryCenterId ? this.data.deliveryCenterId : '')
  },
  onLoad: function(options) { //页面加载
    this.setData({
      // mainColor: app.globalData.mainColor
      mainColor: 'red',
      storeName: options.deliveryname ? options.deliveryname + '▼' : ''
    })
    var that = this;
    var id = options.id ? options.id : 0
    var systemInfo = wx.getSystemInfoSync()
    this.data.deliveryCenterId = options.deliveryCenterId ? options.deliveryCenterId : ''
    this.setData({
      currentTab: id,
      winHeight: systemInfo.windowHeight
    })

    //获取订单筛选的门店列表
    new Tenant(res => {
      var dataAll = {
        'id': '-1',
        name: '全部门店'
      }
      res.body.unshift(dataAll)
      this.setData({
        deliveryCenterList: res.body,
        storeName: options.deliveryname ? options.deliveryname + '▼' : '全部门店▼',
      })
    }).myDeliveryCenters({
      // tenantId: wx.getStorageSync('tenantIdNow')
    })

    //获取当前的年月日
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var date = new Date().getDate();
    var systemInfo = wx.getSystemInfoSync()
    that.setData({
      nowyear: year,
      nowmonth: month,
      nowdate: date,
      begin_year: year,
      begin_month: month,
      begin_day: '1',
      end_year: year,
      end_month: month,
      end_day: date,
      year: year,
      month: month,
      date: date,
      begin: year + '-' + month + '-' + 1,
      // end: year + '-' + month + '-' + +(parseInt(date) + 1),
      end: year + '-' + month + '-' + +(parseInt(date)),
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
    })
    this.dataLoadOrder()
    //今日订单统计
    new Order(res => {
      this.setData({
        todayTradeStatistics: res.body
      })
    }).todayTradeStatistics({
      // tenantId: wx.getStorageSync('tenantIdNow')
    })
  },

  //开始日期选择器
  bindBeginDateChange: function(e) {
    var that = this;
    var selectDate = e.detail.value;
    var selectYear = selectDate.split("-")[0];
    var selectMonth = selectDate.split("-")[1];
    var selectDay = selectDate.split("-")[2];
    var todayDate = this.data.nowdate
    if (selectYear >= this.data.end_year) {
      if (selectMonth > this.data.end_month) {
        this.setData({
          end_year: selectYear,
          end_month: selectMonth,
          end_day: todayDate,
          end: selectYear + '-' + selectMonth + '-' + todayDate,
        })
      } else if (selectMonth == this.data.end_month) {
        if (selectDay > this.data.end_day) {
          this.setData({
            end_year: selectYear,
            end_month: selectMonth,
            end_day: selectDay,
            end: selectYear + '-' + selectMonth + '-' + selectDay,
          })
        }
      }
    }
    this.setData({
      begin_year: selectYear,
      begin_month: selectMonth,
      begin_day: selectDay,
      begin: selectYear + '-' + selectMonth + '-' + selectDay,
    });
    this.dataLoadOrder()
  },

  //结束日期选择器
  bindEndDateChange: function(e) {
    var that = this;
    var selectDate = e.detail.value;
    var selectYear = selectDate.split("-")[0];
    var selectMonth = selectDate.split("-")[1];
    var selectDay = selectDate.split("-")[2];
    if (selectYear < this.data.begin_year) {
      // if (selectMonth <= this.data.end_month) {
      this.setData({
        begin_year: selectYear,
        begin_month: selectMonth,
        begin_day: 1,
        begin: selectYear + '-' + selectMonth + '-' + 1,
      })
      // }
    } else if (selectYear == this.data.begin_year) {
      if (selectMonth < this.data.begin_month) {
        this.setData({
          begin_year: selectYear,
          begin_month: selectMonth,
          begin_day: 1,
          begin: selectYear + '-' + selectMonth + '-' + 1,
        })
      }
      if (selectMonth == this.data.begin_month) {
        if (selectDay < this.data.begin_day) {
          this.setData({
            begin_year: selectYear,
            begin_month: selectMonth,
            begin_day: 1,
            begin: selectYear + '-' + selectMonth + '-' + 1,
          })
        }
      }
    }
    this.setData({
      end_year: selectYear,
      end_month: selectMonth,
      end_day: selectDay,
      end: selectYear + '-' + selectMonth + '-' + selectDay,
    });
    this.dataLoadOrder()
  },
  //选择日期加载订单
  dataLoadOrder() {

    var that = this
    var id = that.data.currentTab
    // wx.showLoading({
    //   title: '查询中',
    // })
    var sTypeList = this.data.sType
    paging(this, sTypeList[id], 'up', function() {}, this.data.begin, this.data.end, this.data.deliveryCenterId ? this.data.deliveryCenterId : '')
    // paging(that, that.data.sType[id], 'up', function() {
    //   for (var i = 0; i < that.data.sType.length; i++) {
    //     if (i == id) {
    //       continue
    //     }
    //     paging(that, that.data.sType[i], 'up', function() {}, that.data.begin, that.data.end, that.data.deliveryCenterId)
    //   }
    // }, that.data.begin, that.data.end, that.data.deliveryCenterId)
  },
  onShow() {
    // var that = this
    // var id = that.data.currentTab
    // paging(that, that.data.sType[id], 'up', function() {
    //   for (var i = 0; i < that.data.sType.length; i++) {
    //     if (i == id) {
    //       continue
    //     }
    //     paging(that, that.data.sType[i], 'up')
    //   }
    // })
  },
  //前往订单详情
  goDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../view/index?id=' + id,
    })
  },
  //显示订单信息
  showIntro: function(e) {
    var index = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    var data = this.data
    data[type][index].show = !data[type][index].show
    this.setData(data)
  },
  //显示佣金分润明细
  clickBonus(e) {
    var data = this.data
    var index = e.currentTarget.dataset.index
    var sTypeList = this.data.sType
    var currentTab = this.data.currentTab
    data.showModalMask = !data.showModalMask
    data[sTypeList[currentTab]][index].showBonusDetail = !data[sTypeList[currentTab]][index].showBonusDetail
    this.setData(data)
  },
  pageModel: {
    'ALL': {
      pageNumber: 0,
      pageSize: 10,
      page: 999
    },
    'SHIPPED': {
      pageNumber: 0,
      pageSize: 10,
      page: 999
    },
    'COMPLETED': {
      pageNumber: 0,
      pageSize: 10,
      page: 999
    }
  }
}))

function paging(that, sType, direction, cb, beginTime, endTime, deliveryCenterId) {
  var tips = that.data[sType + 'Tips']
  var info = that.data[sType]
  if (direction == 'up') {
    info = []
  }
  if (direction !== 'up' && that.pageModel[sType].pageNumber + 1 > that.pageModel[sType].totalPages) {
    return
  }
  that.setData({
    [sType + 'Tips']: '加载中...'
  })
  new Order(function(data) {
    // wx.hideLoading()
    that.pageModel[sType].page = data.body.page
    that.setData({
      totalTimes: data.body.totalTimes,
      totalAmount: data.body.totalAmount,
      totalRebate: data.body.totalRebate
    })
    if (data.body.page == 0) {
      that.setData({
        [sType + 'Tips']: '暂无相关的订单！',
        [sType]: []
      })
      cb ? cb() : ''
      return
    }
    for (var i = 0; i < data.body.records.length; i++) {
      data.body.records[i].show = false
      data.body.records[i].showBonusDetail = false
    }
    info = info.concat(data.body.records)
    if (data.body.page <= data.body.current) {
      that.setData({
        [sType + 'Tips']: '• ● End ● •',
        [sType]: info
      })
      if (data.body.page < data.body.current) {
        cb ? cb() : ''
        return
      }
    } else {
      that.setData({
        [sType + 'Tips']: "上拉加载",
        [sType]: info
      })
    }
    cb ? cb() : ''
  }, function() {
    wx.hideLoading()
  }).list({
    orderQueryStatusEnum: sType,
    pageIndex: direction == 'up' ? that.pageModel[sType].pageNumber = 1 : ++that.pageModel[sType].pageNumber,
    pageSize: that.pageModel[sType].pageSize,
    // tenantId: wx.getStorageSync('tenantIdNow'),
    // shelvesNo: that.data.shelvesNo,
    startTime: util.timeTurnString(beginTime + ' ' + '00:00:00'),
    endTime: util.timeTurnString(endTime + ' ' + '23:59:59'),
    deliveryCenterId: deliveryCenterId ? deliveryCenterId : ''
  })
}