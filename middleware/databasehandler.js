var database = require('./../database/database');

module.exports = DataBaseHandler;

function DataBaseHandler(config){
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