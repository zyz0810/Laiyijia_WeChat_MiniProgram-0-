
let Ajax = require("./ajax.js")

module.exports = class Commom extends Ajax {
  getPublicKey(data) {
    super.get({
      url: "api/v1/util/getPublicKey",
      data: data
    })
  }
}