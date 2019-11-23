var Validation = window['Validation']=new (function(){
	var regExpDateUK=RegExp('^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$');
	this[S.IS_NULL_OR_EMPTY]=isNullOrEmpty;
	this[S.IS_NUMBER]=isNumber;
	this[S.IS_INT]=isInt;
	this[S.IS_INT_OR_EMPTY]=function(value){
		if(isNullOrEmpty(value))return true;
		return isInt(value);
	};
	this[S.IS_DATE]=function (value){
		if(isNullOrEmpty(value))return false;
		return !isNaN(new Date(value).getTime());
	};
	this[S.IS_DATE_UK]=function (value){
		if(isNullOrEmpty(value))return false;
		var valid  = regExpDateUK.test(value);
		valid = valid&&Date.fromUKString(value);
		return valid;
	};
	this[S.IS_DATE_UK_OR_EMPTY]=function(value){
		if(isNullOrEmpty(value))return true;
		var valid  = regExpDateUK.test(value);
		valid = valid&&Date.fromUKString(value);
		return valid;
	};
	this[S.IS_BOOLEAN]=function(value){
		return typeof(value)==='boolean';
	};
	function isInt(value){
		if(!isNumber(value))return false;
		return parseFloat(value)==parseInt(value);
	}
	function isNumber(value){
		if(isNullOrEmpty(value))return false;
		return !isNaN(value);
	}
	function isNullOrEmpty(value){
		return value===undefined||value===null||value==='';
	}
})();