$(function () {
	
	//获取活动ID
	var shopCode = 'a';
	var actId = '1';
	var roomId = shopCode + actId;

	// 扫码报名人数
	socket.emit('prejoin', {
		roomId: roomId
	});

    // 获取状态，开始倒计时时跳转到游戏页面
    socket.on('countdown', function(data){
        window.location.href = 'step2.html';
    });
});