var UniqueId = global['UniqueId']=new(function(){
	var count=0;
	this[S.NEXT] = function(){
		return '_'+String(count++);
	};
})();