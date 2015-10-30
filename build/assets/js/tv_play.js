$(function(){

	var roomId = $.url().param('roomId');
    var firstClick = false;
    window.onkeypress = function(){
        if(!firstClick){
			firstClick = true;
			hudongtv.countDown(function(){
				socket.emit('start', {
					roomId: roomId
				});
			});
        }else{
            var raceBg = document.getElementById('race');
            if(raceBg){raceBg.play();}//游戏背景音乐
        }
    };
	// 触发倒计时事件
	socket.on('connect', function(){
		socket.emit('countdown', {
			roomId: roomId
		});
	});

	socket.on('update', function(data){
		if(roomId === data.roomId){
			hudongtv.beginGame(data.users, data.game_shake_num, data.screen_user_num, function(){
				socket.emit('end', {
					roomId: roomId
				});
				socket.on('force', function(data){
        			window.location.href = g.tvResultUrl + '?roomId=' + data.roomId;
	        	});
			});
		}
	});

	$(document).keydown(function (e) {
        var button = e.keyCode;
        //强制结束
        if(button == 39){
    		socket.emit('end', {
				roomId: roomId
			});
        	socket.on('force', function(data){
        		if(roomId == data.roomId){
        			window.location.href = g.tvResultUrl + '?roomId=' + roomId;
        		}
        	});
        }
    });

});
