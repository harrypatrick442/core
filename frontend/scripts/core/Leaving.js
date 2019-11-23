var Leaving = new (function(){
	var callbacks =[];
	this.add = function(callback){
		if(callbacks.indexOf(callback)>=0)return;
		callbacks.push(callback);
	};
	console.log('Leave');
	window.onbeforeunload = function (event) {
		each(callbacks, function(callback){
			callback();
		});
	};
})();