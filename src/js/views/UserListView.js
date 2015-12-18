define(['backbone',
		'text!../../html/user.html'],
function(Backbone,
		UserTemplate){
	return Backbone.View.extend({
		template : _.template(UserTemplate),
		tagName: "user-list",
		className: "container-fluid",
		initialize: function(){
			this.users = [];
			var view = this;
			App.socket.on('users', function(users) {
				view.users = users;
				view.render();
			});
		},
		render: function(){
			this.$el.html(this.template());
			var userList = this.$el.find('#userList');
			userList.html("");
			for(var i = 0; i < this.users.length; i++){
				userList.append("<div>" + this.users[i] + "</div>");
			}
			this.delegateEvents();
			return this;
		}
	});
});
