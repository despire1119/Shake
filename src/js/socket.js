// socket helper
// require jQuery, Socket.io
;(function(window, io){
    //var host = 'http://fed.suning.com';
    //var host = 'http://fedsit.cnsuning.com';
    //var host = 'http://10.25.31.197:3200';
    var socket = io.connect(g.socketHost, {
        reconnection: true,
        reconnectionAttempts: 10
    });


    socket.on('reconnect_error', function(){
        console.log('connect error, try again.');
    });
    socket.on('reconnect_failed', function(){
        console.log('connect failed!');
    });
    socket.on('connect_error', function(error){
        console.log(error);
    });

    window.socket = socket;

})(window, io);