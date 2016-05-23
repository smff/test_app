'use strict';

//got routing and dataProvider (DB) and configure it
var calendarApp = angular.module('calendarApp', ['ngRoute', 'dataProvider'])
  .config(function ($routeProvider, dataProviderProvider) {

    //trying differ way to show content
    $routeProvider
      .when('/', {
        templateUrl: 'app/templates/day.html',
        controller: 'DayController'
      })
      .when('/week', {
        template: 'Week from template in config',
        controller: 'WeekController'
      })
      .when('/month', {
        template: '<month></month>',
        controller: 'MonthController'
      });

    //choose indexedDB and set db_name and version of DB
    dataProviderProvider
      .setProvider('IndexedDBProvider', {
        version: 1,
        db_name: 'my_first_angularjs_app'
      });

  });