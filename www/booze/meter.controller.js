(function () {
    'use strict';

    angular.module('booze')
        .controller('MeterCtrl', MeterCtrl);

    MeterCtrl.$inject = ['$scope', 'socketService', '$window'];

    function MeterCtrl($scope, socketService, $window) {



        var meter = this;
        var startHeight = 585;

        meter.orientation = {};

        //window.addEventListener("deviceorientation",function(val) {
        //    console.log(val);
        //    meter.orientation = val;
        //});


        socketService.registerCallback(messageReceived);

        function messageReceived(data) {
            $('#rect4384-5')[0].setAttribute('d',composePath((data * 5.58)));
        }

        function composePath (data) {
            return 'm 320,' + (620-data) + ' ' +
            'c -9.07445,0.07891 -39.11956,1.703858 -39,9.499835 ' +
            'l 0,' + data + ' ' +
            'c -0.0299,7.72957 30.60495,9.51173 39,9.49984 8.87795,0.0946 39.09375,-1.87234 39,-9.49984 ' +
            'l 0,-' + data + ' ' +
            'c -0.0729,-7.926124 -30.54171,-9.269804 -39,-9.499835 z';
        }
    }

})();
