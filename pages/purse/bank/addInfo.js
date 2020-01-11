//获取应用实例
var app = getApp()
var member = require("../../../service/member.js")
var util = require("../../../utils/util.js")
Page({
  data: {
    bgBtn: '#9CE6BF',
    keywords: '',
    searchNameList: []
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      bankName: options.bankName,
      cardNo: options.cardNo,
      cardType: options.cardType,
      searchKeyword: '',
      province: options.province,
      city: options.city
    })
  },
  searchInputTimeOut: null,
  //搜索框的输入
  bindChangeBank(e) {
    var that = this
    this.setData({
      keywords: e.detail.value
    })
  },
  //点击右侧搜索开始
  searchStart() {
    var that = this
    clearTimeout(this.searchInputTimeOut)
    const keywords = that.data.keywords
    this.setData({
      showSearchNameList: true
    })
    const reg = new RegExp(`(.*)(${encodeURIComponent(keywords)})(.*)`)
    this.searchInputTimeOut = setTimeout(() => {
      new member((res) => {
        this.data.page = 1
        this.data.totalPage = res.body ? res.body.totalPage : 1
        const result = res.body && res.body.record.length > 0 ? res.body.record.map((v) => {
          return {
            data: v,
            hitList: encodeURIComponent(v.name).match(reg).map(r => ({
              name: decodeURIComponent(r),
              hit: r === encodeURIComponent(keywords)
            })).slice(1)
          }
        }) : wx.showToast({
          title: '无该支行',
          icon: 'none'
        })
        this.setData({
          searchNameList: result ? result : []
        })
      }).searchBank({
        keywords: keywords,
        bankName: that.data.bankName,
        cardNo: that.data.cardNo,
        city: that.data.city,
        province: that.data.province,
        page: 1
      })
    }, 300)
  },
  //模糊查询分页
  toLower(e) {
    var that = this
    if (that.data.page <= that.data.totalPage) {
      const reg = new RegExp(`(.*)(${encodeURIComponent(that.data.keywords)})(.*)`)
      new member((res) => {
        var searchNameList = that.data.searchNameList
        const result = res.body && res.body.record.length > 0 ? res.body.record.map((v) => {
          return {
            data: v,
            hitList: encodeURIComponent(v.name).match(reg).map(r => ({
              name: decodeURIComponent(r),
              hit: r === encodeURIComponent(that.data.keywords)
            })).slice(1)
          }
        }) : []
        this.setData({
          searchNameList: searchNameList.concat(result)
        })
      }).searchBank({
        keywords: that.data.keywords,
        bankName: that.data.bankName,
        cardNo: that.data.cardNo,
        city: that.data.city,
        province: that.data.province,
        page: that.data.page++
      })
    }
  },
  //搜索事件
  // searchFocus(e) {
  //   var that = this
  //   this.setData({
  //     showSearchNameList: true,
  //   })
  //   clearTimeout(this.searchInputTimeOut)
  //   const keywords = that.data.keywords;
  //   const reg = new RegExp(`(.*)(${encodeURIComponent(keywords)})(.*)`)
  //   this.searchInputTimeOut = setTimeout(() => {
  //     new member((res) => {
  //       this.data.page = 1
  //       this.data.totalPage = res.body.totalPage
  //       const result = res.body && res.body.record.length > 0 ? res.body.record.map((v) => {
  //         return {
  //           data: v,
  //           hitList: encodeURIComponent(v.name).match(reg).map(r => ({
  //             name: decodeURIComponent(r),
  //             hit: r === encodeURIComponent(keywords)
  //           })).slice(1)
  //         }
  //       }) : []
  //       this.setData({
  //         searchNameList: result
  //       })
  //     }).searchBank({
  //       keywords: keywords,
  //       bankName: that.data.bankName,
  //       cardNo: that.data.cardNo,
  //       city: that.data.city,
  //       province: that.data.province,
  //       page: 1
  //     })
  //   }, 300)
  // },
  hideSearchNameListFn() {
    this.setData({
      showSearchNameList: false
    })
  },
  goSearch(e) {
    this.setData({
      searchKeyword: e.currentTarget.dataset.name,
      showSearchNameList: false,
      branchBank: e.currentTarget.dataset.name,
      branchBankCode: e.currentTarget.dataset.code,
      branchBankAddress: e.currentTarget.dataset.address,
      branchBankTel: e.currentTarget.dataset.tel
    })
  },
  //输入框变化
  bindChange: function(e) {
    this.setData({
      phone: e.detail.value
    })
    if (e.detail.value.length == 11) {
      this.setData({
        bgBtn: '#1AAD19'
      })
    } else {
      this.setData({
        bgBtn: '#9CE6BF'
      })
    }
  },

  submit: function() { //提交
    var that = this
    if (!util.checkPhone(this.data.phone)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确手机号'
      })
    } else if (!that.data.branchBank) {
      wx.showToast({
        icon: 'none',
        title: '请点击搜索并选择支行'
      })
    } else {
      util.navigateTo({
        url: 'code?cardNo=' + that.data.cardNo + '&mobile=' + that.data.phone + '&branchBank=' + that.data.branchBank + '&branchBankCode=' + that.data.branchBankCode + '&branchBankAddress=' + that.data.branchBankAddress + '&branchBankTel=' + that.data.branchBankTel,
      });
    }
  }
})