function LocalDataStore(dataStoreName, promiseLib) {

    function supports_html5_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    if (!supports_html5_storage) {
        var message = "This browser doesn't support html5 localStorage. Please download a better browser.";
        alert(message);
        throw message;
    }

    var db = new localStorageDB(dataStoreName, window['localStorage']);

    var onInsert, onUpdate, onDelete;

    return {
        init: function (newDatabaseInit) {
            if (db.isNew()) {
                newDatabaseInit(db);
            }
        },
        onInsert: function (fn) {
            onInsert = fn;
        },
        insert: function (resource, obj) {
            var deferred = promiseLib.defer();
            db.insert(resource, obj);
            db.commit();
            deferred.resolve(true);
            if (onInsert) onInsert(resource, obj);
            return deferred.promise;
        },
        onUpdate: function (fn) {
            onUpdate = fn;
        },
        update: function (resource, condition, changes) {
            var deferred = promiseLib.defer();
            var updateFunction = function (item) { return _.extend(item, changes); };
            db.update(resource, condition, updateFunction);
            db.commit();
            deferred.resolve(true);
            if (onUpdate) onUpdate(resource, condition, changes);
            return deferred.promise;
        },
        onDelete: function (fn) {
            onDelete = fn;
        },
        'delete': function (resource, objId) {
            var deferred = promiseLib.defer();
            db.deleteRows(resource, { ID: objId });
            db.commit();
            deferred.resolve(true);
            if (onDelete) onDelete(resource, objId);
            return deferred.promise;
        },
        get: function (resource, objId) {
            var deferred = promiseLib.defer();
            deferred.resolve(db.query(resource, { ID: objId }));
            return deferred.promise;
        },
        getMany: function (resource, objIds) {
            var deferred = promiseLib.defer();
            var many = _.map(objIds, function (id) {
                return db.query(resource, { ID: id })[0];
            });
            deferred.resolve(many);
            return deferred.promise;
        },
        getAll: function (resource, query) {
            var deferred = promiseLib.defer();
            deferred.resolve(db.query(resource, query));
            return deferred.promise;
        }
    };

}
