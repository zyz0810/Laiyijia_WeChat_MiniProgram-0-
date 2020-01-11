let Ajax = require('./ajax.js')

module.exports = class Team extends Ajax {

  /**
   * 团队收益列表
   * pageIndex  页数
   * pageSize   每页数据大小
   * date 筛选条件（今天today，昨天yesterday，本周thisWeek）
   */
  teamIncomePage(data) {
    super.get({
      url: 'api/v1/payment/teamIncomeList',
      data: data
    });
  }

  /**
   * 团队收益统计
   * peopleCount  人数
   * totalBrokerage   总收益
   */
  teamIncomeSummary(data) {
    super.get({
      url: 'api/v1/payment/teamIncomeSummary',
      data: data
    });
  }

  /**
   * 团队收益详情
   * memberId  团队成员id
   */
  teamIncomeView(data) {
    super.get({
      url: 'api/v1/payment/teamIncomeView',
      data: data
    });
  }

 
}