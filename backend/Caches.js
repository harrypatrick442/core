module.exports = new (function(){
	const CachesHandler = require('./CachesHandler');
	CachesHandler.initialize(this);
	var list=[];
	var mapNameToCache= new Map();
	this.add = function(cache){
		list.push(cache);
		mapNameToCache.set(cache.getName(), cache);
	};
	this.getJSON=function(){
		return list.select(cache=>cache.getJSON()).toList();
	};
	this.getCacheByName=function(name){
		return mapNameToCache.get(name);
	};
})();