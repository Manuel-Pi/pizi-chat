define(['backbone',
		'views/ChatView'],
function(Backbone,
		ChatView){
	if(io){
		var name = prompt("Enter a name:");
		if(name){
			
			window.App = App || {};
			
			// Connect to server
			App.socket = io.connect('http://localhost:8080/pizi-chat');
			App.socket.emit('login', name);
			
			var chatView = new ChatView();
			$('body').html(chatView.$el);
			chatView.render();
			
			// Define 'users' event  
			App.socket.on('users', function(user) {
				// Display Chat
				document.getElementById("pizi-chat").className = "";
				
				document.getElementById("userList").innerHTML = "";
				for(var i = 0; i < user.length; i++){
					var div = document.createElement('div');
					div.innerHTML = user[i];
					document.getElementById("userList").appendChild(div);
				}
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