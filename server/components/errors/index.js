/**
 * Error responses
 */

'use strict';

module.exports[404] = function pageNotFound(req, res) {
  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };

  res.status(result.status);
  res.render(viewFilePath, function (err) {
    if (err) { return res.json(result, result.status); }
    res.render(viewFilePath);
  });
};

module.exports.badRequest = function(req, res){
  var defaultMessage = res.errorMsg || 'A required query parameter was not specified for this request';
  console.warn(defaultMessage);
  return res.json({msg: defaultMessage}, 400);
}

module.exports.handleApiError = function(req, res, err){
  console.error(err);
  return res.json({}, 500);
};
