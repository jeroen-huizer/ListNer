var orm = require("orm");	

// Connection to the database
var connection;


function setup(db, callback){

	console.log('DATABASE: Loading models.');

	// Load models into the connection
	db.load("models", function (err) {
		if (err && callback) return callback(err);
		if (err) throw err;

		console.log('DATABASE: Loaded models.');

		// Sync models and return
		db.sync(function(err){
			if (err && callback) return callback(err);
			if (err) throw err;
			console.log('DATABASE: Synchronized models.');
			return callback && callback(null, db);		
		});
	});
}

module.exports = function(database_url, callback){
	// Return existing connection
	if(connection) return callback(null, connection);

	// Create new connection
	// var connectionString = 'postgres://'+user+':'+pass+'@'+host+':'+port+'/'+schema;
	console.log('DATABASE: Connecting to: ' + database_url);

	orm.connect(database_url, function (err, db) {
		if (err && callback) return callback(err);
		if (err) throw err;

		connection = db;

		setup(db, callback);
	});
};
