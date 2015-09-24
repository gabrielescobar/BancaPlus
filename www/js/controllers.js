// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

"use strict";

angular.module('app.controllers', [])
/**
 * Created by Usuario on 2/02/15.
 */


    .factory('dataBanca', ['$http', function($http) {
        // Url base
        var urlBase = 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/';

        // Objeto que almacena los servicios
        var dataBanca = {};

        dataBanca.getDetails = function(cid, idE) {
            return $http.get(urlBase + 'details?cid=' + cid + '&idE=' + idE);
        };

        return dataBanca;
    }])

