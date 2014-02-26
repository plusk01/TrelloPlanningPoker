'use strict';
angular.module('myApp.controllers')
    .controller('loginController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function ($window, $scope, $routeParams, trello, game) {

            trello.onAuthError(function () {                

            });

            trello.getUser().then(function () {
                $window.location.href = "/#/games";
            });
            
            $scope.connect = function () {
                trello.connect(function () {
                    $window.location.href = "/#/games";
                });                
            };
        }]);