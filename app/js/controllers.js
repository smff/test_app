/**
 * Created by dima on 12.05.16.
 */
'use strict';

/* Controllers */

calendarApp
  .controller('DayController', ['$scope', function ($scope) {

  }])
  .controller('WeekController', ['$scope', 'dataProvider', function ($scope) {

  }])
  .controller('MonthController', ['$scope', 'dataProvider', function ($scope, dataProvider) {

    var d = new Date(),
      CurrentMonth = d.getMonth(),
      CurrentYear = d.getFullYear(),
      DayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


    $scope.init = function () {
      var row_tasks = [],
        FirstDay = new Date(CurrentYear, CurrentMonth, 1),
        positionOfFirstDay = (FirstDay.getDay() == 0) ? 1 : FirstDay.getDay();

      FirstDay = FirstDay.setDate(FirstDay.getDate() - positionOfFirstDay);

      //add 42 day, for month grid
      var LastDay = FirstDay + 42 * 24 * 3600 * 1000;

      dataProvider.open(function () {
        dataProvider.getRange(FirstDay, LastDay, function (row) {
            row_tasks.push(row);
          },
          function () {

            var month = [],
            //for new week in month
              i = 0;

            while (FirstDay < LastDay) {
              //going for 1 day for LastDay
              FirstDay = +(new Date(FirstDay + 1 * 24 * 3600 * 1000)).getTime();

              var dayCode = FirstDay, // sugar
                date = (new Date(dayCode)).getDate(),
                cur_month = (new Date(dayCode)).getMonth(),
                isCurrentMonth = (cur_month == CurrentMonth) ? 1 : 0,
                tasks = [];


              //check if task_start time in range of current day
              for (var j = 0; j < row_tasks.length; j++) {
                if (row_tasks[j].task_start >= dayCode && row_tasks[j].task_end <= (dayCode + (24 * 60 * 60))) {
                  tasks.push(row_tasks[j]);
                }
              }

              //for new week in month
              if (i % 7 == 0) {
                month.push([])
              }

              //add day this tasks in week
              month[month.length - 1].push(
                {
                  dayCode: dayCode,
                  date: date,
                  is_current_month: isCurrentMonth,
                  tasks: tasks
                }
              );
              i++;
            }

            $scope.CurrentMonth = CurrentMonth;
            $scope.CurrentYear = CurrentYear;
            $scope.DayNames = DayNames;
            $scope.month = month;

            $scope.$apply();
          });
      });
    };


    $scope.addTask = function (dayCode) {
      var text = prompt('Enter task text');

      if (text !== null && text !== "") {

        //task data template
        var task = {
          task_id: Date.now(),
          task_start: dayCode,
          task_end: dayCode,
          task_text: text
        };

        dataProvider.open(function () {
          dataProvider.create(task, function () {
            $scope.init();
          });
        });
      }

    };

    $scope.removeTask = function (task_id) {
      dataProvider.open(function () {
        dataProvider.delete(task_id, function () {
          $scope.init();
        });
      });
    };


    $scope.prevMonth = function () {

      if (CurrentMonth == 0) {
        CurrentMonth = 11;
        CurrentYear -= 1;
      }
      else {
        CurrentMonth -= 1;
      }
      $scope.init();
    };

    $scope.nextMonth = function () {

      if (CurrentMonth == 11) {
        CurrentMonth = 0;
        CurrentYear += 1;
      }
      else {
        CurrentMonth += 1;
      }
      $scope.init();
    };


    //trying to use some functions in scope
    $scope.showMonthName = function (monthIndex) {
      var monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
      ];

      return monthNames[monthIndex];
    };

    $scope.init();

  }])
  // may be in separate file?
  .directive('month', function () {
    return {
      templateUrl: 'app/templates/month.html'
    };
  });