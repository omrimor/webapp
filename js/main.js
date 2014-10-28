(function(){
	var settings = document.querySelector('.tab-content-settings');
	var settingsBtn = document.querySelector('.action-btn.settings');
	settings.classList.add('hidden');

	toggleSettings = function(e){
		e.preventDefault();
		console.log('clicked on ' + this);
		var onBtn = this.classList.add('active');
		if(onBtn){
			console.log("im on")
			this.classList.remove('active');
			settings.classList.add('hidden');
		} else {
			console.log("im off")

			settings.classList.remove('hidden');
			onBtn;
		}
		
	}
	settingsBtn.addEventListener('click', toggleSettings);

})();