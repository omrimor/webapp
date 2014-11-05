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
		notification = document.querySelector('.notifications'),
		notificationMsg = notification.childNodes[1],
		mtfIframe = document.querySelector('.js-mtfIframe');

	notification.classList.add('hidden');
	qrSettings.classList.add('hidden');

	var getTab = function(tab){
	    return tab.getAttribute('href').split('#')[1];
	};

	var hasClass = function (element, cls) {
	    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	};

	// Initialize if class hidden exists for the qrSettings & mtfSettings toggle
	var qrSettingsClass = hasClass(qrSettings, 'hidden');
	var mtfClass = hasClass(mtfSettings, 'hidden');

	var setTab = function(e){
		e.preventDefault();
		var currentHash = location.hash.replace('panel-', '');

		if (currentHash === '') {
			currentHash =  allTabs[0].getAttribute('href');
		}

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
		location.hash = 'panel-' + tabAttr.replace('#', '');
	};

	var toggleSettings = function(e){
		e.preventDefault();
		if (qrSettingsClass || mtfClass){
			this.classList.add('active');
			qrSettings.classList.remove('hidden');
			mtfSettings.classList.remove('hidden');
			qrSettingsClass = false;
			mtfClass = false;
		} else {
			this.classList.remove('active');
			qrSettings.classList.add('hidden');
			mtfSettings.classList.add('hidden');
			qrSettingsClass = true;
			mtfClass = true;
		}
	};

	UTILS.addEvent(qrSettingsBtn, 'click', toggleSettings);
	UTILS.addEvent(mtfSettingsBtn, 'click', toggleSettings);
	UTILS.addEvent(tabs, 'click', activeTab);
	UTILS.addEvent(window, 'hashchange', setTab);

	UTILS.ajax('../webapp/data/notification.txt', {
		done: function(response) {
			notification.classList.remove('hidden');
			notificationMsg.innerHTML = response;
			console.log(response);
		},
		fail: function(err) {
			// console.log(err);
		}
	});

})();
