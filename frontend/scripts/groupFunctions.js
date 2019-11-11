var groupFunctions = function(){
	var toCalls=[];
	each(arguments, function(argument){
		if(argument)toCalls.push(argument);
	});
	if(toCalls.length==1)return toCalls[0];
	return function(){ 
		var args = arguments;
		each(toCalls, function(toCall){
			toCall.apply(null, args);
		});
	};
};