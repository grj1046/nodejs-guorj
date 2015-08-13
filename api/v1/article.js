var renderHelper = require('../../common/render_helper');

/**
 * 将markdown格式的文章转换为html格式
 */
exports.preview = function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var mdContent = renderHelper.markdown(content);
  res.json({
    title: title, 
    content: mdContent
  });
};