'use strict';
angular.module('myApp.controllers')
    .controller('gameListController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function ($window, $scope, $routeParams, trello, game) {

            trello.onAuthError(function () {
                $window.location.href = "#/login";
            });

            $scope.isLoading = true;
            
            trello.getUser().then(function (user) {
                $scope.user = user;

                game.getAll(user.username).then(function (response) {
                    $scope.games = response.data;
                    $scope.isLoading = false;
                });
            });

            $scope.startNewGame = function () {
                $window.location.href = "/#/start";
            };
        }]);