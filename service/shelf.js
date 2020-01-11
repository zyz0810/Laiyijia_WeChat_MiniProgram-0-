let Ajax = require('./ajax.js')
let config = require('../utils/config.js')
module.exports = class Shelf extends Ajax {

  /**
   * 获取我的货架列表
   * tenantId  店铺id
   * pageNumber
   * pageSize
   */
  myShelves(data) {
    super.get({
      url: 'api/v1/shelves/myShelfList',
      data: data
    });
  }

  /**
   * 获取我发展的货架列表
   * tenantId  店铺id
   * pageNumber
   * pageSize
   */
  developmentShelfList(data) {
    super.get({
      url: 'api/v1/shelves/developmentShelfList',
      data: data
    });
  }

  /**
   * 分享货架套餐
   */
  shareShelvesPackage(data) {
    super.get({
      url: 'api/v2/shelves/shareShelvesPackage',
      data: data
    });
  }

  /**
   * 货架补货记录
   * tenantId=66786
   * shelvesId 
   */
  query(data) {
    super.get({
      url: 'api/v1/product/shelvesRetrievalRecord',
      data: data
    });
  }

  /**
   * 货架补货详情
   * retrievalId=30
   */
  detail(data) {
    super.get({
      url: 'api/v1/product/shelvesRetrievalDetail',
      data: data
    });
  }

  /**
   * 货架补货签收
   * 
   */
  sign(data) {
    super.post({
      url: 'api/v1/product/signShelvesRetrieval',
      data: data
    });
  }


  /**
   * 货架补货签收物流信息
   * 
   */
  logistic(data) {
    super.get({
      url: 'api/v1/util/logistic/' + data.no
    });
  }
}