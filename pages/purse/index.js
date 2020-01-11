// pages/purse/index.js
var app = getApp()
var Balance = require('../../service/balance.js')
var Member = require('../../service/member.js')
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    freezeBalance: 0,
    authStatus: 2,
    topTips: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    new Balance(res => {
      var billList = res.body.records
      if (billList.length == 0) {
        that.setData({
          tips: '暂无账单数据~',
          showtips: false
        })
      }
      for (var i = 0; i < billList.length; i++) {
        billList[i].createDate = util.formatTimeTwo(billList[i].createDate, 'Y/M/D h:m:s')
      }
      this.data.total = res.body.total;
      this.data.size = res.body.size;
      this.data.page = res.body.page;
      this.data.pageIndex = 1;
      this.setData({
        billList: billList
      })
    }).deposits({
      pageIndex: 1,
      pageSize: 10
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
    this.getBaseInfo()
    
    // console.log(topTips)
  },
  //前往实名认证
  goAuth() {
    if (this.data.authStatus == 0) {
      util.navigateTo({
        url: '/pages/purse/auth/index',
      })
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
    }
  },
  //前往提现
  goCash(e) {
    if (e.detail.formId) {
      new Member(res => { }).addFormId({
        formIds: e.detail.formId
      })
    }
    if (this.data.authStatus == 0) {
      wx.showToast({
        icon: 'none',
        title: '实名认证后可提现'
      })
      setTimeout(function() {
        wx.redirectTo({
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
      }, 2000)
    } else {
      util.navigateTo({
        url: 'cash/index'
      })
    }
  },
  //查看冻结金额账单
  goFreezing() {
    wx.navigateTo({
      url: 'freezing/list',
    })
  },
  getBaseInfo() {
    //获取会员实名状态
    new Member(res => {
      this.setData({
        authStatus: res.body.authStatus
      })
      // var topTips=[]
      // if (res.body.authStatus == 2){
      //   topTips = [{
      //     id: 1,
      //     span:'"银联入网"',
      //     name: '账单，不经过钱包直接进入银行卡'
      //   }, {
      //     id: 2,
      //       span: '',
      //       name: '所账单实际入账银行卡时间，受银联结算周期影响'
      //   }];
      // }else{
      //   topTips = [{
      //     id: 0,
      //     span: '',
      //     name: '首次提现需完成实名认证'
      //   }, {
      //     id: 1,
      //       span: '"银联入网"',
      //       name: '账单，不经过钱包直接进入银行卡'
      //   }, {
      //     id: 2,
      //       span: '',
      //       name: '所账单实际入账银行卡时间，受银联结算周期影响'
      //   }];
      // }
      
      // topTips.sort(() => Math.random() - 0.5);
      // this.setData({
      //   topTips: topTips
      // })

    }).getRealNameStatus({
      // tenantId: wx.getStorageSync('tenantIdNow')
    })

    //获取余额资料
    new Balance(res => {
      this.setData({
        balance: res.body.balance,
        freezeBalance: res.body.freezeBalance
      })
    }).memberBalance()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getBaseInfo()
    //账单
    var that = this
    new Balance(res => {
      wx.stopPullDownRefresh()
      var billList = res.body.records
      if (billList.length == 0) {
        that.setData({
          tips: '暂无数据~',
          showtips: false
        })
      }
      for (var i = 0; i < billList.length; i++) {
        billList[i].createDate = util.formatTimeTwo(billList[i].createDate, 'Y/M/D h:m:s')
      }
      this.data.total = res.body.total;
      this.data.size = res.body.size;
      this.data.page = res.body.page;
      this.data.pageIndex = 1;
      this.setData({
        billList: billList
      })
    }).deposits({
      pageIndex: 1,
      pageSize: 10
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.showNavigationBarLoading();
    var pageModel = this.data.pageModel;
    var billList = this.data.billList;
    if (this.data.page > this.data.pageIndex) {
      new Balance(function(data) {
        wx.hideNavigationBarLoading() //完成停止加载
        if (data.body.page < data.body.current) {
          that.setData({
            tips: '没有更多啦~',
            showtips: false
          })
        } else {
          for (var i = 0; i < data.body.records.length; i++) {
            data.body.records[i].createDate = util.formatTimeTwo(data.body.records[i].createDate, 'Y/M/D h:m:s')
          }
          billList = billList.concat(data.body.records)
          that.setData({
            billList: billList,
            loading: false,
            tips: data.body.records.length < that.data.size ? '没有更多啦~' : '努力加载中',
            showtips: false
          })
        }
      }).deposits({
        pageIndex: ++that.data.pageIndex,
        pageSize: 10
      })
    } else {
      that.setData({
        tips: '没有更多啦~'
      })
      wx.hideNavigationBarLoading() //完成停止加载
    }
  }
})