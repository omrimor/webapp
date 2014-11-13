/* globals UTILS*/

window.onload = (function() {
	var settings = UTILS.qsa('.tab-content-settings'),
		tabContainer = UTILS.qs('.tab-headers'),
		allTabs = UTILS.qsa('a[role="tab"]'),
		SettingsBtn = UTILS.qsa('.action-btn.settings'),
		notification = UTILS.qs('.notifications'),
		openInNewTabIcon  = UTILS.qsa('.action-btn.expand'),
		selectBoxContainer = UTILS.qsa('.select--choose-iframe'),
		selectBox = UTILS.qsa('.choose-iframe-select'),
		submitBtn = UTILS.qsa('.btn.btn__submit-form'),
		cancelFormBtn = UTILS.qsa('.link.cancel-form'),
		iframeContainer = UTILS.qsa('.tab-content-body--iframe');

	// Define some helper functions
	var getElmAttribute = function(elm, attr){
		if(attr === 'href'){
		    return elm.getAttribute(attr).split('#')[1];
		} else {
			return elm.getAttribute(attr);
		}
	};


	var hasClass = function (element, cls) {
	    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	};

	for (var i = 0; i < settings.length; i++) {
		hasClass(settings[i], 'hidden');
	}

	var getMatchingPanel = function(tab){
		var tabAttr = getElmAttribute(tab, 'href'),
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

	var superAddEvent = function(elm, type, handler){
		if(elm.length !== undefined){
			for (var i = 0; i < elm.length; i++) {
				UTILS.addEvent(elm[i], type, handler);
			}
		}else {
			UTILS.addEvent(elm, type, handler);
		}
	};

    // Event handlers functions
	var setTab = function(){
		var currentHash = location.hash.replace('panel-', '');

		if (currentHash === '') {
			currentHash =  allTabs[0].getAttribute('href');
		}

		for (var i = 0; i < allTabs.length; i++) {
			var currentElm = allTabs[i],
				currentElmAttr = getElmAttribute(currentElm, 'href'),
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
			tabAttr = getElmAttribute(clicked, 'href'),
			currentDiv = UTILS.qs('#' + tabAttr);

		if (e.keyCode === 13 || e.keyCode === 32) {
			location.hash = 'panel-' + tabAttr.replace('#', '');
		}

		location.hash = 'panel-' + tabAttr.replace('#', '');
	};

	var escToClose = function(e){
		var target = e.currentTarget,
		dataAttr = getElmAttribute(target, 'data-settings'),
		currentSettingBtn = UTILS.qs('[data-btn="' + dataAttr + '"]'),
		currentDiv = UTILS.qs('[data-settings="' + dataAttr + '"]');

		if(e.keyCode === 27){
			target.classList.add('hidden');
			currentSettingBtn.classList.remove('active');
			currentDiv.classList.remove('active');
			hasClass(currentDiv, 'hidden');
		}
	};

	var toggleSettings = function(e){
		e.preventDefault();
		var target = e.target,
			dataAttr = getElmAttribute(target, 'data-btn'),
			toggleDiv = UTILS.qs('[data-settings="' + dataAttr + '"]'),
			inputFieldsQr = UTILS.qsa('.settings-field');

		if (hasClass(toggleDiv, 'hidden')){
			target.classList.add('active');
			toggleDiv.classList.remove('hidden');
			inputFieldsQr[0].focus();
		} else {
			target.classList.remove('active');
			toggleDiv.classList.add('hidden');
		}
	};

	var closeForm = function(e){
		e.preventDefault();
		var target = e.target,
			dataAttr = getElmAttribute(target, 'data-link'),
			currentSettingBtn = UTILS.qs('[data-btn="' + dataAttr + '"]'),
			closeDiv = UTILS.qs('[data-settings="' + dataAttr + '"]');

		closeDiv.classList.add('hidden');
		currentSettingBtn.classList.remove('active');
		hasClass(closeDiv, 'hidden');
	};

	var saveInput = function(e){
		e.preventDefault();

		var isValid = true,
			target = e.target,
			collectInputArray = [],
			dataAttr = getElmAttribute(target, 'data-form'),
			currentSettingBtn = UTILS.qs('[data-btn="' + dataAttr + '"]'),
			inputTypeText = UTILS.qsa('[data-settings="' + dataAttr + '"] input[type="text"]'),
			inputTypeURL = UTILS.qsa('[data-settings="' + dataAttr + '"] input[type="url"]'),
			divContainer = UTILS.qs('[data-settings="' + dataAttr + '"]'),
			currentSelectContainer = UTILS.qs('[data-selectContainer="' + dataAttr + '"]'),
			currentSelectElm = UTILS.qs('[data-select="' + dataAttr + '"]'),
			currentIframeContainer = UTILS.qs('[data-iframe="' + dataAttr + '"]'),
			currentOpenInNewTabIcon = UTILS.qs('[data-expand="' + dataAttr + '"]');

		// To make sure the array is empty on every iteration
		collectInputArray.length = 0;

		if(collectInputArray.length === 0){
			collectInputArray.length = 0;
			currentSelectContainer.classList.add('hidden');
			currentIframeContainer.classList.add('hidden');
			currentOpenInNewTabIcon.classList.add('hidden');
		}

		// Make sure the select box is empty on every iteration
		while (currentSelectElm.firstChild) {
		    currentSelectElm.removeChild(currentSelectElm.firstChild);
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
						divContainer.classList.add('hidden');
						currentSettingBtn.classList.remove('active');
						hasClass(divContainer, 'hidden');

						// Create an option Node with array[i] content and append to selectBox
						var option = document.createElement('option');
						option.textContent = collectInputArray[i].name;
						option.value = collectInputArray[i].url;
						currentSelectElm.appendChild(option);

						// Show the selectBox, open in new tab icon and the iframe
						currentOpenInNewTabIcon.classList.remove('hidden');
						currentSelectContainer.classList.remove('hidden');
						currentIframeContainer.classList.remove('hidden');
				    }
			    }
			}
			if(isValid){
				populateIframe(dataAttr);
			}
	};

	var populateIframe = function(context){
		// Change the default context 'e' of the listener function
		if(typeof context === 'object'){
			context = getElmAttribute(context.target, 'data-select');
		}

		var currentSelectBox = UTILS.qs('[data-select = "' + context + '"]'),
			optionsLength = currentSelectBox.options.length,
			currentIndex = currentSelectBox.options[currentSelectBox.selectedIndex],
			currentIframeContainer = UTILS.qs('[data-iframe="' + context + '"]'),
		    optionVal = currentIndex.value;

	    currentIframeContainer.src = optionVal;
	};

	var openInNewTab = function(e){
		e.preventDefault();
		var target = e.target,
			dataAttr = getElmAttribute(target, 'data-expand'),
			currentIframeContainer = UTILS.qs('[data-iframe="' + dataAttr + '"]'),
			currentUrl = currentIframeContainer.src;

			if(hasClass(currentIframeContainer, 'hidden')){
				return;
			} else {
				window.open(currentUrl, '_blank');
				window.focus();
			}
	};

	setTab();

	UTILS.addEvent(tabContainer, 'click keypress', changeHash);
	UTILS.addEvent(window, 'hashchange', setTab);
	superAddEvent(SettingsBtn, 'click', toggleSettings);
	superAddEvent(cancelFormBtn, 'click', closeForm);
	superAddEvent(submitBtn, 'click', saveInput);
	superAddEvent(settings, 'keyup', escToClose);
	superAddEvent(selectBox, 'change', populateIframe);
	superAddEvent(openInNewTabIcon, 'click', openInNewTab);

	UTILS.ajax('../webapp/data/notification.txt', {
		done: function(response) {
			var notificationMsg = notification.childNodes[1];
			notification.classList.remove('hidden');
			notificationMsg.innerHTML = response;
			console.log(response);
		}
	});

})();
