(function(core){

	function listner(resultCallback){
		this.started = false; //Public
		this.callback = resultCallback;

		// Setup speech recognition
		this.recognition = new webkitSpeechRecognition();

		//Settings
		this.recognition.continuous = false;
		this.recognition.lang = 'nl-NL';
		this.recognition.interimResults = false;

		// Events
		this.recognition.onresult = this.onresult.bind(this);
		this.recognition.onspeechend = this.stopListening.bind(this);;
		this.recognition.onend = this.startListening.bind(this);

	}
	
	listner.prototype.toggleListen = function(){
		if(!this.started){
			this.started = true;
			this.startListening();
		}
		else{
			this.started = false;			
			this.stopListening();
		}
	}

	listner.prototype.onresult = function({results}){
		var transcript = results[0][0].transcript;
		if(transcript)	
			this.callback(transcript);
	}

	listner.prototype.startListening = function(){
		if(this.started)
			this.recognition.start();
	}

	listner.prototype.stopListening = function(){
		this.recognition.stop();
	}

	window.core = window.core || {};
	window.core.listner = listner;

})(window)