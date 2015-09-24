
"use strict";

angular.module('app.controllers-transfer-result', ['ngCookies','currencyFilter'])

    .controller('transferResultController', function($scope,$ionicHistory,$translate,$filter,$rootScope,$state, $cordovaSocialSharing) {
        // Se verifica si el archivo css copia del css de la aplicacion existe
        if(typeof($rootScope.existCss) == 'undefined') {
            $scope.existCss = "NO";
        } else {
            $scope.existCss = "YES";
            $scope.externalDirectory = cordova.file.externalDataDirectory;
        }

        $scope.val= $rootScope.transferResult;
        $rootScope.data=$rootScope.transferResult
        $scope.confirm = function() {
            $scope.transactions = $rootScope.transactions;
            $state.go('eventmenu.globalStatement');
        }

        $scope.share = function(message) {
            $cordovaSocialSharing.share(message, null, null, null)
                .then(function(success) {
                    console.log('Se compartió la transferencia con éxito');
                }, function(error) {
                    console.log('No se pudo compartir la transferencia');
                });
        };
    });