let Ajax = require('./ajax.js')

module.exports = class Member extends Ajax {
  /**
   * 微信授权手机号自动登陆接口
   * code wx.login获得
   * encryptedData 手机号加密数据
   * iv   手机号解密向量
   */
  login(data) {
    super.post({
      url: 'api/v1/member/applet/loginByCode',
      hideErrorTip: true,
      data: data
    })
  }

  /**
   * 退出登录
   */
  logout(data) {
    super.post({
      url: 'api/v1/member/logout',
      data: data
    })
  }


  /**
   *发送登录验证码
   * mobile 登录手机号
   */
  getVerifyCode(data) {
    super.post({
      url: 'api/v1/member/getVerifyCode',
      data: data
    })
  }

  /**
   *手机验证码登录
   * mobile 登录手机号
   */
  loginByVerifyCode(data) {
    super.post({
      url: 'api/v1/member/loginByVerifyCode',
      data: data,
      hideErrorTip: true
    })
  }

  /**
   * 获取用户实名认证状态
   */
  getRealNameStatus(data) {
    super.post({
      url: 'api/v1/member/getRealNameStatus',
      data: data
    })
  }

  /**
   * 平台支持的银行卡列表
   */
  bankList() {
    super.get({
      url: 'api/v1/util/bankList'
    });
  }

  /**
   * 我的银行卡列表
   */
  myBankList() {
    super.get({
      url: 'api/v1/member/myBankcardList'
    });
  }

  /**
   * 获取银行卡信息
   * cardNo
   */
  getBankcardInfo(data) {
    super.get({
      url: 'api/v1/member/getBankcardInfo',
      data: data
    });
  }

  /**
   * 获取银行卡信息(更新支行用)
   * cardNo
   */
  myBankcardInfo(data) {
    super.get({
      url: 'api/v1/member/myBankcardInfo',
      data: data
    });
  }



  /**
   * 更新银行卡支行信息
   * 
   */
  bindBranchBank(data) {
    super.post({
      url: 'api/v1/member/bindBranchBank',
      data: data
    });
  }


  /**
   * 添加银行卡提交
   * cardNo  卡号
   * mobile  手机号
   * verifyCode 验证码
   */
  bankAdd(data) {
    super.post({
      url: 'api/v1/member/addBankcard',
      data: data
    });
  }

  /**
   * 删除银行卡
   * @param data
   * id 银行卡Id
   */
  deleteCard(data) {
    super.post({
      url: 'api/v1/member/removeBankcard',
      data: data
    });
  }


  /**
   * 实名认证提交
   * name       姓名
   * no         身份证号
   * pathFront  身份证正面图片
   * pathBack   身份证反面图片
   */
  idcardSave(data) {
    super.post({
      url: 'api/v1/member/realNameCertification',
      data: data
    })
  }

  searchBank(data) {
    super.get({
      url: 'api/v1/member/getBankapsList',
      data: data
    })
  }
  /**
   * 模板推送前获取formId
   * formIds
   */
  addFormId(data) {
    super.post({
      hideErrorTip: true,
      url: 'api/v1/member/addFormId',
      data: data
    })
  }
  /**
   * 地区
   * areaId
   */
  provinceList(data) {
    super.get({
      hideErrorTip: true,
      url: 'api/v1/util/areaList',
      data: data
    })
  }
  /**
   * 地区
   * areaId
   */
  getMemberOrder(data) {
    super.get({
      hideErrorTip: true,
      url: 'api/v1/order/getMemberOrder',
      data: data
    })
  }

  /**
   * 邀请注册
   */
  shareB2BApplet(data) {
    super.get({
      url: 'api/v1/member/shareB2BApplet',
      data: data
    });
  }
}