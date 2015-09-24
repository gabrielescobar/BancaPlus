/**
 * Created by Usuario on 5/02/15.
 */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

"use strict";

angular.module('app.controllers-login', ['ionic','app.factories-localStorage'])
/**
 * Created by Usuario on 2/02/15.
 */
    .controller('loginController', function($scope,$rootScope, $filter,$ionicModal,$window, $translate,$ionicLoading,$state, LoginService, $ionicPopup, $localStorage, $cordovaFile, $http, $ionicPlatform, $ionicHistory) {
        // Forzar el boton back para que vaya al dashboard

        $ionicPlatform.onHardwareBackButton(function () {
            console.log('Funciona onHardwareBackButton');

            //colocar el ionic next view el disable back
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('languages.dashboard');
        });


        // Se verifica si el archivo css copia del css de la aplicacion existe
        if(typeof($rootScope.existCss) == 'undefined') {
            $scope.existCss = "NO";
        } else {
            $scope.existCss = "YES";
            $scope.externalDirectory = cordova.file.externalDataDirectory;
        }

        // Variable para almacenar el contenido del css
        var cssContent;

        $rootScope.whereAmi="log";

        $scope.user = {};

        // Verificamos que se almacene la version como 1.0 la primera vez
        console.log('actualVersion: ' + $window.localStorage['actualVersion']);

        if(typeof($window.localStorage['actualVersion']) == 'undefined') {
            $window.localStorage['actualVersion'] = "V. 1.0";
        }

        $scope.actualVersion=$window.localStorage['actualVersion'];

        $scope.ChangeLanguage = function(lang){
            $translate.use(lang);
        }

        $scope.clean = function(){
            $scope.user={};
        }

        $scope.login = function(usr, pwd) {

            if (!$scope.user.name || !$scope.user.password){
                $ionicPopup.alert({
                    title: "Error",
                    content: $translate('nouserpass')
                });
                $scope.user={};
            } else {

            var result = LoginService.login(usr, pwd);

            // show loading screen
            $ionicLoading.show({template: $translate.instant("loading")});

            result.then(function(data) {
                $ionicLoading.hide();

               var networkState = navigator.connection.type;

                var states = {};
                states[Connection.UNKNOWN]  = 'UC';
                states[Connection.NONE]     = 'NC';


                if (states[networkState]=='UC' || states[networkState]=='NC' ) {
                    $ionicPopup.alert({
                        title: "Error",
                        content: $translate('errorconnection')
                    });
                $scope.user={}

                }
                if(typeof(data) != 'undefined' && data.status.code=="OK") {
                    // Para verificar que inicio sesion y mostrar o quitar
                    // el icono de cerrar sesion
                    $rootScope.isLogged = true;

                    // Para probar si cuando no hay version nueva, no se realiza descarga y
                    // por lo tanto, se sigue referenciando al archivo css interno de la app
                //    data.adico = {};
                //    data.adico.actualVersion = 1;
                //    data.adico.newVersion = data.adico.actualVersion;
                //    data.adico.newVersion = 2;

                    // Se verifica la version actual de la aplicacion vs la nueva
                    if (data.adico.newVersion > data.adico.actualVersion) {
                        // Se debe verificar si la nueva version es mayor a la actual en 0.1
                        // si es asi, se realiza la descarga de la version incremental, si la
                        // nueva version es mayor por mas de 0.1, se realiza la descarga de la
                        // version total

                        // Para realizar la descarga del zip, se debe concatenar al campo 'url'
                        // devuelto por el servicio de login la version del SO (android, ios),
                        // la nueva version (1.0.1, 1.0.2, etc) se le concatena algo que puede
                        // tener valor 'normal', el tipo de resolucion, y por ultimo el nombre
                        // del zip con extension zip incluida

                        // Al terminar de descargar, verificar si el hash del zip descargado
                        // corresponde con el hash correspondiente del servicio (si la version
                        // nueva es 0.1, comparar con el hash incremental, si la version es
                        // mayor a 0.1,comparar con el has total). Si los hash no coinciden,
                        // si los hash no coinciden, descargar de nuevo

                        // Una vez descargado, realizar los pasos ya conocidos para deszipear,
                        // crear los directorios, crear el archivo css copia, etc

                        document.addEventListener('deviceready', function () {
                            // Se obtiene el contenido del css de la aplicacion
                            $http.get(cordova.file.applicationDirectory + 'www/css/own.css').
                                success(function(data) {
                                    //    console.log('data: ' + data);
                                    cssContent = data;
                                }).
                                error(function(error) {
                                    console.log('error: ' + JSON.stringify(error));
                                });

                            var fileTransfer = new FileTransfer();
                        //    var uri = encodeURI("https://s3.amazonaws.com/bancaplusadico/android/1.0.2/normal/hdpi/design.zip");

                            // La linea de codigo anterior debe cambiarse por el siguiente fragmento de codigo para que descargue de la carpeta correcta
                            var uriString = "";

                            uriString += "https://s3.amazonaws.com/bancaplusadico/" + device.platform.toLowerCase() + "/" + data.adico.newVersion + "/normal";

                            var pixelRatio = window.devicePixelRatio;

                            console.log('screenWitdh: ' + screen.width);
                            console.log('screenHeight: ' + screen.height);

                            console.log('pixelRatio: ' + pixelRatio);

                            if(pixelRatio >= 2) {
                                // pixelratio 2 or above – Extra high DPI
                                uriString += "/xhdpi";
                            } else if (pixelRatio >= 1.5) {
                                // Pixelratio 1.5 or above – High DPI
                                uriString += "/hdpi";
                            } else if (pixelRatio <= 0.75) {
                                // Pixelratio 0.75 or less – Low DPI
                                uriString += "/ldpi";
                            } else {
                                // Pixelratio 1 or undetected. – Medium DPI
                                uriString += "/mdpi";
                            }

                            uriString += "/design.zip";

                            var uri = encodeURI(uriString);

                            fileTransfer.download(
                                uri,
                                cordova.file.externalDataDirectory + "design.zip",
                                function (entry) {
                                    console.log("---------------------------------------download complete: " + entry.toURL());
                                    //si el hash no es igual que el de adico no descargues///////////////////////////////////
                                    ////////////////////////////////////////////////////////////////////////////////////////

                                    zip.unzip(
                                        cordova.file.externalDataDirectory + "design.zip",
                                        cordova.file.externalDataDirectory,
                                        function () {
                                            console.log('Zip decompressed successfully');

                                            /*
                                            // Verifico el hash del archivo descargado
                                            $cordovaFile.readAsText(cordova.file.externalDataDirectory, 'design.zip').then(function(success) {
                                                console.log('sha1_file: ' + sha1_file(cordova.file.externalDataDirectory + 'design.zip'));
                                                console.log('sha1_file(success): ' + sha1_file(success));
                                            }, function(error) {
                                                console.log(error);
                                            });
                                            */

                                            // Se crea el directorio de recursos
                                            $cordovaFile.createDir(cordova.file.externalDataDirectory, "resources", true)
                                                .then(function (success) {
                                                    console.log('Creó el directorio resources: ' + JSON.stringify(success));

                                                    // Se copia el contenido del directorio de recursos descargados
                                                    // en el directorio de recursos creado
                                                    $cordovaFile.copyDir(cordova.file.externalDataDirectory, 'design', cordova.file.externalDataDirectory, 'resources')
                                                        .then(function(success) {
                                                            console.log('Copiado directorio design correctamente: ' + JSON.stringify(success));
                                                        }, function(error) {
                                                            console.log('No se copio design correctamente: ' + JSON.stringify(error));
                                                        });
                                                }, function (error) {
                                                    console.log('No creó el directorio resources: ' + JSON.stringify(error));
                                                });

                                            // Se crea el directorio de css
                                            $cordovaFile.createDir(cordova.file.externalDataDirectory, "css", true)
                                                .then(function (success) {
                                                    console.log('Creó el directorio css: ' + JSON.stringify(success));

                                                    // Se crea el archivo css copia del css de la aplicacion
                                                    $cordovaFile.createFile(cordova.file.externalDataDirectory + 'css/', 'own.css', true).
                                                        then(function (success) {
                                                            //    console.log('Contenido de cssContent: ' + cssContent);
                                                            // Se llena el archivo copia del css con el contenido
                                                            $cordovaFile.writeFile(cordova.file.externalDataDirectory + 'css/', 'own.css', cssContent, true)
                                                                .then(function(success) {
                                                                    console.log('write file bien');
                                                                }, function(error) {
                                                                    console.log('write file mal');
                                                                });
                                                        }, function (error) {
                                                            console.log('error ' + JSON.stringify(error));
                                                        });
                                                },function (error) {
                                                    console.log('No creó el directorio css: ' + JSON.stringify(error));
                                                });

                                            // Se lee el json de adico y se almacena los valores necesarios
                                            // (por ahora la version, la duracion de los banners y los valores
                                            // que se muestran en el dashboard)
                                            $cordovaFile.readAsText(cordova.file.externalDataDirectory, 'adico.json').then(function(success) {
                                                console.log('adico readed good: ' + success);
                                                var jsonAdico = JSON.parse(JSON.parse(JSON.stringify(success)));

                                                var dashObject = {
                                                    object: jsonAdico.dash1.listD1
                                                };

                                                console.log('dashObject: ' + dashObject);
                                                console.log('dashObjectStr: ' + JSON.stringify(dashObject));

                                                // Almacenamos en local storage la informacion del dashboard y banners
                                                $window.localStorage['listDashboard'] = JSON.stringify(dashObject);
                                                $window.localStorage['bannerRes1'] = JSON.stringify(jsonAdico.res1.banner);

                                                $window.localStorage['bannerCons1'] = JSON.stringify(jsonAdico.cons1.banner);

                                                // Almacenamos la nueva version
                                                $window.localStorage['actualVersion'] = 'V. ' + data.adico.newVersion;
                                                console.log('actualVersion: ' + $window.localStorage['actualVersion']);
                                            }, function(error) {
                                                console.log('adico not readed: ' + error);
                                            })
                                        }
                                    );
                                },
                                function (error) {
                                    console.log("----------------------------------------download error source " + error.source);
                                    console.log("----------------------------------------download error target " + error.target);
                                    console.log("----------------------------------------upload error code" + error.code);
                                },
                                true
                            );
                        });
                    }
                }

                if (!data){
                    $ionicPopup.alert({
                        title: "Error",
                        content: $translate('noservice')
                    });
                     $scope.user={};
                }

                else if (data.status.code!="OK"){
                    $ionicPopup.alert({
                        title: "Error",
                        content: data.status.msg
                    });
                     $scope.user={};

                }
                else if(data.terms) {
                    $rootScope.terms = data.terms;
                    $rootScope.data = data;
                    $rootScope.cookieId = data.cid;
                    $state.go('simplemenu.terms');
                }
                else{
                    $scope.user.token = data.cid;
                    $rootScope.data = data;
                    $rootScope.cookieId = data.cid;
                     if($rootScope.relocate=="global")
                         $state.go('eventmenu.globalStatement');
                     else if ($rootScope.relocate=="transfer")
                         $state.go('eventmenu.form');
                     else{
                         $state.go('eventmenu.globalStatement');
                     }

                }
            });
            }
            return true;
        }
    })