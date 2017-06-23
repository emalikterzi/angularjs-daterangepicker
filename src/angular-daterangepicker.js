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
            scope: {
                dateRangePickerOptions: '=',
                startDate: '=',
                endDate: '=?',
                minDate: '=?',
                maxDate: '=?',
                closeOnClear: '=?',
                onChange: '&',
                clearOnCancel: '@'
            },
            compile: function ($el, $attr) {
                var baseElementClone = $el.clone();
                return function ($scope, $element, $attr) {

                    var baseOptions = {},
                        currentApiElement = undefined,
                        currentApi = undefined,
                        dpApi = undefined,
                        watchList = ['startDate', 'endDate', 'minDate', 'maxDate'],
                        isDataFound = false;

                    if ($scope.dateRangePickerOptions) {
                        for (var key in $scope.dateRangePickerOptions) {
                            if (available_options.indexOf(key) >= 0) {
                                baseOptions[key] = $scope.dateRangePickerOptions[key];
                            }
                        }
                    }

                    if (baseOptions['singleDatePicker']) {
                        if ($scope['startDate']) {
                            isDataFound = true;
                        }
                    } else {
                        if ($scope['startDate'] && $scope['endDate']) {
                            isDataFound = true;
                        }
                    }

                    $scope.$on('$destroy', function () {
                        currentApiElement.remove();
                        currentApi.destroy();
                    });

                    function initElement() {
                        createElement();
                        createController();
                        openListener();
                    }

                    function openListener() {
                        $scope.$watchGroup(watchList, function (n) {
                                if (n && n.length > 0) {

                                    var startDate = n[0],
                                        endDate = n[1],
                                        minDate = n[2],
                                        maxDate = n[3];

                                    if (minDate)
                                        dpApi.setMinDate(minDate);

                                    if (maxDate)
                                        dpApi.setMaxDate(maxDate);

                                    if (startDate)
                                        dpApi.setStartDate(startDate);

                                    if (endDate)
                                        dpApi.setEndDate(endDate);

                                }
                            }
                        );
                    }

                    function createElement() {
                        var tempOptions = angular.copy(baseOptions);
                        tempOptions['startDate'] = $scope.startDate;
                        tempOptions['endDate'] = $scope.endDate;
                        currentApiElement = $(baseElementClone).daterangepicker(tempOptions);
                        $element.replaceWith(currentApiElement);

                        if (!isDataFound) {
                            $(currentApiElement).val('');
                        }
                    }

                    function createController() {
                        currentApi = new DateRangePickerApi(currentApiElement, $scope, baseOptions);
                        currentApi.init();
                        dpApi = currentApi.build();
                    }

                    initElement();
                }
            }
        }
    }

    var applyEvent = 'apply.daterangepicker';
    var cancelEvent = 'cancel.daterangepicker';
    var hideEvent = 'hide.daterangepicker';

    function DateRangePickerApi(e, s, o) {
        this.el = e;
        this.$scope = s;
        this.options = o;
    }

    DateRangePickerApi.prototype.build = function () {
        var self = this;
        return {
            setMinDate: function (x) {
                self.el.data('daterangepicker').minDate = x;
                self.el.data('daterangepicker').updateView();
                self.el.data('daterangepicker').updateCalendars();

                if (self.$scope.startDate
                    && self.$scope.startDate.isBefore(x)) {
                    self.$scope.startDate = x;
                }

                if (self.$scope.endDate
                    && self.$scope.endDate.isBefore(x)) {
                    self.$scope.endDate = x;
                }
            },
            setMaxDate: function (x) {
                self.el.data('daterangepicker').maxDate = x;
                self.el.data('daterangepicker').updateView();
                self.el.data('daterangepicker').updateCalendars();

                if (self.$scope.startDate
                    && self.$scope.startDate.isAfter(x)) {
                    self.$scope.startDate = null;
                }

                if (self.$scope.endDate
                    && self.$scope.endDate.isAfter(x)) {
                    self.$scope.endDate = null;
                }
                self.clearInput();
            },
            setStartDate: function (x) {
                self.el.data('daterangepicker').setStartDate(x);
            },
            setEndDate: function (x) {
                self.el.data('daterangepicker').setEndDate(x);
            },
            isSingle: function () {
                self.el.data('daterangepicker')['singleDatePicker'];
            },
            show: function () {
                self.el.data('daterangepicker').show();
            },
            hide: function () {
                self.el.data('daterangepicker').hide();
            }
        }
    };

    DateRangePickerApi.prototype.onApply = function (event, api) {
        var self = this;
        if (self.isSingle()) {
            self.$scope.$apply(function () {
                self.$scope.startDate = api.startDate;
                self.$scope.endDate = api.startDate;
            });

        } else {
            self.$scope.$apply(function () {
                self.$scope.startDate = api.startDate;
                self.$scope.endDate = api.endDate;
            });
        }
        this.$scope.$apply(function () {
            if (self.$scope.onChange)
                self.$scope.onChange();
        });

    };

    DateRangePickerApi.prototype.onCancel = function (event, api) {
        var self = this;
        if (self.$scope.clearOnCancel) {
            self.$scope.$apply(function () {
                self.$scope.startDate = null;
                self.$scope.endDate = null;

                self.clearInput();
                try {
                    if (this.$scope.onChange)
                        this.$scope.onChange();
                } catch (e) {
                    throw e;
                } finally {
                    if (!this.$scope.closeOnClear)
                        api.show();
                }

            });

        } else {
            if (!this.$scope.closeOnClear)
                api.show();
        }
    };

    DateRangePickerApi.prototype.onHide = function (event, api) {
        var self = this;
        setInterval(function () {
            if (self.isSingle()) {
                if (!self.$scope.startDate)
                    self.clearInput();
            } else {
                if (!self.$scope.startDate && !self.$scope.endDate)
                    self.clearInput();
            }
        })

    };

    DateRangePickerApi.prototype.clearInput = function () {
        $(this.el).val('');
    };

    DateRangePickerApi.prototype.isSingle = function () {
        return this.options['singleDatePicker'];
    };

    DateRangePickerApi.prototype.init = function () {
        var self = this;
        this.el.on(applyEvent, function (event, api) {
            self.onApply(event, api);
        });
        this.el.on(cancelEvent, function (event, api) {
            self.onCancel(event, api);
        });
        this.el.on(hideEvent, function (event, api) {
            self.onHide(event, api);
        });
    };


    DateRangePickerApi.prototype.destroy = function () {
        this.el.off(applyEvent);
        this.el.off(cancelEvent);
        this.el.off(hideEvent);
    };

})
(jQuery, moment);
