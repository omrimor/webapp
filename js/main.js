/* globals UTILS*/

window.onload = (function() {
	var qrSettings = UTILS.qs('.js-qrTabSettings'),
		mtfSettings = UTILS.qs('.js-mtfTabSettings'),
		tabContainer = UTILS.qs('.tab-headers'),
		allTabs = UTILS.qsa('a[role="tab"]'),
		tabBody = UTILS.qsa('div[role="tabpanel"]'),
		qrSettingsBtn = UTILS.qs('.js-qrBtnSettings'),
		mtfSettingsBtn = UTILS.qs('.js-mtfBtnSettings'),
		notification = UTILS.qs('.notifications'),
		notificationMsg = notification.childNodes[1],
		mtfIframe = UTILS.qs('.js-mtfIframe');

	notification.classList.add('hidden');
	qrSettings.classList.add('hidden');

	var getElmAttribute = function(elm){
	    return elm.getAttribute('href').split('#')[1];
	};

	var hasClass = function (element, cls) {
	    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	};

	var addClass = function(nodeElm){
		nodeElm.classList.add('active');
		nodeElm.setAttribute('aria-selected', 'true');
		nodeElm.removeAttribute('aria-hidden');
		return nodeElm;
	};

	var removeClass = function(nodeElm){
		nodeElm.classList.remove('active');
		nodeElm.setAttribute('aria-hidden', 'true');
		nodeElm.removeAttribute('aria-selected');
		return nodeElm;
	};

	// Initialize if class hidden exists for the qrSettings & mtfSettings toggle
	var qrSettingsClass = hasClass(qrSettings, 'hidden'),
	    mtfClass = hasClass(mtfSettings, 'hidden');

	var setTab = function(){
		var currentHash = location.hash.replace('panel-', '');

		if (currentHash === '') {
			currentHash =  allTabs[0].getAttribute('href');
		}

		for (var i = 0; i < allTabs.length; i++) {
			var currentElm = allTabs[i],
				currentElmAttr = getElmAttribute(currentElm),
				currentActivePanel = document.getElementById(currentElmAttr);

				removeClass(currentElm);
				removeClass(currentActivePanel);

			if(currentHash === ('#' + currentElmAttr)){
				addClass(currentElm);
				addClass(currentActivePanel);
			}
		}
	};

	var changeHash = function(e){
		e.preventDefault();
		var clicked = e.target,
			tabAttr = getElmAttribute(clicked);

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

	setTab();

	UTILS.addEvent(qrSettingsBtn, 'click', toggleSettings);
	UTILS.addEvent(mtfSettingsBtn, 'click', toggleSettings);
	UTILS.addEvent(tabContainer, 'click', changeHash);
	UTILS.addEvent(window, 'hashchange', setTab);

	UTILS.ajax('../webapp/data/notification.txt', {
		done: function(response) {
			notification.classList.remove('hidden');
			notificationMsg.innerHTML = response;
			console.log(response);
		},
		fail: function(err){
			// console.log(err);
		}
	});

})();
