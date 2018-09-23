module.exports = function(req, res){
	if(!req.body || !req.body.action)
		res.status(404).send('');

	switch(req.body.action){
		case "save":
			save(req, res);
			break;
		case "get":
			get(req, res);
			break;
		case "delete":
			remove(req, res);
			break;
		default:
			res.status(404).send();
	}
}

function save(req, res){

	var model = req.models[req.body.model];
	var data = req.body.item;

	model.find({id: data.id}, findCallBack)

	function findCallBack(err, matched){
		errHandler(err, res);

		if(matched.length){
			matched[0].save(data, saveCallBack);
		} else{
			model.create(data, saveCallBack);
		}
	}

	function saveCallBack(err, result){
			errHandler(err, res);
			res.send(result);
	}
}

function remove(req, res){

	var model = req.models[req.body.model];
	var data = req.body.item;

	model.find(data, findCallBack);

	function findCallBack(err, results){
		errHandler(err, res)
		if(results.length){
			results[0].remove(removeCallBack);
		}else{
			removeCallBack(err);
		}
	}

	function removeCallBack(err){
			res.status(200).send();
	}

}

function get(req, res){

	var model = req.models[req.body.model];
	var query = req.body.query;

	model.find(query, findCallBack);

	function findCallBack(err, results){
		errHandler(err, res)
		res.send(results);
	}
}

function errHandler(err, res){
	if(err){
		console.log(err);
		res.status(404).send(err);
		res.end();
	}

}
