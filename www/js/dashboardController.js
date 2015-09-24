/**
 * Created by Usuario on 5/02/15.
 */

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

"use strict";

angular.module('app.controllers-dashboard', ['ionic'])
/**
 * Created by Usuario on 2/02/15.
 */


    .controller('dashboardCtrl', ['$scope', '$window','$ionicPopup', '$localStorage', '$translate', '$rootScope', function($scope,$window, $ionicPopup, $localStorage, $translate, $rootScope) {
        $scope.listDash = [];

        $scope.ChangeLanguage = function(lang){
            $translate.use(lang);
        };

        $scope.externalDirectory = '';
        $scope.existCss = "NO";

        $scope.$watch(function() { return $rootScope.existCss },
            function() {
                // Se verifica si el archivo css copia del css de la aplicacion existe
                if(typeof($rootScope.existCss) != 'undefined') {
                    $scope.existCss = "YES";
                    $scope.externalDirectory = cordova.file.externalDataDirectory;
                }
            }
        );

        var sufix = $translate.use().toUpperCase();

        if(typeof($window.localStorage['listDashboard']) == 'undefined') {
            // Lista dashboard por defecto
            var listDd = '{"object": [';
            // Primer objecto de la lista
            listDd = listDd + '{"id": "Identificador",';
            listDd = listDd + '"type": "APL",';
            listDd = listDd + '"message": "El mensaje del popup",';
            listDd = listDd + '"url": "",';
            listDd = listDd + '"txtEN": "Mobile Bank",';
            listDd = listDd + '"txtES": "Banca Móvil",';
            listDd = listDd + '"descEN": "The best way of manage your accounts",';
            listDd = listDd + '"descES": "La mejor manera de manejar tus cuentas",';
            listDd = listDd + '"clrBack": "Colorenhexadecimal",';
            listDd = listDd + '"alpha": 0.5,';
            listDd = listDd + '"icon": "tlf.png"},';

            // Segundo objeto de la lista
            listDd = listDd + '{"id": "Identificador",';
            listDd = listDd + '"type": "MSJ",';
            listDd = listDd + '"message": "Esto es un mensaje que viene del json de ADICO.",';
            listDd = listDd + '"url": "",';
            listDd = listDd + '"txtEN": "Tutorial",';
            listDd = listDd + '"txtES": "Tutorial",';
            listDd = listDd + '"descEN": "Bancaplus award your happiness",';
            listDd = listDd + '"descES": "Banca+ premia tu felicidad",';
            listDd = listDd + '"clrBack": "Colorenhexadecimal",';
            listDd = listDd + '"alpha": 0.5,';
            listDd = listDd + '"icon": "tutorial.png"},';

            // Tercer objeto de la lista
            listDd = listDd + '{"id": "Identificador",';
            listDd = listDd + '"type": "WEB",';
            listDd = listDd + '"message": "Esto es un mensaje que viene del json de ADICO.",';
            listDd = listDd + '"url": "",';
            listDd = listDd + '"txtEN": "Find Us",';
            listDd = listDd + '"txtES": "Ubícanos",';
            listDd = listDd + '"descEN": "Locate your bank fast",';
            listDd = listDd + '"descES": "Localiza tu banco rápidamente",';
            listDd = listDd + '"clrBack": "Colorenhexadecimal",';
            listDd = listDd + '"alpha": 0.5,';
            listDd = listDd + '"icon": "geo.png"},';

            // Cuarto objeto de la lista
            listDd = listDd + '{"id": "Identificador",';
            listDd = listDd + '"type": "FUN",';
            listDd = listDd + '"message": "Esto es un mensaje que viene del json de ADICO.",';
            listDd = listDd + '"url": "",';
            listDd = listDd + '"txtEN": "Contact Us",';
            listDd = listDd + '"txtES": "Contáctanos",';
            listDd = listDd + '"descEN": "Find your agency",';
            listDd = listDd + '"descES": "Encuentra tu agencia",';
            listDd = listDd + '"clrBack": "Colorenhexadecimal",';
            listDd = listDd + '"alpha": 0.5,';
            listDd = listDd + '"icon": "contactenos.png"}';

            listDd = listDd + ']}';

            $window.localStorage['listDashboard'] = listDd;
        }

        console.log('$window.localStorage["listDashboard"]: ' + $window.localStorage['listDashboard']);
        console.log('$window.localStorage["listDashboard"] str: ' + JSON.stringify($window.localStorage['listDashboard']));

        var listParsed = JSON.parse($window.localStorage['listDashboard']);
        var listToParseObject = listParsed.object;

        // Construyo mi lista definitiva de dashboard que se parsea en el view
        for(var index = 0; index < listToParseObject.length; index++) {
            var dashboardObject = {};

            dashboardObject.image = listToParseObject[index]['icon'];
            dashboardObject.type = listToParseObject[index]['type'];
            dashboardObject.message = listToParseObject[index]['message'];
            dashboardObject.title = listToParseObject[index]['txt' + sufix];
            dashboardObject.description = listToParseObject[index]['desc' + sufix];

            $scope.listDash.push(dashboardObject);
        }

    //    $scope.listDash = JSON.parse($window.localStorage['listDashboard']);
        console.log( 'Dashboard: ' + JSON.stringify($scope.listDash));
        $scope.showMessage = function(dash) {
            $ionicPopup
                .alert({
                    title: $translate.instant("message"),
                    content: dash.message,
                    okText: $translate.instant('Yes')
                })
                .then(resultMessage);
        };

        var resultMessage = function(res) {
            console.log(res);
        };
    }])