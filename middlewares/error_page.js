//ErrorPage middlewares
exports.errorPage = function (req, res, next) {
  res.render404 = function (error) {
    return res.status(404).render('notify/notify', {
		title: "404",
		error: error
	});
  }	;
  
  res.renderError = function (error, statusCode) {
	if (statusCode === undefined) {
		statusCode = 404;
	}
	return res.status(404).render('notify/notify', {
		title: statusCode,
		error: error
	});
  };
  
  next();
};