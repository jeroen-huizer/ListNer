/** Utility
*/
String.prototype.hash = function(){
	var str = this.toLowerCase();
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}


if (typeof jQuery === 'undefined') {
  throw new Error('LNUX requires jQuery')
}
else{

var lnux = (function($){

	var ux = {};
	ux.list = {};
	ux.list.add = add;
	ux.list.commitItem = commitItem;

	ux.inputField = $('#maininput');
	ux.recordButton = $('#listen');

	var listElement = $('#list');

	ux.inputField.on('keypress', enterOnInput);
	ux.recordButton.on('click', toggleRecording);

	ux.inputField.focus();

	loadList();

	function enterOnInput(e){
		if(e.which == 13){
			var newItem = ux.inputField.val().toLowerCase();
			var hash = newItem.hash();

			addItem(hash, newItem);
			commitItem(hash);

			ux.inputField.val('');
		}
	}

	function clickItem(e){
		var elem = $(this);
		var hash = elem.attr('name');

		toggleItem(hash);
		commitItem(hash);

	}

	function add(item){
		addItem(item.hash(), item);
		commitItem(item.hash())
	}

	function addItem(hash, item, amount=1, status='new') {
		if(!item)
			return
		
		hash = hash ? hash:item.hash();

		if(!ux.list[hash]){
			ux.list[hash] = {name: item, count: amount, status: status};
			$(listItemHtml(item, amount, status)).prependTo(listElement).on('click', clickItem);
		}
		else{
			ux.list[hash].count+=amount; 
			listElement.find('[name="'+hash+'"]').find('.badge').text(ux.list[hash].count);			
		}
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

	function listItemHtml(label, amount=1, status){
		return '<a href="#" class="list-group-item text-capitalize '+(status=='done'?'list-group-item-danger':'')+'" name="'+label.toLowerCase().hash()+'">'+label+'<span class="badge">'+(amount>1?amount:'')+'</span></a>';
	}

	function toggleItem(hash){
		
		var item = ux.list[hash];
		if(!item) return

		var clss = 'list-group-item-danger';

		if(item.status == 'new'){
			item.status = 'done';
			$('[name="'+hash+'"]')
				.addClass(clss)
				.appendTo(listElement);

		}else{
			item.status = 'new'
			$('[name="'+hash+'"]')
				.removeClass(clss)
				.prependTo(listElement);
		}
	}

	function commitItem(hash){
		if(!ux.list[hash]) return

		var data = ux.list[hash];

		var payload = {"list": 1 ,"name": data.name, "count": data.count, "status": data.status};
		var action = {"action": "save", "item": payload}; 

		$.ajax({method: "POST", 
				url: "action", 
				contentType: "application/json", 
				processData: false, 
				data: JSON.stringify(action)});
	}

	function loadList(list){
		var action = {"action": "get", "list": 1}; 

		$.ajax({method: "POST", 
				url: "action", 
				contentType: "application/json", 
				processData: false, 
				data: JSON.stringify(action)})
			.done(function(data, status){
					if(data.length){
						for(i in data){
							
							addItem(null, data[i].name, data[i].count, data[i].status);
						}
					}
				})
	}

	return ux;

})(jQuery)}
