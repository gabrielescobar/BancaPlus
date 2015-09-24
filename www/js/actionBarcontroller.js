"use strict";

angular.module('app.controllers-actionB', [])


    .controller('actionController', function($scope,$ionicHistory,$filter,$translate, $rootScope,acceptTerms,logout,$ionicLoading,$state, $ionicPopup, $ionicPlatform) {
        //$scope.whereAmi=$rootScope.whereAmi;



        $scope.$watch(function() { return $rootScope.whereAmi },
            function() {
                $scope.whereAmi=$rootScope.whereAmi;
            }
        );

        $scope.$watch(function() { return $rootScope.cookieId },
            function() {
                if ($rootScope.cookieId){
                $scope.logout=true;
                $scope.value= true;
                    console.log($rootScope.cookieId);
                }
                else
                    $scope.login=true;
                $scope.value=false;
            }
        );


        $scope.logoutf = function() {
            $rootScope.isLogged = undefined;

            $scope.cancel = $translate.instant("cancel");
            $scope.accept = $translate.instant("acpt");
            $scope.msj = $translate.instant("logoutmsj");
               if ($rootScope.cookieId){
                $ionicPopup.show({
                    title: $scope.msj,
                    scope: $scope,
                    buttons: [
                        { text: $scope.cancel },
                        {
                            text: $scope.accept,
                            type: 'button-positive',
                            onTap: function(e) {
                                var result = logout.logout($rootScope.cookieId);
                                result.then(function(data) {
                                    if(typeof(data) == 'undefined') {
                                        $ionicPopup.alert({
                                            title: "Error",
                                            content: $translate('noservice')
                                        });
                                    } else {
                                        $state.go('languages.login');
                                        $ionicHistory.clearCache();
                                        $rootScope.data = "";
                                        $rootScope.relocate="global";
                                        $rootScope.cookieId = "";
                                    }
                                });
                            }
                        }
                    ]
                });
            }
            else{
                   $state.go('languages.login');
                   console.log('clearCache actionBar else');
                   $ionicHistory.clearCache();
                   $rootScope.data = "";
                   $rootScope.cookieId = "";
               }
            return true;
        }

        $scope.relocate = function(relocate) {
            $ionicHistory.clearCache();
            $scope.cancel = $translate.instant("cancel");
            $scope.accept = $translate.instant("acpt");
            $scope.msj = $translate.instant("relocate");
            if (!$rootScope.cookieId){
                $ionicPopup.show({
                    title: $scope.msj,
                    scope: $scope,
                    buttons: [
                        { text: $scope.cancel },
                        {
                            text: $scope.accept,
                            type: 'button-positive',
                            onTap: function(e) {
                                    $rootScope.relocate=relocate;
                                    $state.go('languages.login');
                            }
                        }
                    ]
                });
            }
            else{
                if(relocate=="details")
                    $state.go('eventmenu.details');
                else if (relocate=="transfer")
                    $state.go('eventmenu.form');
                else if (relocate=="geo")
                    $state.go('eventmenu.ubicanos');
                else if (relocate=="contact")
                    $state.go('eventmenu.contact');
                else
                    $state.go('eventmenu.globalStatement');



            }
            return true;
        }

    })