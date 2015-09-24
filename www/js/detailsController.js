"use strict";

angular.module('app.controllers-details', [])
    .controller('detailsCtrl', ['$scope', '$ionicPopup', '$ionicActionSheet', '$rootScope', 'detailsService', '$ionicLoading', '$state', '$translate', '$ionicHistory', 'extendSession', '$window', function($scope, $ionicPopup, $ionicActionSheet, $rootScope, detailsService, $ionicLoading, $state, $translate, $ionicHistory, extendSession, $window) {
        $rootScope.whereAmi="detail";
        // recursive function to clone an object. If a non object parameter
        // is passed in, that parameter is returned and no recursion occurs.
        function cloneObject(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }

            var temp = obj.constructor(); // give temp the original obj's constructor
            for (var key in obj) {
                temp[key] = cloneObject(obj[key]);
            }

            return temp;
        }

        var currentDate = new  Date();



        $scope.bannerTrue = false;

        if($window.localStorage['bannerCons1'] && (typeof($window.localStorage['bannerCons1']) != 'undefined')) {
            $scope.banner = JSON.parse($window.localStorage['bannerCons1']);

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

        // Se verifica si el archivo css copia del css de la aplicacion existe
        if(typeof($rootScope.existCss) == 'undefined') {
            $scope.existCss = "NO";
        } else {
            $scope.existCss = "YES";
            $scope.externalDirectory = cordova.file.externalDataDirectory;
        }

        console.log('########  Estoy en detailsCtrl  #########: ' + JSON.stringify($rootScope.details));
        console.log('Instruments: ' + JSON.stringify($rootScope.data.globalStatement.instruments));

        // Objeto usado para almacenar los detalles del instrumento
        $scope.detailsObject = {};

        // Lista de campos (montos, fechas, etc) que se muestran
        $scope.detailsObject.listShowFields = [];

        // Si el instrumento es una tarjeta, se almacena el limite de credito
        $scope.detailsObject.creditLimit = $rootScope.details.container.creditLimit ? $rootScope.details.container.creditLimit : undefined;

        // Instrumentos que se pueden consultar
        $scope.instruments = [];

        // Funcion usada para devolver el instrumento por su idE
        var searchInstrumentByIdE = function(idE) {
            for(var index = 0; index < $rootScope.data.globalStatement.instruments.length; index++) {
                if($rootScope.data.globalStatement.instruments[index].idE == idE) {
                    return $rootScope.data.globalStatement.instruments[index];
                }
            }
        };

        // Primer instrumento de la lista dropdown
        $scope.inst = searchInstrumentByIdE($rootScope.details.idE);
        $scope.inst = $scope.inst.idE;

        // Almaceno los instrumentos que se pueden consultar
        var instrumentsSearchables = [];
        for(var index = 0; index < $rootScope.data.globalStatement.instruments.length; index++) {
            var newInstrument = cloneObject($rootScope.data.globalStatement.instruments[index]);
            instrumentsSearchables.push(newInstrument);
        }

        for(var index = 0; index < instrumentsSearchables.length; index++) {
            if(instrumentsSearchables[index].searchable) {
                var instrumentRenamed = instrumentsSearchables[index];
                instrumentRenamed.name = instrumentRenamed.name + ' ' + instrumentRenamed.idI;

                $scope.instruments.push(instrumentRenamed);
            }
        }

        // Clasificacion del instrumento
        $scope.classification = $rootScope.details.classification;

        // Movimientos del instrumento
        $scope.detailsObject.movements = $rootScope.details.container.movements;

        // Todos los detalles en general
        $scope.details = $rootScope.details;

        // Obtengo el ancho de cada barra del grafico de tarjeta
        var getGraphicWidth = function(details) {
            if(parseFloat(details.container.balanceDue[0].amount) <= parseFloat(details.container.creditLimit[0].amount)) {
                var total = parseFloat(details.container.creditLimit[0].amount);

                $scope.detailsObject.graphicBlue = parseInt((parseFloat(details.container.balanceDue[0].amount) / total) * 100) - 3;
                $scope.detailsObject.graphicGrey = parseInt((parseFloat(details.available[0].amount) / total) * 100);

                //        console.log('blue: '+ $scope.detailsObject.graphicBlue);
                //        console.log('grey: '+ $scope.detailsObject.graphicGrey);
            } else {
                $scope.detailsObject.graphicBlue = 97;
                $scope.detailsObject.graphicGrey = 0;

                //        console.log('blue: '+ $scope.detailsObject.graphicBlue);
                //        console.log('grey: '+ $scope.detailsObject.graphicGrey);
            }
        };

        // Muestro las opciones del menu contextual
        $scope.showDetails = function(idE,idI,name,amount,classification,payable,payer,searchable) {
            //searcheble si vienes de detalle pasalo como falso
            var botones=[];
            var val =false;
            var options = [];

            var opciones="Opciones";

            if (searchable==true){
                var searchable= { text: 'Consultar' , image:'' };
                botones.push(searchable);
                val=true;
                options.push("searchable");
            }
            if(payable==true){
                var payble= { text: 'Transferir como destino', image:'' };
                botones.push(payble);
                val=true;
                options.push("payable");
            }
            if(payer==true){
                var payer = { text: 'Transferir como origen', image:'' };
                botones.push(payer);
                val=true;
                options.push("payer");
            }
            if (val==false){
                opciones="Este instrumento no tiene opciones disponibles.";
            }

            $ionicActionSheet.show({
                buttons:botones,
                titleText: opciones,
                cancelText: 'Cancel',
                buttonClicked: function(index) {
                    $rootScope.itemtransf={};
                    $rootScope.itemtransf.idE=idE;
                    $rootScope.itemtransf.idI=idI;
                    $rootScope.itemtransf.name=name;
                    $rootScope.itemtransf.amount=amount;
                    $rootScope.itemtransf.classification=classification;
                    $rootScope.itemtransf.option=options[index];

                    if (options[index]=="searchable"){
                        var result= $scope.details(idE);
                        $state.go('details');
                    }
                    else{
                        $state.go('eventmenu.form');
                    }
                }
            });
        };

        // Anchos de los graficos y almacenamiento de ultimo
        // dia de pago y proximo dia de pago
        if($rootScope.details.container.creditLimit) {
            getGraphicWidth($rootScope.details);
        }

        // Meses por idioma
        var months_by_lang = [];

        months_by_lang['es'] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        months_by_lang['en'] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Meses que se muestran en la lista drop down
        $scope.months = months_by_lang[$translate.use()];
        // Dias de la semana
        $scope.days = ["DO", "LU", "MA", "MI", "JU", "VI", "SA"];

        // Funcion para aumentar cada movimiento con el dia de semana
        // y mes que le corresponde
        var addDays = function(movements) {
            for(var index = 0; index < movements.length; index++) {
                var dateArray = movements[index].fullDate.split("/");

                var date = new Date(dateArray[2], dateArray[1], dateArray[0]);
                movements[index].dayWeek = date.getDay();
                movements[index].dayMonth = date.getDate();
            }
        };

        // Aumentamos cada movimiento con el dia de la semana que le corresponde
        if($scope.detailsObject.movements) {
            addDays($scope.detailsObject.movements);
        }

        // Fecha actual para listar los meses de los cuales se puede
        // consultar movimientos
        var date = new Date();

        $scope.possibleDates = [];

        for(var index = 0; index < 3; index++) {
            var dateObject = {
                month: date.getMonth(),
                year: date.getFullYear(),
                name: $scope.months[date.getMonth()] + " " + date.getFullYear()
            };

            date = new Date(date.setMonth(date.getMonth()-1));

            //    console.log('New date: ' + date);

            $scope.possibleDates.push(dateObject);
        }

        $scope.date = $scope.possibleDates[0];

        // Funcion usada para almacenar los campos y movimientos que se muestran en la pantalla
        var getDetails = function(details) {
            // Elimino los campos almacenados anteriormente
            var listShowFields = {};

            var keys = Object.keys(details.container);
            var dates = [];
            var amounts = [];
            var others = [];

            // Almaceno las fechas en un arreglo aparte
            for(var index = 0; index < keys.length; index++) {
                if(keys[index] != 'movements') {
                    var value = details.container[keys[index]];
                    var pattern = /\d(\d)?\/\d(\d)?\/\d\d\d\d/;

                    if(pattern.test(value)) {
                        var dateDet = {};
                        dateDet[keys[index]] = value;

                        dates.push(dateDet);
                    }
                }
            }

            var balanceDet = {};
            balanceDet['balance'] = details.balance[0].amount;

            var availableDet = {};
            availableDet['available'] = details.available[0].amount;

            amounts.push(balanceDet);
            amounts.push(availableDet);

            var keys = Object.keys(details.container);

            for(var index = 0; index < keys.length; index++) {
                if(keys[index] != 'movements') {
                    var value = details.container[keys[index]];
                    var pattern = /\d(\d)?\/\d(\d)?\/\d\d\d\d/;

                    if(typeof(value) == "object") {
                        var detAmount = {};
                        detAmount[keys[index]] = details.container[keys[index]][0].amount;

                        amounts.push(detAmount);
                    } else if(!pattern.test(value)) {
                        var otherDet = {};
                        otherDet[keys[index]] = value;

                        others.push(otherDet);
                    }


                }
            }

            listShowFields.dates = dates;
            listShowFields.amounts = amounts;
            listShowFields.others = others;


            return listShowFields;
        };

        // Moneda del instrumento
        $scope.currency = searchInstrumentByIdE($rootScope.details.idE).currency;

//    console.log('instrumentos: ' + JSON.stringify($rootScope.data.globalStatement.instruments));

        // Obtengo los campos que se muestran del instrumento
        $scope.detailsObject.listShowFields = getDetails($rootScope.details);

        // Funcion para manejar el cambio de instrumento
        $scope.changeInstrument = function(inst) {
            //    console.log('instrumentIdE: ' + inst);
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
                    // Funcionalidad de cambiar instrumento
                    // Llamada al servicio de consulta detallada
                    var result = detailsService.details($rootScope.cookieId, inst);

                    // Se muestra un mensaje que indica cargando
                    $ionicLoading.show({template: 'Cargando...'});

                    result.then(function(data) {

                        // Se oculta el mensaje de cargando
                        $ionicLoading.hide();

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
                            $rootScope.details = data;

                            console.log('details: ' + JSON.stringify(data));

                            // Cambiamos el valor de los campos con el resultado
                            // de la respuesta del servicio de detalles
                            $scope.detailsObject.listShowFields = getDetails($rootScope.details);
                            $scope.detailsObject.movements = $rootScope.details.container.movements;
                            $scope.detailsObject.creditLimit = $rootScope.details.container.creditLimit ? $rootScope.details.container.creditLimit : undefined;

                            // Aumentamos cada movimiento con el dia de la semana que le corresponde
                            if($scope.detailsObject.movements) {
                                addDays($scope.detailsObject.movements);
                            }

                            // Primera opcion de la lista de instrumentos consultables
                            $scope.inst = searchInstrumentByIdE($rootScope.details.idE);
                            $scope.inst = $scope.inst.idE;

                            $scope.currency = searchInstrumentByIdE($rootScope.details.idE).currency;
                            $scope.classification = $rootScope.details.classification;

                            $scope.details = $rootScope.details;

                            // Anchos de los graficos y almacenamiento de ultimo
                            // dia de pago y proximo dia de pago
                            if($rootScope.details.container.creditLimit) {
                                getGraphicWidth($rootScope.details);
                            }
                        }
                    });

                    return result;
                }
            });

            return sessionNoExpired;
        };

        // Funcion para manejar el cambio de mes de movimientos
        $scope.changeMovements = function(date) {
            //    console.log('ide: ' + $scope.inst.idE);

            // Llamada al servicio de consulta de movimientos
            var result = detailsService.movements($rootScope.cookieId, $scope.details.idE, date.year, date.month);

            // Se muestra un mensaje que indica cargando
            $ionicLoading.show({template: 'Cargando...'});

            result.then(function(data) {
                // Se oculta el mensaje de cargando
                $ionicLoading.hide();

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
                else if (data.status.code!="OK"){
                    $ionicPopup.alert({
                        title: "Error",
                        content: data.status.msg
                    });

                }
                else {
                    $rootScope.details.container.movements = data.movements;
                    $rootScope.MovementMonth = data.month;
                    $rootScope.MovementYear = data.year;

                    console.log('Movements: ' + JSON.stringify(data));

                    // Cambiamos el valor de los campos con el resultado
                    // de la respuesta del servicio de detalles
                    $scope.detailsObject.movements = $rootScope.details.container.movements;

                    // Aumentamos cada movimiento con el dia de la semana que le corresponde
                    if($scope.detailsObject.movements) {
                        addDays($scope.detailsObject.movements);
                    }
                }
            });

            return result;
        };

        $scope.calendar = function() {
            $state.go('eventmenu.calendar');
        };
    }])