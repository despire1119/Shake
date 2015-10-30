$(function () {
	var params = purl().param();
	var wx_pic = !params.wx_headimgurl?'./assets/images/wx_pic_default.jpg':params.wx_headimgurl;
    var start = false;
    var userInfo = {
        roomId: params.roomId,
        openid: params.wx_openid,
        nickname: params.wx_nickname,
        wx_pic: wx_pic,
        shaking_num: 0,
        ranking_num: 0,
        end: false
    };


    // 存储cookie
    Cookies.set('user', {
        openid: userInfo.openid
    });

    // 新用户
    socket.emit('join', userInfo);

    // play
    socket.on('start', function(data){
        if(data.roomId === userInfo.roomId){
            start = true;
            // alert('start: '+true);
            // // 初始活摇动对象
            // var shake = new Shake({
            //     onShake: function(){
            //         if(start){
            //             this.count += 1;
            //             shakeYouPhone();
            //             socket.emit('shake', {
            //                 roomId: params.roomId,
            //                 openid: params.openid,
            //                 shaking_num: this.count
            //             });
            //         }
            //     }
            // });
            // shake.start();
        }
    });

    // shake
    var shakeEvent = new Shake({
        threshold: 17
    });
    var shakeCount = 0;
    shakeEvent.start();
    window.addEventListener('shake', shakeEventDidOccur, false);
    function shakeEventDidOccur() {
    	if(start){
    		shakeCount += Math.ceil(Math.random()*3);
	        shakeYouPhone();
	        socket.emit('shake', {
	            roomId: userInfo.roomId,
	            openid: userInfo.openid,
	            shaking_num: shakeCount
	        });
    	}else{
            var tips = $('.game-tips');
            if(tips.hasClass('hide')){
                tips.removeClass('hide');
                setTimeout(function(){
                    tips.addClass('hide');
                },2000);
            }
    	}

    }


    // 游戏结束
    socket.on('end', function(data){
        var room  = data.room;
        if(userInfo.roomId == room.roomId){
            start = false;
            window.location.href = g.mResultUrl + '?roomId=' + userInfo.roomId;
        }
        socket.disconnect();
    });


});
