var models = (function(window, $){

	function Util(){};
	Util.hash = function(inputString){
		if(!inputString)
			return 0

		var str = inputString.toLowerCase();
	    var hash = 0;
	    if (str.length == 0) return hash;
	    for (i = 0; i < str.length; i++) {
	        char = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	}

	/* 
	Definition of item
	*/	
	function Item(name, count, status, rank, list){
		this.name = name;
		this.count = count || 1;
		this.status = Item.Status.get(status) || Item.Status.NEW; // ["new", "done"]
		this.rank = rank || 1;
		this.list = list;

		this.guid = Util.hash(this.name);
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
		var payload = {"list": this.list, "name": this.name, "count": this.count, "status": this.status, "rank": this.rank};
		var action = {"action": "save", "item": payload}; 

		$.ajax({method: "POST", 
				url: "action", 
				contentType: "application/json", 
				processData: false, 
				data: JSON.stringify(action)})
		.done(function(data, status){
			if(status != "success"){
				callback && callback(new Error('Could not create object.'))
			}
			else{
				callback && callback();
			}
		});
	}

	Item.prototype.del = function(callback){
		var action = {"action": "delete", "item": {"list": this.list ,"name": this.name}}; 

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
		this.items = items || {};
		this.count = count || 0;
	}

	List.prototype.add = function(item){
		var exists = this.items[item.guid]

		if(exists){
			this.items[item.guid].count += 1;
			item = this.items[item.guid];
		}
		else{
			item.list = this.id;
			this.items[item.guid] = item;
		}

		this.count += item.count;

		return item;
	}

	List.prototype.remove = function(guid){
		this.items[guid].del();
		delete this.items[guid]; 
	}

	List.prototype.decrease = function(guid){
		var item = this.items[guid];
		if(item && item.count > 1){
			item.count--;
			this.count--;
		}
	}

	List.prototype.get = function(guid){
		return this.items[guid];
	}

	List.prototype.commit = function(callback){
		for(guid in Object.keys(this.items))
			this.items[guid].commit();
	}

	List.load = function(id, callback){

		var action = {"action": "get", "list": id}; 

		$.ajax({method: "POST", 
				url: "action", 
				contentType: "application/json", 
				processData: false, 
				data: JSON.stringify(action)})
			.done(function(data, status){
					var newList = new List(id);

					if(data.length){
						for(i in data){
							newList.add(new Item(data[i].name, data[i].count, data[i].status, data[i].rank, newList.id))
						}
					}

					callback && callback(null, newList);
				})
	}


	window.core = window.core || {};
	window.core.List = List;
	window.core.Item = Item;

})(window, jQuery)