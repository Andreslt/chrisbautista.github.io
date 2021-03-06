'use strict';

var tmPromise, myApp = angular.module('cbTimer', []);

/**
 * @ngservice initService
 * @param $rootScope
 */
myApp.service('initService', function () {

  //initialize schedule list
  this.timeSchedule = {
    history: []
  };

});

/**
 *  @ngcontroller cbTimerCtrl
 *  @params  $scope, $timeout, $initService
 *  handle toggling between modes, and binding data
 */
myApp.controller('cbTimerCtrl', ['$scope', '$timeout', 'initService', function ($scope, $timeout, initService) {

  var timeStart = 0, timeEnd = 0;
  $scope.timeSchedule = initService.timeSchedule;
  $scope.mode = "Start";
  $scope.timer = "00:00:00";


  function checkTime(i) {
    i = (i < 1) ? 0 : i;
    if (i < 10) { i = "0" + i; }  // add zero in front of numbers < 10
    return i;
  }

  function setMode() {
    $scope.mode === "Stop" ? "Stop" : "Start";
  }

  /**
  *  @func startTimer
  *  trigger timer to start,
  *  recursive, call again when timer expires
  */
  function startTimer() {
    // toggle
    setMode();

    var h, m, s, ms, today = new Date();
    // compute for the duration,
    // normalize for the user
    timeEnd = today.getTime();
    ms = Math.floor((timeEnd - timeStart) / 1000);
    h =  checkTime(Math.floor(ms / 3600));
    ms = Math.floor(ms % 3600);
    m = checkTime(Math.floor(ms / 60));
    ms = Math.floor(ms % 60);
    s = checkTime(Math.floor(ms));
    // normalize time string
    $scope.timer = h + ":" + m + ":" + s;

    // timer expired, restart timer
    tmPromise = $timeout(function () {
      startTimer();
    }, 500);
  }

  /**
   * @func stopTimer
   * handle end of timer
   */
  function stopTimer() {
    // toggle
    setMode();

    // stop timeout service
    $timeout.cancel(tmPromise);

    // add to history
    $scope.timeSchedule.history.push([timeStart,
                                      timeEnd,
                                      (timeEnd - timeStart) / 1000]);
  }

  /***  @func $scope.toggleTimer
   *  toggle between modes
   */
  $scope.toggleTimer = function () {

    // handle modes
    if ($scope.mode === 'Start') {
      var today = new Date();
      timeStart = today.getTime();
      startTimer();
    } else {
      stopTimer();
    }

  };


}]);
