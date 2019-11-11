var ConverterNativeDateToUKDateAndTimeStringNoSeconds = new (function(){
	this[S.FROM]=function(date){
		return ConverterNativeDateToUKDateString[S.FROM](date)+' '+ConverterNativeDateToTimeStringNoSeconds[S.FROM](date);
	};
})();