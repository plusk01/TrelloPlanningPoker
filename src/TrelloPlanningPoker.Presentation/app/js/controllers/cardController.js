'use strict';
angular.module('myApp.controllers')
    .controller('cardController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function($window, $scope, $routeParams, trello, game) {

            $scope.sizes = [1, 2, 3, 5, 8, 13, 21];

            var intervalId;
            var getSizes = function () {

                var getEm = function() {
                    game.getSizes($scope.card.id).then(function(response) {
                        $scope.allSizes = response.data;
                    });
                };

                getEm();

                intervalId = setInterval(getEm, 1000);
            };

            trello.getCard($routeParams.cardId).then(function (card) {
                $scope.card = card;
                
                trello.getUser().then(function (user) {
                    $scope.user = user;

                    game.getSize(user.username, card.id).then(function (response) {
                        if (response.data) {
                            $scope.selectedSize = response.data.points;
                            getSizes();
                        }
                    });
                });
            });

            $scope.setSize = function (size) {
                $scope.selectedSize = size;
                game.setSize($scope.user.username, $scope.game.id, $scope.card.id, size)
                    .then(getSizes);
            };

            game.get($routeParams.gameId).then(function(response) {
                $scope.game = response.data;
            });

            $scope.goBackToGame = function() {
                clearInterval(intervalId);
                $window.location.href = "/#/game/" + $scope.game.id;
            };
        }]);