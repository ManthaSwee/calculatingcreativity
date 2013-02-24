
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');


var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

    server.listen(3000);
    console.log('Listening on port 3000');


app.configure(function(){
    app.set('port', process.env.port || 3000); //3000
    app.set('views', __dirname + '/views');
    //Template Enginer
    app.set('view engine', 'ejs');	
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

	//Session Management 
//	app.use(express.cookieParser()); 
//	app.use(express.session({ 
//		store: MongoStore(my_db), 
//		secret: 'OMG_SuperTopSecret!@#54^!!!!!!flfdd:CW' 
//	}));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//**Routes
app.get('/hello', function(req, res){
  res.send('Hello World');
});

app.get('/', function(req, res){
    res.render('index');
});

//**Socket.IO

//needs to emit inital states of each of the boxes
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

