/**
 * Created by training12 on 2/23/15.
 */

"use strict";

angular.module('app.controllers-contact', ['ionic'])

    .controller('contactController', ['$scope', '$window','$ionicPopup', '$localStorage', '$translate', '$cordovaInAppBrowser', '$rootScope', function($scope,$window, $ionicPopup, $localStorage, $translate, $cordovaInAppBrowser, $rootScope) {
        // Se verifica si el archivo css copia del css de la aplicacion existe
        $rootScope.whereAmi="contact";
        if(typeof($rootScope.existCss) == 'undefined') {
            $scope.existCss = "NO";
        } else {
            $scope.existCss = "YES";
            $scope.externalDirectory = cordova.file.externalDataDirectory;
        }

        $scope.openUrl = function(url) {
            $cordovaInAppBrowser.open(url, '_blank');
        };

        $scope.notLogged = (typeof($rootScope.isLogged) == 'undefined') ? true : false;
    }])