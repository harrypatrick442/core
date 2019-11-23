var ConverterNativeDateToUKDateString = new (function(){
	this[S.FROM]=function(date){
		if(!Validation[S.IS_DATE](date))return '';
		return padZeros(String(date.getDate()), 2)+'/'+padZeros(String(date.getMonth()+1), 2)+'/'+padZeros(String(date.getFullYear()), 4);
	};
})();