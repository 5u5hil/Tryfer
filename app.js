var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var users = {};

app.get("/", function (req, res) {
    res.send('hello world!');
});




io.on('connection', function (socket) {

    socket.on('chat message', function (msg) {
        io.emit('chat message', {msg: msg, user: socket.nickname});
    });

    socket.on('new user', function (nickname, callback) {
        if (nickname in users) {
            callback(false);
        } else {
            socket.nickname = nickname;
            users[socket.nickname] = nickname;
            updateUsers();
            callback(true);
        }
    });

    socket.on('disconnect', function (data) {
        if (!socket.nickname)
            return true;
        delete users[socket.nickname];
        updateUsers();
    });

    function updateUsers() {
        io.emit('users', Object.keys(users));
    }
});

http.listen(3000, getIPAddress(), function () {

    console.log(getIPAddress());
});


function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }

    return '0.0.0.0';
}

