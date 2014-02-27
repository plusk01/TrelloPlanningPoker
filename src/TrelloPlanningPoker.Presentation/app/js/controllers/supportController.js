'use strict';
angular.module('myApp.controllers')
    .controller('supportController', ['$window', '$scope', '$routeParams', 'trelloService', 'gameService',
        function ($window, $scope, $routeParams, trello, game) {

        	trello.onAuthError(function () {
        		$window.location.href = "#/login";
        	});

            trello.getUser().then(function(u) {

                $scope.fullName = u.fullName;

            });

        }]);