(function () {
    'use strict';

    angular
        .module('booze')
        .service("socketService", socketService);

    socketService.$inject = ['$interval'];

    function socketService($interval) {

        //Internal variables.
        var nodeSocket = null;
        var callbacks = [];

        //Kick things into gear!
        connectToWebsocket();

        this.sendJSONMessage = function (jsonMessage) {
            nodeSocket.send(JSON.stringify(jsonMessage));
        };

        this.registerCallback = function (callback) {
            callbacks.push(callback);
        };

        function connectToWebsocket() {
            //nodeSocket = new WebSocket("ws://localhost:8081");
            //
            ////Wait for the socket connection to be established before doing anything else socket related!
            //nodeSocket.onopen = function (event) {
            //    console.log("Connection to web socket established!");
            //
            //    nodeSocket.onmessage = function (event) {
            //        console.log("Received message from web socket:" + event.data);
            //        var data = JSON.parse(event.data);
            //
            //        for(var i = 0; i < callbacks.length; i++) {
            //            callbacks[i](data);
            //        }
            //    }
            //};

            var height = 100;

            $interval(function(){
                height!==0? height -= 25 : height = 100;

                callbacks.forEach(function(cb){
                    cb(height)
                });
            },2000);
        }
    }

})();