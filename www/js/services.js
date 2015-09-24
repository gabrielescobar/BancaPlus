
angular.module('app.services', [])

    .service('LoginService', function($q, $timeout, $http) {
        return {
            login: function(usr,pwd) {
                var defer = $q.defer();

                var req = {
                    method: 'POST',
                    url: 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/login',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    },
                    data: {
                        "username": usr,
                        "password": pwd,
                        "applicationInfo": {
                            "platform": "IOS_PHONE",
                            "version": "20130610"
                        },
                        "mobileInfo": {
                            "brand": "Blackberry",
                            "model": "8900",
                            "os": "IOS",
                            "resolution": "retina",
                            "version": "v4.6.1.206",
                            "latitude": "10.463378",
                            "longitude": "-66.839772"
                        },
                        "userInfo": {
                            "pin": "258E0AA0",
                            "email": "ejdp@gmail.com",
                            "phoneNumber": "04177777777"
                        },
                        "ip": "195.6.78.194"
                    }
                }
                defer.promise;
                $http(req).success(function(data) {
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    })

    .service('acceptTerms', function($q, $timeout, $http) {
        return {
            accept: function(id) {
                var defer = $q.defer();

                // $timeout(function() {
                //     defer.resolve({token: new Date().getTime()});
                // }, 3000);

                var req = {
                    method: 'POST',
                    url: 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/accept-terms',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    },
                    data: {
                        "cid": id,
                        "accepted": true
                    }
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    })

    .service('logout', function($q, $timeout, $http) {
        return {
            logout: function(id) {
                var defer = $q.defer();

                // $timeout(function() {
                //     defer.resolve({token: new Date().getTime()});
                // }, 3000);

                var req = {
                    method: 'POST',
                    url: 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/logout',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    },
                    data: {
                        "cid": id
                    }
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    })



    .service('transactionalQuery', function($q, $timeout, $http) {
        return {
            querytrans: function(cid) {
                var defer = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/trans?cid=' + cid,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    }
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    })

    .service('afiliationQuery', function($q, $timeout, $http) {
        return {
            queryafil: function(cid) {
                var defer = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'http://172.16.16.136:8088bancaplus-dummies-0.1-SNAPSHOT/webresources/affiliations?cid=' + cid,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    }
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    })
    .service('ownAccounts', function() {
        return {
            transfer: function(instrument,type) {
                var result=[];
                instrument.forEach(function(entry) {
                    var currency = (typeof(entry.currency) != 'undefined') ? entry.currency : entry.mainCurrency;

                   if(entry.classification=="account" && type=="payer" && entry.payer==true ){
                       result.push({id: entry.idE, text: entry.name+' '+entry.idI+'.          Disponible bsf.'+entry.available[0].amount, amount: entry.available[0].amount, currency: currency, checked: false, icon: null});
                   }
                    else if(entry.classification=="account" && type=="payable" && entry.payable==true ){
                        result.push({id: entry.idE, text: entry.name+' '+entry.idI, currency: currency, checked: false, icon: null});
                    }
                   else if( type=="credit-card" && entry.payable==true ){
                       result.push({id: entry.idE, text: entry.name+' '+entry.idI, balance: entry.balance[0].amount, minpay: entry.creditLimit[0].amount, currency: currency, checked: false, icon: null});
                   }
                   else if(entry.classification=="loan" && type=="loan" && entry.payable==true ){
                       result.push({id: entry.idE, text: entry.name+' '+entry.idI, currency: currency, checked: false, icon: null});
                   }
                    else if(type=="services"){
                        result.push({id: entry.idE, text: entry.name+' '+entry.idI, currency: currency, checked: false, icon: null});
                    }
                   else if(type=="tt"){
                       result.push({id: entry.idE, text: entry.name+' '+entry.idI, currency: currency, checked: false, icon: null});
                   }
                   else if(type=="to"){
                       result.push({id: entry.idE, text: entry.name+' '+entry.idI, currency: currency, checked: false, icon: null});
                   }
                });
                return result;
            }
        }
    })

    .service('transferExecute', function($q, $timeout, $http) {
        return {
            execute: function(json) {
                var defer = $q.defer();

                // $timeout(function() {
                //     defer.resolve({token: new Date().getTime()});
                // }, 3000);

                var req = {
                    method: 'POST',
                    url: 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/tp',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    },
                    data: json
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    })

    .service('detailsService', function($q, $timeout, $http) {
        return {
            details: function(cid, idE) {
                var defer = $q.defer();

                // $timeout(function() {
                //     defer.resolve({token: new Date().getTime()});
                // }, 3000);

                var req = {
                    method: 'GET',
                    url: 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/details?cid=' + cid + '&idE=' + idE,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    }
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            },
            movements: function(cid, idE, year, month, day) {
                var defer = $q.defer();

                var url;

                if(typeof day !== 'undefined') {
                    url = 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/movements?cid=' + cid + '&idE=' + idE + '&year=' + year + '&month=' + month + '&day=' + day;
                } else {
                    url = 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/movements?cid=' + cid + '&idE=' + idE + '&year=' + year + '&month=' + month;
                }

                var req = {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    }
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    })

    .service('geoService', function($q, $timeout, $http) {
        return {
            maps: function(version) {
                var defer = $q.defer();

                // $timeout(function() {
                //     defer.resolve({token: new Date().getTime()});
                // }, 3000);

                var req = {
                    method: 'GET',
                    url: 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/maps?version=' + version,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    }
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    })

    .service('extendSession', function($q, $timeout, $http) {
        return {
            extend: function(cid) {
                var defer = $q.defer();

                // $timeout(function() {
                //     defer.resolve({token: new Date().getTime()});
                // }, 3000);

                var req = {
                    method: 'POST',
                    url: 'http://172.16.16.136:8088/bancaplus-dummies-0.1-SNAPSHOT/webresources/extend-session',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'es-VE'
                    },
                    data: {
                        "cid": cid
                    }
                }
                // replace timeout function with actual $http call
                // the $http call will return a promise equivelant to
                defer.promise;
                $http(req).success(function(data) {
                    // presume data contains json {token: some token}
                    defer.resolve(data);
                }).error(function(){
                    defer.resolve();
                });

                return defer.promise;
            }
        }
    });