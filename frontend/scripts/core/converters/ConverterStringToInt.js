var ConverterStringToInt = new (function(){
	this[S.TO]=function(s){
		return parseInt(s);
	};
	this[S.FROM]=function(i){
		return String(i);
	};
})();