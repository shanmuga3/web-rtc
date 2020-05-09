var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(9090, function() {
	console.log('socket.io server listen at 9090');
});

io.on('connection', (socket) => {
	console.log("new client connected");

	function log()
	{
		var array = ['Message from server:'];
		array.push.apply(array, arguments);
		socket.emit('log', array);
	}

	socket.on('disconnect', () => {
		io.emit('user disconnected');
	});
	
	socket.on('message', function(message) {
		log('Client said: ', message);
		socket.broadcast.emit('message', message);
	});

	socket.on('create_or_join', function(room) {
		log('Received request to create or join room ' + room);

		var clientsInRoom = io.sockets.adapter.rooms[room];
		var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
		log('Room ' + room + ' now has ' + numClients + ' client(s)');

		if (numClients === 0) {
			socket.join(room);
			log('Client ID ' + socket.id + ' created room ' + room);
			socket.emit('created', room, socket.id);
		}
		else if (numClients === 1) {
			log('Client ID ' + socket.id + ' joined room ' + room);
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room, socket.id);
			io.sockets.in(room).emit('ready');
		}
		else {
			socket.emit('full', room);
		}
	});
});