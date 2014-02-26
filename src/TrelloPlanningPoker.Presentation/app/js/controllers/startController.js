'use strict';
angular.module('myApp.controllers')
    .controller('startController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function ($window, $scope, $routeParams, trello, game) {

        if (!$scope.user) {
            trello.getUser().then(function (u) {

                $scope.user = u;

                $scope.selectBoard = function (board) {
                    
                    trello.getLists(board.id).then(function (lists) {
                    
                        $scope.lists = lists;
                    });
                };

                trello.getBoards(u.username).then(function(boards) {
                    $scope.boards = boards;                    
                });
            });
            
            $scope.createGame = function () {

                trello.getCards($scope.list.id).then(function (cards) {
                    var cardIds = _.map(cards, function (c) {
                        return c.id;
                    });
                    game.create($scope.user.username, $scope.board.id, $scope.list.id, cardIds).then(function (gameInfo) {
                        debugger;
                        $window.location.href = "/#/game/" + gameInfo.data.id;
                    });
                });                
            };
        }
    }]);