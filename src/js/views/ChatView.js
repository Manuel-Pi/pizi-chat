import Backbone from 'backbone';
import ChatTemplate from 'text!html/chat.html';
import MessageTemplate from 'text!html/message.html';
import Pizi from 'pizi-backbone';

export default Backbone.View.extend({
    template: _.template(ChatTemplate),
    tagName: "chat",
    className: "container-fluid",
    events: {
        'click .poke': 'sendMessage',
        'keyup .message': 'pressEnter'
    },
    initialize: function(options) {
        options = options || {};
        this.room = options.room;
    },
    pressEnter: function(event) {
        if (event.keyCode == 13 && !event.shiftKey) this.sendMessage();
    },
    addMessage: function(message, send) {
        if (message && message.text !== "") {
            var $render = this.$el.find('.render');
            $render.append(_.template(MessageTemplate)({ message: message, type: send ? "sent" : "received" }));
            $render[0].scrollTop = $render[0].scrollHeight;
        }
    },
    sendMessage: function() {
        var $text = this.$el.find(".message");
        var message = {
            text: $text.val(),
            user: App.user,
            roomId: this.room.id
        };
        $text.val("");
        this.addMessage(message, true);
        if (message.text) App.socket.emit('message', message);
    },
    render: function() {
        this.$el.html(this.template({ name: this.room.name }));
        this.notification = this.notification || new Pizi.NotificationView({ container: this.$el.find(".render") });
        this.delegateEvents();
        return this;
    }
});