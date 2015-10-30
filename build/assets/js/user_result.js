$(function(){

	var roomId = purl().param('roomId');

	var win = $('#win');
	var fail = $('#fail');
	var time = Date.now();
	var timestamp = time.toString().substring(time.length-10);

	// 获取cookie用户信息
	var localUser = Cookies.getJSON('user');
	
	function getUser(users, openid){
		var filtered = users.filter(function(item){
			return item.openid == openid;
		});
		user = filtered.length !== 0 ? filtered[0]: null;
		return user;
	}

	socket.on('connect', function(){
		socket.emit('result', {
			roomId: roomId
		});

		socket.on('end', function(data){
			var room = data.room;
			var screen_user_num = room.screen_user_num;
			var user = getUser(room.users, localUser.openid);
			if(roomId == room.roomId){
				if(user&&user.end){
					fail.hide();
					win.show();
					win.find('.J-rank').html(user.ranking_num);
					win.find('.J-time').html(getTime(user.shaking_time));
					// 判断是否可以领奖
					$.ajax({
						type: 'get',
						url: g.api.isAward + '&openid='+user.openid+'&store_act_id='+room.store_act_id+'&ranking_num='+user.ranking_num+'&callback=?',
						dataType: 'jsonp',
						success: function(data){
							if(data.start == 1){
								var sendParams = [
									'openid='+user.openid,
									'store_act_id='+room.store_act_id,
									'store_sess_id='+room.store_sess_id,
									'ranking_num='+user.ranking_num,
									'activeCode='+room.active_code,
									'startTime='+room.start_time,
									'endTime='+room.end_time,
									'timestamp='+timestamp
								].join('&');
								win.attr('style','display:block');
								win.find('.J-get').show();
								$('#getAward').css('display', 'block');
								$('#getAward').on('click', function(){
									var link = g.auth + encodeURIComponent(g.awardRedirectUrl+'&'+sendParams);
									window.location.href=link;
								});
							}else if(data.start == 3){
								win.find('.J-all-out').show();
							}else if(data.start == 4){
								win.find('.J-not-get').show();
							}else if(data.start == 5){
								win.find('.J-not-get').show();
							}
						}
					});
				}else{
					win.hide();
					fail.show();
					fail.find('.J-time').html(getTime(user.shaking_time));
				}
				// 断开socket连接
				socket.disconnect();
			}
		});
	});

	function getTime(shaking_time){
		var time;
        var second = Math.floor(shaking_time/1000);
        var mSecond = shaking_time-second*1000;
        if(mSecond>=10){
            mSecond = parseInt(mSecond/10);
            time=second+"秒"+mSecond;
        }else{
            time=second+"秒";
        }
        return time;
	}

    
});