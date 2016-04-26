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

    function roundStep(value, precision, step, floor) {
      var remainder = (value - floor) % step;
      var steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;
      var decimals = Math.pow(10, precision);
      var roundedValue = steppedValue * decimals / decimals;
      return parseFloat(roundedValue.toFixed(precision));
    }

    function offset(element, position) {
      return element.css({
        left: position
      });
    }

    function pixelize(position) {
      return position + "px";
    }

    function contain(value) {
      if (isNaN(value)) return value;
      return Math.min(Math.max(0, value), 100);
    }

    return {

      restrict: 'EA',

      scope: {
        floor       : '=?',
        ceiling     : '=?',
        step        : '@',
        highlight   : '@',
        precision   : '@',
        buffer      : '@',
        dragstop    : '@',
        ngModel     : '=?',
        ngModelLow  : '=?',
        ngModelHigh : '=?'
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

        var low, high;
        if (currentMode === modes.single) {
          low = 'ngModel';
          highPointer.remove();
          highBubble.remove();
        } else {
          low = 'ngModelLow';
          high = 'ngModelHigh';
        }

        scope.local = {};
        scope.local[low] = scope[low];
        scope.local[high] = scope[high];

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

        var updateCalculations = function() {

          if (scope.step === undefined) scope.step = 1;
          if (scope.floor === undefined) scope.floor = 0;
          if (scope.ceiling === undefined) scope.ceiling = 100; //TODO: Make this more intelligent
          if (scope.precision === undefined) scope.precision = 0;

          if (currentMode === modes.single) {
            scope.ngModelLow = scope.ngModel;
          }

          scope.local[low] = scope[low];
          scope.local[high] = scope[high];

          scope.floor = roundStep(parseFloat(scope.floor), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
          scope.ceiling = roundStep(parseFloat(scope.ceiling), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));

          if (currentMode === modes.range) {
            scope.ngModelLow = roundStep(parseFloat(scope.ngModelLow), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
            scope.ngModelHigh = roundStep(parseFloat(scope.ngModelHigh), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
          } else {
            scope.ngModel = roundStep(parseFloat(scope.ngModel), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
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

        var updateDOM = function () {
          updateCalculations();

          var percentOffset = function (offset) {
            return contain(((offset - minOffset) / offsetRange) * 100);
          };

          var percentValue = function (value) {
            return contain(((value - minValue) / valueRange) * 100);
          };

          var pixelsToOffset = function (percent) {
            return pixelize(percent * offsetRange / 100);
          };

          var setPointers = function () {
            offset(ceilBubble, pixelize(barWidth - ceilBubble[0].offsetWidth));

            var newLowValue, newHighValue;
            newLowValue = percentValue(scope.local[low]);
            offset(lowPointer, pixelsToOffset(newLowValue));
            offset(lowBubble, pixelize(lowPointer[0].offsetLeft - (lowBubble[0].offsetWidth / 2) + handleHalfWidth));
            offset(highlight, pixelize(lowPointer[0].offsetLeft + handleHalfWidth));

            if (currentMode === modes.range) {
              newHighValue = percentValue(scope.local[high]);
              offset(highPointer, pixelsToOffset(newHighValue));
              offset(highBubble, pixelize(highPointer[0].offsetLeft - (highBubble[0].offsetWidth / 2) + handleHalfWidth));

              highlight.css({
                width: pixelsToOffset(newHighValue - newLowValue)
              });

            } else if (scope.highlight === 'right') {

              highlight.css({
                width: pixelsToOffset(110 - newLowValue)
              });

            }
            else if (scope.highlight === 'left') {

              highlight.css({
                width: pixelsToOffset(newLowValue)
              });

              offset(highlight, 0);
            }

          };

          var bind = function (handle, bubble, ref, events) {

            var currentRef = ref;

            var onEnd = function () {
              bubble.removeClass('active');
              handle.removeClass('active');
              ngDocument.unbind(events.move);
              ngDocument.unbind(events.end);
              if (scope.dragstop) {
                scope[high] = scope.local[high];
                scope[low] = scope.local[low];
              }
              currentRef = ref;
              scope.$apply();
            };

            var onMove = function (event) {

              // Suss out which event type we are capturing and get the x value
              var eventX = 0;
              if (event.clientX !== undefined) {
                eventX = event.clientX;
              }
              else if ( event.touches !== undefined && event.touches.length) {
                eventX = event.touches[0].clientX;
              }
              else if ( event.originalEvent !== undefined &&
                        event.originalEvent.changedTouches !== undefined &&
                        event.originalEvent.changedTouches.length) {
                eventX = event.originalEvent.changedTouches[0].clientX;
              }

              var newOffset = Math.max(Math.min((eventX - element[0].getBoundingClientRect().left - handleHalfWidth), maxOffset), minOffset),
                  newPercent = percentOffset(newOffset),
                  newValue = minValue + (valueRange * newPercent / 100.0);

              if (currentMode === modes.range) {
                switch (currentRef) {
                  case low:
                    if (newValue > scope.local[high]) {
                      currentRef = high;
                      lowPointer.removeClass('active');
                      lowBubble.removeClass('active');
                      highPointer.addClass('active');
                      highBubble.addClass('active');
                      setPointers();
                    } else if (scope.buffer > 0) {
                      newValue = Math.min(newValue, scope.local[high] - scope.buffer);
                    }
                    break;
                  case high:
                    if (newValue < scope.local[low]) {
                      currentRef = low;
                      highPointer.removeClass('active');
                      highBubble.removeClass('active');
                      lowPointer.addClass('active');
                      lowBubble.addClass('active');
                      setPointers();
                    } else if (scope.buffer > 0) {
                      newValue = Math.max(newValue, parseInt(scope.local[low]) + parseInt(scope.buffer));
                    }
                }
              }

              newValue = roundStep(newValue, parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
              scope.local[currentRef] = newValue;

              if (!scope.dragstop) {
                scope[currentRef] = newValue;
              }

              setPointers();
              scope.$apply();
            };

            var onStart = function (event) {
              updateCalculations();
              bubble.addClass('active');
              handle.addClass('active');
              setPointers();
              event.stopPropagation();
              event.preventDefault();
              ngDocument.bind(events.move, onMove);
              return ngDocument.bind(events.end, onEnd);
            };

            handle.bind(events.start, onStart);
          };

          var setBindings = function () {
            var method, i;
            var inputTypes = ['touch', 'mouse'];
            for (i = 0; i < inputTypes.length; i++) {
              method = inputTypes[i];

              if (currentMode === modes.range) {
                bind(lowPointer, lowBubble, low, events[method]);
                bind(highPointer, highBubble, high, events[method]);
              } else {
                bind(lowPointer, lowBubble, low, events[method]);
              }
            }

            bindingsSet = true;
          };

          if (!bindingsSet) {
            setBindings();
          }

          setPointers();
        };

        // Watch Models based on mode
        scope.$watch(low, updateDOM);

        if (currentMode === modes.range) {
          scope.$watch(high, updateDOM);
        }

        window.addEventListener('resize', updateDOM);
      },

      template :  '<div class="bar"><div class="selection"></div></div>' +
                  '<div class="handle low"></div>' +
                  '<div class="handle high"></div>' +
                  '<div class="bubble limit low">{{ floor }}</div>' +
                  '<div class="bubble limit high">{{ ceiling }}</div>' +
                  '<div class="bubble value low">{{ ngModelLow }}</div>' +
                  '<div class="bubble value high">{{ ngModelHigh }}</div>'

    }

  }]);


  return module;
}));
