let Ajax = require('./ajax.js')

module.exports = class Course extends Ajax {

  /**
   * 教程小标题
   */
  tagList(data) {
    super.get({
      url: 'api/v1/tag/tagList',
      data: data
    });
  }
  /**
  * 教程列表
  * tagId 标签id
  */
  newCourseList(data) {
    super.get({
      url: 'api/v1/course/newCourseList',
      data: data
    });
  }
  /**
  * 教程详情
  * courseId	 教程id
  */
  view(data) {
    super.get({
      url: 'api/v1/course/view',
      data: data
    });
  }
}