# angularjs-daterangepicker

Impl for [Date Range Picker]


### Installation

```ssh
npm install angularjs-daterangepicker
```

```ssh
bower install angularjs-daterangepicker
```


### Usage

```js
      $scope.options = {
        locale: {cancelLabel: 'Clear'},
        showDropdowns: true
    };

    $scope.startDate = moment();
    $scope.endDate = moment();


```

```html
        <form name="test">
            <div>
                <input date-range-picker="t1"
                       start-date="startDate"
                       end-date="endDate"
                       placeholder="select"
                       data-ng-required="true"
                       date-range-picker-options="options"
                       clear-on-cancel="true"
                       class="form-control">

                <button class="btn btn-default" data-ng-disabled="!test.$valid">Test</button>
            </div>
        </form>
        {{startDate}} - {{endDate}}
```
   [Date Range Picker]: <http://www.daterangepicker.com>
