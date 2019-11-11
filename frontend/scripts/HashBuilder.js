var HashBuilder = window['HashBuilder']=(function(){
	var count=1;
	return function(obj){
		if(obj[S.GET_HASH])return obj[S.GET_HASH]();
		var next =String(count++);
		obj[S.GET_HASH]=(function(hash){
			return function(){
				return hash;
			};
		})(next);
		return next;
	};
})();
	