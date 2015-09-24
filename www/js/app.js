// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic',
                              'app.controllers-global',
                              'app.controllers-login',
                              'app.controllers-terms',
                              'app.controllers-dashboard',
                              'app.controllers-details',
                              'app.controllers-transfer',
                              'app.controllers-geolocation',
                              'app.controllers-geodetails',
                              'app.controllers-calendar',
                              'app.controllers-otp',
                              'app.controllers-actionB',
                              'app.controllers-transfer-result',
                              'app.controllers-transfer-confirm',
                              'app.controllers-transfer-amount',
                              'app.controllers-contact',
                              'ngCordova',
                                                                'app.services',
                                                                               'app.factories-localStorage',
                                                                                                            'pascalprecht.translate'])

.run(function($ionicPlatform, $rootScope, $window) {
  $ionicPlatform.ready(function() {
      // Funcion para crear elementos script o link
      var createjscssfile = function (filename, filetype) {
          if (filetype == "js") { //if filename is a external JavaScript file
              var fileref = document.createElement('script');
              fileref.setAttribute("type","text/javascript");
              fileref.setAttribute("src", cordova.file.externalDataDirectory + filename);
          }
          else if (filetype == "css") { //if filename is an external CSS file
              var fileref = document.createElement("link");
              fileref.setAttribute("rel", "stylesheet");
              fileref.setAttribute("type", "text/css");
              fileref.setAttribute("href", cordova.file.externalDataDirectory + 'css/' + filename);
          }

          return fileref;
      };

      // Funcion para sustituir elementos del head de index
      var replacejscssfile = function (oldfilename, newfilename, filetype) {
          //determine element type to create nodelist using
          var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";

          //determine corresponding attribute to test for
          var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";

          var allsuspects = document.getElementsByTagName(targetelement);

          //search backwards within nodelist for matching elements to remove
          for (var i = allsuspects.length; i >= 0; i--) {
              if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename) != -1) {
                  var newelement = createjscssfile(newfilename, filetype);
                  allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i]);
              }
          }
      };

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      // set to either landscape
    screen.lockOrientation('portrait');
//      console.log(JSON.stringify(cordova.file));


    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }

      $rootScope.existCssNew = false;

      // Se verifica si el archivo css copia del css de la aplicacion existe
      window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory+"/css/own.css", function(success) {
          console.log("Se consiguio el css: " + JSON.stringify(success));

          // Reemplazamos el elemento del head del index
          replacejscssfile("own.css", "own.css", "css");
          $rootScope.existCss = 'YES';
      }, function(error) {
          console.log("No se consiguio el css: " + JSON.stringify(error));
          $window.localStorage.clear();
          $window.localStorage['actualVersion'] = "V. 1.0";
      });

      // Se verifica si el archivo js copia del js de la aplicacion existe
      window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory+"/internationalization.js", function(success) {
//          console.log("Se consiguio el css: " + JSON.stringify(success));

          replacejscssfile("internationalization.js", "internationalization.js", "js");
          $rootScope.existCss = 'YES';
      }, function(error) {
//          console.log("No se consiguio el css: " + JSON.stringify(error));
      });
  });
})
    .config(['$httpProvider','$ionicConfigProvider', function($httpProvider,$ionicConfigProvider) {
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.navBar.alignTitle('center');
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])

    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        for(lang in translations){
            $translateProvider.translations(lang, translations[lang]);
        }

        $translateProvider.preferredLanguage('es');

        $stateProvider

            .state('languages.login', {
                url: '/login',
                views: {
                    'menuContent' :{
                        templateUrl: 'templates/login.html'
                    }
                }
            })

            .state('eventmenu.form', {
                url: "/form",
                views: {
                    'menuContent' :{
                templateUrl: "templates/form.html",
                controller: 'MainCtrl'
                    }
                }
            })

            .state('otp', {
                url: "/otp",
                templateUrl: "templates/otpTransfer.html",
                controller: 'otpController'
            })

            .state('eventmenu.transferamount', {
                url: "/transferamount",
                views: {
                    'menuContent' :{
                templateUrl: "templates/tranferAmount.html"
                    }
                }
            })

            .state('eventmenu', {
                url: "/event",
                abstract: true,
                templateUrl: "templates/event-menu.html"
            })

            .state('simplemenu', {
                url: "/simple",
                abstract: true,
                templateUrl: "templates/simpleHeader.html"
            })
            .state('simplemenu.result', {
                url: "/result",
                views: {
                    'menuContent' :{
                templateUrl: "templates/resultTransfer.html"
                    }
                }
            })
            .state('languages', {
                url: "/languages",
                abstract: true,
                templateUrl: "templates/language.html"
            })
            .state('eventmenu.home', {
                url: "/home",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/home.html"
                    }
                }
            })
            .state('languages.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent' :{
                templateUrl: 'templates/dashboard.html',
                controller: 'dashboardCtrl'
        }
                }
            })

            .state('eventmenu.contact', {
                url: '/contact',
                views: {
                    'menuContent' :{
                templateUrl: 'templates/contact.html'
                    }
                }
            })

            .state('eventmenu.details', {
                url: '/details',
                views: {
                    'menuContent' :{
                templateUrl: 'templates/details.html',
                        controller: 'detailsCtrl'
                    }
        }
            })

            .state('transfer', {
                url: '/transf',
                views: {
                    'menuContent' :{
                templateUrl: 'templates/form.html'
                    }
                }
            })



            .state('eventmenu.globalStatement', {
                url: '/global',
                views: {
                    'menuContent' :{
                templateUrl: 'templates/globalStatement.html'
                    }
                }
            })


            .state('eventmenu.confirmation', {
                url: '/conformation',
                views: {
                    'menuContent' :{
                templateUrl: 'templates/confirmationTransfer.html'
                    }
                }
            })
            .state('simplemenu.terms', {
                url: '/terms',
                views: {
                    'menuContent' :{
                templateUrl: 'templates/termsPage.html',
                controller: 'termsController'
                    }
                }
            })
            .state('eventmenu.ubicanos', {
                url: '/ubicanos',
                views: {
                    'menuContent' :{
                        templateUrl: 'templates/ubicanos.html'
                    }
                }
            })

            .state('eventmenu.sucursalDetails', {
                url: '/sucdetails',
                views: {
                    'menuContent' :{
                        templateUrl: 'templates/sucursalDetails.html'
                    }
                }
            })

            .state('eventmenu.calendar', {
                url: '/calendar',
                views: {
                    'menuContent' :{
                        templateUrl: 'templates/calendar.html'
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback

        $urlRouterProvider.otherwise('languages/dashboard');
    })

;
