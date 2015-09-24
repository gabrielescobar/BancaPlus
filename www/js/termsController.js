"use strict";

angular.module('app.controllers-terms', [])


    .controller('termsController', function($scope,$ionicHistory,$filter,$translate, $rootScope,acceptTerms,logout,$ionicLoading,$state, $ionicPopup) {
        $scope.user = {};
        $scope.user.terms = $rootScope.terms;

        $scope.acceptTerms = function() {
            //alert($rootScope.cookieId);
            var result = acceptTerms.accept($rootScope.cookieId);

            // show loading screen
            $ionicLoading.show({template: 'Cargando...'});

            result.then(function(data) {
                $ionicLoading.hide();

                if(typeof(data) == 'undefined') {
                    $ionicPopup.alert({
                        title: "Error",
                        content: $translate('noservice')
                    });
                } else if (data.status.code!="OK"){


                    $ionicPopup.alert({
                        title: "Error",
                        content: data.status.msg
                    }).then(function(res) {

                        $state.go('languages.login');
                    });



                }
                else{
                    $rootScope.cookieId = data.cookieId;
                    $scope.user.token = data.cookieId;
                    $state.go('eventmenu.globalStatement');
                }

            });


            return result;
        }

        $scope.rejectTerms = function() {


            var result = logout.logout($rootScope.cookieId);

            // show loading screen


            result.then(function(data) {
                $scope.msj = $translate.instant("msj");
                $scope.noterms = $translate.instant("noterms");
                $ionicPopup.alert({
                    title: $scope.msj,
                    content: $scope.noterms
                }).then(function(res) {

                    $state.go('languages.login');
                });

            });


            return result;


        }

        $scope.logoutf = function() {
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
                                $state.go('languages.login');
                                console.log('clearCache terms if');
                                $ionicHistory.clearCache();
                                    $rootScope.relocate="global"
                                    $rootScope.data = "";
                                    $rootScope.cookieId = "";
                                });
                            }
                        }
                    ]




            });
        }
            else{
                   $state.go('languages.login');
                   console.log('clearCache terms else');
                   $ionicHistory.clearCache();
                   $rootScope.data = "";
                   $rootScope.cookieId = "";
               }


            return true;


        }

    })