var ConverterNativeDateToUKDateAndTimeString = new (function(){
	this[S.FROM]=function(date){
		return ConverterNativeDateToUKDateString[S.FROM](date)+' '+ConverterNativeDateToTimeString[S.FROM](date);
	};
})();