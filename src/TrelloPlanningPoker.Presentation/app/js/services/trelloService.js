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

        var pointPattern = /\([0-9]+(.[0-9]+)?\)/g;
        
        var removePointsFromName = function(name) {
            var newName = name.replace(pointPattern, '').trim();
            return newName;
        };

        var getPointsFromName = function (name) {
            var pointsSection = name.match(pointPattern);
            if (!pointsSection) return;
            var points = pointsSection[0].replace('(', '').replace(')', '');
            return points;
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
                            var originalCardName = c.name;
                            c.name = removePointsFromName(originalCardName);
                            c.points = getPointsFromName(originalCardName);
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
                        var originalCardName = card.name;
                        card.name = removePointsFromName(originalCardName);
                        card.points = getPointsFromName(originalCardName);
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
                        work.push(Trello.put("/cards/" + c.id, { name: newName }, function (card) {
                            card.points = c.points;
                            onProgress(card);
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