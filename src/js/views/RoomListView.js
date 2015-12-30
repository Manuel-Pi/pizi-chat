define(['backbone',
		'text!../../html/room.html'],
function(Backbone,
		UserTemplate){
	return Backbone.View.extend({
		template : _.template(UserTemplate),
		tagName: "room-list",
		className: "container-fluid",
		initialize: function(options){
			options = options || {};
			this.rooms = options.rooms;
			var view = this;
			App.socket.on('roomAdded', function(room) {
				this.rooms.push(room);
				view.addRoom(room);
			});
			App.socket.on('roomDeleted', function(room) {
				view.removeRoom(room);
				this.rooms.slice(this.rooms.indexOf(room), 1);
			});
		},
		events:{
			'dblclick #roomList div': 'displayRoom'
		},
		displayRoom: function(event){
			var room = _.where(this.rooms, {id: event.currentTarget.id})[0];
			App.displayRoom(room);
		},
		addRoom: function(room, silent){
			var roomList = this.$el.find('#roomList');
			roomList.append("<div id='" + room.id + "'>" + room.name + "</div>");
			if(!silent) App.notification.notify(room.name + ' room opened!');
		},
		removeRoom: function(room, silent){
			var $room = this.$el.find('#roomList #' + room.id);
			$room.remove();
			if(!silent) App.notification.notify(room.name + ' room closed!');
		},
		setActual: function(roomId){
			this.$el.find('#roomList .actualRoom').removeClass('actualRoom');
			this.$el.find('#roomList #' + roomId).addClass('actualRoom');	
		},
		render: function(){
			this.$el.html(this.template());
			for(var i = 0; i < this.rooms.length; i++){
				this.addRoom(this.rooms[i], true);
			}
			this.delegateEvents();
			return this;
		}
	});
});
