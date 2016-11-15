define(['module', 'exports', 'backbone', 'text!html/chat.html', 'text!html/message.html', 'pizi-backbone'], function (module, exports, _backbone, _chat, _message, _piziBackbone) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _backbone2 = _interopRequireDefault(_backbone);

    var _chat2 = _interopRequireDefault(_chat);

    var _message2 = _interopRequireDefault(_message);

    var _piziBackbone2 = _interopRequireDefault(_piziBackbone);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    exports.default = _backbone2.default.View.extend({
        template: _.template(_chat2.default),
        tagName: "chat",
        className: "container-fluid",
        events: {
            'click .poke': 'sendMessage',
            'keyup .message': 'pressEnter'
        },
        initialize: function (options) {
            options = options || {};
            this.room = options.room;
        },
        pressEnter: function (event) {
            if (event.keyCode == 13 && !event.shiftKey) this.sendMessage();
        },
        addMessage: function (message, send) {
            if (message && message.text !== "") {
                var $render = this.$el.find('.render');
                $render.append(_.template(_message2.default)({ message: message, type: send ? "sent" : "received" }));
                $render[0].scrollTop = $render[0].scrollHeight;
            }
        },
        sendMessage: function () {
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
        render: function () {
            this.$el.html(this.template({ name: this.room.name }));
            this.notification = this.notification || new _piziBackbone2.default.NotificationView({ container: this.$el.find(".render") });
            this.delegateEvents();
            return this;
        }
    });
    module.exports = exports['default'];
});
