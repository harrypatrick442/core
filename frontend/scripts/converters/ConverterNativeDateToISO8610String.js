var ConverterNativeDateToISO8610String = new (function(){
	this[S.FROM]=function(date){
		if(!Validation[S.IS_DATE](date))return '';
		return padZeros(String(date.getFullYear()), 4)+'-'+padZeros(String(date.getMonth()+1), 2)+'-'+ padZeros(String(date.getDate()), 2)+'T'+ padZeros(String(date.getHours()), 2)+':'+padZeros(String(date.getMinutes()), 2)+':'+padZeros(String(date.getSeconds()), 2);
	};
})();