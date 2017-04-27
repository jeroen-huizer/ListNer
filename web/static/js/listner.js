


if (typeof lnux === 'undefined') {
  throw new Error('Listner.js requires LNUX')
}
else{

var recog = (function($, button, list){

	var recog = {};
	recog.started = false; //Public

	button.on('click', toggleListen);

	// Setup speech recognition
	var recognition = new webkitSpeechRecognition();

	//Settings
	recognition.continuous = false;
	recognition.lang = 'nl-NL';
	recognition.interimResults = false;

	// Events
	recognition.onresult = onresult;
	recognition.onspeechend = stopListening;
	recognition.onend = startListening;

	function toggleListen(){
		if(!recog.started){
			recog.started = true;
			startListening();
		}
		else{
			recog.started = false;			
			stopListening();
		}
	}

	function onresult({results}){
		var item = results[0][0].transcript;
		if(item && item.toLowerCase() == 'stop')
			toggleListen();
		else if(item)	
			list.add(item);
	}

	function startListening(){
		if(recog.started)
			recognition.start();
	}

	function stopListening(){
		recognition.stop();
	}

	return recog;


})(jQuery, lnux.recordButton, lnux.list)}