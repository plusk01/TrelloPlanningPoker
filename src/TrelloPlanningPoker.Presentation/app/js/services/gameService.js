﻿'use strict';
angular.module('myApp.services')
    .service('gameService', ['$q', '$http', function($q, $http) {

        return {
            create: function(username, boardId, listId, cardIds) {
                return $http.post("/game", { username: username, boardId: boardId, listId: listId, cardIds: cardIds });
            },
            get: function(gameId) {
                return $http.get("/game/" + gameId);
            },
            setSize: function(username, gameId, cardId, size) {
                return $http.post("/game/" + gameId + "/card/" + cardId + "/size/", { username: username, points: size });
            },
            getSizes: function(cardId) {
                return $http.get("/card/" + cardId + "/sizes");
            },
            getAggregateSizes: function (gameId) {
                return $http.get("/game/" + gameId + "/aggregateSizes");
            },
            getSize: function(username, cardId) {
                return $http.get("/card/" + cardId + "/" + username + "/size");
            }
        };
    }]);