

"use strict";

angular.module('app.controllers-global', [])


    .controller('globalController', function($location,$scope,$ionicHistory, $ionicModal,$rootScope,detailsService, $translate, $ionicLoading,$state, $ionicActionSheet, $ionicPopup, extendSession, $window, $ionicPlatform) {
        // Forzar el boton back para que vaya al dashboard


        $rootScope.whereAmi="globalstatement";
        $scope.user = {};
        $scope.type="";

        // Se verifica si el archivo css copia del css de la aplicacion existe
        if(typeof($rootScope.existCss) == 'undefined') {
            $scope.existCss = "NO";
        } else {
            $scope.existCss = "YES";
            $scope.externalDirectory = cordova.file.externalDataDirectory;
        }

        var currentDate = new Date();



        $scope.bannerTrue = false;

        if($window.localStorage['bannerRes1'] && (typeof($window.localStorage['bannerRes1']) != 'undefined')) {
            $scope.banner = JSON.parse($window.localStorage['bannerRes1']);

            var startDateValues = $scope.banner.startDate.split('/');

            var monthStartDate = parseInt(startDateValues[1])-1;
            startDateValues[1] = monthStartDate.toString();

            var startDate = new Date(startDateValues[2], startDateValues[1], startDateValues[0]);

            var endDateValues = $scope.banner.endDate.split('/');

            var monthEndDate = parseInt(endDateValues[1])-1;
            endDateValues[1] = monthEndDate.toString();

            var endDate = new Date(endDateValues[2], endDateValues[1], endDateValues[0]);

            if((Date.parse(startDate) < Date.parse(currentDate)) && (Date.parse(currentDate) < Date.parse(endDate))) {
                $scope.bannerTrue = true;
            }
        }

        $scope.showDetails = function(idE,idI,name,amount,classification,payable,payer,searchable) {
            //searcheble si vienes de detalle pasalo como falso
            var botones=[];
            var val =false;
            var options = [];

            var opciones=$translate.instant("options");
            if (searchable==true){
                var searchable= { text: $translate.instant("consult") , image:'' };
                botones.push(searchable);
                val=true;
                options.push("searchable");
        }
        if(payable==true){
            var payble= { text: $translate.instant("trasnasdest"), image:'' };
            botones.push(payble);
            val=true;
            options.push("payable");
        }
        if(payer==true){
            var payer = { text: $translate.instant("transasori"), image:'' };
            botones.push(payer);
            val=true;
            options.push("payer");

        }
            if (val==false){
                opciones=$translate.instant("nochoice");
            }

            var hideSheet = $ionicActionSheet.show({
                buttons:botones,
                titleText: opciones,
                cancelText: $translate.instant("cancel"),
                buttonClicked: function(index) {
                   $rootScope.itemtransf={};
                    $rootScope.itemtransf.idE=idE;
                    $rootScope.itemtransf.idI=idI;
                    $rootScope.itemtransf.name=name;
                    $rootScope.itemtransf.amount=amount;
                    $rootScope.itemtransf.classification=classification;
                    $rootScope.itemtransf.option=options[index];

                    if (options[index]=="searchable"){
                        hideSheet();
                        var result= $scope.details(idE,true);
                       // $state.go('eventmenu.details');
                    }
                    else{
                        $state.go('eventmenu.form');
                    }
                }
            });
        };

        $scope.details = function(idE,searcheble) {
            if(searcheble==true){
                var resultExtend = extendSession.extend($rootScope.cookieId);
                var sessionNoExpired = false;

                resultExtend.then(function(data) {
                    if(typeof(data) == 'undefined') {
                        $ionicPopup.alert({
                            title: "Error",
                            content: $translate('noservice')
                        });
                    } else if (data.status.code=="bp-c-kicked-session" || data.status.code=="bp-c-expired-session" ||data.status.code=="bp-c-closed-session"){
                        $ionicPopup.alert({
                            title: "Error",
                            content: data.status.msg
                        });
                        $state.go('languages.login');
                        $ionicHistory.clearCache();
                        $rootScope.data = "";
                        $rootScope.cookieId = "";
                    }
                    else if (data.status.code != "OK") {
                        $ionicPopup.alert({
                            title: "Error",
                            content: 'Error: ' + data.status.msg
                        }).then(function(res) {
                            console.log('error');
                        });
                    } else {
                        var result = detailsService.details($rootScope.cookieId, idE);

                        // show loading screen
                        $ionicLoading.show({template: $translate.instant("loading")});

                        result.then(function(data) {
                            $ionicLoading.hide();

                            if(typeof(data) == 'undefined') {
                                $ionicPopup.alert({
                                    title: "Error",
                                    content: $translate('noservice')
                                });
                                $scope.user={};
                            } else if (data.status.code=="bp-c-kicked-session" || data.status.code=="bp-c-expired-session" ||data.status.code=="bp-c-closed-session"){
                                $ionicPopup.alert({
                                    title: "Error",
                                    content: data.status.msg
                                });
                                $state.go('languages.login');
                                $ionicHistory.clearCache();
                                $rootScope.data = "";
                                $rootScope.cookieId = "";
                            }
                            else if (data.status.code!="OK"){
                                $ionicPopup.alert({
                                    title: "Error",
                                    content: data.status.msg
                                });
                            }
                            else{
                                $rootScope.details = data;
                                $state.go('eventmenu.details');
                            }
                        });
                    }
                });

                return sessionNoExpired;
            }
            else{
                $scope.msj = $translate.instant("msj");
                $scope.nosearch = $translate.instant("nosearch");
                $ionicPopup.alert({
                    title: $scope.msj,
                    content: $scope.nosearch
                });
            }
            return true;
        };

        var sorting = $rootScope.data.globalStatement.classificationOrder;
        var knowArray = [];
        var unknowArray = [];
        var items= $rootScope.data.globalStatement.instruments;
        sorting.forEach(function(key) {
            var found = false;
            var other = false;
            items = items.filter(function(item) {
                if(item.classification == key) {
                    if (found==false){
                        var know= {value: key};
                        knowArray.push(know);
                        found= true;
                    }
                    knowArray.push(item);
                    return false;
                } else if(sorting.indexOf(item.classification) == -1) {
                    if (other==false){
                        var unknow= {value: "other"};
                        unknowArray.push(unknow);
                        other= true;
                    }
                    unknowArray.push(item);
                    return false;
                }
                else{
                    return true;
                }
            })
        })
        unknowArray.forEach(function(entry) {
            knowArray.push(entry);
        });

        $scope.data= $rootScope.data;
        $scope.result = knowArray;


        // Version de arreglo de arreglos
        var instsByClas = {};

        for(var index = 0; index < knowArray.length; index++) {
            var actualKnown = knowArray[index];

            if((typeof(actualKnown.value) != 'undefined') && (actualKnown.value != null)) {
                instsByClas[actualKnown.value] = [];
            } else {
                (instsByClas[actualKnown.classification]).push(actualKnown);
            }
        }

        $scope.instsByClass = instsByClas;
    })