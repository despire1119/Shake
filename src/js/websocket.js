
;(function(){

	var socket = {
		url: 'ws://localhost:8080',
		instance: null,
		state: 0,
		defaultEvents: ['open', 'message', 'close', 'error'],
		customEvents: [],
		isDefault: function(eventName){
			return !(this.defaultEvents.indexOf(eventName) < 0);
		},
		customEvents: [],
		connect: function(opts, cb){
			if(this.instance){
				return;
			}
			if(opts && opts.url){
				this.url = opts.url;
			}
			var instance = new WebSocket(this.url);
			this.instance = instance;
			instance.onopen = function(){
				if(cb){
					cb();
				}
			}
		},
		on: function(eventName, cb){
			var instance = this.instance;
			if(!this.isDefault(eventName)){
				instance.onmessage = function(data){
					if(data.eventName == eventName){
						cb();
					}
				}
			}else{
				instance['on' + eventName] = cb;
			}
			
		},
		emit: function(eventName, data){
			if(!this.isDefault(eventName)){
				data['eventName'] = eventName;
			}
			this.instance.send(JSON.stringify(data));
		},
		close: function(){
			this.instance.close();
		}
	};
	window.socket = socket;

})(window);