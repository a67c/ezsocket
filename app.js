var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var multiparty = require('multiparty');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var socketHash = new routes.users.hash();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
var server = app.listen(3000,function(){
  console.log('Express.js server listening on port'+ app.get('port'));
});
var io = require('socket.io').listen(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function(socket) {  
  console.log(socket.id);
  var socketId = socket.id;
  socket.on('login',function(nickname){
    socket.nickname = nickname; 
    socket.emit('loginSuccess');
    io.sockets.emit('system', nickname);
  });
  socket.on('msg',function(data){
    console.log(data);
    var sendMsg = {'name':socket.nickname,'data':data}
    socket.broadcast.emit('chat',sendMsg);
  });
  socket.on('disconnect',function(){
    io.sockets.emit('disconnect', socket.nickname);
  })
});

app.get('/', routes.index);
app.get('/chat',routes.users.chat);
app.post('/uploadUserImgPre',function(req, res, next) {
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: './public/files/images'});
  form.parse(req,function(err, fields, files) {
    var filesTmp = JSON.stringify(files);
    console.log(files);
    if(err){
      console.log('parse error: ' + err);
    } else {
      testJson = eval("(" + filesTmp+ ")"); 
      console.log(testJson);
      res.json({imgSrc:testJson.fileField[0].path})
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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


module.exports = app;
