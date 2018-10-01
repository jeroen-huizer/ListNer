(function(window, $){

	function ItemView(){

		this.$list =  $('#list');

		this.$mainInput =  $('#maininput');
		this.$recordButton = $('#recordbutton');
		this.$openMenuButton = $('#openmenu');
		this.$closeMenuButton = $('#closemenu');
		this.$selectAllButton = $('#selectall');
		this.$trashButton = $('#trashbutton');

		this.$mainInput.on('keypress', enterOnInput);
		this.$recordButton.on('click', toggleRecording);
		this.$trashButton.on('click', clickTrashButton);
		this.$openMenuButton.on('click', clickOpenMenuButton);
		this.$closeMenuButton.on('click', clickCloseMenuButton);
		this.$selectAllButton.on('click', clickSelectAllButton);

		this.$mainInput.focus();

		this.mode = 'normal';
		this.$list.addClass('normal-mode');
	}

	ItemView.prototype.render = function (item) {

		// <div>
		// 		<input type="checkbox"/>
		// 		<a>
		//		 	<input type="checkbox"/>
		// 			<p>item name</p>
		// 			<span class="badge">2</span
		// 		</a>
		// 	<div>
		// </div>

		var itemContainer = $('<div>')
				.addClass('item-container')
				.attr('data-rank', item.rank)
				.attr('id', item.id);

		var itemAnchor = $('<a>')
			.addClass('list-group-item');

		if(item.status === 'done'){
			itemAnchor.addClass('list-group-item-danger');
		}

		itemAnchor.click(clickItem);
		// itemAnchor.swipe({swipeRight:  swipeItemRight, swipeLeft: swipeItemLeft, allowPageScroll:"vertical", tap: clickItem});

		var itemSelector = $('<span>')
			.addClass('select-marker')
			.addClass('glyphicon')
			.addClass('glyphicon-ok')
			.addClass('small')
			.css('margin-right', '5px')
			.css('color', item.selected ? 'lightgreen': '#999');

		var itemLabel = $('<span>').text(item.name)
			.addClass('text-capitalize');

		var badge = $('<span>').text(item.count>1?item.count:'')
			.addClass('badge');

		itemAnchor.appendTo(itemContainer);
		itemSelector.appendTo(itemAnchor);
		itemLabel.appendTo(itemAnchor);
		badge.appendTo(itemAnchor);

		// Add to or replace in DOM
		if($('#'+item.id).length){
			$('#'+item.id).replaceWith(itemContainer);
		}	else{
			itemContainer.prependTo(this.$list);
		}
	}

	ItemView.prototype.remove = function(items){
		items.forEach(function(item){
			$('#'+item.id).remove();
		});
	}

//Fix this to deal with the new div wrapper
	ItemView.prototype.sort = function(){
		this.$list.find('.item-container').sort(function(a, b){return -(a.dataset.rank - b.dataset.rank)}).prependTo(this.$list);

	  // console.log(list)
	  if(this.$list.find('.item-container').length)
	    this.$list.show();
	  else
	    this.$list.hide();
	}

	ItemView.prototype.toggleListner = function(){
		if(this.$recordButton.hasClass('active')){
			this.$recordButton.removeClass('btn-danger');
			this.$recordButton.removeClass('active');
			this.$recordButton.addClass('btn-primary');
		}
		else{
			this.$recordButton.removeClass('btn-primary');
			this.$recordButton.addClass('btn-danger');
			this.$recordButton.addClass('active');
		}
	}

	function enterOnInput(e){
		if(e.which == 13){
			var input = $(this).val().toLowerCase();

			var existingItem = core.data.list.items.find(function(obj){return obj.name === input})
			if(existingItem){

				existingItem.count += 1;
				existingItem.commit(function(){
					core.views.itemView.render(existingItem);
				});
			}
			else{
				var newItem = new core.Item(null, input);
				newItem.list = core.data.list.id;
				newItem.commit(function(){
					core.data.list.add(newItem);
					core.views.itemView.render(newItem);
					core.views.itemView.sort()
				});
			}

			// core.views.listView.sort();
			$(this).val('');
		}
	}

	function clickItem(e){
		if(!e.cancelable)
			return;

		var itemId = $(this).parent().attr('id');
		var item = core.data.list.get(itemId);

		var mode = core.views.itemView.mode;
		if(mode == 'normal'){
			switch(item.status){
				case core.Item.Status.NEW:
				item.status = core.Item.Status.DONE;
				item.rank = -1*item.rank; //TODO: Elaborate ranking
				break;
				case core.Item.Status.DONE:
				item.status = core.Item.Status.NEW;
				item.rank = Math.abs(item.rank);
				break;
				default:
				break;
			}

			item.commit();
		}

		if(mode == 'select'){
			item.selected = !item.selected;
		}

		core.views.itemView.render(item);
		core.views.itemView.sort();
	}

	function swipeItemRight(e){
		var id = $(this).attr('id');
		core.views.itemView.remove(ids);
		core.data.list.remove(id);
	}

	function swipeItemLeft(e){
		var item = core.data.list.get($(this).attr('id'));
		core.data.list.decrease(item.id);
		item.commit();

		core.views.itemView.render(item);
		core.views.itemView.sort();
	}

	function toggleRecording(){
		core.tools.listner.toggleListen();
		core.views.itemView.toggleListner();
	}


	function clickOpenMenuButton(){
		toggleMenu('select');
	}

	function clickCloseMenuButton(){
		toggleMenu('normal');
	}

	function toggleMenu(newMode){
		var mode = core.views.itemView.mode;
		core.views.itemView.mode = newMode;
		core.views.itemView.$list.removeClass(mode+'-mode');
		core.views.itemView.$list.addClass(newMode+'-mode');
	}

	function clickTrashButton(){
		var selectedItems = core.data.list.items.filter(function(item){return item.selected});
		core.data.list.deleteItems(selectedItems, function(){core.views.itemView.remove(selectedItems);});
	}

	function clickSelectAllButton(){

		var items = core.data.list.items;
		var allSelected = items.filter(function(item){return item.selected}).length == items.length;

		items.forEach(function(item){
				item.selected = !allSelected;
				core.views.itemView.render(item);
		});
	}

	window.core = window.core || {};
	window.core.ItemView = ItemView;
	// window.core.ListView = ListView;

})(window, jQuery)
