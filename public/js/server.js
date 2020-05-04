var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(9090, function() {
	console.log('socket.io server listen at 9090');
});

io.on('connection', (socket) => {
	console.log("new client connected");

	socket.on('disconnect', () => {
		io.emit('user disconnected');
	});
});