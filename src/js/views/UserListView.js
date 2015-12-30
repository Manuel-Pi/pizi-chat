define(['backbone',
		'text!../../html/user.html'],
function(Backbone,
		UserTemplate){
	return Backbone.View.extend({
		template : _.template(UserTemplate),
		tagName: "user-list",
		className: "container-fluid",
		initialize: function(options){
			options = options || {};
			this.users = options.users;
			var view = this;
			App.socket.on('joinRoom', function(data) {
				if(data.roomId ){
					view.addUser(data.user);
				}
			});
			App.socket.on('leaveRoom', function(data) {
				view.removeUser(data.user);
			});
		},
		addUser: function(user, silent){
			var userList = this.$el.find('#userList');
			userList.append("<div id='" + user + "'>" + user + "</div>");
			if(!silent) App.notification.notify(user + ' join the room!');
		},
		removeUser: function(user, silent){
			var $user = this.$el.find('#userList #' + user);
			$user.remove();
			if(!silent) App.notification.notify(user + ' left the room!');
		},
		render: function(){
			this.$el.html(this.template());
			for(var i = 0; i < this.users.length; i++){
				this.addUser(this.users[i], true);
			}
			this.delegateEvents();
			return this;
		}
	});
});
