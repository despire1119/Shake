$(function () {
	var params = purl().param();
	var roomId = params.roomId;
	var wx_pic = !params.wx_headimgurl?'./assets/images/wx_pic_default.jpg':params.wx_headimgurl;
	var query = [
		'roomId=' + roomId,
		'openid=' + params.wx_openid,
		'nickname=' + params.wx_nickname,
		'wx_pic=' + wx_pic
	];
	// var query = [
	// 	'roomId=' + roomId,
	// 	'openid=' + Date.now(),
	// 	'nickname=Zeron',
	// 	'wx_pic=./assets/images/wx_pic_default.jpg'
	// ];


	// 扫码报名人数
	socket.emit('prejoin', {
		roomId: roomId
	});

    // 获取状态，开始倒计时时跳转到游戏页面
    socket.on('countdown', function(data){
    	if(roomId === data.roomId){
        	window.location.href = g.mPlayUrl + '?' + query.join('&');
    	}
    });
});
