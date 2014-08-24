'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'ui.sortable'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', { templateUrl: 'partials/login.html', controller: 'loginController' });
        $routeProvider.when('/start', { templateUrl: 'partials/start.html', controller: 'startController' });
        $routeProvider.when('/games', { templateUrl: 'partials/gameList.html', controller: 'gameListController' });
        $routeProvider.when('/support', { templateUrl: 'partials/support.html', controller: 'supportController' });
        $routeProvider.when('/', { templateUrl: 'partials/gameList.html', controller: 'gameListController' });
        $routeProvider.when('/game/:id', { templateUrl: 'partials/game.html', controller: 'gameController' });
        $routeProvider.when('/game/:gameId/:cardId', { templateUrl: 'partials/card.html', controller: 'cardController' });
        
    }]).run(['$rootScope', '$window', 'trelloService', function ($scope, $window, trello) {

        var getUser = function () {
            trello.getUser().then(function (user) {
                $scope.user = user;
            });
        };
        getUser();
        
        $scope.connect = function () {
            trello.connect(function () {
                getUser();
            });
        };

        $scope.disconnect = function () {
            trello.disconnect();
            $scope.user = null;
            $window.location.href = "#/login";
        };

        $(".hiddenOnStart").show();
    }]);