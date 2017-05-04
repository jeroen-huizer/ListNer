(function(window, $){

	function ListView(){
		this.$list = $('#list');
	}

	ListView.prototype.add = function (itemView){
		itemView.prependTo(this.$list);
	}

	ListView.prototype.sort = function(){
		// Just resorts all items that are in the view
		this.$list.find('a').sort(function(a, b){return a.dataset.rank > b.dataset.rank}).appendTo(this.$list);
	}

	function ItemView(listView){

		if(!listView)
			throw new Error('Item view can only be instantiated with a ListView context')

		this.$list = listView;

		this.$mainInput =  $('#maininput');
		this.$recordButton = $('#recordbutton');
	

		this.$mainInput.on('keypress', enterOnInput);
		this.$recordButton.on('click', toggleRecording);

		this.$mainInput.focus();
	}

	ItemView.prototype.renderNewItem = function (item) {
		var itemView = $('<a>').text(item.name)
			.addClass('list-group-item')
			.addClass('text-capitalize')
			.attr('id', item.guid)
			.attr('data-rank', item.rank);

		if(item.status === 'done'){
			itemView.addClass('list-group-item-danger');
		}

		//itemView.click(clickItem);
		itemView.swipe({swipeRight:  swipeItemRight, swipeLeft: swipeItemLeft, tap: clickItem});
	
		var badgeView = $('<span>').text(item.count>1?item.count:'').addClass('badge')
		badgeView.appendTo(itemView);

		this.$list.add(itemView);

	}

	ItemView.prototype.renderUpdatedItem = function(item){
		var itemView = $('#'+item.guid);

		itemView.text(item.name);
		itemView.attr('data-rank', item.rank);
		if(item.status === core.Item.Status.NEW && itemView.hasClass('list-group-item-danger'))
			itemView.removeClass('list-group-item-danger');
		else if(item.status === core.Item.Status.DONE)
			itemView.addClass('list-group-item-danger');
			
		var badgeView = $('<span>').text(item.count>1?item.count:'').addClass('badge')
		badgeView.appendTo(itemView);
	}

	ItemView.prototype.removeItem = function(id){
		$('#'+id).remove();
	}
	
	function enterOnInput(e){
		if(e.which == 13){
			var input = $(this).val().toLowerCase();
		
			//TODO: Move to a controller
			var newItem = new core.Item(input);
			var existingItem = core.data.list.get(newItem.guid);

			if(existingItem){
				core.data.list.add(existingItem);
				core.views.itemView.renderUpdatedItem(existingItem);
				existingItem.commit();
			}
			else{
				core.data.list.add(newItem);
				core.views.itemView.renderNewItem(newItem);
				newItem.commit();
			}

			core.views.listView.sort();
			
			$(this).val('');
		}
	}

	function clickItem(e){
		var item = core.data.list.get($(this).attr('id'));

		switch(item.status){
			case core.Item.Status.NEW:
				item.status = core.Item.Status.DONE;
				item.rank = 2; //TODO: Elaborate ranking
				break;
			case core.Item.Status.DONE:
				item.status = core.Item.Status.NEW;
				item.rank = 1;
				break;
			default:
				item.status = core.Item.Status.NEW;
				item.rank = 1;
		}

		item.commit();
		
		core.views.itemView.renderUpdatedItem(item);
		core.views.listView.sort();
	}

	function swipeItemRight(e){
		var guid = $(this).attr('id');
		core.views.itemView.removeItem(guid);
		core.data.list.remove(guid);
	}

	function swipeItemLeft(e){
		var item = core.data.list.get($(this).attr('id'));
		core.data.list.decrease(item.guid);
		item.commit();
		
		core.views.itemView.renderUpdatedItem(item);
		core.views.listView.sort();
	}

	function toggleRecording(){
		if(ux.recordButton.hasClass('active')){
			ux.recordButton.removeClass('btn-danger');
			ux.recordButton.removeClass('active');
			ux.recordButton.addClass('btn-primary');
		}
		else{
			ux.recordButton.removeClass('btn-primary');
			ux.recordButton.addClass('btn-danger');
			ux.recordButton.addClass('active');
		}
	}

	window.core = window.core || {};
	window.core.ItemView = ItemView;
	window.core.ListView = ListView;

})(window, jQuery)
