var app = getApp()
var Member = require("../../../service/member.js")
var util = require("../../../utils/util.js")
Page({
  data: {
    bgBtn: '#9CE6BF',
    realNum: '',
    toastInfo: '',
    tips: "验证码",
    choose: false,
    info: [],
    nowBank: '点我选择银行',
    id: '',
    count: 60,
    captcha: '',
    bankInfoId: '',
    cardNo: '',
    name: '',
    phone: '',
    from: '',
    nowArea: '点我选择开户行所属地区',
    province: [],
    nowCity: '',
    city: [],
    hasChildren: ''
  },
  onLoad: function(options) {
    var that = this;
    new Member(res => {
      this.setData({
        authStatus: res.body
      })
    }).getRealNameStatus()
  },

  onShow: function() {

  },

  //卡号输入变化
  cardNum: function(e) {
    this.setData({
      toastInfo: ''
    })

    var v = e.detail.value;
    if (v.length > 10) {
      this.setData({
        bgBtn: '#1AAD19'
      })
    } else {
      this.setData({
        bgBtn: '#9CE6BF'
      })
    }
    //每隔四位加一个空格
    if (/\S{5}/.test(v)) {
      e.detail.value = v.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
    }
    this.setData({
      cardNum: e.detail.value,
      realNum: e.detail.value.replace(/\s/g, "")
    })
  },
  //提交
  submit: function() {
    var form = this.data.formContent
    var that = this
    if (!util.luhmCheck(that.data.realNum)) {
      this.setData({
        toastInfo: '请输入正确银行卡号'
      })
    } else {
      new Member(res => {
        var province = res.body.area.split("-")[0].trim()
        var city = res.body.area.split("-")[1].trim()
        util.navigateTo({
          url: 'addInfo?cardNo=' + that.data.realNum + '&bankName=' + res.body.bankName + '&cardType=' + res.body.cardType + '&province=' + province + '&city=' + city
        })
      }).getBankcardInfo({
        cardNo: that.data.realNum
      })
    }
  },
  goSupportBank() {
    util.navigateTo({
      url: 'supportBank'
    })
  }
})