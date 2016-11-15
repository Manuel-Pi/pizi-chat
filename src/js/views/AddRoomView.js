import Backbone from 'backbone';
import AddRoomTemplate from 'text!html/addRoom.html';

export default Backbone.View.extend({
    template: _.template(AddRoomTemplate),
    tagName: "add-room",
    className: "container-fluid",
    initialize: function(options) {
        options = options || {};
    },
    events: {
        'click .choice': 'choose',
        'click li:not(.joined)': 'select',
        'click #switch': 'setRoomType'
    },
    setRoomType: function(event) {
        if (event.currentTarget.checked === true) {
            this.$el.find('.type').html("Private");
            this.$el.find('.users').removeClass("hide");
        } else {
            this.$el.find('.type').html("Public");
            this.$el.find('.users').addClass("hide");
        }
    },
    select: function(event) {
        var $target = $(event.currentTarget);
        if ($target.hasClass('selected')) {
            $target.removeClass('selected');
        } else {
            $target.addClass('selected');
        }
    },
    choose: function(event) {
        var view = this;
        this.choice = $(event.currentTarget).hasClass('add') ? 'add' : 'join';
        if (this.choice === 'add') {
            App.socket.emit('getUsers');
            App.socket.once('userList', function(users) {
                view.users = users;
                view.users.splice(users.indexOf(App.user), 1);
                view.render();
            });
        } else if (this.choice === 'join') {
            App.socket.emit('getRooms');
            App.socket.once('roomList', function(rooms) {
                var ids = _.pluck(App.roomView.rooms, 'id');
                var i = rooms.length;
                while (i--)
                    if (ids.indexOf(rooms[i].id) > -1) rooms[i].joined = true;
                view.rooms = rooms;
                view.render({
                    actions: { ok: true, cancel: true },
                    success: function() {
                        _.each(this.$el.find('ul li.selected'), function(li) {
                            var id = li.id.replace('-choice', '');
                            var index = App.roomView.roomIndex(id);
                            if (index === -1) {
                                var i = rooms.length;
                                while (i--) {
                                    if (rooms[i].id === id) {
                                        index = App.roomView.rooms.push(rooms[i]) - 1;
                                        break;
                                    }
                                }
                            }
                            App.roomView.render();
                            App.displayRoom(App.roomView.rooms[index]);
                        });
                    }
                });
            });
        }
    },
    render: function() {
        this.$el.html(this.template({ choice: this.choice, users: this.users, rooms: this.rooms }));
        this.choice ? $('popup .actions .ok').show() : $('popup .actions .ok').hide();
        this.delegateEvents();
        return this;
    }
});