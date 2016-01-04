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
			this.container = options.container || $('body');
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
			var $notification = this.container.find('notification');
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
		template: _.template('<a class="close-reveal-modal" aria-label="Close">&#215;</a><div><div class="row content"><%= content %></div><% if(actions){ %><div class="actions right"><button class="ok button">Ok</button><button class="cancel button">Cancel</button></div><% } %></div>'),
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
                actions: true,
				content: message
			});
		},
        basic: function(view, options){
            options = options || {};
            this.render({
				type: "basic",
				content: "",
                actions: true
			});
            this.$el.find('.content').html(view.$el);
            view.render();
            this.displayActions({});
            var tmp = view.render;
            var that = this;
            view.render = function(opts){
                opts = opts || {}; 
                tmp.apply(this, arguments);
                that.resize();
                that.success = opts.success;
                that.error = opts.error;
                that.displayActions(opts.actions);
            };
            this.basicView = view;
        },
        displayActions: function(actions){
            if(actions.ok){
               this.$el.find('.ok').removeClass('hide'); 
            } else {
               this.$el.find('.ok').addClass('hide');  
            }
            if(actions.cancel){
               this.$el.find('.cancel').removeClass('hide'); 
            } else {
               this.$el.find('.cancel').addClass('hide');  
            }
            if(!actions.ok && !actions.cancel){
                this.$el.find('.actions').addClass('hide');
            } else if(this.$el.find('.actions').hasClass('hide')){
                this.$el.find('.actions').removeClass('hide');
            }
        },
		close: function(){
			this.$el.foundation('reveal', 'close');
			if(this.error) this.error();
		},
		validate: function(){
			this.$el.foundation('reveal', 'close');
			if(this.success) this.success();
		},
        resize: function(){
            var $popup = $('popup');
            $popup.height("");
            var bodyHeight = $('body').height() - 10;
            var height = $popup.outerHeight();
            var top = 5;
            if(height > bodyHeight){
                $popup.outerHeight(bodyHeight);
            } else {
                top = (bodyHeight + 10 - height) / 2;
            }
            $popup.css('top', top > 100 ? 100 : top + 'px');
            
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
            var view = this;
            this.resize();
            window.addEventListener('resize', this.resize, true);
            $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
                if(view.basicView){
                     view.basicView.remove();
                     view.basicView = null;
                     view.undelegateEvents();
                }
                window.removeEventListener('resize', this.resize);
            });
			this.delegateEvents();
		}
	});
	
	return {
		NotificationView: NotificationView,
		PopUpView: PopUpView
	};
});