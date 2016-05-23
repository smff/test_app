//like a module ... may be use BASENAME_APP for it?
angular.module('dataProvider', [])
  .provider('dataProvider', function () {
    var provider, conf;
    return {
      setProvider: function (value, config) {
        provider = value;
        conf = config;
      },
      $get: function () {
        return new window[provider](conf);
      }
    }
  });

//base dataProvider
function ADataProvider() {
  this.open = function () {
    console.log('Your must create a open function');
    return false;
  };
  this.create = function () {
    console.log('Your must create a create function');
    return false;
  };
  this.read = function () {
    console.log('Your must create a read function');
    return false;
  };
  this.update = function () {
    console.log('Your must create a update function');
    return false;
  };
  this.delete = function () {
    console.log('Your must create a delete function');
    return false;
  };
}

//dataProvider for indexedDB
function IndexedDBProvider(config) {
  var db = null;

  //search for working object
  window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

  //search for working object again
  if ('webkitIndexedDB' in window) {
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
  }

  //and again
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

  this.onerror = function (e) {
    console.log(e);
  };


  this.open = function (fn) {

    if (window.indexedDB) {
      var request = window.indexedDB.open(config.db_name, config.version);

      //for new user or update version
      request.onupgradeneeded = function (e) {
        db = e.target.result;

        e.target.transaction.onerror = this.onerror;

        if (!db.objectStoreNames.contains("tasks")) {
          var objectStore = db.createObjectStore("tasks", {keyPath: "task_id", autoIncrement: false});
          //for searching
          objectStore.createIndex("task_start", "task_start", {unique: false});
          objectStore.createIndex("task_end", "task_end", {unique: false});
        }
      };

      request.onsuccess = function (e) {
        db = e.target.result;
        fn();
      };
    }
    else {
      console.log('ERROR: Error occured while accessing indexedDB.')
    }
    request.onerror = this.onerror;
  };


  this.create = function (record, fn) {
    var request = db.transaction('tasks', "readwrite")
      .objectStore('tasks')
      .put(record);

    request.onsuccess = function (e) { // activate the callback if record created successfully
      fn();
    };

    request.onerror = function (e) {
      console.log(e.value);
    };
  };


  this.delete = function (id, fn) {
    var request = db.transaction('tasks', "readwrite")
      .objectStore('tasks')
      .delete(id);

    request.onsuccess = function (e) {    // activate the callback if record deleted successfully
      fn();
    };

    request.onerror = function (e) {
      console.log(e);
    };
  };


  this.getRange = function (start_time, end_time, iterateFn, endFn) {

    var request = db.transaction("tasks", "readonly")
      .objectStore("tasks")
      .index("task_start")
      .openCursor(IDBKeyRange.bound(start_time, end_time));

    request.onsuccess = function (event) {
      var cursor = event.target.result;

      if (cursor) {

        iterateFn(cursor.value);
        cursor.continue();
      }
      else {               // When the cursor is null, all the records have been iterated
        endFn();
      }
    };

    request.onerror = this.onerror;
  };

}

IndexedDBProvider.prototype = new ADataProvider();

function MySQLProvider(config) {
  this.open = function () {
    return 'open fn from MySQLProvider() class'
  };
  this.create = function () {
    return 'create fn from MySQLProvider() class'
  };
  this.read = function () {
    console.log('read fn from MySQLProvider() class');
    return false;
  };
  this.update = function () {
    console.log('update fn from MySQLProvider() class');
    return false;
  };
  this.delete = function () {
    console.log('delete fn from MySQLProvider() class');
    return false;
  };
}
MySQLProvider.prototype = new ADataProvider();