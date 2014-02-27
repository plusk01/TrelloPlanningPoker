'use strict';
angular.module('myApp.services')
    .service('trelloService', ['$q', function($q) {

        var authErrorCallback = function() {
            connectWithTrello();
        };

        var connectWithTrello = function (onAuth) {
            Trello.authorize({
                interactive: true,
                persist: true,
                success: function () {
                    onAuth();
                },
                error: function () {
                    throw new Error("Trello auth error!");
                },
                scope: { write: true, read: true },
                name: "Trello Planning Poker",
            });
        };
        
        var authenticate = function (callback) {
            Trello.authorize({
                interactive: false,
                success: function () {
                    callback();
                },
                error: function () {
                    console.log("Trello not logged in.");
                    if (authErrorCallback) authErrorCallback();
                }
            });
        };

        return {
            onAuthError: function (callback) {
                authErrorCallback = callback;
            },
            connect: function(onAuth) {
                connectWithTrello(onAuth);
            },
            disconnect: function() {
                Trello.deauthorize();
            },
            getUser: function() {
                var def = $q.defer();
                authenticate(function() {
                    Trello.members.get("me", function(member) {
                        def.resolve(member);
                    });
                });
                return def.promise;
            },
            getBoards: function(username) {
                var def = $q.defer();
                authenticate(function() {
                    Trello.get("/members/" + username + "/boards", function(boards) {
                        def.resolve(boards);
                    });
                });
                return def.promise;
            },
            getBoard: function(boardId) {
                var def = $q.defer();
                authenticate(function() {
                    Trello.get("/boards/" + boardId, function(board) {
                        def.resolve(board);
                    });
                });
                return def.promise;
            },
            getLists: function(boardId) {
                var def = $q.defer();
                authenticate(function() {
                    Trello.get("/board/" + boardId + "/lists", function(lists) {
                        def.resolve(lists);
                    });
                });
                return def.promise;
            },
            getList: function(listId) {
                var def = $q.defer();
                authenticate(function() {
                    Trello.get("/lists/" + listId, function(list) {
                        def.resolve(list);
                    });
                });
                return def.promise;
            },
            getCards: function(listId) {
                var def = $q.defer();
                authenticate(function() {
                    Trello.get("/lists/" + listId + "/cards", function (cards) {
                        cards = _.map(cards, function (c) {
                            c.name = c.name.replace(/\(\d+\) /g, '');
                            return c;
                        });
                        def.resolve(cards);
                    });
                });
                return def.promise;
            },
            getCard: function(cardId) {
                var def = $q.defer();
                authenticate(function() {
                    Trello.get("/cards/" + cardId, function (card) {
                        card.name = card.name.replace(/\(\d+\) /g, '');
                        def.resolve(card);
                    });
                });
                return def.promise;
            },
            applyPoints: function(boardId, listId, cardsWithPoints, onProgress) {
                var def = $q.defer();
                authenticate(function() {
                    var work = [];
                    _.each(cardsWithPoints, function(c) {
                        var nameWithoutPoints = c.name.replace(/\(\d+\) /g, '');
                        var newName = "(" + c.points + ") " + nameWithoutPoints;
                        work.push(Trello.put("/cards/" + c.id, { name: newName }, function(response) {
                            onProgress(response);
                        }));
                    });

                    $q.all(work).then(function() {
                        def.resolve();
                    });
                });
                return def.promise;
            }
        };
    }]);