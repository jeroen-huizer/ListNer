var orm = require("orm");	

// Connection to the database
var connection;


function setup(db, callback){

	// Load models into the connection
	db.load("./models", function (err) {
		if (err && callback) return callback(err);
		if (err) throw err;
	});

	// Sync models and return
	db.sync(function(err){
		if (err && callback) return callback(err);
		if (err) throw err;
		return callback && callback(null, db);		
	});

}

module.exports = function({host, port, schema, user, pass}, callback){
	// Return existing connection
	if(connection) return callback(null, connection);

	// Create new connection
	var connectionString = 'postgres://'+user+':'+pass+'@'+host+':'+port+'/'+schema;
	console.log('Connecting to: ' + connectionString);

	orm.connect(connectionString, function (err, db) {
		if (err && callback) return callback(err);
		if (err) throw err;

		connection = db;

		setup(db, callback);
	});
};
