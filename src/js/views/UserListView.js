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
		},
		addUser: function(user, silent){
			if(user !== App.user){
				var userList = this.$el.find('#userList');
				userList.append("<div id='" + user + "'>" + user + "</div>");
				if(!silent) App.notification.notify(user + ' join the room!');
			}
		},
		removeUser: function(user, silent){
			var $user = this.$el.find('#userList #' + user);
			$user.remove();
			if(!silent) App.notification.notify(user + ' left the room!');
		},
		render: function(users){
			this.$el.html(this.template());
			this.users = users || this.users;
			for(var i = 0; i < this.users.length; i++){
				this.addUser(this.users[i], true);
			}
			this.delegateEvents();
			return this;
		}
	});
});
