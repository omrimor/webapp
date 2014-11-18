/* globals UTILS*/

window.onload = (function() {
	var settings = UTILS.qsa('.tab-content-settings'),
		tabContainer = UTILS.qs('.tab-headers'),
		SettingsBtn = UTILS.qsa('.action-btn.settings'),
		openInNewTabIcon  = UTILS.qsa('.action-btn.expand'),
		selectBox = UTILS.qsa('.choose-iframe-select'),
		submitBtn = UTILS.qsa('.btn.btn__submit-form'),
		cancelFormBtn = UTILS.qsa('.link.cancel-form');

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
		if(nodeElm.length !== undefined){
			for (var i = 0; i < nodeElm.length; i++) {
				nodeElm[i].classList.add('active');
				nodeElm[i].setAttribute('aria-selected', 'true');
				nodeElm[i].removeAttribute('aria-hidden');
			}
		}else {
			nodeElm.classList.add('active');
			nodeElm.setAttribute('aria-selected', 'true');
			nodeElm.removeAttribute('aria-hidden');
		}
	};


	var removeClass = function(nodeElm){
		if(nodeElm.length !== undefined){
			for (var i = 0; i < nodeElm.length; i++) {
				nodeElm[i].classList.remove('active');
				nodeElm[i].setAttribute('aria-hidden', 'true');
				nodeElm[i].removeAttribute('aria-selected');
			}
		}else {
			nodeElm.classList.remove('active');
			nodeElm.setAttribute('aria-hidden', 'true');
			nodeElm.removeAttribute('aria-selected');
		}
	};

	var isValidURL =  function(urlStr) {
	  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	  return pattern.test(urlStr);
	  // return true;
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
	var getTab = function(){
		var currentTab = UTILS.qs('li a[href="' + location.hash.replace('panel-', '') + '"]'),
			allTabs = UTILS.qsa('a[role="tab"]');

		if (location.hash === '') {
			currentTab =  allTabs[0];
		}

		// Pass the changeHash an object with a custom target property
		changeHash({target:currentTab});
	};

	var changeHash = function(e){
		if(e.preventDefault){
			e.preventDefault();
		}

		var clicked = e.target,
			tabAttr = getElmAttribute(clicked, 'href'),
			allTabs = UTILS.qsa('a[role="tab"]');

		location.hash = 'panel-' + tabAttr.replace('#', '');

	    var currentHash = location.hash.replace('panel-', '');

	    removeClass(UTILS.qsa('div[role="tabpanel"]'));
	    removeClass(UTILS.qsa('a[role="tab"]'));

	    addClass(UTILS.qs('a[href="#' + tabAttr + '"]'));
	    addClass(UTILS.qs('#' + tabAttr));

		if (e.keyCode === 13 || e.keyCode === 32) {
			location.hash = 'panel-' + tabAttr.replace('#', '');
		}

		// Make sure when a empty form exist in a form, set focus to first input
		var firstInput = UTILS.qs('#' + tabAttr + ' input');
		if(firstInput){
			if(firstInput.value !== ''){
				return;
			}
			firstInput.focus();
		}
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

		console.log('seyysdgfs');
	};

	var saveInput = function(e){
		e.preventDefault();
		var isValid = false,
			target = e.target,
			collectInputArray = [],
			dataAttr = getElmAttribute(target, 'data-form'),
			currentSettingBtn = UTILS.qs('[data-btn="' + dataAttr + '"]'),
			divContainer = UTILS.qs('[data-settings="' + dataAttr + '"]'),
			currentSelectContainer = UTILS.qs('[data-selectContainer="' + dataAttr + '"]'),
			currentSelectElm = UTILS.qs('[data-select="' + dataAttr + '"]'),
			currentIframeContainer = UTILS.qs('[data-iframe="' + dataAttr + '"]'),
			currentOpenInNewTabIcon = UTILS.qs('[data-expand="' + dataAttr + '"]'),
			fieldsets = UTILS.qsa('fieldset');

		// Make sure the array is empty on every iteration
		collectInputArray.length = 0;

		// Make sure the select box is empty on every iteration
		while (currentSelectElm.firstChild) {
		    currentSelectElm.removeChild(currentSelectElm.firstChild);
		}
		// If array is empty
		if(collectInputArray.length === 0){
			collectInputArray.length = 0;
			currentSelectContainer.classList.add('hidden');
			currentIframeContainer.classList.add('hidden');
			currentOpenInNewTabIcon.classList.add('hidden');
		}

		for (var i = 0; i < fieldsets.length; i++) {
			var fieldset = fieldsets[i],
			    inputTypeText = fieldset.getElementsByTagName('INPUT')[0],
			    textValue = inputTypeText.value,
			    inputTypeUrl = fieldset.getElementsByTagName('INPUT')[1],
			    urlValue = inputTypeUrl.value;

			// Reset the valid inside the If statment
		    isValid = false;

		    // All fields are empty & the array is also empty so don't need to validate
		    if((textValue === '' && urlValue === '') && collectInputArray.length === 0){
		    	inputTypeText.classList.add('error');
		    	inputTypeText.focus();
		    	isValid = false;
		    	break;
		    }

    	    else {
		    	inputTypeText.classList.remove('error');
		    	inputTypeUrl.classList.remove('error');

    	    	if (textValue === '' && urlValue !== '') {
	    	    	inputTypeText.classList.add('error');
	    	    	inputTypeText.focus();
	    	    	isValid = false;
	    	    	break;
    	    	}

    	    	if ((urlValue === '' || !isValidURL(urlValue)) && textValue !== '') {
	    	    	inputTypeUrl.classList.add('error');
	    	    	inputTypeUrl.focus();
	    	    	isValid = false;
	    	    	break;

    	    	}

    		    if(textValue !== '' && (isValidURL(urlValue))){
    		    	inputTypeUrl.classList.remove('error');
    		    	isValid = true;
    		    }
    		    console.log(i, isValid, textValue, urlValue);

	    		if(isValid){
					collectInputArray.push({name:textValue, url: urlValue});
					currentSettingBtn.classList.remove('active');
					hasClass(divContainer, 'hidden');

					// Create an option Node with array[i] content and append to selectBox
					var option = document.createElement('option');
					option.textContent = collectInputArray[i].name;
					option.value = collectInputArray[i].url;
					currentSelectElm.appendChild(option);
					currentOpenInNewTabIcon.classList.remove('hidden');
					currentSelectContainer.classList.remove('hidden');
					currentIframeContainer.classList.remove('hidden');
	    		}
			}
		}

	    if(collectInputArray.length > 0){
	    	populateIframe(dataAttr);
	    	divContainer.classList.add('hidden');
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

	getTab();

	UTILS.addEvent(tabContainer, 'click keypress', changeHash);
	UTILS.addEvent(window, 'hashchange', getTab);
	superAddEvent(SettingsBtn, 'click', toggleSettings);
	superAddEvent(cancelFormBtn, 'click', closeForm);
	superAddEvent(submitBtn, 'click', saveInput);
	superAddEvent(settings, 'keyup', escToClose);
	superAddEvent(selectBox, 'change', populateIframe);
	superAddEvent(openInNewTabIcon, 'click', openInNewTab);

	UTILS.ajax('../webapp/data/notification.txt', {
		done: function(response) {
			var notification = UTILS.qs('.notifications'),
				notificationMsg = notification.childNodes[1];

			notification.classList.remove('hidden');
			notificationMsg.innerHTML = response;
			console.log(response);
		}
	});


})();
