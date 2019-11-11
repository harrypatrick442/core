module.exports = (function(){
	var count=1;
	return function(obj){
		if(obj.getHash)return obj.getHash();
		var next =String(count++);
		obj.getHash=(function(hash){
			return function(){
				return hash;
			};
		})(next);
		return next;
	};
})();
	