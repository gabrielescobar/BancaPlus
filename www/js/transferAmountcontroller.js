
"use strict";

angular.module('app.controllers-transfer-amount', ['ngCookies','currencyFilter'])

    .controller('transferAmountController', function($scope,$translate,$filter,$rootScope,$ionicPopup,$state) {
        $scope.val=$rootScope.transf;
        $rootScope.itemtransf=null;

        $scope.prestamos=[];
        $scope.tarjetas=[];
        $scope.minPayment=[];
        $scope.totalPayment=[];
        //$scope.customPayment=[];
        $scope.servicios=[];
        $scope.serviciosConcept=[];
        $scope.mismasCuentas=[];
        $scope.otrasCuentas=[];
        $scope.otrasCuentasConcept=[]
        $scope.cuentasOtrosBancos=[];
        $scope.cuentasOtrosBancosConcept=[];


        $scope.clickcreditCard = function(index,type){
            if (type=="min"){
                $scope.totalPayment[index]=false;
                $scope.tarjetas[index]=null;
            }
            else if (type=="total"){
                $scope.minPayment[index]=false;
                $scope.tarjetas[index]=null;
            }
            else if (type=="custom"){
                $scope.minPayment[index]=false;
                $scope.totalPayment[index]=false;
            }

        }

        var currency = $filter('currency');
        $scope.price = currency($scope.prestamos[0]);
        $scope.transfer = function() {
            $rootScope.prestamos = $scope.prestamos;

            $rootScope.tarjetas = $scope.tarjetas;
            $rootScope.servicios = $scope.servicios;
            $rootScope.serviciosConcept = $scope.serviciosConcept;
            $rootScope.mismasCuentas = $scope.mismasCuentas;
            $rootScope.otrasCuentas = $scope.otrasCuentas;
            $rootScope.otrasCuentasConcept = $scope.otrasCuentasConcept;
            $rootScope.cuentasOtrosBancos = $scope.cuentasOtrosBancos;
            $rootScope.cuentasOtrosBancosConcept = $scope.cuentasOtrosBancosConcept;
            var error= false;
            var error2 = false;



            $scope.total=0;
            if ($scope.val.loan_same_bank){
                if ($scope.prestamos.length != $scope.val.loan_same_bank.length){
                    error= true;
                }
                else{
                    $scope.prestamos.forEach(function(key) {
                        $scope.total= (parseFloat($scope.total)+parseFloat(key));
                        if(key==0 || (typeof key == 'undefined'))
                            error= true;
                    })
                }
            }


            if ($scope.val.account_same_owner){
                if ($scope.mismasCuentas.length != $scope.val.account_same_owner.length){
                    error= true;
                }
                else{
                    $scope.mismasCuentas.forEach(function(key) {

                        $scope.total= (parseFloat($scope.total)+parseFloat(key));
                        if(key==0 || (typeof key == 'undefined'))
                            error= true;
                    })
                }
            }

            if ($scope.val.account_other_person){
                if ($scope.otrasCuentas.length != $scope.val.account_other_person.length){
                    error= true;
                }
                else if ($scope.otrasCuentasConcept.length != $scope.val.account_other_person.length){
                    error2= true;
                }
                else{
                    $scope.otrasCuentas.forEach(function(key) {
                        $scope.total= (parseFloat($scope.total)+parseFloat(key));
                        if(key==0 || (typeof key == 'undefined'))
                            error= true;
                    })
                }
            }

            if ($scope.val.account_external_bank){
                if ($scope.cuentasOtrosBancos.length != $scope.val.account_external_bank.length){
                    error= true;

                }
                else if ($scope.cuentasOtrosBancosConcept.length != $scope.val.account_external_bank.length){
                    error2= true;
                }
                else{
                    $scope.cuentasOtrosBancos.forEach(function(key) {
                        $scope.total= (parseFloat($scope.total)+parseFloat(key));
                        if(key==0 || (typeof key == 'undefined'))
                            error= true;
                    })
                }
            }
            if ($scope.val.services_same_bank){
                if ($scope.servicios.length != $scope.val.services_same_bank.length){
                    error= true;
                }
                else if ($scope.serviciosConcept.length != $scope.val.account_other_person.length){
                    error2= true;
                }
                else{
                    $scope.servicios.forEach(function(key) {
                        $scope.total= (parseFloat($scope.total)+parseFloat(key));
                        if(key==0 || (typeof key == 'undefined'))
                            error= true;
                    })
                }
            }
            if ($scope.val.creditcard_same_owner){

                if (($scope.tarjetas.length) != $scope.val.creditcard_same_owner.length){
                    error= true;
                }
                else{
                    for (var i = 0; i < $scope.tarjetas.length; i++) {
                        if($scope.minPayment[i]==true){
                            $scope.tarjetas[i]=$scope.val.creditcard_same_owner[i].minpay;
                        }
                        else if($scope.totalPayment[i]==true){
                            $scope.tarjetas[i]=  $scope.val.creditcard_same_owner[i].balance;
                        }

                    }

                    $scope.tarjetas.forEach(function(key) {
                        $scope.total= (parseFloat($scope.total)+parseFloat(key));
                        if(key==0 || (typeof key == 'undefined'))
                            error= true;
                    })
                }
            }
            var res = $scope.val.account_origin_fund.split("&");

            $rootScope.originAcount= res[0];
            var totalConvert = res[1].split('.').join('');
            totalConvert = totalConvert.split(',').join('.');
            var total= parseFloat(totalConvert);
            if (error){
                $ionicPopup.alert({
                    title: "Error",
                    content: $translate.instant("noamount")
                });
            }
            else if (error2){
                $ionicPopup.alert({
                    title: "Error",
                    content: $translate.instant("noconcept")
                });
            }
            else if (total < $scope.total){
                $ionicPopup.alert({
                    title: "Error",
                    content: $translate.instant("nosub")
                });
            }
            else{
                $state.go('eventmenu.confirmation');
            }


            return true;
        }

    })