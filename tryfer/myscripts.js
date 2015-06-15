$(document).foundation();

var app = angular.module('tryfer', [])

app.factory('socket', function () {
    var socket = io('http://192.168.0.103:3000');
    return socket;
});

app.controller('chat', function ($scope, socket) {
    $scope.msgs = [];
    $scope.users = [];


    $scope.sendMsg = function () {
        socket.emit('chat message', $scope.msg.text);
        $scope.msg.text = '';
    }

    $scope.saveNickname = function () {
        socket.emit('new user', $scope.nickname, function (data) {
            if (!data) {
                alert('This Nickname is Already Taken')
            } else {

            }
        });
        $scope.nickname = '';
    }

    socket.on('chat message', function (msg) {
        $scope.msgs.push(msg);
        $scope.$digest();
    });

    socket.on('users', function (nicknames) {
        console.log(nicknames);
        $scope.users = nicknames;
        $scope.$digest();
    });
});