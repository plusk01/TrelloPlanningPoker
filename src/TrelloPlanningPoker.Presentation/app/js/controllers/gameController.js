'use strict';
angular.module('myApp.controllers')
    .controller('gameController', ['$rootScope', '$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function($rootScope, $window, $scope, $routeParams, trello, game) {

            $scope.isLoading = true;
            $scope.gameExists = true;

            $scope.applyOptions = [{ name: 'Maximum', value: 'maximum' }, { name: 'Minimum', value: 'minimum' }, { name: 'Average', value: 'average' }];

            game.get($routeParams.id).then(function(response) {

                if (!response.data) {
                    $scope.isLoading = false;
                    $scope.gameExists = false;
                    return;
                }
                
                $scope.game = response.data;

                $scope.gameUrl = document.URL;
                
                trello.getBoard($scope.game.boardId).then(function(board) {
                    $scope.board = board;
                });

                trello.getList($scope.game.listId).then(function(list) {
                    $scope.list = list;
                });

                trello.getUser().then(function(user) {
                    $scope.user = user;
                    $scope.isCreator = user.username == $scope.game.creator;
                });

                var intervalId;

                $scope.viewCard = function(cardId) {
                    clearInterval(intervalId);
                    $window.location.href = "#/game/" + $scope.game.id + "/" + cardId;
                };

                var getAggregateSizes = function() {
                    var doWork = function() {
                        game.getAggregateSizes($scope.game.id).then(function(r) {
                            var aggregates = r.data;
                            $scope.cards = _.map($scope.cards, function(c) {
                                var matchingAggregate = _.find(aggregates, function(a) {
                                    return a.cardId == c.id;
                                });
                                if (matchingAggregate) {
                                    c.aggregateSize = matchingAggregate;
                                }
                                return c;
                            });

                            $scope.isLoading = false;

                        });
                    };

                    intervalId = setInterval(doWork, 1000);
                };

                trello.getCards($scope.game.listId).then(function(cards) {
                    var num = 1;
                    $scope.cards = _.map(cards, function(c) {
                        c.name = c.name;
                        c.number = num;
                        num++;
                        return c;
                    });
                    getAggregateSizes();
                });

                $scope.startApplyProcess = function() {
                    $scope.successfullyAppliedPointsToCards = false;
                    $scope.almostApplying = true;
                };

                $scope.applyPointsToCardsInTrello = function(applyFrom) {

                    $scope.isApplying = true;
                    $scope.cardsApplied = 0;

                    var filteredCards = _.filter($scope.cards, function(c) {
                        return c.aggregateSize;
                    });

                    var cardsWithPoints = _.map(filteredCards, function(c) {
                        return {
                            name: c.name,
                            id: c.id,
                            points: c.aggregateSize[applyFrom.value]
                        };
                    });

                    $scope.totalCardsWithPoints = cardsWithPoints.length;

                    trello.applyPoints($scope.board.id, $scope.list.id, cardsWithPoints, function(updatedCard) {
                        _.each($scope.cards, function(c) {
                            if (c.id == updatedCard.id) {
                                c.points = updatedCard.points;
                            }
                        });
                    }).then(function() {
                        $scope.isApplying = false;
                        $scope.almostApplying = false;
                        $scope.successfullyAppliedPointsToCards = true;
                    });
                };

                $scope.deleteGame = function() {
                    if (confirm("Are you sure you want to delete this game?")) {
                        game.delete($scope.game.id).then(function() {
                            $window.location.href = "#/games";
                        });
                    }
                };
            });
        }]);