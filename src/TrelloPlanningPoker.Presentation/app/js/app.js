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
        $routeProvider.when('/start', { templateUrl: 'app/partials/start.html', controller: 'startController' });
        $routeProvider.when('/game/:id', { templateUrl: 'app/partials/game.html', controller: 'gameController' });
        $routeProvider.when('/game/:gameId/:cardId', { templateUrl: 'app/partials/card.html', controller: 'cardController' });
        //$routeProvider.when('/event/:id', { templateUrl: 'app/partials/eventDetails.html', controller: 'eventsController' });

        //$routeProvider.when('/createEventItem', { templateUrl: 'app/partials/createEventItem.html', controller: 'eventItemsController' });
        //$routeProvider.when('/eventItems', { templateUrl: 'app/partials/eventItems.html', controller: 'eventItemsController' });
        //$routeProvider.when('/eventItem/:id', { templateUrl: 'app/partials/eventItemDetails.html', controller: 'eventItemsController' });

        $routeProvider.otherwise({ redirectTo: '/start' });
    }]);