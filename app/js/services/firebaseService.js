'use strict';

angular.module('myApp.services')
.factory('firebaseService', ['$rootScope', '$firebase', '$q',
		function($rootScope, $firebase, $q) {
	var ref = new Firebase('https://sizzling-torch-264.firebaseio.com/tpp');
    var sync = $firebase(ref);

    var scope = $rootScope.$new();

    var deferred = $q.defer();

    sync.$asObject().$bindTo(scope, 'games').then(function() {
    	deferred.resolve(scope);
    });

    return deferred.promise;
}])