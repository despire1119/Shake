$(function(){

	var roomId = $.url().param('roomId');


	socket.on('connect', function(){
		socket.emit('result', {
			roomId: roomId
		});
		socket.on('result', function(data){
			if(roomId === data.roomId){
				$('#title').text(data.title);
				renderData(data);
			}
		});
		socket.on('end', function(data){
			var room = data.room;
			saveData(room);
			socket.disconnect();
		});
	});

	// saveData(room);
	function saveData(room){
		var base = '&'+[
			'store_sess_id='+ room.store_sess_id,
			'store_act_id='+ room.store_act_id,
			'code='+room.code
		].join('&') + '&';
		var users = room.users;
		var len=users.length;
		// 提交活动时间
		$.ajax({
			type: 'get',
			url: g.api.updateActTime + '&store_sess_id='+room.store_sess_id+'&store_act_id='+room.store_act_id+'&start_time='+encodeURIComponent(room.start_time)+'&end_time='+encodeURIComponent(room.end_time)+'&callback=?',
			dataType: 'jsonp',
			async: false,
			success: function(data){
				if(data.start ==1){
					saveUser();
				}
			},
			error: function(error){
			}
		});
		function saveUser(){
			users.forEach(function(item, index, arr){
				var params = base + [
					'openid='+ item.openid,
					'nickname='+ item.nickname,
					'wx_pic='+ encodeURIComponent(item.wx_pic),
					'shaking_time='+ item.shaking_time,
					'shaking_num='+ item.shaking_num,
					'ranking_num=' + item.ranking_num
				].join('&');
				// 提交数据
				$.ajax({
					type: 'get',
					url: g.api.saveData + params + '&callback=?',
					async: false,
					dataType: 'jsonp',
					success: function(data){
						//表解锁
						if(len == index + 1){
							$.ajax({
								type: 'get',
								url: g.api.unlockTable + '&code=' + room.code + '&id=' + room.store_act_id + '&callback=?',
								async: false,
								dataType: 'jsonp',
								success: function(data){
								}
							});
						}

					},
					error: function(error){
					}
				});
			});
		}

	}



	function renderData(data){
	    var html='';
	    var users = data.users;
	    for(var i = 0;i<users.length;i++){
	    	if(users[i].end){
	    		num =i+1;
		        var time;
		        var second = Math.floor(users[i].shaking_time/1000);
		        var mSecond = users[i].shaking_time-second*1000;
		        if(mSecond>=10){
		            mSecond = parseInt(mSecond/10);
		            if(mSecond<10){
		            	mSecond = ""+0+mSecond;
		            }
		            time=second+"秒"+mSecond+'';
		        }else{
		            time=second+"秒";
		        }
		        html+='<div class="rank-list rank-list'+num+' l">'
	                +'<span>'+time+'</span><div class="list">'
	                +'<em>'+num+'</em><div class="user-ifo">'
	                +'<p>'+users[i].nickname+'</p>'
	                +'<img src="'+decodeURIComponent(users[i].wx_pic)+'" alt="用户头像"></div></div></div>'
	    	}
	    }
	    $('.rank').html(html);
	    var rankList = $('.rank-list');
	    var maxHeight=290;
	    rankList.each(function(index,ele){
	        if(index==0){
	            rankList.eq(0).find('.list').height(maxHeight);
	        }else{
	            var nowTime = users[index].shaking_time;
	            var firstTime = users[0].shaking_time;
	            rankList.eq(index).find('.list').height((firstTime/nowTime)*maxHeight);
	        }
	    });
		var pressNum = 1;
	    window.onkeypress = function(){
			pressNum++;
			if(pressNum==2){
				var awardBg = document.getElementById('award');
				if(awardBg){awardBg.play();} //游戏背景音乐
			}else{
				window.location.href = g.tvEntranceUrl+'?code='+data.code+'&id='+data.store_act_id+'&active_code='+data.active_code;
			}
	    };
	}

});
