// Check io is defined
function run(){
	if(io){
		var name = prompt("Enter a name:");
		if(name){
			// Connect to server
			var socket = io.connect('http://top608:8087/pizi-chat');
			socket.emit('login', name);
			
			// Send message
			function sendMessage(){
				var message = {
					text: document.getElementById("message").value,
					user: name
				};
				document.getElementById("message").value = "";
				addMessage(message, true);
				if(message.text) socket.emit('message', message);
			}
			
			// Add message to IHM
			function addMessage(message, send){
				if(message && message.text){
					var usr = document.createElement('div');
					usr.innerHTML = message.user;
					usr.clasName = "user";
					var div = document.createElement('div');
					div.appendChild(usr);
					div.className = send ? "sent" : "received";
					var span = document.createElement('span');
					span.innerHTML = message.text;
					span.className = send ? "sent" : "received";
					div.appendChild(span);
					var render = document.getElementById("render");
					render.appendChild(div);
					var clear = document.createElement('div');
					clear.className = "empty";
					div.appendChild(clear);
					render.scrollTop = render.scrollHeight;
				}
			}
			
			// Define 'users' event  
			socket.on('users', function(user) {
				// Display Chat
				document.getElementById("pizi-chat").className = "";
				
				document.getElementById("userList").innerHTML = "";
				for(var i = 0; i < user.length; i++){
					var div = document.createElement('div');
					div.innerHTML = user[i];
					document.getElementById("userList").appendChild(div);
				}
			});
			// Define 'message' event 
			socket.on('message', function(message) {
				addMessage(message);
			});
			
			socket.on('disconnect', function(message) {
				if(message === 'unauthorized'){
					alert("Name already used!");
					run();
				} else {
					alert("Server closed!");
					document.getElementsByTagName('body')[0].innerHTML = "";
				}
			});
			
			document.getElementById("poke").onclick = sendMessage;
					
			document.getElementById("message").onkeyup = function(event){
				if(event.keyCode == 13 && !event.shiftKey) sendMessage();
			}

		} else {
			alert("No name ... no chat!");
			document.getElementsByTagName("body")[0].innerHTML = "";
		}
	} else {
		console.log("io is not defined!");
	}
}
run();

