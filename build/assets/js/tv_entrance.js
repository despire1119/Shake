$(function(){

	'use strict';

	var params = $.url().param();
	var code = params.code;
	var active_code=params.active_code;
	var id = params.id;
	var roomId = 'room' + code + id;
	var sessId = 0;
	var data = [];

	// 活动解锁
	$.ajax({
		type: 'get',
		url: g.api.unlockTable + '&code=' + code + '&id=' + id + '&callback=?',
		async: false,
		dataType: 'jsonp',
		success: function(data){
			//活动锁表
			$.ajax({
				type: 'get',
				url: g.api.lockTable + '&code=' + code + '&id=' + id + '&callback=?',
				async: false,
				dataType: 'jsonp',
				success: function(data){
					sessId = data.store_sess_id;
					roomId += sessId;
					render();
				}
			});
		}
	});


	function render(){
		var qrcodeUrl = g.wxapi + encodeURIComponent(g.wxRedirectUrl + '?roomId=' + roomId+'&v='+Date.now());
		// 生成二维码
		$('#qrcode').qrcode({
			width: 400,
			height: 400,
			text: qrcodeUrl
		});

		//获取活动信息
		$.ajax({
			type: 'get',
			url: g.api.getActInfo + '&id=' + id + '&callback=?',
			async: false,
			dataType: 'jsonp',
			success: function(data){
				data = data;
				renderAct(data);
				if(sessId!=-1){
					socket.emit('create', {
			        	roomId: roomId,
			        	sessId: sessId,
			        	code: code,
			        	active_code: active_code,
			        	actId: id,
			        	actInfo: data
			        });
				}
			}
		});

		//显示数据
		function renderAct(data){
			var awards = data.awards;
			//规则
			$('#actRule').html(data.game_rule_dec);
			$('#title').text(data.title);
			//奖品
			var html = '';
			awards.forEach(function(item, index, arr){
				var rank = item.rank_start === item.rank_end?item.rank_start: item.rank_start + '-' + item.rank_end;
				html += [
					'<div class="l">',
					'<img src="'+item.gift_pic+'" alt="奖品">',
					'第<span>'+rank+'</span>名',
					'</div>'
				].join('');
			});
			$('#awards').html(html);

			// 开始跳转
			$(document).keydown(function(e){
		        if(e.keyCode==13){
		            window.location.href = g.tvRaceUrl + '?roomId=' + roomId;
		        }
		    });

		}

	}


    socket.on('prejoin', function(data){
		setJoinNumber(data);
	});

	function setJoinNumber(data){
		if(data.roomId === roomId){
			$('#joinNumber').text(data.joinNumber);
		}
	}

	// $(document).keydown(function (e) {
 //        var button = e.keyCode;
 //        if(button == 37||button == 38||button == 39||button == 40){
 //            window.location.reload();
 //        }
 //    });




});
