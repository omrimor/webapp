/* globals UTILS*/

/**
 * Main.js for webapp project
 */

window.onload = (function() {
	var settings = document.querySelector('.tab-content-settings'),
		tabs = document.querySelector('.tab-headers'),
		allTabs = document.querySelectorAll('a[role="tab"]'),
		tabBody = document.querySelectorAll('div[role="tabpanel"]'),

	settingsBtn = document.querySelector('.action-btn.settings');
	settings.classList.add('hidden');


	// Initialize if class exists
	var hasClass = (' ' + settings.className + ' ').indexOf('hidden') > -1;


		var curElement = document.activeElement;

		// if(curElement){
		// 	console.log(curElement);

		// }
		// var curElement = document.hasFocus();



	for (var i = 0; i < allTabs.length; i++) {
		var cur = allTabs[i];
		var hasFocus = document.hasFocus();
		if(hasFocus){
			console.log(curElement.tagName);
		}
	}


	var changeHash = function(e){
		var currentHash = window.location.hash;

		for (var i = 0; i < allTabs.length; i++) {
			var current = allTabs[i];
			var currentAttr = current.getAttribute('href').split('#')[1];
			var currentActivePanel = document.getElementById(currentAttr);

			current.classList.remove('active');
			currentActivePanel.classList.remove('active');

			if(currentHash === current.getAttribute('href')){
				current.classList.add('active');
				currentActivePanel.classList.add('active');
			}
		}
	};

	var activeTab = function(e){
		e.preventDefault();
		var currentTab = e.target,
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
		window.location.hash = currentTab.getAttribute('href');
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

	UTILS.addEvent(settingsBtn, 'click', toggleSettings);
	UTILS.addEvent(tabs, 'click', activeTab);
	UTILS.addEvent(window, 'hashchange', changeHash);

})();
