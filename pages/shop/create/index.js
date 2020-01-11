// pages/shop/create/index.js
var app = getApp();
var util = require("../../../utils/util.js");
var member = require("../../../service/member.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceShow: false,
    cityShow: false,
    nowArea: '请选择所在地区',
    province: [],
    nowCity: '',
    city: [],
    hasChildren: '',
    nowCategory: '请选择主营类目',
    categoryChoose: '',
    nowProvince: '',
    tenantName: '',
    tenantAdress: '',
    category: [{
      id: 0,
      name: '便利店'
    }, {
      id: 1,
      name: '进口食品'
    }, {
      id: 2,
      name: '零食饮料'
    }, {
      id: 3,
      name: '文化阅读'
    }, {
      id: 4,
      name: '酒水茶叶'
    }, {
      id: 5,
      name: '食品百货'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    new member(function (res) {
      that.setData({
        province: res.data
      })
    }).provinceList();
  },

  name: function(e) {
    console.log(e)
    this.setData({
      tenantName: e.detail.value
    })
  },

  address: function(e) {
    console.log(e)
    this.setData({
      tenantAdress: e.detail.value
    })
  },


  showCategory: function() {
    this.setData({
      categoryShow: true,
      // categoryChoose: ''
    })
  },
  chooseCategory: function(e) {
    this.setData({
      nowCategory: '',
      categoryChoose: e.currentTarget.dataset.name,
      categoryShow: false,
      categoryId: e.currentTarget.dataset.id,
    })
  },

  //展示银行卡开户行省份
  chooseProvince: function () {
    var that = this;
    that.setData({
      provinceShow: true
    })
  },
  //展示银行卡开户行城市
  chooseArea: function () {
    var that = this;
    that.setData({
      provinceShow: false,
      cityShow: true
    })
  },
  //选择店铺所在省
  provinceCS: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset.haschildren)
    that.setData({
      cityShow: true,
      nowProvince: e.currentTarget.dataset.name,
      provinceShow: false,
      provinceId: e.currentTarget.dataset.id,
      hasChildren: e.currentTarget.dataset.haschildren
    })

    if (that.data.hasChildren == true) {
      new member(function (res) {
        that.setData({
          city: res.data
        })
      }).provinceList({ areaId: e.currentTarget.dataset.id });
    }
  },
  //选择店铺所在市
  cityCS: function(e) {
    var that = this;
    that.setData({
      nowCity: e.currentTarget.dataset.name,
      cityId: e.currentTarget.dataset.id,
      hasChildren: e.currentTarget.dataset.haschildren
    })
    //判断是否有下级区域，有则显示区级选择框
    if (that.data.hasChildren == true) {
      new member(function(res) {
        that.setData({
          cityShow: false,
          district: res.data,
          districtShow: true
        })
      }).provinceList({
        areaId: e.currentTarget.dataset.id
      });
    } else {  //无责不显示区级选择
      this.setData({
        cityShow: false,
        nowArea: '',
        nowDistrict: ''
      })
    }
  },
  //选择店铺所在区
  districtCS(e) {
    var that = this;
    that.setData({
      nowDistrict: e.currentTarget.dataset.name,
      districtShow: false,
      districtId: e.currentTarget.dataset.id,
      nowArea: ''
    })
  },

  change: function(e) {
    var that = this
    if (that.data.tenantName == '') {
      wx.showToast({
        title: '请填写店铺名称',
        icon: 'none'
      })
    } else if (that.data.categoryChoose == '') {
      wx.showToast({
        title: '请选择主营类目',
        icon: 'none'
      })
    }
    // else if (that.data.nowProvince == '') {
    //   wx.showToast({
    //     title: '请选择所在地区',
    //     icon: 'none'
    //   })
    // } else if (that.data.tenantAdress == '') {
    //   wx.showToast({
    //     title: '请填写详细地址',
    //     icon: 'none'
    //   })
    // }
     else {
      util.navigateTo({
        url: './../../shop/change/index'
      })
    }

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})