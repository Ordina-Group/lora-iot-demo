(function () {
    'use strict';

    angular.module('booze')
        .controller('MeterCtrl', MeterCtrl);

    MeterCtrl.$inject = ['$scope', 'socketService', '$window'];

    function MeterCtrl($scope, socketService, $window) {


        var meter = this,
            fullHeight = 558;
        //meter.orientation = [0, 0, 0];
        //
        //window.addEventListener("deviceorientation", function (val) {
        //    if (tresholdReached()) {
        //        //console.log('x', val.alpha>0 ? val.alpha : 360+val.alpha);
        //        //console.log('y', val.beta>0 ? val.beta : 360+val.beta);
        //        console.log('z', val.gamma>0 ? 'left' : 'right');
        //
        //        //meter.orientation[0] = val.alpha;
        //        //meter.orientation[1] = val.beta;
        //        meter.orientation[2] = val.gamma;
        //    }
        //
        //    function tresholdReached() {
        //        //if (Math.abs(meter.orientation[0]-val.alpha) > 1) {
        //        //    return true;
        //        //}
        //        //if (Math.abs(meter.orientation[1]-val.beta) > 1) {
        //        //    return true;
        //        //}
        //        if (Math.abs(meter.orientation[2]-val.gamma) > 1) {
        //            return true;
        //        }
        //        return false;
        //    }
        //});


        socketService.registerCallback(messageReceived);

        function messageReceived(data) {
            $('#rect4384-5')[0].setAttribute('d', composePath((data * (558/100))));
        }

        function composePath(data) {
            var topLeftX = 0,
                topLeftY = 0,
                topRightX = 78,
                topRightY = 0,
                bezierPoint1X = 10,
                bezierPoint1Y = 15,
                bezierPoint2X = 76,
                bezierPoint2Y = 11;

            return 'm 281,73 0,558.436651 ' +
                'c 10,15 ' +
                '76,11 ' +
                '78,0 '+
                'l '+topLeftX+',-' + (topLeftY+data) + ' ' +
                'c -'+bezierPoint1X+',-'+bezierPoint1Y+' ' +
                '-'+bezierPoint2X+',-'+bezierPoint2Y+' ' +
                '-'+topRightX+','+topRightY+' z'
        }
    }

})();
