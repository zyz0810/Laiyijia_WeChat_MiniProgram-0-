// pages/home/home.js

let swiperAutoHeight = require("../../../template/swiper/swiper.js"),
  Tenant = require("../../../service/tenant.js"),
  member = require("../../../service/member.js"),
  Census = require("../../../service/census.js"),
  app = getApp(),
  util = require("../../../utils/util.js")
var page = undefined;
Page(Object.assign({}, swiperAutoHeight, {

  /**
   * 页面的初始数据
   */
  data: {
    scrollTo: '', //页面跳转到
    sys: app.globalData.sys,
    percent: 10,
    currentTab: 0,
    homeLoadReady: false,
    showClerkRank: true,
    showActivityRule: false,
    myTime: '',
    activityEffective: false
  },

  selectTab(e) {
    if (e.currentTarget.dataset.tab == this.data.currentTab) {
      return
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.tab
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    page = this;
    this.data.activityId = options.activityId
    this.data.rewardTemplateId = options.rewardTemplateId
    this.getData()
  },
  onHide: function() {
    clearInterval(this.data.myTime)
  },
  onUnload: function() {
    clearInterval(this.data.myTime)
  },

  //获取数据
  getData() {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('tenantNameNow'),
    })
    let that = this
    new Census(res => {
      this.setData({
        homeLoadReady: true
      })
      wx.stopPullDownRefresh()
      
      this.setData({
        activityName: res.body.activityName,
        totalAmount: res.body.totalAmount.toFixed(2).toString().replace(/\s/g, '').replace(/(.{1})/g, "$1 "),
        activityName: res.body.activityName,
        showRank: true,
        startDate: util.formatTimeTwo(res.body.startDate, 'Y/M/D h:m:s'),
        endDate: util.formatTimeTwo(res.body.endDate, 'Y/M/D h:m:s')
      })
      let start_time = "2019/12/09 00:00:00";
      let activityEffective = res.body.startDate / 1000 - Date.parse(new Date(start_time)) / 1000
      if (activityEffective>0){
        that.setData({
          activityEffective:true
        })
      }
      if (res.body.ranking) {
        if (res.body.ranking.username.length > 10) {
          res.body.ranking.username = res.body.ranking.username.substr(0, 3) + '···' + res.body.ranking.username.substr(res.body.ranking.username.length - 3, 3)
        }
      }
      this.setData({
        rankshoperSelf: res.body.ranking ? res.body.ranking : ''
      })
      if (res.body.rankingList) {
        for (var i = 0; i < res.body.rankingList.length; i++) {
          if (res.body.rankingList[i].username&&res.body.rankingList[i].username.length > 10) {
            res.body.rankingList[i].username = res.body.rankingList[i].username.substr(0, 3) + '···' + res.body.rankingList[i].username.substr(res.body.rankingList[i].username.length - 3, 3)
          }
        }
      }
      this.setData({
        shopkeeperList: res.body.rankingList,
        article: res.body.memo
      })

      function time1() {
        var beginDate = res.body.startDate
        var endDate = res.body.endDate
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
        // if (dayStr.length == 1) dayStr = '0' + dayStr;

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
          clearInterval(time1);
          that.setData({
            'timeStap.countDownDay': '00',
            'timeStap.countDownHour': '00',
            'timeStap.countDownMinute': '00',
            'timeStap.countDownSecond': '00',
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
      this.data.myTime = setInterval(time1, 1000)
    }).historySalesRankingList({
      tenantId: wx.getStorageSync('tenantIdNow'),
      activityId: that.data.activityId,
      rewardTemplateId: that.data.rewardTemplateId,
      pageNumber: 1,
      pageSize: 100
    })
  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    this.setData({
      tenantIdNow: wx.getStorageSync('tenantIdNow')
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getData()
  },
  goRule() {
    wx.navigateTo({
      url: '/pages/news/view/view',
    })
  },
  clickShowRule() {
    this.setData({
      showActivityRule: true
    })
  },
  closeRule() {
    this.setData({
      showActivityRule: false
    })
  },
  showRankList() {
    wx.navigateTo({
      url: 'rank/list',
    })
  }

}))