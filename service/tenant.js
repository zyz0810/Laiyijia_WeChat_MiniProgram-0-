let Ajax = require('./ajax.js')

module.exports = class Tenant extends Ajax {

  /**
   * 我的店铺列表
   */
  tenantList(data) {
    super.get({
      url: 'api/v1/tenant/memberTenantList',
      data: data
    });
  }

  /**
   * 切换店铺
   * tenantId  店铺id
   * deliveryCenterId 门店id(不需要就传空、或不传)
   */
  select(data) {
    super.post({
      url: 'api/v1/tenant/selectTenant',
      data: data
    });
  }

  /**
   * 门店列表
   * tenantId  店铺id
   */
  myDeliveryCenters(data) {
    super.get({
      url: 'api/v1/tenant/myDeliveryCenters',
      data: data
    });
  }
  /**
   * 注册店铺
   * 
   */
  registerDeliveryCenter(data) {
    super.post({
      url: 'api/v1/deliveryCenter/registerDeliveryCenter',
      data: data
    });
  }
  /**
   * 店铺类别
   * 
   */
  tenantCategoryTree(data) {
    super.get({
      url: 'api/v1/tenant/tenantCategoryTree',
      data: data
    });
  }
  /**
   * 查询注册店铺信息
   * 
   */
  getShopOwnerDeliveryCenter(data) {
    super.get({
      url: 'api/v1/deliveryCenter/getShopOwnerDeliveryCenter',
      data: data,
      hideErrorTip: true
    });
  }
  /**
   * 修改店铺信息
   * 
   */
  updateDeliveryCenter(data) {
    super.post({
      url: 'api/v1/deliveryCenter/updateDeliveryCenter',
      data: data
    });
  }
}