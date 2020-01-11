let Ajax = require('./ajax.js')
let config = require('../utils/config.js')

module.exports = class Order extends Ajax {

  /**
   * 今日订单统计
   * tenantId 商家Id
   */
  todayTradeStatistics(data) {
    super.get({
      url: "api/v1/trade/todayTradeStatistics",
      data: data
    });
  }

  /**
   * 我的订单列表
   * tenantId 商家Id
   * type {unshipped 待发货, unpaid 待支付, unreciver 待签收, unreview 待评价}
   * pageSize 每页记录数
   * pageNumber 页码
   */
  list(data) {
    super.get({
      url: "api/v1/trade/tradeList",
      data: data
    });
  }

  /**
   * 订单详情
   * tradeId 订单id
   * pageSize 每页记录数
   * pageNumber 页码
   */
  tradeDetail(data) {
    super.get({
      url: "api/v1/trade/tradeDetail",
      data: data
    });
  }

  /**
   * 订单收益统计
   */
  tradeProfit(data) {
    super.get({
      url: "api/v1/trade/tradeProfit",
      data: data
    });
  }
}