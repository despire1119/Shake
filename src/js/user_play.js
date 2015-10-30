$(function () {
    var count = 0;
    var params = purl().param();
    var start = false;
    var userInfo = {
        roomId: params.roomId,
        openid: params.openid,
        nickname: params.nickname,
        wx_pic: params.wx_pic,
        shaking_num: 0,
        ranking_num: 0
    };

    // 存储cookie
    Cookies.set('user', {
        openid: userInfo.openid
    });

    // 新用户
    socket.emit('join', userInfo);

    socket.on('start', function(data){
        if(data.roomId === params.roomId){
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

            var shakeEvent = new Shake({
                threshold: 17
            });
            shakeEvent.start();
            if(start){
                window.addEventListener('shake', shakeEventDidOccur, false);
                var shakeCount = 0;
                function shakeEventDidOccur() {
                    shakeCount += Math.ceil(Math.random()*2);
                    shakeYouPhone();
                    socket.emit('shake', {
                        roomId: params.roomId,
                        openid: params.openid,
                        shaking_num: shakeCount
                    });
                }
            }
        }
    });

    // var count = 0;
    // $('#trigger').on('click', function(){
    //     socket.emit('shake', {
    //         roomId: params.roomId,
    //         openid: params.openid,
    //         shaking_num: count++
    //     });
    // });

    // 游戏结束
    socket.on('end', function(data){
        var room  = data.room;
        if(params.roomId === room.roomId){
            start = false;
            window.location.href = g.mResultUrl + '?roomId=' + params.roomId;
        }
        socket.disconnect();
    });


});
