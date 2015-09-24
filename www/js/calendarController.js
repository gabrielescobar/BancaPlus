/**
 * Created by training12 on 2/12/15.
 */

"use strict";

angular.module('app.controllers-calendar', [])
    .controller('calendarController', ['$scope', '$ionicPopup', '$ionicActionSheet', '$rootScope', '$ionicLoading', '$state', '$translate', function($scope, $ionicPopup, $ionicActionSheet, $rootScope, $ionicLoading, $state, $translate) {
        // Se verifica si el archivo css copia del css de la aplicacion existe
        if(typeof($rootScope.existCss) == 'undefined') {
            $scope.existCss = "NO";
        } else {
            $scope.existCss = "YES";
            $scope.externalDirectory = cordova.file.externalDataDirectory;
        }

        $scope.lastPDate = parseInt($rootScope.details.container.lastPDate.split('|')[0]);
        $scope.nextPDate = parseInt($rootScope.details.container.nextPDate.split('|')[0]);

        // Meses por idioma
        var months_by_lang = [];

        months_by_lang['es'] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        months_by_lang['en'] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Mes actual
        var currentMonth = new Date().getMonth();
        $scope.month = months_by_lang[$translate.use()][currentMonth];

        // Obtengo el ultimo dia del mes para saber cuantas filas va a tener mi tabla
        var calendarDate = new Date();
        var lastDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 2, 0);
        $scope.lastDay = lastDay.getDate();
        var calendarDays = [];
        var auxDate = 1;

        console.log('lastDay: ' + $scope.lastDay);
        console.log('lastPDate: ' + $scope.lastPDate);
        console.log('nextPDate: ' + $scope.nextPDate);


        // Creo una matriz para representar mi calendario
        if($scope.lastDay == 28) {
            for(var index0 = 0; index0 < 4; index0++) {
                var weekDays = [];
                for(var index1 = 0; index1 < 7; index1++) {
                    weekDays.push(auxDate.toString());
                    auxDate++;
                }
                calendarDays.push(weekDays);
            }
        } else {
            for(var index0 = 0; index0 < 5; index0++) {
                var weekDays = [];
                for(var index1 = 0; index1 < 7; index1++) {
                    weekDays.push(auxDate);
                    auxDate++;
                    if(auxDate > $scope.lastDay) {
                        break;
                    }
                }
                calendarDays.push(weekDays);
            }
        }

        $scope.calendarDays = calendarDays;
    }])