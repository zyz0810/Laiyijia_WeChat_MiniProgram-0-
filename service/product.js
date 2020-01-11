let Ajax = require('./ajax.js')

module.exports = class Product extends Ajax {

  /**
   * 特惠商品
   */
  specialOffersProductList(data) {
    super.get({
      url: 'api/v1/product/specialOffersProductList',
      data: data
    });
  }
}