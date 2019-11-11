function Host(params){
	console.log(params);
	this[S.GET_ID] = function(){
		return params[S.ID];
	};
	this[S.GET_NAME]=function(){
		return params[S.NAME];
	};
	this[S.GET_IP]=function(){
	return params[S.IP];};
}