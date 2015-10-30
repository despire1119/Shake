var app = require('http').createServer(),
	io = require('socket.io').listen(app),
	fs = require('fs'),
	xss = require('xss');

app.listen(3200);
//io.configure(function () {
//	io.set('log level’, 1);
//	io.set('origin’, ‘*’);
//	io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
//});

io.sockets.on('connection', function (client) {
	console.log("客户端已经连接");

	//向客户端发送数据
//	client.send({ name: '系统信息', content: '系统已经准备好了！' });

	//接收到来自客户端的数据后
	client.on('pageData', function (data) {
		console.log(data);
		io.emit('message', { name: xss(data.name), content: xss(data.content) });
	});

});

