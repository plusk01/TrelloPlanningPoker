'use strict';
angular.module('myApp.controllers')
    .controller('startController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService', 'firebaseService',
        function($window, $scope, $routeParams, trello, game, firebase) {

            // firebase.$asObject().$bindTo($scope, 'games');

            trello.onAuthError(function() {
                $window.location.href = "#/login";
            });

            trello.getUser().then(function(u) {

                $scope.user = u;

                $scope.selectBoard = function(board) {

                    trello.getLists(board.id).then(function(lists) {
                        $scope.lists = lists;
                    });
                };

                $scope.selectList = function(list) {
                    $scope.tempName = $scope.board.name + '/' + list.name;
                };

                trello.getBoards(u.username).then(function(boards) {
                    $scope.boards = boards;
                });
            });

            $scope.createGame = function() {
                if (!$scope.name) $scope.name = $scope.tempName;

                game.createNew($scope.user, $scope.board, $scope.list, $scope.name).then(function() {
                    $window.location.href = "/#/game/" + $scope.list.id;
                }, function() {
                    console.log("error!");
                });
                    
                // game.createNew($scope.user.id, $scope.board.id, $scope.list.id, $scope.name).then(function(gameInfo) {
                //     $window.location.href = "/#/game/" + gameInfo.data.id;
                // });
            };

        }]);