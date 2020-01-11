// pages/shop/register/index.js
let app = getApp(),
  util = require("../../../utils/util.js"),
  member = require('../../../service/member.js'),
  tenant = require('../../../service/tenant.js')
var countdown = util.countdown //验证码计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    objectMultiArray: [],
    addressIndexArray: [0, 0, 0],
    shopCategoryId: '',
    shopCategory: '请选择所属行业',
    fullName: '请选择店铺所在区域',
    tips: '验证码',
    count: 60,
    province: '',
    city: '',
    district: '',
    formContent: {
      masterName: '',
      phone: '',
      code: '',
      shopName: '',
      shopAddress: '',
      latitude: '',
      longitude: '',
      licenseNo:''
    },
    imgdefault: '',
    bg: false,
    areaId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getCategory()
    var that = this
    if (options.category) {
      console.log(options.category)
      var shopCategory = unescape(options.category)
      that.setData({
        shopCategory: shopCategory
      })
    } else if (options.scene){
      var scene = decodeURIComponent(options.scene)
      console.log('555' + scene.split("#")[1])
      that.setData({
        extensionId: scene.split("#")[1]
      })
    }
    new member(function(res) {
      var objectMultiArray = that.data.objectMultiArray
      objectMultiArray[0] = res.body
      that.setData({
        objectMultiArray: objectMultiArray
      })
      new member(function(res) {
        var objectMultiArray = that.data.objectMultiArray
        objectMultiArray[1] = res.body
        that.setData({
          objectMultiArray: objectMultiArray
        })
        new member(function(res) {
          var objectMultiArray = that.data.objectMultiArray
          objectMultiArray[2] = res.body
          that.setData({
            objectMultiArray: objectMultiArray
          })
        }).provinceList({
          areaId: res.body[0].id
        });
      }).provinceList({
        areaId: res.body[0].id
      });
    }).provinceList();
  },
  chooseCategory: function() {
    util.navigateTo({
      url: '/pages/shop/category/index',
    })
  },
  //选择地址滚动
  bindMultiPickerColumnChange(e) {
    var that = this
    var column = e.detail.column
    var index = e.detail.value
    var areaId = that.data.objectMultiArray[column][index].id
    this.setData({
      changeAddress: false
    })
    if (column == 0) {
      new member(function(res) {
        var objectMultiArray = that.data.objectMultiArray
        objectMultiArray[1] = res.body
        that.setData({
          objectMultiArray: objectMultiArray
        })
        new member(function(res) {
          var objectMultiArray = that.data.objectMultiArray
          objectMultiArray[2] = res.body
          that.setData({
            objectMultiArray: objectMultiArray
          })
        }).provinceList({
          areaId: res.body[0].id
        });
      }).provinceList({
        areaId: areaId
      });
    } else if (column == 1) {
      new member(function(res) {
        var objectMultiArray = that.data.objectMultiArray
        objectMultiArray[2] = res.body
        that.setData({
          objectMultiArray: objectMultiArray
        })
      }).provinceList({
        areaId: areaId
      });
    }
  },
  //选择地址区域确定
  bindMultiPickerChange(e) {
    var that = this
    var addressIndexArray = this.data.addressIndexArray
    this.data.addressIndexArray[0] = e.detail.value[0] ? e.detail.value[0] : this.data.addressIndexArray[0]
    this.data.addressIndexArray[1] = e.detail.value[1] ? e.detail.value[1] : this.data.addressIndexArray[1]
    this.data.addressIndexArray[2] = e.detail.value[2] ? e.detail.value[2] : this.data.addressIndexArray[2]
    var areaId = this.data.objectMultiArray[2].length > 0 ? this.data.objectMultiArray[2][this.data.addressIndexArray[2]].id : this.data.objectMultiArray[1][this.data.addressIndexArray[1]].id
    this.setData({
      addressIndexArray: addressIndexArray,
      areaId: areaId,
      province: that.data.objectMultiArray[0][this.data.addressIndexArray[0]].name,
      city: that.data.objectMultiArray[1][this.data.addressIndexArray[1]].name,
      district: that.data.objectMultiArray[2].length > 0 ? that.data.objectMultiArray[2][this.data.addressIndexArray[2]].name : ''
    })
    if (that.data.formContent.masterName != '' && that.data.formContent.phone != '' && that.data.formContent.code != '' && that.data.formContent.shopName != '' && that.data.formContent.shopAddress != '' && that.data.shopCategory != '请选择所属行业' && that.data.province != '' && that.data.checked == true) {
      that.setData({
        bg: true
      })
    } else {
      that.setData({
        bg: false
      })
    }
  },

  goMap: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var name = res.name
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude)
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28,
          name: name,
          success: function(data) {
            console.log(data)
            console.log('dhaj af')
            var formContent = that.data.formContent
            that.data.formContent.shopAddress = data.address
            that.data.formContent.latitude = data.latitude
            that.data.formContent.longitude = data.longitude
            that.setData({
              formContent: formContent
            })
            if (that.data.formContent.masterName != '' && that.data.formContent.phone != '' && that.data.formContent.code != '' && that.data.formContent.shopName != '' && that.data.formContent.shopAddress != '' && that.data.shopCategory != '请选择所属行业' && that.data.province != '' && that.data.checked == true && that.data.imgdefault != '' && that.data.formContent.licenseNo != '') {
              that.setData({
                bg: true
              })
            } else {
              that.setData({
                bg: false
              })
            }
          }
        })
      },
      fail: function(err) {
        if (err.errMsg.indexOf('auth') > -1) {
          wx.showModal({
            title: '提示',
            content: '未授予定位权限，是否前往设置',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
    })
  },
  //上传门头照片
  uploadImg: function () {
    var that = this;
    console.log('添加图22片')
    util.getUrlAfterUpload(function (data, tempFilePaths) {
      console.log('添加图片')
      that.setData({
        imgdefault: tempFilePaths,
        pic: data
      })
      if (that.data.formContent.masterName != '' && that.data.formContent.phone != '' && that.data.formContent.code != '' && that.data.formContent.shopName != '' && that.data.formContent.shopAddress != '' && that.data.shopCategory != '请选择所属行业' && that.data.province != '' && that.data.checked == true && that.data.imgdefault != '' && that.data.formContent.licenseNo != '') {
        that.setData({
          bg: true
        })
      } else {
        that.setData({
          bg: false
        })
      }
    })
  },
  submit: function() {
    let that = this
    if (that.data.formContent.masterName == '') {
      wx.showToast({
        title: '请输入店主真实姓名',
        icon: 'none'
      })
    } else if (that.data.formContent.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else if (!util.checkPhone(that.data.formContent.phone)) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      })
    } else if (that.data.formContent.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (that.data.formContent.shopName == '') {
      wx.showToast({
        title: '请输入店铺营业名称',
        icon: 'none'
      })
    } else if (that.data.shopCategory == '请选择所属行业') {
      wx.showToast({
        title: '请选择店铺所属行业',
        icon: 'none'
      })
    } else if (that.data.province == '' || that.data.city == '' || that.data.district == '') {
      wx.showToast({
        title: '请选择店铺区域',
        icon: 'none'
      })
    } else if (that.data.formContent.shopAddress == '') {
      wx.showToast({
        title: '请输入店铺详细地址',
        icon: 'none'
      })
    } else if (that.data.formContent.licenseNo == '') {
      wx.showToast({
        title: '请填写营业执照编号',
        icon: 'none'
      })
    } else if (that.data.imgdefault == '') {
      wx.showToast({
        title: '请上传营业执照',
        icon: 'none'
      })
    } else if (that.data.checked == false) {
      wx.showToast({
        title: '请先阅读并同意《服务协议》',
        icon: 'none'
      })
    } else {
      new tenant(function(res) {
        wx.showToast({
          title: '注册成功',
          icon: 'none'
        })

        wx.setStorageSync('access_token', res.body.token.access_token)
        wx.setStorageSync('submit', true)
        wx.setStorageSync('memberIdNow', res.body.member.id) //切换店铺后存储会员id
        setTimeout(function() {
          util.navigateTo({
            url: '/pages/index/index',
          })
        },500)
      }).registerDeliveryCenter({
        contact: that.data.formContent.masterName,
        mobile: that.data.formContent.phone,
        verifyCode: that.data.formContent.code,
        name: that.data.formContent.shopName,
        tenantCategoryId: that.data.shopCategoryId,
        areaId: that.data.areaId,
        areaAddress: that.data.formContent.shopAddress,
        lng: that.data.formContent.latitude,
        lat: that.data.formContent.longitude,
        extensionId: that.data.extensionId ? that.data.extensionId:'',
        licenseNo: that.data.formContent.licenseNo,
        licensePic: that.data.pic
      })
    }
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
    var that = this;
    if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true && that.data.imgdefault != '' && that.data.formContent.licenseNo != '') {
      that.setData({
        bg: true
      })
    } else {
      that.setData({
        bg: false
      })
    }
  },
  //输入框变化
  bindChange: function(e) {
    var that = this
    var form = this.data.formContent;
    form[e.currentTarget.id] = e.detail.value.trim();
    this.setData({
      formContent: form
    })
    if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true && that.data.imgdefault != '' && that.data.formContent.licenseNo != '') {
      that.setData({
        bg: true
      })
    } else {
      that.setData({
        bg: false
      })
    }
  },

  //发送验证码
  getcode: function() {
    var that = this;
    if (!util.checkPhone(that.data.formContent.phone)) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      })
    } else {
      new member(res => {
        countdown(that);
      }).getVerifyCode({
        mobile: that.data.formContent.phone
      })

    }

  },

  checkboxChange: function(e) {
    let that = this
    if (e.detail.value == '') {
      that.setData({
        checked: false
      })
      if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true && that.data.imgdefault != '' && that.data.formContent.licenseNo != '') {
        that.setData({
          bg: true
        })
      } else {
        that.setData({
          bg: false
        })
      }
    } else {
      that.setData({
        checked: true
      })
      if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true && that.data.imgdefault != '' && that.data.formContent.licenseNo != '') {
        that.setData({
          bg: true
        })
      } else {
        that.setData({
          bg: false
        })
      }
    }
  },
  goAgreement: function() {
    wx.navigateTo({
      url: '/pages/agreement/index'
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})