/**
 * Main.js for webapp project
 */

window.onload = (function() {
	var settings = document.querySelector('.tab-content-settings'),
		tabs = document.querySelector('.tab-headers'),
		settingsBtn = document.querySelector('.action-btn.settings');

	settings.classList.add('hidden');

	// Initialize if class exists
	var hasClass = (' ' + settings.className + ' ').indexOf('hidden') > -1;

	var activeTab = function(e){
		e.preventDefault();
		var currentTab = e.target,
			allTabs = document.querySelectorAll('a[role="tab"]'),
			tabBody = document.querySelectorAll('div[role="tabpanel"]'),
			tabAttr = currentTab.getAttribute('href').split('#')[1],
			activePanel = document.getElementById(tabAttr);

		for (var i = 0; i < tabBody.length; i++) {
			tabBody[i].classList.remove('active');
		}

		for (var i = 0; i < allTabs.length; i++) {
			allTabs[i].classList.remove('active');
		}

		currentTab.classList.add('active');
		activePanel.classList.add('active');
	};



	var toggleSettings = function(e){
		e.preventDefault();
		if (hasClass){
			this.classList.add('active');
			settings.classList.remove('hidden');
			hasClass = false;
		} else {
			this.classList.remove('active');
			settings.classList.add('hidden');
			hasClass = true;
		}
	};

	settingsBtn.addEventListener('click', toggleSettings);
	tabs.addEventListener('click', activeTab);

})();
