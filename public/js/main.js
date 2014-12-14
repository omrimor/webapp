$(function(){
	'use strict';

	var $tabList = $('[role="tablist"]'),
		$selectBox = $('.choose-iframe-select'),
		$notification = $('.notifications'),
		$notificationMsg = $('[data-span="notificationTxt"]');

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

	var addClass = function(nodeElm){
		nodeElm.addClass('active')
		.attr('aria-selected', 'true')
		.removeAttr('aria-hidden');
	};

	var removeClass = function(nodeElm){
		nodeElm.removeClass('active')
		.attr('aria-hidden', 'true')
		.removeAttr('aria-selected');
	};

	var isValidURL =  function(urlStr) {
	  var pattern = /(([a-z]{4,6}:\/\/)|(^|\s))([a-zA-Z0-9\-]+\.)+[a-z]{2,13}[\.\?\=\&\%\/\w\-]*\b([^@]|$)/;
	  return pattern.test(urlStr);
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

	var setReports = function(data){
    	if (localStorageSupported()) {
    		// Save it in localStorage, as a string
			localStorage.setItem('reports', JSON.stringify(data));
    	}
	};

	var getReports = function(){
	    var savedData = localStorage.getItem('reports');

	    // If no localStorage, we can't retrieve any data
	    if (!localStorageSupported()) {
	    	return false;
	    }
	    try {
	    	savedData = JSON.parse(savedData);
	    } catch (e) {
	    	console.error('The saved data was not in a valid JSON format');
	    }
	    //Set an empty object to savedData if Not exist
	    if(!savedData){
	    	savedData = {};
	    }
	    return savedData;
	};

    var initReprots = function(){
	    var savedData = getReports();

	    $('form').each(function(index, item){
	    	$(item).find('input').each(function(i, itm){
	    		$(itm).val('');
	    	});
	    });
	    // For each saved report
	    $.each(savedData, function(key, value){
    	 	// Prevent iterating inherited properties
	    	if (savedData.hasOwnProperty(key)) {
	    		var $name = $('[data-settings="' + key + '"] fieldset [type="text"]'),
	    			$url = $('[data-settings="' + key + '"] fieldset [type="url"]');

		    	$(savedData[key]).each(function(index, item){
		    		if(item.name && item.url){
			    		$name[index].value = item.name;
			    		$url[index].value = item.url;
		    		}
		    	});
	    	    // Pass the saveInput function context
	    		saveInput({target: $('[data-form="' + key + '"]').eq(0)[0]});
			}
	    });
    };

    var findReports = function(e){
    	e.preventDefault();
    	var searchVal = e.target.value,
	    	isValid = false;

    	if (e.keyCode === 13) {
    		$selectBox.each(function(index, selectBox){
    			var $options = $(selectBox).find('option'),
    			dataAttr = getElmAttribute(selectBox, 'data-select');

    			$options.each(function(i, item){
    				var result = item.text.indexOf(searchVal),
    				optionVal = item.value;

    				// If match to search value - go to first match found
    				if(result > -1){
    					removeClass($('div[role="tabpanel"]'));
    					removeClass($('a[role="tab"]'));
    					addClass($('[data-link="' + dataAttr + '"]'));
    					addClass($('[data-div="' + dataAttr + '"]'));
    					selectBox.selectedIndex = i;
    					$('[data-iframe="' + dataAttr + '"]').attr('src', optionVal);
    					isValid = true;
    					return;
    				}
    			});
    		});
			// If no match to search value - display message
			if(!isValid){
				if($notification.hasClass('hidden')){
					$notification.removeClass('hidden');
					$tabList.css({'top': '330px'});
					$notificationMsg.html('The searched report <b>' + searchVal + '</b> was not found');
				} else {
					$notificationMsg.html('The searched report <b>' + searchVal + '</b> was not found');
				}
			}
    	}
    };

	var getTab = function(){
		var $allTabs = $('a[role="tab"]'),
			$currentTab = $('li a[href="' + location.hash.replace('panel-', '') + '"]');

		if (location.hash === '') {
			$currentTab[0] =  $allTabs[0];
		}
		// Pass the changeHash function context
		changeHash({target:$currentTab[0]});
	};

	var changeHash = function(e){
		if(e.preventDefault){
			e.preventDefault();
		}
		var clicked = e.target,
			tabAttr = getElmAttribute(clicked, 'href'),
			$firstInput = $('#' + tabAttr + ' input').eq(0);

		location.hash = 'panel-' + tabAttr.replace('#', '');
		removeClass($('div[role="tabpanel"]'));
		removeClass($('a[role="tab"]'));

	    addClass($('a[href="#' + tabAttr + '"]'));
	    addClass($('#' + tabAttr));

		if (e.keyCode === 13 || e.keyCode === 32) {
			location.hash = 'panel-' + tabAttr.replace('#', '');
		}
		if($firstInput){
			if($firstInput.val() === ''){
				$firstInput.focus();
			} else {
				$firstInput.blur();
			}
		}
	};

	var escToClose = function(e){
		var target = e.currentTarget,
		dataAttr = getElmAttribute(target, 'data-settings');

		if(e.keyCode === 27){
			$(target).addClass('hidden');
			$('[data-btn="' + dataAttr + '"]').removeClass('active');
			$('[data-settings="' + dataAttr + '"]').removeClass('active').hasClass('hidden');
		}
	};

	var toggleSettings = function(e){
		e.preventDefault();
		var target = e.target,
			dataAttr = getElmAttribute(target, 'data-btn'),
			$toggleDiv = $('[data-settings="' + dataAttr + '"]');

		$toggleDiv.toggleClass('hidden');
		$(target).toggleClass('active');
	};

	var closeForm = function(e){
		e.preventDefault();
		var target = e.target,
			dataAttr = getElmAttribute(target, 'data-link');

		$('[data-settings="' + dataAttr + '"]').addClass('hidden').hasClass('hidden');
		$('[data-btn="' + dataAttr + '"]').removeClass('active');
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
			$currentSelectElm = $('[data-select="' + dataAttr + '"]'),
			$fieldsets = $('[data-settings="' + dataAttr + '"] fieldset'),
			collectInputArray = [],
			reports = getReports(),
		    emptyCount = 0;
		// Make sure the select box is empty
		$currentSelectElm.empty();

		// If array is empty
		if(collectInputArray.length === 0){
			$('[data-selectContainer="' + dataAttr + '"]').addClass('hidden');
			$('[data-iframe="' + dataAttr + '"]').addClass('hidden');
			$('[data-expand="' + dataAttr + '"]').addClass('hidden');
		}
		$fieldsets.each(function(index, item){
			var $inputTypeText = $(item.getElementsByTagName('INPUT')[0]),
				$textValue = $inputTypeText.val(),
				$inputTypeUrl = $(item.getElementsByTagName('INPUT')[1]),
				$urlValue = $inputTypeUrl.val();

			// Reset isValid inside the If statment
		    isValid = false;

		    if(($textValue === '' && $urlValue === '')){
		    	emptyCount++;

		    	// If all fieldsets are empty - set focus & error to the the first input
		    	if(emptyCount === $fieldsets.size()){
			    	$($fieldsets.eq(0).find('input')[0]).addClass('error').focus();
			    	isValid = false;
			    	localStorage.clear();
		    	}
		    }
		    $inputTypeText.removeClass('error');
		    $inputTypeUrl.removeClass('error');

	    	// If input name is empty
	    	if ($textValue === '' && $urlValue !== '') {
    	    	$inputTypeText.addClass('error').focus();
    	    	isValid = false;
    	    	isClosed = false;
    	    	return;
	    	}
	    	// Add http prefix if omitted
	    	if($urlValue !== ''){
		    	if($urlValue.indexOf('http://') === -1){
		    		$urlValue = 'http://' + $urlValue;
		    	}
	    	}
	    	// If input url is empty or invalid
	    	if (($urlValue === '' || !isValidURL($urlValue)) && $textValue !== '') {
    	    	$inputTypeUrl.addClass('error').focus();
    	    	isValid = false;
    	    	isClosed = false;
    	    	return;
	    	}
	    	// If input name & input url are filled & valid
		    if($textValue !== '' && (isValidURL($urlValue))){
		    	$inputTypeUrl.removeClass('error');
		    	isValid = true;
		    }
    		if(isValid){
    			$('[data-btn="' + dataAttr + '"]').removeClass('active');
				$('[data-settings="' + dataAttr + '"]').hasClass('hidden');

				// Create an option Node with array[i] content and append to selectBox
				var $option = $('<option>');

				$option.html($textValue).val($urlValue);
				$currentSelectElm.append($option);
				$('[data-expand="' + dataAttr + '"]').removeClass('hidden');
				$('[data-selectContainer="' + dataAttr + '"]').removeClass('hidden');
				$('[data-iframe="' + dataAttr + '"]').removeClass('hidden');
    		}
    		// In order to set other unfilled input to empty strings
    		else{
    			$textValue = '';
    			$urlValue = '';
    		}
			collectInputArray.push({name:$textValue, url:$urlValue});
		});
		// If the array has at least one object
	    if(collectInputArray.length > 0){
			reports[dataAttr] = collectInputArray;
			setReports(reports);
	    	// Populate the selectbox and make sure to set selecetd index to the last option
	    	populateIframe(dataAttr, $currentSelectElm.children().size() - 1);
	    	// Close the containing form div
	    	if(isClosed){
	    		$('[data-settings="' + dataAttr + '"]').addClass('hidden');
	    	}
	    }
	};

	var populateIframe = function(context, index){
		// Change the default event context
		if(typeof context === 'object'){
			context = getElmAttribute(context.target, 'data-select');
		}

		var currentSelectBox = $('[data-select = "' + context + '"]').get()[0],
			currentIndex = currentSelectBox.options[index ? index : currentSelectBox.selectedIndex];
		    console.log(currentIndex, currentSelectBox);
		 var optionVal = currentIndex && currentIndex.value;

	    // If index is passed, set the selected index to it
	    if(optionVal){
			if(index){
		    	currentSelectBox.selectedIndex = index;
			}
			$('[data-iframe="' + context + '"]').attr('src', optionVal);
	    }
	};

	var openInNewTab = function(e){
		e.preventDefault();
		var target = e.target,
			dataAttr = getElmAttribute(target, 'data-expand'),
			currentUrl = $('[data-iframe="' + dataAttr + '"]').attr('src');

			if($('[data-iframe="' + dataAttr + '"]').hasClass('hidden')){
				return;
			} else {
				window.open(currentUrl, '_blank');
				window.focus();
			}
	};

	// Init functions
	getTab();
	initReprots();

//===================================================================
// Event handlers
//===================================================================

	$('.tab-headers').on('click keypress', changeHash);
	$(window).on('hashchange', getTab);
	$('input[name="q"]').on('keyup', findReports);
	$('.action-btn.settings').on('click', toggleSettings);
	$('.link.cancel-form').on('click', cancelForm);
	$('.btn.btn__submit-form').on('click', saveInput);
	$('.tab-content-settings').on('keyup', escToClose);
	$('.choose-iframe-select').on('change', populateIframe);
	$('.action-btn.expand').on('click', openInNewTab);


//===================================================================
// Ajax call
//===================================================================

	$.get('/' + (location.href.indexOf('github.io') > 0 ? 'webapp/' : '') + 'data/notification.txt', function(){
		console.log('success!');
		})
		.done(function(data) {
			console.log('success again!');
			$notification.removeClass('hidden');
			$notificationMsg.html(data);
			$tabList.css({'top': '330px'});
		})
		.fail(function() {
			console.log('faillll');
		});

});

//# sourceMappingURL=main.js.map