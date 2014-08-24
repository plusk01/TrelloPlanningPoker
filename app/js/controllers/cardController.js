'use strict';
angular.module('myApp.controllers')
    .controller('cardController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function($window, $scope, $routeParams, trello, game) {

            $scope.isLoading = true;
            
            $scope.sizes = [.5, 1, 2, 3, 5, 8, 13, 21];

            var intervalId;
            var getSizes = function () {

                var getEm = function() {
                    game.getSizes($scope.card.id).then(function(response) {
                        $scope.allSizes = response.data;

                        _.each($scope.allSizes, function(s) {
                            if (s.username == $scope.user.username)
                                $scope.selectedSize = s.points;
                        });
                    });
                    
                    $scope.isLoading = false;
                };

                getEm();

                intervalId = setInterval(getEm, 1000);
            };

            trello.getCard($routeParams.cardId).then(function (card) {
                $scope.card = card;
                
                trello.getUser().then(function (user) {
                    $scope.user = user;
                    getSizes();
                    
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