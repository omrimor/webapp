/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}

;/* Placeholders.js v3.0.2 */
(function(t){"use strict";function e(t,e,r){return t.addEventListener?t.addEventListener(e,r,!1):t.attachEvent?t.attachEvent("on"+e,r):void 0}function r(t,e){var r,n;for(r=0,n=t.length;n>r;r++)if(t[r]===e)return!0;return!1}function n(t,e){var r;t.createTextRange?(r=t.createTextRange(),r.move("character",e),r.select()):t.selectionStart&&(t.focus(),t.setSelectionRange(e,e))}function a(t,e){try{return t.type=e,!0}catch(r){return!1}}t.Placeholders={Utils:{addEventListener:e,inArray:r,moveCaret:n,changeType:a}}})(this),function(t){"use strict";function e(){}function r(){try{return document.activeElement}catch(t){}}function n(t,e){var r,n,a=!!e&&t.value!==e,u=t.value===t.getAttribute(V);return(a||u)&&"true"===t.getAttribute(D)?(t.removeAttribute(D),t.value=t.value.replace(t.getAttribute(V),""),t.className=t.className.replace(R,""),n=t.getAttribute(F),parseInt(n,10)>=0&&(t.setAttribute("maxLength",n),t.removeAttribute(F)),r=t.getAttribute(P),r&&(t.type=r),!0):!1}function a(t){var e,r,n=t.getAttribute(V);return""===t.value&&n?(t.setAttribute(D,"true"),t.value=n,t.className+=" "+I,r=t.getAttribute(F),r||(t.setAttribute(F,t.maxLength),t.removeAttribute("maxLength")),e=t.getAttribute(P),e?t.type="text":"password"===t.type&&M.changeType(t,"text")&&t.setAttribute(P,"password"),!0):!1}function u(t,e){var r,n,a,u,i,l,o;if(t&&t.getAttribute(V))e(t);else for(a=t?t.getElementsByTagName("input"):b,u=t?t.getElementsByTagName("textarea"):f,r=a?a.length:0,n=u?u.length:0,o=0,l=r+n;l>o;o++)i=r>o?a[o]:u[o-r],e(i)}function i(t){u(t,n)}function l(t){u(t,a)}function o(t){return function(){m&&t.value===t.getAttribute(V)&&"true"===t.getAttribute(D)?M.moveCaret(t,0):n(t)}}function c(t){return function(){a(t)}}function s(t){return function(e){return A=t.value,"true"===t.getAttribute(D)&&A===t.getAttribute(V)&&M.inArray(C,e.keyCode)?(e.preventDefault&&e.preventDefault(),!1):void 0}}function d(t){return function(){n(t,A),""===t.value&&(t.blur(),M.moveCaret(t,0))}}function g(t){return function(){t===r()&&t.value===t.getAttribute(V)&&"true"===t.getAttribute(D)&&M.moveCaret(t,0)}}function v(t){return function(){i(t)}}function p(t){t.form&&(T=t.form,"string"==typeof T&&(T=document.getElementById(T)),T.getAttribute(U)||(M.addEventListener(T,"submit",v(T)),T.setAttribute(U,"true"))),M.addEventListener(t,"focus",o(t)),M.addEventListener(t,"blur",c(t)),m&&(M.addEventListener(t,"keydown",s(t)),M.addEventListener(t,"keyup",d(t)),M.addEventListener(t,"click",g(t))),t.setAttribute(j,"true"),t.setAttribute(V,x),(m||t!==r())&&a(t)}var b,f,m,h,A,y,E,x,L,T,N,S,w,B=["text","search","url","tel","email","password","number","textarea"],C=[27,33,34,35,36,37,38,39,40,8,46],k="#ccc",I="placeholdersjs",R=RegExp("(?:^|\\s)"+I+"(?!\\S)"),V="data-placeholder-value",D="data-placeholder-active",P="data-placeholder-type",U="data-placeholder-submit",j="data-placeholder-bound",q="data-placeholder-focus",z="data-placeholder-live",F="data-placeholder-maxlength",G=document.createElement("input"),H=document.getElementsByTagName("head")[0],J=document.documentElement,K=t.Placeholders,M=K.Utils;if(K.nativeSupport=void 0!==G.placeholder,!K.nativeSupport){for(b=document.getElementsByTagName("input"),f=document.getElementsByTagName("textarea"),m="false"===J.getAttribute(q),h="false"!==J.getAttribute(z),y=document.createElement("style"),y.type="text/css",E=document.createTextNode("."+I+" { color:"+k+"; }"),y.styleSheet?y.styleSheet.cssText=E.nodeValue:y.appendChild(E),H.insertBefore(y,H.firstChild),w=0,S=b.length+f.length;S>w;w++)N=b.length>w?b[w]:f[w-b.length],x=N.attributes.placeholder,x&&(x=x.nodeValue,x&&M.inArray(B,N.type)&&p(N));L=setInterval(function(){for(w=0,S=b.length+f.length;S>w;w++)N=b.length>w?b[w]:f[w-b.length],x=N.attributes.placeholder,x?(x=x.nodeValue,x&&M.inArray(B,N.type)&&(N.getAttribute(j)||p(N),(x!==N.getAttribute(V)||"password"===N.type&&!N.getAttribute(P))&&("password"===N.type&&!N.getAttribute(P)&&M.changeType(N,"text")&&N.setAttribute(P,"password"),N.value===N.getAttribute(V)&&(N.value=x),N.setAttribute(V,x)))):N.getAttribute(D)&&(n(N),N.removeAttribute(V));h||clearInterval(L)},100)}M.addEventListener(t,"beforeunload",function(){K.disable()}),K.disable=K.nativeSupport?e:i,K.enable=K.nativeSupport?e:l}(this);
;$(function() {
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
			currentIndex = currentSelectBox.options[index ? index : currentSelectBox.selectedIndex],
		    optionVal = currentIndex.value;

	    // If index is passed, set the selected index to it
		if(index){
	    	currentSelectBox.selectedIndex = index;
		}
		$('[data-iframe="' + context + '"]').attr('src', optionVal);
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

	$.get('../webapp/data/notification.txt', function(){
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

//# sourceMappingURL=all.js.map