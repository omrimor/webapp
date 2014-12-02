/* globals UTILS, Modernizr*/

window.onload = (function() {
	var settings = UTILS.qsa('.tab-content-settings'),
		tabContainer = UTILS.qs('.tab-headers'),
		tabList = UTILS.qs('[role="tablist"]'),
		searchBox = UTILS.qs('input[name="q"]'),
		SettingsBtn = UTILS.qsa('.action-btn.settings'),
		openInNewTabIcon  = UTILS.qsa('.action-btn.expand'),
		selectBox = UTILS.qsa('.choose-iframe-select'),
		submitBtn = UTILS.qsa('.btn.btn__submit-form'),
		cancelFormBtn = UTILS.qsa('.link.cancel-form'),
		notification = UTILS.qs('.notifications'),
		notificationMsg = UTILS.qs('[data-span="notificationTxt"]'),
		reports = {};

//===================================================================
// Define helper functions
//===================================================================



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
	  var pattern = /(([a-z]{4,6}:\/\/)|(^|\s))([a-zA-Z0-9\-]+\.)+[a-z]{2,13}[\.\?\=\&\%\/\w\-]*\b([^@]|$)/;
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

	var localStorageSupported = function(){
		if (!Modernizr.localstorage) {
			console.error('Your browser does not support localStorage');
			return false;
		}
		return true;
	};


//===================================================================
// Handler functions
//===================================================================

    var initReprots = function(){
	    var savedData = localStorage.getItem('reports'),
	    allForms = UTILS.qsa('form');

	    // If no localStorage, we can't retrieve any data
	    if (!localStorageSupported()) {
	    	return false;
	    }

	    try {
	    	savedData = JSON.parse(savedData);
	    	if(savedData){
		    	reports = savedData;
	    	}

	    } catch (e) {
	    	console.error('The saved data was not in a valid JSON format');
	    	return false;
	    }

	    for (var i = 0; i < allForms.length; i++) {
	    	var inputs = allForms[i].getElementsByTagName('input');
	    	for (var j = 0; j < inputs.length; j++) {
	    		inputs[j].value = '';
	    	}
	    }

	    // For each saved report
	    for (var inx in savedData) {

	    	// Prevent iterating inherited properties
	    	if (savedData.hasOwnProperty(inx)) {

	    		var name = UTILS.qsa('[data-settings="' + inx + '"] fieldset [type="text"]'),
	    		    url = UTILS.qsa('[data-settings="' + inx + '"] fieldset [type="url"]');

			    for(var i = 0; i < savedData[inx].length; i++){
			    	if(name[i] && url[i]){
			    		name[i].value = savedData[inx][i].name;
			    		url[i].value = savedData[inx][i].url;
			    	}
			    }
			    // Pass the saveInput function context
				saveInput({target: UTILS.qs('[data-form="' + inx + '"]')});
	    	}
	    }
    };

    var findReports = function(e){
    	e.preventDefault();
    	var searchVal = e.target.value,
	    	isValid = false;

    	if (e.keyCode === 13) {
			for (var j = 0; j < selectBox.length; j++) {
				var singleSelectBox = selectBox[j],
					singleOptions = singleSelectBox.options,
					dataAttr = getElmAttribute(singleSelectBox, 'data-select'),
					currentIframeContainer = UTILS.qs('[data-iframe="' + dataAttr + '"]');

				for (var i = 0; i < singleOptions.length; i++) {
					var optionTxt = singleOptions[i].text,
						result = optionTxt.indexOf(searchVal);

						var optionVal = singleOptions[i].value;

						console.log(optionTxt, searchVal);
						console.log('found: ' + result);

					if(result > -1){

						removeClass(UTILS.qsa('div[role="tabpanel"]'));
						removeClass(UTILS.qsa('a[role="tab"]'));

						addClass(UTILS.qs('[data-link="' + dataAttr + '"]'));
						addClass(UTILS.qs('[data-div="' + dataAttr + '"]'));
						singleOptions.selectedIndex = i;
						currentIframeContainer.src = optionVal;
						isValid = true;

						// Break the loop to exit if first value found
						j = selectBox.length;
						break;
					}
				}
			}
			// If no match to search value - display message
			if(!isValid){
				if(hasClass(notification, 'hidden')){
					notification.classList.remove('hidden');

					tabList.style.top = '330px';

					notificationMsg.innerHTML = 'The searched report <b>' + searchVal + '</b> was not found';
				} else {
					notificationMsg.innerHTML = 'The searched report <b>' + searchVal + '</b> was not found';
				}
			}
    	}

    };

	var getTab = function(){
		var currentTab = UTILS.qs('li a[href="' + location.hash.replace('panel-', '') + '"]'),
			allTabs = UTILS.qsa('a[role="tab"]');

		if (location.hash === '') {
			currentTab =  allTabs[0];
		}

		// Pass the changeHash function context
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
			if(firstInput.value === ''){
				firstInput.focus();
			} else {
				firstInput.blur();
			}
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

	var cancelForm = function(e){
		e.preventDefault();
		initReprots();
		closeForm(e);
	};

	var saveInput = function(e){
		if(e.preventDefault){
			e.preventDefault();
		}

		var isValid = false,
			isClosed = true,
			target = e.target,
			dataAttr = getElmAttribute(target, 'data-form'),
			currentSettingBtn = UTILS.qs('[data-btn="' + dataAttr + '"]'),
			divContainer = UTILS.qs('[data-settings="' + dataAttr + '"]'),
			currentSelectContainer = UTILS.qs('[data-selectContainer="' + dataAttr + '"]'),
			currentSelectElm = UTILS.qs('[data-select="' + dataAttr + '"]'),
			currentIframeContainer = UTILS.qs('[data-iframe="' + dataAttr + '"]'),
			currentOpenInNewTabIcon = UTILS.qs('[data-expand="' + dataAttr + '"]'),
			fieldsets = UTILS.qsa('[data-settings="' + dataAttr + '"] fieldset'),
			collectInputArray = [],
		    emptyCount = 0;

		// Make sure the select box is empty on every iteration
		while (currentSelectElm.firstChild) {
		    currentSelectElm.removeChild(currentSelectElm.firstChild);
		}

		// If array is empty
		if(collectInputArray.length === 0){
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

			// Reset isValid inside the If statment
		    isValid = false;

		    // If all fields & the array are empty don't need to validate
		    if((textValue === '' && urlValue === '')){
		    	emptyCount++;

		    	if(emptyCount === fieldsets.length){
			    	fieldsets[0].getElementsByTagName('INPUT')[0].classList.add('error');
			    	fieldsets[0].getElementsByTagName('INPUT')[0].focus();
			    	isValid = false;
			    	localStorage.clear();
		    	}
		    }

    	    // else {
		    	inputTypeText.classList.remove('error');
		    	inputTypeUrl.classList.remove('error');

    	    	if (textValue === '' && urlValue !== '') {
	    	    	inputTypeText.classList.add('error');
	    	    	inputTypeText.focus();
	    	    	isValid = false;
	    	    	isClosed = false;
	    	    	break;
    	    	}

    	    	// Add http prefix if omitted
    	    	if(urlValue.indexOf('http://') === -1){
    	    		urlValue = 'http://' + urlValue;
    	    	}

    	    	if ((urlValue === '' || !isValidURL(urlValue)) && textValue !== '') {
	    	    	inputTypeUrl.classList.add('error');
	    	    	inputTypeUrl.focus();
	    	    	isValid = false;
	    	    	isClosed = false;
	    	    	break;
    	    	}

    		    if(textValue !== '' && (isValidURL(urlValue))){
    		    	inputTypeUrl.classList.remove('error');
    		    	isValid = true;
    		    }

	    		if(isValid){
					collectInputArray.push({name:textValue, url:urlValue});
					currentSettingBtn.classList.remove('active');
					hasClass(divContainer, 'hidden');

					// Create an option Node with array[i] content and append to selectBox
					var option = document.createElement('option');
					option.textContent = textValue;
					option.value = urlValue;
					currentSelectElm.appendChild(option);

					currentOpenInNewTabIcon.classList.remove('hidden');
					currentSelectContainer.classList.remove('hidden');
					currentIframeContainer.classList.remove('hidden');
	    		}
			// }
		}

		// If the array has at least one object
	    if(collectInputArray.length > 0){
	    	// If localStorage is supported:
	    	// 1. Give reports a key based on form ID
	    	// 2. Set the localStorageObject

	    	if (localStorageSupported()) {
	    		// Save it in localStorage, as a string
				reports[dataAttr] = collectInputArray;
				localStorage.setItem('reports', JSON.stringify(reports));
	    	}

	    	populateIframe(dataAttr);

	    	// Close the containing form div
	    	if(isClosed){
		    	divContainer.classList.add('hidden');
	    	}
	    }
	};

	var populateIframe = function(context){
		// Change the default event context
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
	initReprots();

//===================================================================
// Event handlers
//===================================================================

	UTILS.addEvent(tabContainer, 'click keypress', changeHash);
	UTILS.addEvent(window, 'hashchange', getTab);
	UTILS.addEvent(searchBox, 'keyup', findReports);
	superAddEvent(SettingsBtn, 'click', toggleSettings);
	superAddEvent(cancelFormBtn, 'click', cancelForm);
	superAddEvent(submitBtn, 'click', saveInput);
	superAddEvent(settings, 'keyup', escToClose);
	superAddEvent(selectBox, 'change', populateIframe);
	superAddEvent(openInNewTabIcon, 'click', openInNewTab);

	UTILS.ajax('../webapp/data/notification.txt', {
		done: function(response) {
			notification.classList.remove('hidden');
			notificationMsg.innerHTML = response;
			tabList.style.top = '330px';
		}
	});

})();
