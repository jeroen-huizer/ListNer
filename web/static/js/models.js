var models = (function(window, $){

	// function Util(){};
	// Util.hash = function(inputString){
	// 	if(!inputString)
	// 		return 0
	//
	// 	var str = inputString.toLowerCase();
	//     var hash = 0;
	//     if (str.length == 0) return hash;
	//     for (i = 0; i < str.length; i++) {
	//         char = str.charCodeAt(i);
	//         hash = ((hash<<5)-hash)+char;
	//         hash = hash & hash; // Convert to 32bit integer
	//     }
	//     return hash;
	// }

	/*
	Definition of item
	*/
	function Item(id, name, count, status, rank, list){
		this.id = id
		this.name = name;
		this.count = count || 1;
		this.status = Item.Status.get(status) || Item.Status.NEW; // ["new", "done"]
		this.rank = rank;
		this.list = list;

		// not persisted
		this.selected = false;
	}

	Item.Status = {NEW: "new", DONE: "done"};
	Item.Status.get = function(name){
							if(name==="new")
								return Item.Status.NEW
							if(name==="done")
								return Item.Status.DONE
							return null
						}

	Item.prototype.commit = function(callback){

		var payload = {"id": this.id, "list": this.list, "name": this.name, "count": this.count, "status": this.status, "rank": this.rank};
		var action = {"action": "save", "model": "item", "item": payload};

		$.ajax({method: "POST",
				url: "action",
				contentType: "application/json",
				context: this,
				processData: false,
				data: JSON.stringify(action)})
		.done(function(data, status){
			if(status != "success"){
				callback && callback(new Error('Could not create object.'))
			}
			else{
				this.id = data.id
				callback && callback();
			}
		}, this);
	}

	Item.prototype.del = function(callback){
		var action = {"action": "delete", "model": "item", "data": {"id": this.id}};

		$.ajax({method: "POST",
				url: "action",
				contentType: "application/json",
				processData: false,
				data: JSON.stringify(action)})
			.done(
				function(data, status){
					if(status != "success"){
						callback && callback(new Error('Could not delete object.'))
					}
					else{
						callback && callback();
					}
				});
	}

	/*
	Definition of list
	*/
	function List(id, name, items, count){
		this.id = id || 1;
		this.name = name || 1;
		this.items = items || [];
		this.count = count || 0;
	}

	List.prototype.add = function(item){

		// Find by ID if available, otherwise, find by name
		var existingItem = this.items.find(function(obj){return item.id ? obj.id == item.id : obj.name === item.name});

		if(existingItem){
			existingItem.count = item.count ? item.count : existingItem.count + 1;
			item = existingItem;
		}
		else{
			item.list = this.id;
			item.rank = item.rank ? item.rank : Object.keys(this.items).length + 1;
			this.items.push(item);
		}

		this.count += item.count;

		return item;
	}

	List.prototype.remove = function(id){
		var item = this.items.find(function(obj){return obj.id == id });
		item.del();
		delete item;
	}

	List.prototype.deleteItems = function(items, callback){

		var action = {"action": "delete", "model": "item", "data": items};

		$.ajax({method: "POST",
				url: "action",
				contentType: "application/json",
				processData: false,
				data: JSON.stringify(action)})
			.done(
				function(data, status){
					if(status != "success"){
						callback && callback(new Error('Could not delete objects.'))
					}
					else{
						callback && callback();
					}
				});
	}

	List.prototype.decrease = function(id){
		var item = this.items.find(function(obj){return obj.id == id });
		if(item && item.count > 1){
			item.count--;
			this.count--;
		}
	}

	List.prototype.get = function(id){
		return item = this.items.find(function(obj){return obj.id == id });
	}

	List.prototype.commit = function(callback){
		for(item in this.items)
			item.commit();
	}

	List.prototype.poll = function(){
		return;

		var self = this; // Get current scope in timeout scope
		// var action = {"action": "get", "list": self.id};
		var action = {"action": "get", "model": "item", "query": {"list": seld.id}};

		$.ajax({
				context: self,
				method: "POST",
				url: "action",
				contentType: "application/json",
				processData: false,
				data: JSON.stringify(action)})
			.done(
			function(data, status){
					if(data.length){
						for(i in data){
							var newItem = new Item(data[i].id, data[i].name, data[i].count, data[i].status, data[i].rank, self.id);

							if(self.items[newItem.id]){
								var item = self.add(newItem)
								core.views.itemView.render(item); // TODO: reference to view does not belong here?
							}
							else{
								self.add(newItem)
								core.views.itemView.render(newItem)
							}

						}
					}
					core.views.itemView.sort();
					setTimeout(function(){self.poll()}, 2500);
				})
	}

	List.prototype.processPoll = function(data, status){
		console.log(this);
	}

	List.load = function(id, callback){

		// var action = {"action": "get", "list": id};
		var action = {"action": "get", "model": "item", "query": {"list": id}};


		$.ajax({method: "POST",
				url: "action",
				contentType: "application/json",
				processData: false,
				data: JSON.stringify(action)})
			.done(function(data, status){
					var newList = new List(id);

					if(data.length){
						for(i in data){
							newList.add(new Item(data[i].id, data[i].name, data[i].count, data[i].status, data[i].rank, newList.id))
						}
					}

					callback && callback(null, newList);
				})
	}


	window.core = window.core || {};
	window.core.List = List;
	window.core.Item = Item;

})(window, jQuery)
