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
	var itemModel = req.models.item;
	var itemPassed = req.body.item;

	var itemToFind = {	name: itemPassed.name,
						list: itemPassed.list};

	itemModel.find(itemToFind, function(err, items){
		errHandler(err, res);

		if(items.length){
			Object.assign(items[0], itemPassed);
			items[0].save(function(err){
					errHandler(err, res);
					res.status(200).send();		
				});			
		} else{
			itemModel.create(itemPassed, 
				function(err){
					errHandler(err, res);
					res.status(200).send();		
				}); 
		}

	});
			
}

function remove(req, res){

	var itemModel = req.models.item;
	var itemPassed = req.body.item;

	var itemToFind = {	name: itemPassed.name,
						list: itemPassed.list};

	// console.log('Deleting item: '+JSON.stringify(itemToFind));

	itemModel.find(itemToFind,
		function(err, items){
			if(items.length){
				items[0].remove(function(err){
					errHandler(err, res);
					res.status(200).send();		
				})
			}
			else{
				res.status(200).send();		
			}

		});


}

function get(req, res){

	var itemModel = req.models.item;
	// console.log('Requested items on list: '+req.body.list);

	itemModel.find({
			list: req.body.list
		},
		function(err, items){
			errHandler(err, res)
			res.send(items);
		});
}

function errHandler(err, res){
	if(err){
		console.log(err);
		res.status(404).send(err);
		res.end();
	} 

}