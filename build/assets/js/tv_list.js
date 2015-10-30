$(function(){

	var code = $.url().param('code');
	// 获取数据
	$.ajax({
		type: 'get',
		url: g.api.getActList + '&code=' + code + '&callback=?',
		async: false,
		dataType: 'jsonp',
		success: function(data){
			renderList(data[0]);
		}
	});
	// var data = [
	// 	{
	// 		id: 1,
	// 		code: 123,
	// 		check_code: 1234,
	// 		active_code: 1111,
	// 		title: '摇一摇',
	// 		ctime: '2015/08/10 - 2015/09/12'
	// 	},
	// 	{
	// 		id: 1,
	// 		code: 123,
	// 		check_code: 1234,
	// 		active_code: 1111,
	// 		title: '摇一摇',
	// 		ctime: '2015/08/10 - 2015/09/12'
	// 	},
	// 	{
	// 		id: 1,
	// 		code: 123,
	// 		check_code: 1234,
	// 		active_code: 1111,
	// 		title: '摇一摇',
	// 		ctime: '2015/08/10 - 2015/09/12'
	// 	},
	// 	{
	// 		id: 1,
	// 		code: 123,
	// 		check_code: 1234,
	// 		active_code: 1111,
	// 		title: '摇一摇',
	// 		ctime: '2015/08/10 - 2015/09/12'
	// 	}
	// ]

	function renderList(data){
		var html = '<li>',
			len = data.length,
			classSelect = '';
		data.forEach(function(item, index, arr){
			if(index === 0){
				classSelect = 'selected';
			}else{
				classSelect = '';
			}
			html += [
				'<div class="game '+classSelect + '" data-id="' + item.id + '" data-captcha="' + item.check_code + '" data-active="' +item.active_code + '">',
				'<b class="l">'+(index+1)+'</b>',
				'<span class="stroke l">'+item.title+'</span>',
				'<strong class="r">'+item.ctime+'</strong>',
				'</div>'
			].join('');
			if(index%5 === 4){
				html += '</li>';
				if(index < len - 1){
					html += '<li>'
				}
			}
		});
		if(len%5 !== 0){
			html += '</li>'
		}
		$('#actList').html(html);
	}
	//renderList(data);

    var $li = $('.list-box li'),
          liWidth = $li.width(),
          liNum = $li.length;
    $('.list-box ul').width(liWidth*liNum);
    var flag = true;
    var layout = 1;
    $(document).keydown(function (e) {
        var button = e.keyCode;
        var selected = $('.selected');
        var parent = selected.parent();
        if (button == 27) {//esc

        }
        if(button == 13){//enter
            if(layout==1){
                 $('.code-mask').show();
                 layout=2;
                 var input = $('.code input');
                 input.focus();
                 input.val('');
            }else if(layout==2){
                var focus = $('.focus');
                if(focus.length&&focus.hasClass('confirm')){
                    var target = $('.selected');
                    var code = target.data('code');
                    var id = target.data('id');
                    var captcha = target.data('captcha');
                    var active = target.data('active');
                    getData(id,captcha,active);
                }
                if(focus.length&&focus.hasClass('cancel')){
                    $('.code-mask').hide();
                    $('.code p').hide();
                    $('.focus').removeClass('focus');
                    layout=1;
                }
            }
        }
        if(button == 37&&flag){//左
            if(layout==1){
                 if(parent.prev().length){
                    flag=false;
                    selected.removeClass('selected')
                    parent.prev().find('.game:first').addClass('selected');
                    $('.list-box ul').animate({"margin-left":"+="+liWidth},500,function(){
                        flag=true;
                    });
                 }
            }else if(layout==2){
                if($('.code input:focus').length){
                }else{
                    $('.focus').removeClass('focus').siblings().addClass('focus')
                }
            }
        }
        if(button == 38&&flag){//上
            if(layout==1){
                if(selected.prev().length){
                    selected.removeClass('selected').prev().addClass('selected');
                }else{
                     if(parent.prev().length){
                        flag=false;
                        selected.removeClass('selected');
                        parent.prev().find('.game:last').addClass('selected');
                        $('.list-box ul').animate({"margin-left":"+="+liWidth},200,function(){
                            flag=true;
                        });
                     }
                }
            }else if(layout==2){
                if($('.code input:focus').length){
                }else{
                     $('.code input').focus();
                     $('.focus').removeClass('focus');
                }
            }
        }
        if(button == 39&&flag){//右
            if(layout==1){
                 if(parent.next().length){
                    flag=false;
                    selected.removeClass('selected')
                    parent.next().find('.game:first').addClass('selected');
                    $('.list-box ul').animate({"margin-left":"-="+liWidth},500,function(){
                        flag=true;
                    });
                 }
            }else if(layout==2){
                if($('.code input:focus').length){
                }else{
                    $('.focus').removeClass('focus').siblings().addClass('focus')
                }
            }
        }
        if(button == 40&&flag){//下
            if(layout==1){
                if(selected.next().length){
                    selected.removeClass('selected').next().addClass('selected');
                }else{
                    selected.removeClass('selected');
                    flag=false;
                     if(parent.next().length){
                        parent.next().find('.game:first').addClass('selected');
                        $('.list-box ul').animate({"margin-left":"-="+liWidth},500,function(){
                            flag=true;
                        });
                     }else{
                        $('.game').eq(0).addClass('selected');
                        $('.list-box ul').animate({"margin-left":"0"},500,function(){
                            flag=true;
                        });
                     }
                }
            }else if(layout==2){
                if($('.code input:focus').length){
                     $('.code input').blur();
                     $('.confirm').addClass('focus');
                     e.preventDefault();
                }else{
                       $('.code input').focus();
                       $('.focus').removeClass('focus');
                }
            }
        }
    });
    //取得当前的门店数据
    function getData(id,captcha, active){

        //校验
        var inputValue = $('#captcha').val();
        if(inputValue == captcha){ //校验成功
        	// 后端验证
        	$.ajax({
				type: 'get',
				url: g.api.verifyAct + '&id=' + id + '&code=' + code + '&check_code=' + inputValue + '&callback=?',
				async: false,
				dataType: 'jsonp',
				success: function(data){
					if(data.start === 1){
						window.location.href = g.tvEntranceUrl + '?code='+code+'&id='+id+'&active_code='+active;
					}else{
						$('.code p').show();
					}
				}
			});
			//window.location.href = g.tvEntranceUrl + '?code='+code+'&id='+id+'&active_code='+active;
        }else{ //校验失败
            $('.code p').show();
        }
    }

})
