let Ajax = require('./ajax.js')

module.exports = class Census extends Ajax {
  /**
   * （今日/累计）收入统计
   * tenantId 店铺id
   * timeIntervalEnum TODAY：今日收入，TOTAL：累计收入
   */
  index(data) {
    super.get({
      url: "api/v1/payment/incomeStatistics",
      data: data
    });
  }


  /**
   * （今日/累计）收入统计
   * tenantId 店铺id
   * timeIntervalEnum TODAY：今日收入，TOTAL：累计收入
   */
  shelvesRanking(data) {
    super.get({
      url: "api/v1/shelves/shelvesRanking",
      data: data
    });
  }

  /**
   * 激励活动排名明细
   * tenantId 店铺id
   * activityId  活动id
   * rewardTemplateId 模板id
   * pageNumber
   * pageSize
   */
  shelvesRankingList(data) {
    super.get({
      url: "api/v1/shelves/shelvesRankingList",
      data: data
    });
  }


  /**
   * 进行中的货架排名详情（倒计时）
   * tenantId 店铺id
   * activityId  活动id
   * rewardTemplateId 模板id
   * pageNumber
   * pageSize
   */
  salesRanking(data) {
    super.get({
      url: "api/v1/shelves/salesRanking",
      data: data
    });
  }


  /**
   * 历史货架排名列表
   * tenantId 店铺id
   * pageNumber
   * pageSize
   */
  historySalesRanking(data) {
    super.get({
      url: "api/v1/shelves/historySalesRanking",
      data: data
    });
  }


  /**
   * 历史货架排名活动明细
   * tenantId 店铺id
   * activityId  活动id
   * rewardTemplateId 模板id
   * pageNumber
   * pageSize
   */
  historySalesRankingList(data) {
    super.get({
      url: "api/v1/shelves/historySalesRankingList",
      data: data
    });
  }


}