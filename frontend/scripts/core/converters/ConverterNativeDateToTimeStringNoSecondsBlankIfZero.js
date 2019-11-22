var ConverterNativeDateToTimeStringNoSecondsBlankIfZero = new (function(){
	this[S.FROM]=function(date){
		if(!Validation[S.IS_DATE](date))return '';
		var hours=date.getHours();
		var minutes = date.getMinutes();
		if(hours<=0&&minutes<=0)return '';
		return padZeros(String(hours), 2)+':'+padZeros(String(minutes), 2);
	};
})();