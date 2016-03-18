process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
  mongoose = require('./config/mongoose'),
  express = require('./config/express'),
  passport = require('./config/passport');

var db = mongoose(),
  app = express(),
  passport = passport();

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);