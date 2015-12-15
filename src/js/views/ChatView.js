define(['backbone',
		'text!../../html/chat.html'],
function(Backbone,
		ChatTemplate){
	return Backbone.View.extend({
		template : _.template(ChatTemplate),
		tagName: "chat",
		className: "container-fluid",
		events:{
			'click #poke': 'sendMessage',
			'keyup #message': 'pressEnter'
		},
		initialize: function(){
			var view = this;
			App.socket.on('message', function(message) {
				view.addMessage(message);
			});	
		},
		pressEnter: function(event){
			if(event.keyCode == 13 && !event.shiftKey) this.sendMessage();
		},
		addMessage: function(message, send){
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
		},
		sendMessage: function(){
			var message = {
				text: document.getElementById("message").value,
				user: name
			};
			document.getElementById("message").value = "";
			this.addMessage(message, true);
			if(message.text) App.socket.emit('message', message);
		},
		render: function(){
			this.$el.html(this.template());
			this.delegateEvents();
			return this;
		}
	});
});
