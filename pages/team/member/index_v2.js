// pages/team/index.js
let config = require('../../../utils/config'),
  Team = require('../../../service/team'),
  app = getApp(),
  util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: 'today',
    dateStart: '',
    dateEnd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataStart()
  },
  bindStartChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateStart: e.detail.value
    })
  },
  bindEndChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateEnd: e.detail.value
    })
  },
  getDataStart() {
    var that = this
    // 团队收益统计
    new Team(res => {
      this.setData({
        teamIncomeSummary: res.body
      })
    }).teamIncomeSummary()
    // 团队收益列表
    new Team(res => {
      wx.stopPullDownRefresh()
      // this.data.total = res.body.total;
      // this.data.size = res.body.size;
      // this.data.page = res.body.page;
      // this.data.pageIndex = 1;
      this.setData({
        dataList: res.body
      })
    }).teamIncomePage({
      // pageIndex: 1,
      // pageSize: 10,
      date: that.data.date
    })
  },
  //前往团队分润详情
  goView(e) {
    var memberId = e.currentTarget.dataset.id
    util.navigateTo({
      url: 'member/index?memberId=' + memberId,
    })
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
    var nowData = new Date();
    console.log(nowData)
    var nowYear = nowData.getFullYear();
    var nowMonth = nowData.getMonth() + 1;
    if (nowMonth < 10) {
      nowMonth = '0' + nowMonth
    }
    var nowDay = nowData.getDate();
    this.setData({
      nowYear: nowYear,
      nowMonth: nowMonth,
      nowDay: nowDay,
      dateStart: nowYear + '-' + nowMonth + '-' + nowDay,
      dateEnd: nowYear + '-' + nowMonth + '-' + nowDay
    })
  },
  tabClick: function (e) {
    var that = this
    var date = e.currentTarget.dataset.date
    if (date == this.data.date) {
      this.setData({
        date: ''
      }, () => {
        this.getData()
      })
    } else {

      if (date == 'today') {
        that.setData({
          dateStart: that.data.nowYear + '-' + that.data.nowMonth + '-' + that.data.nowDay,
          dateEnd: that.data.nowYear + '-' + that.data.nowMonth + '-' + that.data.nowDay
        })
      } else if (date == 'thisWeek') {
        that.setData({
          dateStart: util.getAppointedDate(1, 0).startDate,
          dateEnd: util.getAppointedDate(1, 0).endDate
        })
      } else if (date == 'thisMonth') {
        that.setData({
          dateStart: util.getAppointedDate(2, 0).startDate,
          dateEnd: util.getAppointedDate(2, 0).endDate
        })
      }
      this.setData({
        date: date
      }, () => {
        this.getData(date)
      })
    }
  },
  // 收益统计列表
  getData(date) {
    new Team(res => {
      // this.data.total = res.body.total;
      // this.data.size = res.body.size;
      // this.data.page = res.body.page;
      // this.data.pageIndex = 1;
      this.setData({
        dataList: res.body
      })
    }).teamIncomePage({
      // pageIndex: 1,
      // pageSize: 10,
      date: date ? date : ''
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
    this.getDataStart()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {
  //   var that = this;
  //   wx.showNavigationBarLoading();
  //   var dataList = this.data.dataList;
  //   if (this.data.page > this.data.pageIndex) {
  //     new Team(function(data) {
  //       wx.hideNavigationBarLoading() //完成停止加载
  //       if (data.body.page < data.body.current) {
  //         that.setData({
  //           tips: '没有更多啦~',
  //           showtips: false
  //         })
  //       } else {
  //         dataList = dataList.concat(data.body.records)
  //         that.setData({
  //           dataList: dataList,
  //           loading: false,
  //           tips: data.body.records.length < that.data.size ? '没有更多啦~' : '努力加载中',
  //           showtips: false
  //         })
  //       }
  //     }).teamIncomePage({
  //       pageIndex: ++that.data.pageIndex,
  //       pageSize: 10,
  //       date: that.data.date
  //     })
  //   } else {
  //     wx.hideNavigationBarLoading() //完成停止加载
  //   }
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '来一架',
      path: '/pages/index/index',
      imageUrl: 'http://cdn.tiaohuo.com/upload/image/201904/68795f05-0c66-4ba8-9d5b-7b4a7d6bccc1.jpg',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})