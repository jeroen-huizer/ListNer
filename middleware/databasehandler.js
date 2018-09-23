var database = require('./../database/database');

module.exports = DataBaseHandler;

function DataBaseHandler(config){

    database(config, function(err, db){
				 	if(err)
				 		console.log('DATABASE: '+err);
				 	else
				 		console.log('DATABASE: Connected to database.');
					});

	return function(req, res, next){
		database(config, 
				 function(err, db){
				 	if(err){
				 		console.log(err);
				 		res.send(err);
				 		res.end();
				 	}
				 	req.models = db.models;
				 	req.db = db;
					next();
				});
	}
}