angular-rangeslider-directive
==============

Styleable Range Slider Control directive for Angular with no jQuery or browser dependencies.
Does not use the input range type. Allows for binding to model data.

## Usage

    angular
        .module('app', ['angularRangeSlider'])
        .controller('AppController', function($scope) {
            $scope.sliderValue = 200;
            $scope.lowerValue = 400;
            $scope.upperValue = 600;
        });

### Single Item Example:

    <p>Value: {{sliderValue}}</p>
    <div range-slider
         floor="100"
         ceiling="1000"
         step="50"
         precision="2"
         highlight="left"
         ng-model="sliderValue"></div>

### Range:

    <p>Lower Value: {{lowerValue}}</p>
    <p>Value 2: {{upperValue}}</p>
    <div range-slider
         floor="100"
         ceiling="1000"
         dragstop="true"
         ng-model-low="lowerValue"
         ng-model-high="upperValue"></div>

## Properties:

* __floor__ `{number}` Minimum Value for Slider
* __ceiling__ `{number}` Maximum Value for Slider
* __step__ `{number}` Value between steps in snapping on the scale
* __highlight__ `{string}` Left, Right, or false for single handle selectors, true or false for range selectors
* __precision__ `{number}` Maximum Value for Slider
* __dragstop__ `{boolean}` True will not update bound model data until mouse up
* __ngModel__ `{number}` Bound value for a single handle slider
* __ngModelLow__ `{number}` Bound value for lower limit of range selection
* __ngModelHigh__ `{number}` Bound value for upper limit of range selection
* __disabled__ `{boolean}` Bound value for disable element


### License: MIT
