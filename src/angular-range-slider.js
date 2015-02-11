/*
 angular-range-slider v0.0.1
 https://github.com/supertorio/angular-range-slider
 */
(function(angular, factory) {
  if (typeof define === 'function' && define.amd) {
    define('angular-range-slider', ['angular'], function(angular) {
      return factory(angular);
    });
  } else {
    return factory(angular);
  }
}(typeof angular === 'undefined' ? null : angular, function(angular) {

  var module = angular.module('angularRangeSlider', []);

  'use strict';


  module.directive('rangeSlider', ['$timeout', function($timeout){

    var modes = {
      single  : 'SINGLE',
      range   : 'RANGE'
    };

    var events = {
      mouse: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
      },
      touch: {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
      }
    };

    return {

      restrict: 'EA',

      scope: {
        floor       : '@',
        ceiling     : '@',
        values      : '=?',
        step        : '@',
        highlight   : '@',
        precision   : '@',
        buffer      : '@',
        dragstop    : '@',
        ngModel     : '=',
        ngModelLow  : '=?',
        ngModelHigh : '='
      },

      link : function(scope, element, attrs) {

        element.addClass('angular-range-slider');

        var currentMode = (attrs.ngModel == null) && (attrs.ngModelLow != null) && (attrs.ngModelHigh != null) ? modes.range : modes.single;

        // Dom Components
        var children = element.children();
        var bar         = angular.element(children[0]),
            lowPointer  = angular.element(children[1]),
            highPointer = angular.element(children[2]),
            floorBubble = angular.element(children[3]),
            ceilBubble  = angular.element(children[4]),
            lowBubble   = angular.element(children[5]),
            highBubble  = angular.element(children[6]),
            highlight   = angular.element(bar.children()[0]),
            ngDocument  = angular.element(document);

        // Control Dimensions Used for Calculations
        var handleHalfWidth = 0,
            barWidth = 0,
            minOffset = 0,
            maxOffset = 0,
            minValue = 0,
            maxValue = 0,
            valueRange = 0,
            offsetRange = 0;

        var bindingsSet = false;

        var updateCaculations = function() {

          if (scope.step === null) scope.step = 1;
          if (scope.floor === null) scope.floor = 0;
          if (scope.precision === null) scope.precision = 0;

          if (currentMode === modes.single) {
            scope.ngModelLow = scope.ngModel;
          }

          //TODO Investigate this scope.values attr
          if (scope.values !== null && scope.values.length && scope.ceiling === null) {
            scope.ceiling = scope.values.length - 1;
          }

          handleHalfWidth = lowPointer[0].offsetWidth / 2;
          barWidth = bar[0].offsetWidth;
          minOffset = 0;
          maxOffset = barWidth - lowPointer[0].offsetWidth;
          minValue = parseFloat(scope.floor);
          maxValue = parseFloat(scope.ceiling);
          valueRange = maxValue - minValue;
          offsetRange = maxOffset - minOffset;
        };



      },

      template :  '<div class="bar"><div class="selection"></div></div>' +
                  '<div class="handle low"></div>' +
                  '<div class="handle high"></div>' +
                  '<div class="bubble limit low">{{ values.length ? values[floor || 0] : floor }}</div>' +
                  '<div class="bubble limit high">{{ values.length ? values[ceiling || values.length - 1] : ceiling }}</div>' +
                  '<div class="bubble value low">{{ values.length ? values[local.ngModelLow || local.ngModel || 0] : local.ngModelLow || local.ngModel || 0 }}</div>' +
                  '<div class="bubble value high">{{ values.length ? values[local.ngModelHigh] : local.ngModelHigh }}</div>'

    }

  }]);


  return module;
}));
