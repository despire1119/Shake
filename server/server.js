/**
 * Module dependencies
 */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {'log level':2});

var port = 3200;

app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

/**
 * io
 */
var rooms = {};
function exist(obj, key){
    return obj.hasOwnProperty(key) && (key in obj);
}
// 计算排名

//根据wx_openid获取用户索引
function getUserIndex(arr, user){
    var ret = -1;
    arr.forEach(function(item, index){
        if(item.openid === user.openid){
            ret = index;
        }
    });
    return ret;
}
function getTop(users, num){
    users.sort(function(a, b){
        return b.shaking_num - a.shaking_num;
    });
    return users.slice(0, num);
}
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
console.log('Socket conected!');
io.on('connection', function(socket){
    var addedUser = false;
    var disconnected = false;
    // 进入活动页，创建一个活动
    socket.on('create', function(data){
        var roomId = data.roomId;
        var room = {};
        if(!exist(rooms, roomId)){
            rooms[roomId] = {
                roomId: roomId,
                isEnd: false,
                joinNumber: 0,
                playNumber: 0,
                code: data.code,
                active_code: data.active_code,
                store_sess_id: data.sessId,
                store_act_id: data.actId,
                actInfo: data.actInfo,
                users: []
            };
            console.log('a new room created: ' + roomId, ', current room count: ' + Object.keys(rooms).length);
        }
        room = rooms[roomId];
    });

    // 报名人数
//    socket.on('prejoin', function(data){
//        var roomId = data.roomId;
//        var room;
//        room = rooms[roomId];
//        if(room&&(!room.isEnd)){
//            room.joinNumber += 1;
//            console.log(roomId + '报名人数：' + room.joinNumber);
//            socket.broadcast.emit('prejoin', {
//                roomId: roomId,
//                joinNumber: room.joinNumber
//            });
//        }else{
//            console.log('room unexist');
//        }
//    });



//    //倒计时开始
//    socket.on('countdown', function(data){
//        socket.broadcast.emit('countdown', {
//            roomId: data.roomId
//        });
//        console.log('begin countdown');
//    });

    // 游戏开始
    socket.on('start', function(data){
        console.log('start game');
        var room = rooms[data.roomId];
        var startTime = Date.now();
        room.start_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
        var users = room.users;
        users.forEach(function(item, index, arr){
            item.start_time = startTime;
        });
        socket.broadcast.emit('start', {
            roomId: data.roomId
        });
    });

    // 游戏加入
    socket.on('join', function(data){
        addedUser = true;
        var room = rooms[data.roomId];
        var users;
        if(room&&(!room.isEnd)){
            users = rooms[data.roomId].users;
            if(getUserIndex(users, data)<0){
                data.shaking_time = 0;
                data.end_time = 0;
                data.end = false;
                users.push(data);
                socket.user = data;
                console.log('user '+ data.nickname + ' joined in room ' + data.roomId);
                socket.broadcast.emit('prejoin', {
                    roomId: data.roomId,
                    joinNumber: users.length
                });
            }
        }else{
            console.log('room unexist');
        }
    });

    // 摇动事件
    socket.on('shake', function(data){
        var room = rooms[data.roomId];
        var targetNum = parseInt(room.actInfo.game_shake_num);
        var screenNum = parseInt(room.actInfo.screen_user_num);
        if(!room.isEnd){
            var users = room.users;
            var user = users[getUserIndex(users, data)];
            if(!user.end){
                user.shaking_num = data.shaking_num;
                if(user.shaking_num >= targetNum){
                    user.shaking_num = targetNum;
                    user.end = true;
                    user.end_time = Date.now();
                    user.shaking_time = user.end_time - user.start_time;
                }
                //console.log('user '+user.nickname + ' shaked '+user.shaking_num +' times');
            }
            //console.log(users);

            socket.broadcast.emit('update', {
                roomId: data.roomId,
                screen_user_num: screenNum,
                game_shake_num: targetNum,
                users: getTop(users, screenNum)
            });

        }

    });

    // 当前游戏结束
    socket.on('end', function(data){
        var room = rooms[data.roomId];
        if(!room){
            console.log('room unexist');
            return;
        }
        room.isEnd = true;
        room.end_time = new Date(Date.now() + 20*60*60*1000).Format('yyyy-MM-dd hh:mm:ss');
        console.log('act ' + data.roomId + ' end');
        // 设置结束时间
        var users = room.users;
        users.forEach(function(item, index, arr){
            if(item.end_time === 0){
                item.end_time = Date.now();
                item.shaking_time = item.end_time - item.start_time;
            }
        });
        // 根据摇动时间排序并设置排名
        users.sort(function(a,b){
            return a.shaking_time - b.shaking_time;
        }).forEach(function(item, index, arr){
            item.ranking_num = index + 1;
        });


        socket.emit('force', {
            roomId: data.roomId
        });
    });

    // 结果
    socket.on('result', function(data){
        var roomId = data.roomId;
        var room = rooms[roomId];
        if(!room){
            console.log('room unexist');
            return;
        }
        var users = room.users;
        //var topUsers = getTop(users, room.actInfo.screen_user_num);
        var topUsers = users.slice(0, room.actInfo.screen_user_num);
        var ret = [];
        topUsers.forEach(function(item, index, arr){
            ret.push({
                shaking_time: item.shaking_time,
                shakeing_num: item.shaking_num,
                ranking_num: item.ranking_num,
                openid: item.openid,
                wx_pic: item.wx_pic,
                nickname: item.nickname,
                end: item.end
            });
        });
        socket.emit('result', {
            roomId: roomId,
            screen_user_num: room.actInfo.screen_user_num,
            store_act_id: room.store_act_id,
            active_code: room.active_code,
            code: room.code,
            store_sess_id: room.store_sess_id,
            start_time: room.start_time,
            end_time: room.end_time,
            title: room.actInfo.title,
            users: ret
        });
        socket.broadcast.emit('end', {
            room: room
        });
        // 删除room
        delete room[roomId];
    });

    socket.on('error', function(error){
        console.log(error);
    });

    // disconnect
    socket.on('disconnect', function () {
        disconnected = true;
    });
});

server.listen(port, function () {
    console.info('Server unit ' + process.pid + ' listening on port ' + port);
});
