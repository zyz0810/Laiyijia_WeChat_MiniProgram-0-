// component/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showNav: Boolean,
    fixed: Boolean,
    color: {
      type: String,
      value: '#000'
    },
    backgroundColor: {
      type: String,
      value: '#fff'
    },
    back: {
      type: null,
      value: false
    },
    currentIndex: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isx: /iphone10|iphone x/i.test(wx.getSystemInfoSync().model),
    isAndroid: /android/i.test(wx.getSystemInfoSync().system),
    // currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goPage: function(e) {
      // this.setData({
      //   currentIndex: e.currentTarget.dataset.index
      // })
      if (e.currentTarget.dataset.index == 1 || e.currentTarget.dataset.index == 2){
        wx.showToast({
          title: '该功能暂未开启，敬请期待！',
          icon:'none'
        })
      } else if (e.currentTarget.dataset.index == 0){
        wx.redirectTo({
            url: '/pages/index/home',
          })
      } else if (e.currentTarget.dataset.index == 3) {
        wx.redirectTo({
          // url: '/pages/index/indexIndepend',
          url: '/pages/index/index',
        })
      }
    }
  }
})