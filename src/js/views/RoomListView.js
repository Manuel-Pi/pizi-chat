define(['backbone',
		'text!../../html/room.html'],
function(Backbone,
		UserTemplate){
	return Backbone.View.extend({
		template : _.template(UserTemplate),
		tagName: "room-list",
		className: "container-fluid",
		initialize: function(){
			this.rooms = [];
			var view = this;
			App.socket.on('users', function(rooms) {
				view.rooms = rooms;
				view.render();
			});
		},
		render: function(){
			this.$el.html(this.template());
			var roomList = this.$el.find('#roomList');
			roomList.html("");
			for(var i = 0; i < this.rooms.length; i++){
				roomList.append("<div>" + this.rooms[i] + "</div>");
			}
			this.delegateEvents();
			return this;
		}
	});
});
