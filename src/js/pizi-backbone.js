define(['backbone',
		'foundation'],
function(Backbone,
		foundation){
			
	var NotificationView = Backbone.View.extend({
		tagName: "notification",
		className: "container-fluid",
		template:  _.template('<div data-alert class="alert-box <%= type %>" style="margin-bottom: 0;padding: 0;opacity:1;"><%= message %><a href="#" class="close">&times;</a></div>'),
		initialize: function(options){
			options= options || {};
			this.container = options.container || 'body';
		},
		success: function(message){
			this.render({
				type: "success",
				message: message
			});
		},
		error: function(message){
			this.render({
				type: "alert",
				message: message
			});
		},
		notify: function(message){
			this.render({
				message: message
			});
		},
		checkEl: function(){
			var $notification = $('notification');
			if($notification.length === 0){
				this.$el.prependTo(this.container);
				this.$el.css({
					'position': 'absolute',
					'top': '0',
					'width': '100%',
					'z-index': '10'
				});
			} else {
				this.$el = $($notification[0]);
			}
		},
		render: function(notif){
			this.checkEl();
			var $news = $(this.template({type: notif.type, message: notif.message}));
			this.$el.append($news);
			this.$el.foundation();
			setTimeout(function(){
				$news.slideUp();
      			$news.find("a.close").click();
			}, 3000);
		}
	});
	
	var PopUpView = Backbone.View.extend({
		tagName: "popup",
		className: "reveal-modal container-fluid small",
		template: _.template('<a class="close-reveal-modal" aria-label="Close">&#215;</a><div class="row message"><%= message %></div><div class="actions right"><button class="ok button">Ok</button><button class="cancel button">Cancel</button></div>'),
		initialize: function(){
			if($('popup').length === 0){
				this.$el.prependTo('body');
			} else {
				this.$el = $($('popup')[0]);
			}
			this.$el.attr('data-reveal', '');
			this.index = 0;
		},
		events: {
			'click button.cancel': 'close',
			'click button.ok': 'validate'
		},
		confirm: function(message, callback){
			callback = callback || {};
			this.success = callback.success;
			this.error = callback.error;
			this.render({
				type: "confirm",
				message: message
			});
		},
		close: function(){
			this.$el.foundation('reveal', 'close');
			if(this.error) this.error();
		},
		validate: function(){
			this.$el.foundation('reveal', 'close');
			if(this.success) this.success();
		},
		render: function(data){
			this.$el.html(this.template(data));
			this.$el.foundation({
				reveal: {
					close_on_background_click: false,
					close_on_esc: false
				}
			});
			this.$el.foundation('reveal', 'open');
			this.delegateEvents();
		}
	});
	
	return {
		NotificationView: NotificationView,
		PopUpView: PopUpView
	};
});