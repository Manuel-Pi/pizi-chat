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
				notification: new Pizi.NotificationView({container: '#render'})
			};
			App.user = name;
			
			// Connect to server
			App.socket.emit('login', name);
			
			App.socket.on('unauthorized', function(data){
				alert(data.message);
				name = prompt("Enter a name:");
				App.socket.emit('login', name);
			});
			
			App.socket.on('loginSuccess', function(data){
				
				$('body').append("<pizi-chat><info></info></pizi-chat>");
				var $PiziChat = $('pizi-chat');
				var $Info = $PiziChat.find("info");
				
				var chatView = new ChatView();
				$PiziChat.prepend(chatView.$el);
				chatView.render();
				
				var userView = new UserView(data);
				$Info.append(userView.$el);
				userView.render();
				
				var roomView = new RoomView();
				$Info.append(roomView.$el);
				roomView.render();
				
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

		} else {
			alert("No name ... no chat!");
			document.getElementsByTagName("body")[0].innerHTML = "";
		}
	} else {
		console.log("io is not defined!");
	}
});