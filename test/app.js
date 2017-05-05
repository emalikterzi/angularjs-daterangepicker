/**
 * Created by emt on 17.04.2017.
 */


var app = angular.module('app', ['angularjs.daterangepicker']);

app.controller('TestController', function ($scope, $timeout) {

    $scope.options = {
        singleDatePicker: true,
        locale: {cancelLabel: 'Clear'},
        showDropdowns: true
    };


    $scope.options2 = {
        locale: {cancelLabel: 'Clear'},
        showDropdowns: true
    };

    $scope.startDate2= moment();
    $scope.endDate2= moment();

    $scope.testMethod = function () {
        console.dir($scope)
    }

});

