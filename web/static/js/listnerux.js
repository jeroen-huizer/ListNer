/** Utility
*/
String.prototype.hash = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
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
	ux.list.addItem = addItem;

	ux.inputField = $('#maininput');
	ux.recordButton = $('#listen');

	var listElement = $('#list');

	ux.inputField.on('keypress', enterOnInput);
	ux.recordButton.on('click', toggleRecording);

	addItem('Appels');
	addItem('Bananen');
	addItem('Druiven');
	addItem('Brood');

	ux.inputField.focus();

	function enterOnInput(e){
		if(e.which == 13){
			addItem(ux.inputField.val());
			ux.inputField.val('');
		}
	}

	function addItem(item) {
		var hash = item.toLowerCase().hash();
		if(!item)
			return

		var similar = listElement.find('[name="'+hash+'"]');

		if(similar.length){
			var count = parseInt(similar.find('.badge').text(),10);
			similar.replaceWith(listItemHtml(item, isNaN(count)?2:count+1));

		} else {
			$(listItemHtml(item)).prependTo(listElement).on('click', toggleItem);
			//listElement.prepend(listItemHtml(item));
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

	function listItemHtml(label, badge=''){
		return '<a href="#" class="list-group-item text-capitalize" name="'+label.toLowerCase().hash()+'">'+label+'<span class="badge">'+badge+'</span></a>';
	}

	function toggleItem(e){
		var elem = $(this);
		var clss = 'list-group-item-danger';
		if(elem.hasClass(clss)){
			elem
				.removeClass(clss)
				.prependTo(listElement);
		}
		else{
			elem
				.addClass(clss)
				.appendTo(listElement);
		}
	}

	return ux;

})(jQuery)}
