/**
 * device shake
 * 李伟
 * 2015-08-10
 */

;(function(window){
	var Shake = function(options){
		var settings = {
			THRESHOLD: 1000,
            TIMESPAN: 150,
			onShake: function(){},
			onStop: function(){},
			onEnd: function(){}
		};
		Object.keys(options).forEach(function(item, index){
			settings[item] = options[item];
		});
		
		this.THRESHOLD = settings.THRESHOLD;
        this.TIMESPAN = settings.TIMESPAN;
		this.onShake = settings.onShake;
		this.onStop = settings.onStop;
		this.onEnd = settings.onEnd;
    	this.count = 0;
    	this.duration = 0;
    	this.enabled = true;
    	this.isShakeing = false;
    	this.acceleration = {
    		x: 0,
    		y: 0,
    		z: 0
    	};
    	this.accelerationIG = {
    		x: 0,
    		y: 0,
    		z: 0
    	};
    	this.speed = 0;
    	};
    	Shake.prototype.start = function(){
    		var x = 0;
        var y = 0;
        var z = 0;
        var lastX = 0;
        var lastY = 0;
        var lastZ = 0;
        var lastUpdate = 0;
        var self = this;

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', shakeHandler, false);
        } else {
            alert("设备不支持摇动");
        }

        function shakeHandler(eventData) {
            var acceleration = eventData.acceleration;
            var accelerationIG = eventData.accelerationIncludingGravity;
            var currentTime = new Date().getTime();
            var diff = currentTime - lastUpdate;
            self.acceleration = {
            	x: round(acceleration.x),
            	y: round(acceleration.y),
            	z: round(acceleration.z)
            };
            self.accelerationIG = {
            	x: round(accelerationIG.x),
            	y: round(accelerationIG.y),
            	z: round(accelerationIG.z)
            };
            if (self.enabled && diff > self.TIMESPAN) {
                lastUpdate = currentTime;
                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;
                var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diff * 10000;
                self.speed = speed;
                if (speed > self.THRESHOLD) {
                	self.isShakeing = true;
                    self.onShake();
                }else{
                	if(self.isShakeing){
                		self.isShakeing = false;
                		self.onStop();
                	}
                }
                lastX = x;
                lastY = y;
                lastZ = z;
            }
        }

        function round(value){
        	var amt = 10;
        	return Math.round(value * amt) / amt;
        }
	};
	window.Shake = Shake;
})(window);
