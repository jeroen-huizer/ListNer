var db = require('./../middleware/databasehandler');
console.log(db);

var hndlr = db({schema: 'hello'});

hndlr('hi', 'hello', function(){console.log('bye')})