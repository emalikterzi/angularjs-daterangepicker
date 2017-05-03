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

    $scope.startDate = moment();
    $scope.endDate = moment();

    $scope.testMethod = function () {
        console.log('here')
    }
});

