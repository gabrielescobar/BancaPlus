/**
 * Created by training12 on 2/10/15.
 */

"use strict";

angular.module('app.controllers-geolocation', ['uiGmapgoogle-maps'])
    .config(
        ['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.17',
                libraries: 'weather,geometry,visualization'
            });
        }]
    )

    .controller('geolocationController', function($scope, $ionicModal,$rootScope, $translate, $ionicLoading, $state, $ionicActionSheet, $ionicPopup, uiGmapGoogleMapApi, geoService, $cordovaGeolocation) {
        // Se verifica si el archivo css copia del css de la aplicacion existe
        $rootScope.whereAmi="geo";
        console.log('$rootScope.existCss dashboard: ' + $rootScope.existCss);
        console.log('cordova.file.externalDataDirectory dashboard: ' + JSON.stringify(cordova.file.externalDataDirectory));

        if(typeof($rootScope.existCss) == 'undefined') {
            $scope.existCss = "NO";
        } else {
            $scope.existCss = "YES";
            $scope.externalDirectory = cordova.file.externalDataDirectory;
        }

        // Variable usada para mostrar u ocultar el icono de cerrar sesion
        $scope.notLogged = (typeof($rootScope.isLogged) == 'undefined') ? true : false;

        uiGmapGoogleMapApi.then(function(maps) {
            maps.visualRefresh = true;
        });

        // Se crea el mapa
        var center = navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map = {
                center: {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                },
                zoom: 8
            };
        });

        $scope.markers = [];
        $scope.markerTitles = [];
        $scope.title = '';
        $scope.latsLngs = [];
        $scope.copy = [];

        var rad = function(x) {
            return x*Math.PI/180;
        };

        // Funcion para conseguir el punto mas cercano
        var find_closest_marker = function(event) {
            var lat = event.latitude;
            var lng = event.longitude;
            var R = 6371; // radius of earth in km
            var distances;
            var closest = -1;
            var closests = [];
            // Copia del arreglo de markers para poder eliminar del mismo
            var markers_copy = $scope.markers.slice(0);
            markers_copy.splice(event.id, 1);

            for(var index = 0; index < 4; index++) {
                distances = [];

                for(var i=0; i < markers_copy.length; i++) {
                    var mlat = markers_copy[i].latitude;
                    var mlng = markers_copy[i].longitude;
                    var dLat  = rad(mlat - lat);
                    var dLong = rad(mlng - lng);
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = R * c;
                    distances[i] = d;
                    if (closest == -1 || d < distances[closest]) {
                        closest = i;
                    }
                }

                // Remuevo el ultimo mas cercano conseguido
                closests.push(markers_copy[closest]);
                markers_copy.splice(closest, 1);

                console.log('closests: ' + JSON.stringify(closests));
            }

            $rootScope.closests = closests.slice(0);

            console.log('model.e: ' + JSON.stringify(event));
        };

        $scope.click = function(e) {
            $scope.markers = $scope.copy.slice(0);
            $rootScope.sucursalDetails = e.model;
            find_closest_marker(e.model);

            $state.go('eventmenu.sucursalDetails');
        };

        $scope.search = function(title) {
            $scope.markers = $scope.copy.slice(0);
            var regexp = new RegExp(title, 'i');
            console.log('search title: ' + regexp);
            var markersAux = [];
            for(var index = 0; index < $scope.markerTitles.length; index++) {
                if(regexp.test($scope.markerTitles[index])) {
                    markersAux.push($scope.markers[index]);
                }
            }
            $scope.markers = markersAux;
        };

        // Llamada al servicio de geolocalizacion con su respectiva version
        var result = geoService.maps('20140513-6');

        // Se muestra un mensaje que indica cargando
        $ionicLoading.show({template: 'Cargando...'});

        result.then(function(data) {
            $scope.data = data;

            // Se oculta el mensaje de cargando
            $ionicLoading.hide();

            if(typeof(data) == 'undefined') {
                $ionicPopup.alert({
                    title: "Error",
                    content: $translate('noservice')
                });
            } else if (data.status.code != "OK") {
                $ionicPopup.alert({
                    title: "Error",
                    content: data.status.msg
                }).then(function(res) {
                    console.log('error');
                });

            } else {
                $scope.data = data;

                //console.log('Geodata: ' + JSON.stringify(data));
                var branches = data.branches.split('|');

                for(var index = 0; index < branches.length / 8; index++) {
                    var marker = {};
                    marker.code = branches.shift();
                    marker.latitude = branches.shift();
                    marker.longitude = branches.shift();
                    marker.address = branches.shift();
                    marker.tlfs = branches.shift();
                    marker.horary = branches.shift();
                    marker.title = branches.shift();
                    $scope.markerTitles.push(marker.title);
                    marker.type = branches.shift();

                    marker.id = index;

                    marker.icon = ($scope.existCss == 'YES') ? ($scope.externalDirectory + 'resources/marker.png') : 'resources/marker.png';
                    marker.show = false;

                    marker.click = $scope.click;

                    $scope.markers.push(marker);
                    $scope.copy = $scope.markers.slice(0);
                }
            }
        });

        return result;
    })