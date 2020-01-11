// pages/purse/cash/index.js
let member = require('../../../service/member.js')
let balance = require('../../../service/balance.js')
let getPwd = require('../../../utils/getPassword.js')
let util = require('../../../utils/util.js')
let config = require('../../../utils/config.js')
let payTemp = require("../../../template/password/payPassword")
Page(Object.assign({}, payTemp, {

  /**
   * 页面的初始数据
   */
  data: {
    actionSheet: false,
    moneyNum: '',
    fee: 0
  },
  onLoad: function() {
    new member(res => {
      this.setData({
        feelv: res.body.fee
      })
    }).getRealNameStatus({
      // tenantId: wx.getStorageSync('tenantIdNow')
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;

    new member(function(data) {
      that.setData({
        mybank: data.body,
        cardId: data.body.length > 0 ? data.body[0].id : ''
      })
      if (!data.body.length > 0) {
        wx.hideToast()
        wx.showModal({
          title: '',
          content: '请先绑定银行卡后才可提现',
          cancelText: '不了',
          confirmText: '前去绑定',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../bank/add'
              })
            } else {
              wx.navigateBack({})
            }
          }
        })
      } else {
        if (!data.body[0].branchBank) {
          wx.showModal({
            title: '',
            content: '为提供更好地提现服务，该银行卡需要补充银行的"开户行名称"信息',
            confirmText: '立即补充',
            cancelText: '更换银行',
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../bank/update?id=' + data.body[0].id,
                })
              } else {
                that.choose()
              }
            }
          })
        }
      }
    }).myBankList()
    new balance((data) => {
      this.setData({
        cash: Number(data.body.balance),
        cashedMoney: Number(data.body.monthlyWithdrawalAmount)
      })
    }).memberBalance()
  },
  choose: function() {
    this.setData({
      actionSheet: true
    })
  },
  close: function() {
    this.setData({
      actionSheet: false
    })
  },
  cashMoney: function(e) {
    var cash = this.data.cash
    this.setData({
      moneyNum: e.detail.value
    })
    this.calculateFee(e.detail.value)
  },
  totalCash: function() {
    var cash = this.data.cash
    this.setData({
      moneyNum: cash
    })
    this.calculateFee(cash)
  },
  chooseCard: function(e) {
    var that = this
    var cardId = e.currentTarget.dataset.id
    var branchBank = e.currentTarget.dataset.branch
    if (branchBank) {
      this.setData({
        cardId: cardId,
        actionSheet: false
      })
    } else {
      wx.showModal({
        title: '',
        content: '为提供更好地提现服务，需要补充该银行卡的"开户行名称"信息',
        confirmText: '立即补充',
        cancelText: '重新选择',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../bank/update?id=' + cardId
            })
          } else {

          }
        }
      })
    }
  },
  addCard: function() {
    util.navigateTo({
      url: './../bank/add'
    })
  },
  //点击提现按钮
  cashBtn: function(e) {
    if (e.detail.formId) {
      new member(res => { }).addFormId({
        formIds: e.detail.formId
      })
    }
    var that = this
    if (that.data.moneyNum < 2) {
      util.errShow('提现金额需大于2元')
      return
    } else if ((Number(that.data.moneyNum) + Number(that.data.cashedMoney)) > 800) {
      var tax = that.data.cashedMoney > 800 ? Number(that.data.moneyNum) * 0.2 : (Number(that.data.moneyNum) + Number(that.data.cashedMoney) - 800) * 0.2
      wx.showModal({
        title: '提示',
        content: '当月提现金额已累计超800，本次提现预计将扣取税费' + tax + '元，建议您银联入网或下月再进行提现',
        cancelText: '下月提现',
        confirmText: '继续提现',
        success: function(res) {
          if (res.confirm) {
            wx.showToast({
              title: '- 请求中 -',
              icon: 'loading',
              duration: 20000,
              mask: true
            })
            
            new balance(function(res) {
              wx.hideToast()
              wx.showToast({
                title: '提现成功',
                icon: 'success',
                duration: 1000,
                mask: true,
              });
              new balance((data) => {
                that.setData({
                  cash: Number(data.body.balance)
                })
              }).memberBalance()
              util.navigateTo({
                url: './../cash/status?moneyNum=' + that.data.moneyNum + '&fee=' + that.data.fee + '&tax=' + tax
              })
            }, function(data) {

            }).withdraw({
              memberBankId: that.data.cardId,
              amount: that.data.moneyNum
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '- 请求中 -',
        icon: 'loading',
        duration: 20000,
        mask: true
      })

      new balance(function(res) {
        wx.hideToast()
        wx.showToast({
          title: '提现成功',
          icon: 'success',
          duration: 1000,
          mask: true,
        });
        new balance((data) => {
          that.setData({
            cash: Number(data.body.balance)
          })
        }).memberBalance()
        util.navigateTo({
          url: './../cash/status?moneyNum=' + that.data.moneyNum + '&fee=' + that.data.fee + '&tax=0'
        })
      }, function(data) {

      }).withdraw({
        memberBankId: that.data.cardId,
        amount: that.data.moneyNum
      })
    }
    // if (that.data.moneyNum < 10) {
    //   util.errShow('提现金额不得小于10')
    // } else {
    // this.PayTempShow()
    // this.PayTempSet({
    //   price: that.data.moneyNum
    // })
    // }
  },
  //计算提现手续费
  calculateFee(money) {
    this.setData({
      fee: Math.floor(money * this.data.feelv * 100) / 100
    })
  },
  //密码框输入完毕
  PayTempSuccess(val) {
    var that = this
    wx.hideKeyboard();
    wx.showToast({
      title: '- 请求中 -',
      icon: 'loading',
      duration: 20000,
      mask: true
    })
    getPwd(val, function(pwd) {
      new balance(function(res) {
        wx.hideToast()
        wx.showToast({
          title: '提现成功',
          icon: 'success',
          duration: 1000,
          mask: true,
        });
        that.PayTempClose()
        new balance((data) => {
          that.setData({
            cash: Number(data.body.balance)
          })
        }).memberBalance()
        util.navigateTo({
          url: './../cash/status?moneyNum=' + that.data.moneyNum + '&fee=' + that.data.fee
        })
      }, function(data) {
        that.PayTempClear()
      }).withdraw({
        memberBankId: that.data.cardId,
        amount: that.data.moneyNum,
        password: pwd
      })
    })
  }
}))