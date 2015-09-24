
"use strict";

angular.module('app.controllers-transfer-confirm', ['ngCookies','currencyFilter'])


    .controller('transferConfirmController', function($scope,$filter,$rootScope,$ionicLoading,transferExecute,$ionicPopup,$state,$ionicHistory, extendSession) {
        $scope.val=$rootScope.transf;
        // Arreglo de prestamos
        $scope.prestamos = [];

        for(var index = 0; index < $rootScope.prestamos.length; index++) {
            var prestamo = {};
            prestamo.amount = $rootScope.prestamos[index];
            prestamo.currency = $rootScope.transf.loan_same_bank[index].currency;

            $scope.prestamos.push(prestamo);
        }

    //    $scope.prestamos = $rootScope.prestamos;

        // Arreglo de tarjetas
        $scope.tarjetas = [];

        for(var index = 0; index < $rootScope.tarjetas.length; index++) {
            var tarjeta = {};
            tarjeta.amount = $rootScope.tarjetas[index];
            tarjeta.currency = $rootScope.transf.creditcard_same_owner[index].currency;

            $scope.tarjetas.push(tarjeta);
        }

    //    $scope.tarjetas = $rootScope.tarjetas;

        // Arreglo de mismas cuentas
        $scope.servicios = [];

        for(var index = 0; index < $rootScope.servicios.length; index++) {
            var servicio = {};
            servicio.amount = $rootScope.servicios[index];
            servicio.currency = $rootScope.transf.services_same_bank[index].currency;

            $scope.servicios.push(servicio);
        }

    //    $scope.servicios = $rootScope.servicios;

        // Arreglo de mismas cuentas
        $scope.mismasCuentas = [];

        for(var index = 0; index < $rootScope.mismasCuentas.length; index++) {
            var mismaCuenta = {};
            mismaCuenta.amount = $rootScope.mismasCuentas[index];
            mismaCuenta.currency = $rootScope.transf.account_same_owner[index].currency;

            $scope.mismasCuentas.push(mismaCuenta);
        }

    //    $scope.mismasCuentas = $rootScope.mismasCuentas;

        // Arreglo de otras cuentas
        $scope.otrasCuentas = [];

        for(var index = 0; index < $rootScope.otrasCuentas.length; index++) {
            var otraCuenta = {};
            otraCuenta.amount = $rootScope.otrasCuentas[index];
            otraCuenta.currency = $rootScope.transf.account_other_person[index].currency;

            $scope.otrasCuentas.push(otraCuenta);
        }

    //    $scope.otrasCuentas = $rootScope.otrasCuentas;

        // Arreglo de cuentas otros bancos
        $scope.cuentasOtrosBancos = [];

        for(var index = 0; index < $rootScope.cuentasOtrosBancos.length; index++) {
            var cuentaOtroBanco = {};
            cuentaOtroBanco.amount = $rootScope.cuentasOtrosBancos[index];
            cuentaOtroBanco.currency = $rootScope.transf.account_external_bank[index].currency;

            $scope.cuentasOtrosBancos.push(cuentaOtroBanco);
        }

    //    $scope.cuentasOtrosBancos = $rootScope.cuentasOtrosBancos;

        $scope.serviciosConcept =  $rootScope.serviciosConcept;
        $scope.otrasCuentasConcept = $scope.otrasCuentasConcept;
        $scope.cuentasOtrosBancosConcept = $rootScope.cuentasOtrosBancosConcept;
        $rootScope.transactions=[];
        var res = $scope.val.account_origin_fund.split("&");

        var resOrigin = res[2].split('Disponible')[0].trim();

        $scope.origin= resOrigin.substring(0, resOrigin.length - 1);
        $scope.confirm = function() {
            var transfer = {
                "cid": $rootScope.cookieId,
                "debitInfo": [],
                "opKey":"valid_OTP"
            };

            if($scope.val.loan_same_bank){
                var count=0;
                $scope.val.loan_same_bank.forEach(function(key) {

                    transfer.debitInfo.push({
                        "idEO": $rootScope.originAcount,
                        "idED": key.ide,
                        "payment": {
                            "amount": $scope.prestamos[count].amount,
                            "currency": key.currency
                        },
                        "concept": "Loan Trans"
                    });
                    count=count+1;
                    $rootScope.transactions.push(key.value);
                })
            }

            if($scope.val.creditcard_same_owner){
                var count=0;
                $scope.val.creditcard_same_owner.forEach(function(key) {

                    transfer.debitInfo.push({
                        "idEO": $rootScope.originAcount,
                        "idED": key.ide,
                        "payment": {
                            "amount": $scope.tarjetas[count].amount,
                            "currency": key.currency
                        },
                        "concept": "TDC Trans"
                    });
                    count=count+1;
                    $rootScope.transactions.push(key.value);
                })
            }

            if($scope.val.services_same_bank){
                var count=0;
                $scope.val.services_same_bank.forEach(function(key) {

                    transfer.debitInfo.push({
                        "idEO": $rootScope.originAcount,
                        "idED": key.ide,
                        "payment": {
                            "amount": $scope.servicios[count].amount,
                            "currency": key.currency
                        },
                        "concept": $scope.serviciosConcept[count]
                    });
                    count=count+1;
                    $rootScope.transactions.push(key.value);
                })
            }

            if($scope.val.account_other_person){
                var count=0;
                $scope.val.account_other_person.forEach(function(key) {

                    transfer.debitInfo.push({
                        "idEO": $rootScope.originAcount,
                        "idED": key.ide,
                        "payment": {
                            "amount": $scope.otrasCuentas[count].amount,
                            "currency": key.currency
                        },
                        "concept":  $scope.otrasCuentasConcept[count]
                    });
                    count=count+1;
                    $rootScope.transactions.push(key.value);
                })
            }

            if($scope.val.account_external_bank){
                var count=0;
                $scope.val.account_external_bank.forEach(function(key) {

                    transfer.debitInfo.push({
                        "idEO": $rootScope.originAcount,
                        "idED": key.ide,
                        "payment": {
                            "amount": $scope.cuentasOtrosBancos[count].amount,
                            "currency": key.currency
                        },
                        "concept":  $scope.cuentasOtrosBancosConcept[count]
                    });
                    count=count+1;
                    $rootScope.transactions.push(key.value);
                })
            }

            if($scope.val.account_same_owner){
                var count=0;
                $scope.val.account_same_owner.forEach(function(key) {

                    transfer.debitInfo.push({
                        "idEO": $rootScope.originAcount,
                        "idED": key.ide,
                        "payment": {
                            "amount": $scope.mismasCuentas[count].amount,
                            "currency": key.currency
                        },
                        "concept": "Same owner Trans"
                    });
                    count=count+1;
                    $rootScope.transactions.push(key.value);
                })
            }

            var resultExtend = extendSession.extend($rootScope.cookieId);
            var sessionNoExpired = false;

            resultExtend.then(function(data) {
                if (typeof(data) == 'undefined') {
                    $ionicPopup.alert({
                        title: "Error",
                        content: $translate('noservice')
                    });
                } else if (data.status.code == "bp-c-kicked-session" || data.status.code == "bp-c-expired-session" || data.status.code == "bp-c-closed-session") {
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
                    }).then(function (res) {
                        console.log('error');
                    });
                } else {
                    var result = transferExecute.execute(transfer);

                    // show loading screen
                    $ionicLoading.show({template: 'Cargando...'});

                    result.then(function(data) {
                        console.log("--------------aqui toy");
                        $ionicLoading.hide();

                        if(typeof(data) == 'undefined') {
                            $ionicPopup.alert({
                                title: "Error",
                                content: $translate('noservice')
                            });
                        } else if (data.status.code=="bp-c-kicked-session" || data.status.code=="bp-c-expired-session" || data.status.code=="bp-c-closed-session"){
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
                            $rootScope.transferResult=data;
                            $state.go('simplemenu.result');
                        }
                    });
                }
            });
        }
    });