/* globals UTILS*/

/**
 * Main.js for webapp project
 */

window.onload = (function() {
	var qrSettings = document.querySelector('.js-qrTabSettings'),
		mtfSettings = document.querySelector('.js-mtfTabSettings'),
		tabs = document.querySelector('.tab-headers'),
		allTabs = document.querySelectorAll('a[role="tab"]'),
		tabBody = document.querySelectorAll('div[role="tabpanel"]'),
		qrSettingsBtn = document.querySelector('.js-qrBtnSettings'),
		mtfSettingsBtn = document.querySelector('.js-mtfBtnSettings'),
		mtfIframe = document.querySelector('.js-mtfIframe');

	qrSettings.classList.add('hidden');

	// Initialize if class hidden exists for the qrSettings toggle
	var qrHasClass = (' ' + qrSettings.className + ' ').indexOf('hidden') > -1;
	var mtfHasClass = (' ' + mtfSettings.className + ' ').indexOf('hidden') > -1;


	var getTab = function(tab){
	    return tab.getAttribute('href').split('#')[1];
	};

	var changeHash = function(e){
		var currentHash = window.location.hash;

		for (var i = 0; i < allTabs.length; i++) {
			var current = allTabs[i],
				currentAttr = getTab(current),
				currentActivePanel = document.getElementById(currentAttr);

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
			tabAttr = getTab(currentTab),
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
		if (tabAttr === 'my-team-folders'){
			mtfSettingsBtn.classList.add('active');
			// mtfIframe.classList.add('hidden');

		}

	};

	var toggleSettings = function(e){
		e.preventDefault();
		if (qrHasClass || mtfHasClass){
			this.classList.add('active');
			qrSettings.classList.remove('hidden');
			mtfSettings.classList.remove('hidden');
			qrHasClass = false;
			mtfHasClass = false;
		} else {
			this.classList.remove('active');
			qrSettings.classList.add('hidden');
			mtfSettings.classList.add('hidden');
			qrHasClass = true;
			mtfHasClass = true;
		}
	};

	UTILS.addEvent(qrSettingsBtn, 'click', toggleSettings);
	UTILS.addEvent(mtfSettingsBtn, 'click', toggleSettings);
	UTILS.addEvent(tabs, 'click', activeTab);
	UTILS.addEvent(window, 'hashchange', changeHash);

})();
