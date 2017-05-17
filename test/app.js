/**
 * Created by emt on 17.04.2017.
 */


var app = angular.module('app', ['angularjs.daterangepicker']);

app.controller('TestController', function ($scope, $timeout) {

    $scope.options = {
        showDropdowns: true,
        locale: {
            cancelLabel: 'Clear',
            format: 'MM/DD/YYYY'
        }
    };


    $scope.options2 = {
        locale: {cancelLabel: 'Clear'},
        showDropdowns: true
    };

    $scope.startDate2 = moment().startOf('day');
    $scope.endDate2 = moment().endOf('day');
    $scope.testMethod = function () {
        console.dir($scope)
    }

});

