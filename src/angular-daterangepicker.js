/**
 * Created by emt on 17.04.2017.
 */
(function ($, moment) {
    if (!$ || !moment)
        throw 'Jquery and moment lib must be loaded first';

    var available_options = ['minDate', 'maxDate', 'dateLimit', 'showDropdowns',
        'showWeekNumbers', 'showISOWeekNumbers', 'timePicker', 'timePickerIncrement', 'timePicker24Hour', 'timePickerSeconds',
        'ranges', 'showCustomRangeLabel', 'alwaysShowCalendars', 'opens', 'drops', 'buttonClasses', 'applyClass', 'cancelClass',
        'locale', 'singleDatePicker', 'autoApply', 'linkedCalendars', 'isInvalidDate', 'isCustomDate', 'autoUpdateInput', 'parentEl'
    ];

    angular.module('angularjs.daterangepicker', []);

    angular.module('angularjs.daterangepicker')
        .directive('dateRangePicker', dateRangePicker);

    function dateRangePicker() {
        return {
            restrict: 'A',
            require: '^form',
            scope: {
                dateRangePicker: '=',
                dateRangePickerOptions: '=',
                minDate: '=',
                maxDate: '=',
                startDate: '=',
                endDate: '=',
                onChange: '&',
                clearOnCancel: '@',
                ngRequired: '@'
            },
            link: link
        }
    }

    function Controller(s, o, c, r) {
        this.$scope = s;
        this.options = o;
        this.formController = c;
        this.required = r;
        this.el;
    }

    Controller.prototype.onChange = function (startDate, endDate) {
        if (this.options['singleDatePicker']) {
            this.setStartDateScope(startDate);
            this.setValidity(true);
        } else {
            this.setStartDateScope(startDate);
            this.setEndDateScope(endDate);
            this.setValidity(true);
        }
    };

    Controller.prototype.setValidity = function (flag) {
        if (this.required)
            this.formController.$setValidity('date-range-picker', flag);
    };

    Controller.prototype.setStartDateScope = function (startDate) {
        if (startDate) {
            this.$scope['startDate'] = startDate;
        }
    };

    Controller.prototype.setEndDateScope = function (endDate) {
        if (endDate && !this.options['singleDatePicker']) {
            this.$scope['endDate'] = endDate;
        }
    };

    Controller.prototype.setElement = function (x) {
        this.el = x;
    };

    Controller.prototype.onWatch = function (newValue) {
        if (newValue && newValue.length > 0) {
            var startDate = newValue[0],
                endDate = newValue[1];
            this.setStartDate(startDate);
            this.setEndDate(endDate);
            if (this.options['singleDatePicker']) {
                if (!startDate) {
                    this.$scope.startDate = null;
                    this.$scope.endDate = null;
                    $(this.el).val('');
                }
            } else {
                if (!startDate || !endDate) {
                    this.$scope.startDate = null;
                    this.$scope.endDate = null;
                    $(this.el).val('');
                }
            }
            this.validate();

        }
    };
    Controller.prototype.validate = function () {
        if (this.options['singleDatePicker'] && this.$scope.startDate) {
            this.setValidity(true);
        } else if (!this.options['singleDatePicker'] && this.$scope.startDate && this.$scope.endDate) {
            this.setValidity(true);
        } else {
            this.setValidity(false);
        }
    };

    Controller.prototype.setEndDate = function (startDate) {
        if (startDate) {
            this.el.data('daterangepicker').setEndDate(startDate);
        }
    };

    Controller.prototype.setStartDate = function (endDate) {
        if (endDate && this.options['singleDatePicker']) {
            this.el.data('daterangepicker').setStartDate(endDate);
        }
    };

    function link($scope, $element, $attr, ctrl) {

        var options = {};
        var watchList = ['startDate', 'endDate', 'minDate', 'maxDate'];

        if ($scope.dateRangePickerOptions) {
            for (var key in $scope.dateRangePickerOptions) {
                if (available_options.indexOf(key) >= 0) {
                    options[key] = $scope.dateRangePickerOptions[key];
                }
            }
        }

        function init() {
            var instance = new Controller($scope, options, ctrl, $scope.ngRequired),
                el = $($element).daterangepicker(options, function () {
                    var drpCbArgs = arguments;
                    $scope.$apply(function () {
                        instance.onChange.apply(instance, drpCbArgs)
                    })
                    if($scope.onChange)
                        $scope.onChange()
                });
            instance.setElement(el);
            $scope.$watchGroup(watchList, function (n) {
                instance.onWatch(n)
            });


            $($element).on('hide.daterangepicker',
                function () {
                    if (options['singleDatePicker']
                        && !$scope.startDate) {
                        $($element).val('');
                    }
                    if (!options['singleDatePicker']
                        && !$scope.startDate
                        && !$scope.endDate) {
                        $($element).val('');
                    }
                });

            if ($scope.clearOnCancel)
                $($element).on('cancel.daterangepicker',
                    function (ev, picker) {
                        $($element).val('');
                        $scope.$apply(function () {
                            $scope.startDate = null;
                            $scope.endDate = null;
                            instance.setValidity(false);
                        })
                    });
            $element.val('');
            instance.setValidity(false);
        }

        init();
    }
})(jQuery, moment);
