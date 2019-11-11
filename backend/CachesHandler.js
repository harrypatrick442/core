module.exports = new (function(){
	const S =require('./../strings/S');
	const Router = require('./../interserver_communication/Router');
	var Caches;
	this.initialize = function(caches){
		Caches = caches;
	};
	Router.get().addMessageCallback(S.GET_CACHES, getCaches);
	function getCaches(msg, channel){
		channel.send({
			[S.TICKET]:msg[S.TICKET],
			[S.CACHES]:Caches.getJSON()
		});
	}
	Router.get().addMessageCallback(S.GET_CACHE_ITEMS, getCacheItems);
	function getCacheItems(msg, channel){
		var cacheName = msg.cacheName;
		channel.send({
			[S.TICKET]:msg[S.TICKET],
			[S.ITEMS]:Caches.getCacheByName(cacheName).getItemsJSON()
		});
	}
})();