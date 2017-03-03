var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('./routes');
var users = require('./routes/users');
var articles = require('./routes/article');
var fetchUtil  = require('./fetchData')
var schedule = require('node-schedule');

// var  = require('./models')
var contacts = require('./routes/contacts');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', users);
app.use('/', contacts);
app.use('/', articles);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var loadWebData = function(){
	var categroy = [
		    'necklaces',
		    'bracelets',
		    'earrings',
		    'rings'
		]
	fetchUtil.fetchDataFromWebSit(categroy)
}
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 16;
rule.minute = 32;
var rule1 = new schedule.RecurrenceRule();
rule1.dayOfWeek = [0, new schedule.Range(1, 6)];
rule1.hour = 6;
rule1.minute = 10;
var everyDayNight = schedule.scheduleJob(rule, function(){
  console.log('晚上也需要更新一次!');
  loadWebData()
});
var everyDayMorning = schedule.scheduleJob(rule1, function(){
  console.log('早上来更新一发!');
  loadWebData()
});
var dbUrl = process.env.MONGOHQ_URL
  || 'mongodb://@127.0.0.1:27017/xinshop';

mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console,
  'connection error:'));


// db.once('open', function () {
// 	var userSchema = new mongoose.Schema({
//       name:{type: String, unique: true}, 
//       password:String
//     }, 
//     {collection: "accounts"}
//     );
//      var User = mongoose.model('accounts', userSchema);
//      var baby = new User({name:'zhouyunlong','password':'baby'})



//   console.info('connected to database')
// });

module.exports = app;
