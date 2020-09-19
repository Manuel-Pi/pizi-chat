module.exports = function(socketServer){
    
    // Get io for a specific namespace
    const io = socketServer.of('/pizi-chat');
    
    var users = [];
    var rooms = [{
        id: 'general',
        name: 'General',
        authorized: 'All',
        connected: []
    }];

    // On connection
    io.on('connection', function (socket) {
        
        socket.on('login', function (pseudo) {
            if(pseudo){
                if(users.indexOf(pseudo) == -1){
                    socket.user = pseudo;
                    users.push(pseudo);
                    console.log('Connection: ' + pseudo);
                    socket.emit('loginSuccess', {
                        users: users,
                        rooms: [rooms[0]]
                    });
                    socket.broadcast.emit('userJoin', pseudo);
                } else {
                    socket.emit('unauthorized', {message: 'User already exist!'});
                } 
            } else {
                socket.emit('unauthorized', {message: 'User cannot be empty!'});
            }
        });
        
        socket.on('disconnect', function () {
            var i = users.indexOf(socket.user);
            if(i > -1){
                deleteUserFromRooms(users[i]);
                console.log('Deconnexion: ' + users[i])
                users.splice(i, 1);
            }
            socket.broadcast.emit('userLeft', socket.user);
        });
        
        socket.on('joinRoom', function (roomId) {
            for(var room of rooms){
                if(room.id === roomId){
                    if(room.authorized === "All" || room.author === socket.user || room.authorized.indexOf(socket.user) > -1){
                        socket.join(roomId);
                        socket.emit('roomData', room);
                        room.connected = room.connected || [];
                        room.connected.push(socket.user);
                        socket.broadcast.to(roomId).emit('userJoinRoom', {roomId: roomId, user: socket.user});
                        console.log(socket.user + " join room: " + roomId);
                    }
                    break;
                }
            }
        });
       
        var deleteUserFromRooms = function(user, roomId){
            var i = rooms.length;
            while(i--){
                var room = rooms[i];
                if((room.authorized === "All" || room.author === socket.user || room.authorized.indexOf(user) > -1) && (!roomId || roomId === room.id)){
                   room.connected.splice(room.connected.indexOf(user), 1);
                   socket.broadcast.to(room.id).emit('userLeaveRoom', {roomId: room.id, user: user});
                   console.log(user + " leave room: " + room.id);
                   if(room.connected.length === 0 && room.authorized !== 'All'){
                       rooms.splice(i, 1);
                       console.log("Room " + room.name + " closed because no one's left!");
                   }
                   if(roomId) break;
                }
             }
        };
        
        socket.on('leaveRoom', function (roomId) {
            socket.leave(roomId);
            deleteUserFromRooms(socket.user, roomId);
        });
        
        socket.on('message', function (message) {
            socket.broadcast.to(message.roomId).emit('message', message);
        });
        
        socket.on('getUsers', function () {
            socket.emit('userList', users);
        });
        
        socket.on('addRoom', function(room){
            if(room) {
                room.connected = [];
                socket.emit('roomAdded', room);
                if(room.authorized === 'All'){
                    socket.broadcast.emit('roomAdded', room);
                } else {
                    for(so of io.sockets){
                        if(room.authorized.indexOf(so.user) !== -1 && socket.id !== so.id){
                            so.emit('roomAdded', room);
                        }
                    }
                }
                rooms.push(room);
                console.log("Room created");
            }
        });
        
        socket.on('getRooms', function () {
            var authorizedRooms = [];
            for(var room of rooms){
                if(room.authorized === "All" || room.author === socket.user || room.authorized.indexOf(socket.user) !== -1){
                    authorizedRooms.push(room);
                }
            }
            socket.emit('roomList', authorizedRooms);
        });
    });
}
