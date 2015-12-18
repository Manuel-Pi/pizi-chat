define(['backbone',
		'views/ChatView',
		'views/UserListView',
		'views/RoomListView'],
function(Backbone,
		ChatView,
		UserView,
		RoomView){
	if(io){
		var name = prompt("Enter a name:");
		if(name){
			
			window.App = window.App || {};
			
			App.user = name;
			
			// Connect to server
			App.socket = io.connect('http://localhost:8087/pizi-chat');
			App.socket.emit('login', name);
			
			$('body').html("<pizi-chat><info></info></pizi-chat>");
			var $PiziChat = $('pizi-chat');
			var $Info = $PiziChat.find("info");
			
			var chatView = new ChatView();
			$PiziChat.prepend(chatView.$el);
			chatView.render();
			
			var userView = new UserView();
			$Info.append(userView.$el);
			chatView.render();
			
			var roomView = new RoomView();
			$Info.append(roomView.$el);
			roomView.render();
			
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