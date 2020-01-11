 // pages/login/index.js
 let swiperAutoHeight = require("../../template/swiper/swiper.js"),
   Member = require("../../service/member.js"),
   config = require('../../utils/config'),
   Tenant = require("../../service/tenant.js"),
   app = getApp(),
   util = require("../../utils/util.js")

 Page(Object.assign({}, swiperAutoHeight, {

   /**
    * 页面的初始数据
    */
   data: {
     topImgs: {
       data: [{
         id: 5471,
         title: "您还没有添加标题！",
         image: "http://cdn.laiyijia.com/upload/image/201905/7cd8c66a-657e-4a4e-a3c9-6550fd371046.png",
         url: null,
         adPosition: null,
         linkType: "product",
         linkId: null,
       }, {
         id: 5471,
         title: "您还没有添加标题！",
         image: "http://cdn.laiyijia.com/upload/image/201905/8df44fa1-215f-40d7-8c13-767dbda40b04.png",
         url: null,
         adPosition: null,
         linkType: "product",
         linkId: null,
       }, {
         id: 5471,
         title: "您还没有添加标题！",
         image: "http://cdn.laiyijia.com/upload/image/201905/1a6a2068-c95d-4bb1-976e-0f9b08830ea4.png",
         url: null,
         adPosition: null,
         linkType: "product",
         linkId: null,
       }],
       key: "image"
     },
     loginWeixin: true
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {},

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {},

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {

   },
   goMobile: function() {
     util.navigateTo({
       url: './login/index'
     })
   },

   // 点击获取手机号快速登录
   getPhoneNumber(e) {
     if (e.detail.errMsg.indexOf('fail') > -1) {
       wx.showToast({
         icon: 'none',
         title: '授权失败'
       })
     } else {
       console.log('微信登录')
       wx.showLoading({
         title: '登录中'
       })
       wx.checkSession({
         success: function(res) {
           console.log('checkSession有效')
           new Member(function(res) { //初始化登录
             wx.setStorageSync('access_token', res.body.token.access_token)
             wx.setStorageSync('submit', true)
             wx.setStorageSync('memberIdNow', res.body.member.id) //切换店铺后存储会员id
             //获取用户加盟的品牌
             new Tenant(res => {
               if (res.body.length > 0){
                 wx.setStorageSync('tenantIdNow', res.body[0].id)
                 wx.setStorageSync('tenantNameNow', res.body[0].name)
               }
             }).tenantList()
             wx.redirectTo({
              //  url: '/pages/shop/change/index?from=login',
               url: '/pages/index/index',
             })

           }, function(err) {
             console.log('失败重新登录')
             wx.setStorageSync('access_token', '')
            //  console.log(err)
            //  if (err.subCode == '110102') {
            //    util.navigateTo({
            //      url: '/pages/shop/register/index'
            //    })
            //  }
             wx.hideLoading()
             wx.login({
               success: function(reswx) {
                 console.log('重新登录成功')
                 new Member(function(res) { //初始化登录
                   wx.setStorageSync('access_token', res.body.token.access_token)
                   wx.setStorageSync('code', reswx.code)
                   wx.setStorageSync('submit', true)
                   wx.setStorageSync('memberIdNow', res.body.member.id) //切换店铺后存储会员id
                   //获取用户加盟的品牌
                   new Tenant(res => {
                     wx.setStorageSync('tenantIdNow', res.body[0].id)
                     wx.setStorageSync('tenantNameNow', res.body[0].name)
                   }).tenantList()
                   wx.redirectTo({
                    //  url: '/pages/shop/change/index',
                     url: '/pages/index/index',
                   })
                 }, function(err) {
                   console.log('重新登录失败')
                   console.log('2:'+err)
                   wx.setStorageSync('code', reswx.code)
                   wx.setStorageSync('access_token', '')
                   if (err.subCode == '110102') {
                     util.navigateTo({
                       url: '/pages/shop/register/index'
                     })
                   }
                 }).login({
                   code: reswx.code,
                   encryptedData: e.detail.encryptedData,
                   iv: e.detail.iv
                 })
               },
               fail: function(res) {},
               complete: function(res) {}
             })
           }).login({
             code: wx.getStorageSync('code'),
             encryptedData: e.detail.encryptedData,
             iv: e.detail.iv
           })
         },
         fail: function(err) {
           console.log('无效的checkSession')
           wx.login({
             success: function(reswx) {
               new Member(function(res) { //初始化登录
                 wx.setStorageSync('access_token', res.body.token.access_token)
                 wx.setStorageSync('code', reswx.code)
                 wx.setStorageSync('submit', true)
                 wx.setStorageSync('memberIdNow', res.body.member.id) //切换店铺后存储会员id
                 //获取用户加盟的品牌
                 new Tenant(res => {
                   wx.setStorageSync('tenantIdNow', res.body[0].id)
                   wx.setStorageSync('tenantNameNow', res.body[0].name)
                 }).tenantList()
                 wx.redirectTo({
                  //  url: '/pages/shop/change/index',
                   url: '/pages/index/index',
                 })
               }, function(err) {
                 console.log('3:'+err)
                 wx.setStorageSync('code', reswx.code)
                 wx.setStorageSync('access_token', '')
                 if (err.subCode == '110102') {
                   util.navigateTo({
                     url: '/pages/shop/register/index'
                   })
                 }
               }).login({
                 code: reswx.code,
                 encryptedData: e.detail.encryptedData,
                 iv: e.detail.iv
               })
             },
             fail: function(res) {},
             complete: function(res) {}
           })
         }
         //  success: function() {
         //    console.log('有效')
         //    if (wx.getStorageSync('code')) {
         //      new Member(function(res) { //初始化登录
         //        wx.setStorageSync('access_token', res.body.token.access_token)
         //        wx.setStorageSync('submit', true)
         //        wx.redirectTo({
         //          url: '/pages/shop/change/index',
         //        })
         //      }, function(err) {
         //        console.log(err)
         //        console.log('失败重新登录')
         //        wx.setStorageSync('access_token', '')
         //        wx.hideLoading()
         //      }).login({
         //        code: wx.getStorageSync('code'),
         //        encryptedData: e.detail.encryptedData,
         //        iv: e.detail.iv
         //      })
         //    } else {
         //      wx.login({
         //        success: function(reswx) {
         //          new Member(function(res) { //初始化登录
         //            wx.setStorageSync('access_token', res.body.token.access_token)
         //            wx.setStorageSync('code', reswx.code)
         //            wx.setStorageSync('submit', true)
         //            wx.redirectTo({
         //              url: '/pages/shop/change/index',
         //            })
         //          }, function(err) {
         //            console.log(err)
         //            wx.setStorageSync('code', reswx.code)
         //            wx.setStorageSync('access_token', '')
         //          }).login({
         //            code: reswx.code,
         //            encryptedData: e.detail.encryptedData,
         //            iv: e.detail.iv
         //          })
         //        },
         //        fail: function(res) {},
         //        complete: function(res) {}
         //      })
         //    }
         //  },
         //  fail: function() {
         //    console.log('无效')
         //    wx.login({
         //      success: function(reswx) {
         //        new Member(function(res) { //初始化登录
         //          wx.setStorageSync('access_token', res.body.token.access_token)
         //          wx.setStorageSync('code', reswx.code)
         //          wx.setStorageSync('submit', true)
         //          wx.redirectTo({
         //            url: '/pages/shop/change/index',
         //          })
         //        }, function(err) {
         //          console.log(err)
         //          wx.setStorageSync('code', reswx.code)
         //          wx.setStorageSync('access_token', '')
         //        }).login({
         //          code: reswx.code,
         //          encryptedData: e.detail.encryptedData,
         //          iv: e.detail.iv
         //        })
         //      },
         //      fail: function(res) {},
         //      complete: function(res) {}
         //    })
         //  }
       })
     }
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

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {
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
 }))