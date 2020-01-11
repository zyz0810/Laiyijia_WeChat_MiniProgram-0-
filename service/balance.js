let Ajax = require('./ajax.js')

module.exports = class Balance extends Ajax {
  /**
   * 账户余额查询
   */
  memberBalance(data) {
    super.get({
      url: "api/v1/payment/memberBalance",
      data: data
    });
  }

  /**账单查询
   * pageIndex
   * pageSize
   */
  deposits(data) {
    super.get({
      url: "api/v1/payment/deposits",
      data: data
    });
  }


  /**未到账金额明细
   * pageIndex
   * pageSize
   */
  notInDeposits(data) {
    super.get({
      url: "api/v1/payment/notInDeposits",
      data: data
    });
  }



  /**提现
   * memberBankId
   * amount
   * password
   */
  withdraw(data) {
    super.post({
      url: "api/v1/member/withdraw",
      data: data
    });
  }




}