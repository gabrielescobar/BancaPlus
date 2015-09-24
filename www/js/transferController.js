
"use strict";

angular.module('app.controllers-transfer', ['ngCookies','currencyFilter'])



    .directive('ionicAutocomplete',
    function ($ionicPopover) {
        var popoverTemplate =
            '<ion-popover-view style="margin-top:5px">' +
            '<ion-content>' +
            '<div class="list">' +
            '<a href="#" class="item" ng-repeat="item in items | filter:inputSearch" ng-click="selectItem(item)">{{item.display}}</a>' +
            '</div>' +
            '</ion-content>' +
            '</ion-popover-view>';
        return {
            restrict: 'A',
            scope: {
                params: '=ionicAutocomplete',
                inputSearch: '=ngModel'
            },
            link: function ($scope, $element, $attrs) {
                var popoverShown = false;
                var popover = null;
                $scope.items = $scope.params.items;

                $element.attr('autocorrect', 'off');


                popover = $ionicPopover.fromTemplate(popoverTemplate, {
                    scope: $scope
                });
                $element.on('focus', function (e) {
                    if (!popoverShown) {
                        popover.show(e);
                    }
                });

                $scope.selectItem = function (item) {
                    $element.val(item.display);
                    popover.hide();
                    $scope.params.onSelect(item);
                };
            }
        };
    }
)

    .directive('fancySelect',
    [
        '$ionicModal',
        function($ionicModal) {
            return {
                /* Only use as <fancy-select> tag */
                restrict : 'E',

                /* Our template */
                templateUrl: 'fancy-select.html',

                /* Attributes to set */
                scope: {
                    'items'        : '=', /* Items list is mandatory */
                    'text'         : '=', /* Displayed text is mandatory */
                    'value'        : '=', /* Selected value binding is mandatory */
                    'callback'     : '&'
                },

                link: function (scope, element, attrs) {

                    /* Default values */
                    scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
                    scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;

                    /* Header used in ion-header-bar */
                    scope.headerText    = attrs.headerText || '';

                    /* Text displayed on label */
                    // scope.text          = attrs.text || '';
                    scope.defaultText   = scope.text || '';

                    /* Notes in the right side of the label */
                    scope.noteText      = attrs.noteText || '';
                    scope.noteImg       = attrs.noteImg || '';
                    scope.noteImgClass  = attrs.noteImgClass || '';

                    /* Optionnal callback function */
                    // scope.callback = attrs.callback || null;

                    /* Instanciate ionic modal view and set params */

                    /* Some additionnal notes here :
                     *
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector.
                     *
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view.
                     *
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     *
                     * Also, seems that animations do not work
                     * anymore.
                     *
                     */
                    $ionicModal.fromTemplateUrl(
                        'fancy-select-items.html',
                        {'scope': scope}
                    ).then(function(modal) {
                        scope.modal = modal;
                    });

                    /* Validate selection from header bar */
                    scope.validate = function (event) {
                        // Construct selected values and selected text
                        if (scope.multiSelect == true) {

                            // Clear values

                            scope.value=[];
                            scope.text = '';

                            // Loop on items
                            jQuery.each(scope.items, function (index, item) {
                                if (item.checked) {
                                    if(item.balance){
                                        scope.value.push({ide: item.id, value: item.text, balance: item.balance, minpay: item.minpay, currency: item.currency});
                                    }
                                    else{
                                        scope.value.push({ide: item.id, value: item.text, currency: item.currency});
                                    }

                                    scope.text = scope.text + item.text+', ';

                                }
                            });

                            // Remove trailing comma
                            scope.text = scope.text.substr(0,scope.text.length - 2);
                        }

                        // Select first value if not nullable
                        if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.text = scope.items[0].text;

                                // Check for multi select
                                scope.items[0].checked = true;
                            } else {
                                scope.text = scope.defaultText;
                            }
                        }

                        // Hide modal
                        scope.hideItems();

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }

                    /* Show list */
                    scope.showItems = function (event) {
                        event.preventDefault();
                        scope.modal.show();
                    }

                    /* Hide list */
                    scope.hideItems = function () {
                        scope.modal.hide();

                    }

                    /* Destroy modal */
                    scope.$on('$destroy', function() {
                        scope.modal.remove();
                    });

                    /* Validate single with data */
                    scope.validateSingle = function (item) {

                        // Set selected text
                        scope.text = item.text;
                        // Set selected value

                        scope.value = item.id+"&"+item.amount+"&"+item.text;


                        // Hide items
                        scope.hideItems();

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }
                }
            };
        }
    ]
)

    .controller('MainCtrl', function($scope,$ionicHistory,$rootScope,$state,$translate, transactionalQuery,afiliationQuery,ownAccounts,$ionicPopup, extendSession) {
        $rootScope.whereAmi="paytran";
        $scope.search="";
        $scope.myValue=true;
        $scope.Value_account_same_owner=true;
        $scope.Value_account_other_person=true;
        $scope.Value_account_external_bank=true;
        $scope.Value_creditcard_same_owner=true;
        $scope.Value_loan_same_bank=true;
        $scope.Value_services_same_bank=true;
        $scope.change = function(search) {
            if (search==""){
                $scope.Value_account_same_owner=true;
                $scope.Value_account_other_person=true;
                $scope.Value_account_external_bank=true;
                $scope.Value_creditcard_same_owner=true;
                $scope.Value_loan_same_bank=true;
                $scope.Value_services_same_bank=true;
            }
            else{
                $scope.Value_account_same_owner=false;
                $scope.Value_account_other_person=false;
                $scope.Value_account_external_bank=false;
                $scope.Value_creditcard_same_owner=false;
                $scope.Value_loan_same_bank=false;
                $scope.Value_services_same_bank=false;
                if($scope.loanowner.length > 0){
                    $scope.loanowner.forEach(function(key) {
                        if(key.text.toUpperCase().indexOf(search.toUpperCase()) > -1)
                            $scope.Value_loan_same_bank=true;
                    })
                }
                if($scope.aod.length > 0){
                    $scope.aod.forEach(function(key) {
                        if(key.text.toUpperCase().indexOf(search.toUpperCase()) > -1)
                            $scope.Value_account_same_owner=true;
                    })
                }

                if($scope.creditowner.length > 0){
                    $scope.creditowner.forEach(function(key) {
                        if(key.text.toUpperCase().indexOf(search.toUpperCase()) > -1)
                            $scope.Value_creditcard_same_owner=true;
                    })
                }
                if($scope.atsb.length > 0){
                    $scope.atsb.forEach(function(key) {
                        if(key.text.toUpperCase().indexOf(search.toUpperCase()) > -1)
                            $scope.Value_account_other_person=true;
                    })
                }
                if($scope.atob.length > 0){
                    $scope.atob.forEach(function(key) {
                        if(key.text.toUpperCase().indexOf(search.toUpperCase()) > -1)
                            $scope.Value_account_external_bank=true;
                    })
                }
            }

        };

        var datos= $rootScope.data;

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
                var trans = transactionalQuery.querytrans($rootScope.cookieId);

                trans.then(function (data) {
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
                            content: data.status.msg
                        });

                    }
                    else {
                        $scope.atsb = ownAccounts.transfer(data.dir.tt, "tt");
                        $scope.atob = ownAccounts.transfer(data.dir.to, "to");

                        $scope.creditowner = ownAccounts.transfer(data.minPayments, "credit-card");
                        console.log($scope.creditowner);
                    }
                });
            }
        });



        $scope.aof = ownAccounts.transfer(datos.globalStatement.instruments,"payer");
        $scope.aod  = ownAccounts.transfer(datos.globalStatement.instruments,"payable");
        $scope.loanowner = ownAccounts.transfer(datos.globalStatement.instruments,"loan");

        var total=[];
        total.push($scope.aof);
        total.push($scope.aod);
        total.push($scope.loanowner);

        $scope.val =  {
            account_origin_fund: null,
            account_same_owner: null,
            account_other_person: null,
            account_external_bank: null,
            creditcard_same_owner: null,
            loan_same_bank: null,
            services_same_bank: null
        };

        $scope.account_origin_fund = $translate.instant("account_origin_fund");
        $scope.account_same_owner = $translate.instant("account_same_owner");
        $scope.account_other_person = $translate.instant("account_other_person");
        $scope.account_external_bank = $translate.instant("account_external_bank");
        $scope.creditcard_same_owner = $translate.instant("creditcard_same_owner");
        $scope.creditcard_other_bank = $translate.instant("creditcard_other_bank");
        $scope.loan_same_bank = $translate.instant("loan_same_bank");
        $scope.services_same_bank = $translate.instant("services_same_bank");

        var result=[];

        if($rootScope.itemtransf && $rootScope.itemtransf.option=="payer"){
            $scope.account_origin_fund = $rootScope.itemtransf.name+' '+$rootScope.itemtransf.idI+'.  '+$translate.instant("amount")+' bsf.'+$rootScope.itemtransf.amount;
            console.log($scope.account_origin_fund);
            $scope.val.account_origin_fund=$rootScope.itemtransf.idE+"&"+$rootScope.itemtransf.amount+"&"+$scope.account_origin_fund;
        }

        else if($rootScope.itemtransf && $rootScope.itemtransf.option=="payable"){
            if ($rootScope.itemtransf.classification=="loan"){
                $scope.loan_same_bank = $rootScope.itemtransf.name+' '+$rootScope.itemtransf.idI;
                result.push({ide: $rootScope.itemtransf.idE, value: $rootScope.itemtransf.name+' '+$rootScope.itemtransf.idI});
                $scope.val.loan_same_bank=result;
            }
            else if ($rootScope.itemtransf.classification=="account"){
                $scope.account_same_owner = $rootScope.itemtransf.name+' '+$rootScope.itemtransf.idI;
                result.push({ide: $rootScope.itemtransf.idE, value: $rootScope.itemtransf.name+' '+$rootScope.itemtransf.idI});
                $scope.val.account_same_owner=result;
            }
            else if ($rootScope.itemtransf.classification=="credit-card"){
                $scope.creditcard_same_owner = $rootScope.itemtransf.name+' '+$rootScope.itemtransf.idI;
                result.push({ide: $rootScope.itemtransf.idE, value: $rootScope.itemtransf.name+' '+$rootScope.itemtransf.idI});
                $scope.val.creditcard_same_owner=result;
            }
        }

        $scope.next = function() {
            console.log($scope.val.account_origin_fund);

            if ($scope.val.account_same_owner){
                $scope.same_account=false;
                $scope.val.account_same_owner.forEach(function(key) {

                    var res = $scope.val.account_origin_fund.split("&");
                    res =res[0];

                    if(key.ide == res){
                        $scope.same_account=true;
                    }
                })
            }

            $rootScope.transf= $scope.val;
            if (!$scope.val.account_origin_fund){
                $ionicPopup.alert({
                    title: $translate.instant("message"),
                    content: $translate.instant("noorig")
                });
            }
            else if (!$scope.val.account_same_owner && !$scope.val.account_other_person && !$scope.val.account_external_bank &&
                !$scope.val.creditcard_same_owner  && !$scope.val.loan_same_bank && !$scope.val.services_same_bank){
                $ionicPopup.alert({
                    title: $translate.instant("message"),
                    content: $translate.instant("nodest")
                });

            }
            else if ($scope.same_account==true){
                $ionicPopup.alert({
                    title: $translate.instant("message"),
                    content: $translate.instant("origdist")
                });
            }
            else {

                $state.go('eventmenu.transferamount');
            }
            return true;
        }

    })

