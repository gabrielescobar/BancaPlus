/**
 * Created by training12 on 2/11/15.
 */

"use strict";

angular.module('app.controllers-geodetails', ['uiGmapgoogle-maps'])
    .config(
        ['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.17',
                libraries: 'weather,geometry,visualization'
            });
        }]
    )

    .controller('geoDetailsController', function($scope, $ionicModal,$rootScope, $translate, $ionicLoading, $state, $ionicActionSheet, $ionicPopup, uiGmapGoogleMapApi) {
        // Se verifica si el archivo css copia del css de la aplicacion existe
        if(typeof($rootScope.existCss) == 'undefined') {
            $scope.existCss = "NO";
            $scope.externalDirectory = '';
        } else {
            $scope.existCss = "YES";
            $scope.externalDirectory = cordova.file.externalDataDirectory;
        }

        // Variable usada para mostrar u ocultar el icono de cerrar sesion
        $scope.notLogged = (typeof($rootScope.isLogged) == 'undefined') ? true : false;

        uiGmapGoogleMapApi.then(function(maps) {
            maps.visualRefresh = true;
        });

        $scope.sucursal = $rootScope.sucursalDetails;

        $scope.closests = $rootScope.closests;

        $scope.marker = {
            id: 1,
            coords: {
                latitude: $scope.sucursal.latitude,
                longitude: $scope.sucursal.longitude
            },
            icon: $scope.externalDirectory + 'resources/marker.png'
        };

        // Se crea el mapa
        $scope.map2 = {
            center: {
                latitude: $scope.sucursal.latitude,
                longitude: $scope.sucursal.longitude
            },
            zoom: 16
        };
    })