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
		openInNewTabIcon  = UTILS.qs('.action-btn.expand'),
		selectBoxContainer = UTILS.qs('.select--choose-iframe'),
		selectBox = UTILS.qs('#choose-iframe-select'),
		submitBtn = UTILS.qs('.btn.btn__submit-form'),
		cancelFormBtn = UTILS.qs('.link.cancel-form'),
		inputFieldsQr = UTILS.qsa('.settings-field.js-qr'),
		inputTypeURL = UTILS.qsa('input[type="url"]'),
		inputTypeText = UTILS.qsa('input[type="text"]'),
		collectInputArray = [],
		qrIframeContainer = UTILS.qs('.tab-content-body--iframe'),
		notificationMsg = notification.childNodes[1],
		mtfIframe = UTILS.qs('.js-mtfIframe');

	openInNewTabIcon.classList.add('hidden');
	notification.classList.add('hidden');
	selectBoxContainer.classList.add('hidden');
	qrIframeContainer.classList.add('hidden');

	var getElmAttribute = function(elm){
	    return elm.getAttribute('href').split('#')[1];
	};

	var hasClass = function (element, cls) {
	    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	};

	var getMatchingPanel = function(tab){
		var tabAttr = getElmAttribute(tab),
			matchingPanel = document.getElementById(tabAttr);
			return matchingPanel;
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

	var isValidURL =  function(urlStr) {
	  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	  return pattern.test(urlStr);
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
				currentActivePanel = getMatchingPanel(currentElm);

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

	var keypressOpenTab = function(e){
		e.preventDefault();
		var focused = e.target,
			tabAttr = getElmAttribute(focused);

		if (e.keyCode === 13 || e.keyCode === 32) {
			location.hash = 'panel-' + tabAttr.replace('#', '');
		}
	};

	var escToClose = function(e){
		var target = e.target;
		if(e.keyCode === 27){
			qrSettings.classList.add('hidden');
			qrSettingsBtn.classList.remove('active');
			qrSettingsClass = true;
			mtfClass = true;
		}
	};

	var toggleSettings = function(e){
		e.preventDefault();

		if (qrSettingsClass || mtfClass){
			this.classList.add('active');
			qrSettings.classList.remove('hidden');
			mtfSettings.classList.remove('hidden');
			qrSettingsClass = false;
			mtfClass = false;
			inputFieldsQr[0].focus();
		} else {
			this.classList.remove('active');
			qrSettings.classList.add('hidden');
			mtfSettings.classList.add('hidden');
			qrSettingsClass = true;
			mtfClass = true;
		}
	};

	var closeForm = function(e){
		e.preventDefault();
		qrSettings.classList.add('hidden');
		qrSettingsBtn.classList.remove('active');
		qrSettingsClass = true;
		mtfClass = true;
	};

	var saveInput = function(e){
		e.preventDefault();
		var isValid = true;
		// To make sure the array is empty on every iteration
		collectInputArray.length = 0;
		// To make sure the select box is empty on every iteration
		while (selectBox.firstChild) {
		    selectBox.removeChild(selectBox.firstChild);
		}
		// Running on i will get same place for text and url inputs
		for (var i = 0; i < inputTypeText.length; i++) {
			var textInput = inputTypeText[i],
			    textValue = inputTypeText[i].value,
			    urlInput = inputTypeURL[i],
			    urlValue = inputTypeURL[i].value;

			    // If both fields are empty & they're the first two
			    if((textValue === '' || urlValue === '') && i === 0){
			    	if(textValue === ''){
			    		textInput.focus();
			    	}
			    	else if(urlValue === ''){
			    		urlInput.focus();
			    	}

			    	textInput.classList.add('error');
			    	urlInput.classList.add('error');
			    	isValid = false;

			    } else {
			    	textInput.classList.remove('error');
			    	urlInput.classList.remove('error');
			    }

			    // If either fields has content - validate them
			    if(textValue !== '' || urlValue !== ''){

				    if(textValue !== ''){
				    	textInput.classList.remove('error');
				    }
				    if(urlValue === '' || (!isValidURL(urlValue))){
				    	urlInput.classList.add('error');
				    	isValid = false;
				    }

				    if(isValid){
						collectInputArray.push({name:textValue, url: urlValue});
						qrSettings.classList.add('hidden');
						qrSettingsBtn.classList.remove('active');
						qrSettingsClass = true;
						mtfClass = true;

						// Create an option Node with array[i] content and append to selectBox
						var option = document.createElement('option');
						option.textContent = collectInputArray[i].name;
						option.value = collectInputArray[i].url;
						selectBox.appendChild(option);
					    console.log(selectBox);

						// Show the selectBox, open in new tab icon and the iframe
						openInNewTabIcon.classList.remove('hidden');
						selectBoxContainer.classList.remove('hidden');
						qrIframeContainer.classList.remove('hidden');
				    }
			    }
			}
	};

	setTab();

	UTILS.addEvent(qrSettingsBtn, 'click', toggleSettings);
	UTILS.addEvent(mtfSettingsBtn, 'click', toggleSettings);
	UTILS.addEvent(tabContainer, 'click', changeHash);
	UTILS.addEvent(tabContainer, 'keypress', keypressOpenTab);
	UTILS.addEvent(window, 'hashchange', setTab);
	UTILS.addEvent(cancelFormBtn, 'click', closeForm);
	UTILS.addEvent(submitBtn, 'click', saveInput);
	UTILS.addEvent(qrSettings, 'keyup', escToClose);

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
