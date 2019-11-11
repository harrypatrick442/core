module.exports =new (function(){
	var regExpDateUK=RegExp('^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$');
	this.isNullOrEmpty=isNullOrEmpty;
	this.isNumber=isNumber;
	this.isInt=isInt;
	this.isIntOrEmpty=function(value){
		if(isNullOrEmpty(value))return true;
		return isInt(value);
	};
	this.isBoolean=function(value){
		console.log(S.IS_BOOLEAN);
		console.log(value);
		console.log(typeof(value));
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