var ConverterNativeDateTimeUTCToFriendlyString = new (function(){
	this[S.FROM]=function(date){
		var sentAtLocal = window['moment'].utc(date).local();
		var now = window['moment']();
		var duration = window['moment'].duration(now.diff(sentAtLocal));
		var midnight = window['moment']().startOf('day');
		var time = sentAtLocal.format('HH:mm:ss');
		var sentToday = sentAtLocal.diff(midnight, 'seconds')>=0?true:false;
		if(sentToday){
			return time;
		}
		var secondsToMidnightSinceSent = midnight.diff(sentAtLocal,'seconds');
		if(secondsToMidnightSinceSent<604800){//seven days since midnight ( can include the day with same name as today!!
			var dayAndTime=sentAtLocal.format('dddd')+' at '+time;
			if(secondsToMidnightSinceSent<518400)//six days since midnight
				return dayAndTime;
			return 'last '+dayAndTime;
		}
		var sentThisYear = sentAtLocal.isSame(new Date(), 'year');
		var dayAndMonth =sentAtLocal.format('Do')+' '+sentAtLocal.format('MMMM');
		if(sentThisYear){
			return dayAndMonth;
		}
		return dayAndMonth+' '+sentAtLocal.year();
	};
})();