

"use strict";

angular.module('app.controllers-otp', ['ionic'])
/**
 * Created by Usuario on 2/02/15.
 */
    .controller('otpController', function($scope,$rootScope, $filter,$ionicModal,$window, $translate,$ionicLoading,$state, LoginService, $ionicPopup) {
$scope.otp="";
        $scope.confirm = function() {
            if ($scope.otp==""){
                $ionicPopup.alert({
                    title: "Error",
                    content: "Por favor, Introduzca un OTP válido"
                });

            }
        };



    })