'use strict';


var app = angular.module('app', ['angularRangeSlider']);

app.controller('AppController',['$scope', function($s) {
	$s.isDisabled = true;
  $s.items = [{
      name  : 'First Item',
      value : 500
    },
    {
      name  : 'Second Item',
      value : 200
    },
    {
      name  : 'Third Item',
      value : 700
    },
	  {
      name  : 'First Disabled Item',
      value : 300
    },
    {
      name  : 'Second Disabled Item',
      value : 600
    }];

	$s.change = function(){
		$s.isDisabled = !$s.isDisabled;
	}
}]);
