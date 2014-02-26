'use strict';
angular.module('myApp.controllers')
    .controller('startController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function($window, $scope, $routeParams, trello, game) {

            if (!$scope.user) {
                trello.getUser().then(function(u) {

                    $scope.user = u;

                    $scope.selectBoard = function(board) {

                        trello.getLists(board.id).then(function(lists) {

                            $scope.lists = lists;
                        });
                    };

                    $scope.selectList = function (list) {
                        $scope.tempName = $scope.board.name + '/' + list.name;
                    };
                    
                    trello.getBoards(u.username).then(function(boards) {
                        $scope.boards = boards;
                    });
                });

                $scope.createGame = function() {
                    if (!$scope.name) $scope.name = $scope.tempName;
                    game.create($scope.user.username, $scope.board.id, $scope.list.id, $scope.name).then(function(gameInfo) {
                        $window.location.href = "/#/game/" + gameInfo.data.id;
                    });
                };
            }
        }]);