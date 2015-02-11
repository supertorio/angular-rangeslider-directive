angular-range-slider
==============

Stylable Range Slider Control directive for Angular with no jQuery or browser dependencies.
Does not use the input range type. Allows for binding to model data.

### Example:

    <ul>
        <li ng-repeat="item in items">
            <p>Name: {{item.name}}</p>
            <p>Cost: {{item.cost}}</p>
            <slider floor="100" ceiling="1000" step="50" precision="2" ng-model="item.cost"></slider>
        </li>
    </ul>

### Range:

    <ul>
        <li ng-repeat="position in positions">
            <p>Name: {{position.name}}</p>
            <p>Minimum Age: {{position.minAge}}</p>
            <p>Maximum Age: {{position.maxAge}}</p>
            <slider floor="10" ceiling="60" ng-model-low="position.minAge" ng-model-high="position.maxAge"></slider>
        </li>
    </ul>

### Usage:



### Known issues:




### License: MIT
