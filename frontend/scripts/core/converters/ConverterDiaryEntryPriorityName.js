var ConverterDiaryEntryPriorityName = new (function(){
	this[S.TO]= function(id){
		return DiaryEntryPriorities[S.MAP_ID_TO_NAME][id];
	};
	this[S.FROM]=function(name){
		return DiaryEntryPriorities[S.MAP_NAME_TO_ID][name];
	};
})();