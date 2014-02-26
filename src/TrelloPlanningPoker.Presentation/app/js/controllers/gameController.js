﻿'use strict';
angular.module('myApp.controllers')
    .controller('gameController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function($window, $scope, $routeParams, trello, game) {

            game.get($routeParams.id).then(function (response) {
                $scope.game = response.data;
                
                trello.getBoard($scope.game.boardId).then(function (board) {
                    $scope.board = board;
                });

                trello.getList($scope.game.listId).then(function (list) {
                    $scope.list = list;
                });

                trello.getUser().then(function(user) {
                    $scope.user = user;
                });

                var intervalId;

                $scope.viewCard = function (cardId) {
                    clearInterval(intervalId);
                    $window.location.href = "#/game/" + $scope.game.id + "/" + cardId;
                };
                
                var getAggregateSizes = function () {
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
                        });
                    };

                    intervalId = setInterval(doWork, 1000);
                };
                
                trello.getCards($scope.game.listId).then(function (cards) {
                    var num = 1;
                    $scope.cards = _.map(cards, function (c) {
                        c.name = c.name.replace(/\(\d+\) /g, '');
                        c.number = num;
                        num++;
                        return c;
                    });
                    getAggregateSizes();
                });

                $scope.applyPointsToCardsInTrello = function () {

                    $scope.isApplying = true;
                    $scope.cardsApplied = 0;
                    
                    var filteredCards = _.filter($scope.cards, function (c) {
                        return c.aggregateSize;
                    });
                    
                    var cardsWithPoints = _.map(filteredCards, function (c) {
                        return {
                            name: c.name,
                            id: c.id,
                            points: c.aggregateSize.maximum
                        };
                    });
                    
                    $scope.totalCardsWithPoints = cardsWithPoints.length;
                    
                    trello.applyPoints($scope.board.id, $scope.list.id, cardsWithPoints, function (num) {
                        $scope.cardsApplied = num;
                    }).then(function () {
                        $scope.isApplying = false;
                    });
                };
            });
        }]);