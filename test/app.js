/**
 * Created by emt on 17.04.2017.
 */


var app = angular.module('app', ['angularjs.daterangepicker']);

app.controller('TestController', function ($scope, $timeout) {

    $scope.options = {
        // singleDatePicker:true,
        locale: {cancelLabel: 'Clear'},
        showDropdowns: true
    };

    // $timeout(function () {
    $scope.startDate = moment();
    $scope.endDate = moment().subtract(1, 'd');
    // }, 2000)


    $scope.testMethod = function () {
        console.log('here')
    }
});

