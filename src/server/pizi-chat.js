

module.exports = (socketServer, console) => {

    const { Namespace, DEFAULT_ROOM__NAME} = require("./models/dist/namespace");

    // Get io for a specific namespace
    const nsp = socketServer.of(/^\/pizi-chat(\/\w+)*$/);
    const activeUsers = [];

    // This middleware will be assigned to each namespace
    nsp.use((socket, next) => {
        // ensure the user has access to the workspace
        if (true) {
            console.info("New connection on: " + socket.nsp.name);
            next();
        } else {
            next(new Error('forbidden'));
        }
    });

    // On connection
    nsp.on('connection', (socket) => {

        socket.on('login', (name) => {
            // Need username
            if(!name) socket.emit('unauthorized', {message: 'User cannot be empty!'});

            // Log user in namespace
            const [, namespace] = Namespace.getDataFromSocket(socket, true);
            namespace.connectUser({name, socketId: socket.id}, user => {
                socket.user = user.name;
                socket.broadcast.emit('userJoin', user.name);
            
                socket.emit('loginSuccess', {
                    rooms: namespace.getRoomsForUser(user).map(room => room.getJson())
                });

                namespace.joinRoom(DEFAULT_ROOM__NAME, user, room => {
                    socket.join(room.id);
                    socket.emit('roomData', room.getJson());
                    socket.broadcast.to(room.id).emit('userJoinRoom', {name: room.name, user: user.name});
                    updateRoomForUsers(namespace);
                });

                const existingSocket = activeUsers.find(existingSocket => existingSocket === socket.id);
                if(!existingSocket) activeUsers.push(socket.id);
                console.log('Connection: ' + name);
            });
        });
        
        socket.on('disconnect', () => {
            const [user, namespace] = Namespace.getDataFromSocket(socket);
            /*namespace.disconnectUser(user, () => {
                socket.broadcast.emit('userLeft', user.name);
                activeSockets = activeUsers.filter(existingSocket => existingSocket !== socket.id);
            }, (room) => {
                socket.leave(room.id);
                socket.broadcast.to(room.id).emit('userLeaveRoom', {roomId: room.id, user: user.name});
            });*/
        });
        
        socket.on('joinRoom', (roomId) => {
            const [user, namespace] = Namespace.getDataFromSocket(socket);
            namespace.joinRoom(roomId, user, room => {
                socket.join(room.id);
                socket.emit('roomData', room.getJson());
                socket.broadcast.to(room.id).emit('userJoinRoom', {name: room.name, user: user.name});
                updateRoomForUsers(namespace);
            });
        });
        
        socket.on('leaveRoom', (roomId) => {
            const [user, namespace] = Namespace.getDataFromSocket(socket);
            namespace.leaveRoom(roomId, user, room => {
                socket.leave(roomId);
                socket.broadcast.to(room.id).emit('userLeaveRoom', {name: room.name, user: user.name});
                updateRoomForUsers(namespace);
            }, room => updateRoomForUsers(namespace));
        });
        
        socket.on('addRoom', (room) => {
            if(!room) return;
            room = {
                allowedUsers: [],
                users: [],
                private: false,
                owner: null
                ,...room
            };

            const [user, namespace] = Namespace.getDataFromSocket(socket);
            if(!namespace) return;
            room.users = namespace.getAllUsers(room.users);
            room.owner = namespace.getUsers(room.owner)[0];

            if(!room.owner) room.owner = {
                name: "default"
            };

            // Room exist
            let existingRoom = namespace.rooms.filter(r => room.id === r.id)[0];
            
            
            // Check conversation
            if(!existingRoom && room.allowedUsers.length === 2){
                let conversation = namespace.rooms.filter(r =>  r.id.includes(":")     
                                                            && r.id.includes(room.allowedUsers[0]) 
                                                            && r.id.includes(room.allowedUsers[1]))[0];
                if(conversation){
                    existingRoom = namespace.rooms.filter(r =>  r.id.includes(":")     
                                                                && r.id.includes(room.allowedUsers[0]) 
                                                                && r.id.includes(room.allowedUsers[1]))[0];
                }
            }

            // Connect to existing room
            if(existingRoom) namespace.joinRoom(existingRoom.id, user, room => {
                socket.join(room.id);
                socket.emit('roomData', room.getJson());
                socket.broadcast.to(room.id).emit('userJoinRoom', {name: room.name, user: user.name});
                updateRoomForUsers(namespace);
                return;
            });
             
            // Create room
            if(!existingRoom) namespace.createRoom(room, createdRoom => {
                if(createdRoom.private) {
                    namespace.getUsers().forEach(user => nsp.to(user.socketId).emit('roomAdded', createdRoom))
                } else {
                    nsp.emit('roomAdded', createdRoom);
                }
                updateRoomForUsers(namespace);
            })
        });

        socket.on('updateRoom', (room) => {
            const [, namespace] = Namespace.getDataFromSocket(socket);
            namespace.updateRoom(room);
            updateRoomForUsers(namespace);
        });
        
        socket.on('getRooms', () => {
            const [, namespace] = Namespace.getDataFromSocket(socket);
            updateRoomForUsers(namespace);
        });

        socket.on('message', (message) => {
            const [, namespace] = Namespace.getDataFromSocket(socket);
            const room = namespace.getRoom(message.roomId);
            if(room){
                room.addMessage(message);
                nsp.to(message.roomId).emit('message', message);
            }
        });
    });


    const updateRoomForUsers = (namespace) => {
        namespace.getRoom().users.forEach(user => {
            nsp.to(user.socketId).emit("roomList", namespace.getRoomsForUser(user).map(room => room.getJson()))
        })
    }
}