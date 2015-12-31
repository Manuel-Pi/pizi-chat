define(['backbone',
		'views/ChatView',
		'views/UserListView',
		'views/RoomListView',
		'pizi-backbone'],
function(Backbone,
		ChatView,
		UserView,
		RoomView,
		Pizi){
	if(io){
		var name = prompt("Enter a name:");
		if(name){
			window.App = window.App || {
				user: name,
				socket: io.connect('http://localhost:8087/pizi-chat'),
				notification: {
					success: function(message){
						App.rooms[App.actualRoom].notification.success(message);
					},
					error: function(message){
						App.rooms[App.actualRoom].notification.error(message);
					},
					notify: function(message){
						App.rooms[App.actualRoom].notification.notify(message);
					},
				},
				rooms: {}
			};
			
			App.socket.on('unauthorized', function(data){
				alert(data.message);
				App.name = prompt("Enter a name:");
				App.socket.emit('login', App.name);
			});
			
			App.socket.on('loginSuccess', function(data){
				
				$('body').append("<pizi-chat><info></info></pizi-chat>");
				
				var $PiziChat = $('pizi-chat');
				var $Info = $PiziChat.find("info");
				
				App.roomView = new RoomView(data);
				$Info.append(App.roomView.$el);
				App.roomView.render();
				
				App.userView = new UserView(data);
				$Info.append(App.userView.$el);
				
				App.displayRoom = function(room){
					if(room){
						if(App.actualRoom) App.rooms[App.actualRoom].$el.hide();
						if(App.rooms[room.id]){
							App.rooms[room.id].$el.show();
						} else {
							room.connected.push(App.user);
							var chatView = new ChatView({room: room});
							$PiziChat.prepend(chatView.$el);
							chatView.render();
							App.rooms[room.id] = chatView;
							App.socket.emit('joinRoom', room.id);
						}
						App.actualRoom = room.id;
						App.roomView.setActual(App.actualRoom);
						// Render user view
						App.userView.render(room.connected);
					}
				};
				
				if(data.rooms && data.rooms.length > 0){
					App.displayRoom(data.rooms[0]);
				}
				
				App.socket.on('message', function(message) {
					if(App.rooms[message.roomId]){
						App.rooms[message.roomId].addMessage(message);
					}
				});
				
				App.notification.success('Successfully connected!');
			});
			
			App.socket.on('disconnect', function(message) {
				if(message === 'unauthorized'){
					alert("Name already used!");
				} else {
					alert("Server closed!");
					document.getElementsByTagName('body')[0].innerHTML = "";
				}
			});
			
			// Connect to server
			App.socket.emit('login', name);

		} else {
			alert("No name ... no chat!");
			document.getElementsByTagName("body")[0].innerHTML = "";
		}
	} else {
		console.log("io is not defined!");
	}
});