/**
 * Created by emt on 17.04.2017.
 */


var app = angular.module('app', ['angularjs.daterangepicker']);

app.controller('TestController', function ($scope, $timeout) {

    $scope.options = {
        locale: {cancelLabel: 'Clear'},
        showDropdowns: true,
        // singleDatePicker:true
    };

    // $scope.startDate = moment();
    // $scope.endDate = moment();

    $scope.onChange = function () {
        console.dir($scope);
    }

});

