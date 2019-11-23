var ConverterNativeDateToTimeString = new (function(){
	this[S.FROM]=function(date){
		if(!Validation[S.IS_DATE](date))return '';
		return padZeros(String(date.getHours()), 2)+':'+padZeros(String(date.getMinutes()), 2)+':'+padZeros(String(date.getSeconds()), 2);
	};
})();