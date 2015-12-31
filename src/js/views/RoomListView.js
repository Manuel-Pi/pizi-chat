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
				view.rooms.push(room);
				view.addRoom(room);
			});
			App.socket.on('roomDeleted', function(room) {
				view.removeRoom(room);
				view.rooms.slice(view.rooms.indexOf(room), 1);
			});
			App.socket.on('roomData', function(room) {
				var i = view.rooms.length;
				while(i--){
					if(view.rooms[i].id === room.id){
						view.rooms[i] = room;
						App.userView.render(room.connected);
						break;	
					}
				}
			});
			App.socket.on('userJoinRoom', function(data) {
				var i = view.rooms.length;
				while(i--){
					if(view.rooms[i].id === data.roomId && view.rooms[i].connected.indexOf(data.user) === -1){
						view.rooms[i].connected.push(data.user);
						App.userView.render(view.rooms[i].connected);
						if(data.roomId === App.actualRoom) App.notification.notify(data.user + " join the room!");
						break;
					}	
				}
			});
			App.socket.on('userLeaveRoom', function(data) {
				var i = view.rooms.length;
				while(i--){
					if(view.rooms[i].id === data.roomId && view.rooms[i].connected.indexOf(data.user) > -1){
						view.rooms[i].connected.splice(view.rooms[i].connected.indexOf(data.user), 1);
						App.userView.render(view.rooms[i].connected);
						if(data.roomId === App.actualRoom) App.notification.notify(data.user + " leave the room!");
						break;
					}	
				}
			});
		},
		events:{
			'dblclick #roomList div': 'displayRoom',
			'click span.close': 'leaveRoom',
			'click span.add': 'createRoom'
		},
		createRoom: function(){
			App.socket.emit('userList', function(){
				
			})
			App.popup.confirm('Ca roule?');
		},
		leaveRoom: function(event){
			var i = this.roomIndex($(event.currentTarget).parent()[0].id);
			this.removeRoom(this.rooms[i]);
			App.socket.emit('leaveRoom', this.rooms[i].id);
			this.rooms.splice(i, 1);
			App.displayRoom(this.rooms[0]);
		},
		roomIndex: function(roomId){
			var i = this.rooms.length;
			while(i--){
				if(this.rooms[i].id === roomId) break;
			}
			return i;
		},
		displayRoom: function(event){
			var i = this.roomIndex(event.currentTarget.id);
			this.rooms[i].notif = 0;
			this.$el.find('#roomList #' + event.currentTarget.id + ' span.label').addClass('hide');
			App.displayRoom(this.rooms[i]);
		},
		addRoom: function(room, silent){
			var roomList = this.$el.find('#roomList');
			roomList.append("<div id='" + room.id + "'>" + room.name + "<span class='round label hide'></span><span class='close'>&times;</span></div>");
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
		addNotification: function(roomId){
			var i = this.roomIndex(roomId);
			this.rooms[i].notif = this.rooms[i].notif || 0;
			this.rooms[i].notif++;
			var $roomNotif = this.$el.find('#roomList #' + roomId + ' span.label');
			$roomNotif.html(this.rooms[i].notif);
			$roomNotif.removeClass('hide');
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
