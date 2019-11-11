module.exports = new (function(){
	var RoutingTable = require('./../interserver_communication/routing/RoutingTable');
	const GET='get';
	const UPDATE='update';
	const MostAccessed = require('./MostAccessed');
	var _RemoteCache = function(params){
		var router = params.router;
		var considerCachingLocally = params.considerCachingLocally;
		var cacheLocally = params.cacheLocally;
		if(!router)throw new Error('No router provided');
		var mostAccessed = new MostAccessed();
		this.canGet=has;
		this.canUpdate=has;
		this.get = function(id){
			return new Promise(function(resolve, reject){
				var sendToServerWithTryHandle = router.getSendToServerWithTryHandle(id);
				var msg = {
					type:GET,
					itemId:id
				};
				next();
				function next(err){
					if(err)console.error(err);
					if(!sendToServerWithTryHandle.hasNext()){
						reject();
						return;
					}
					sendToServerWithTryHandle.sendToNext(msg).then(function(res){
						var item = res.item;
						if(!item){
							next();
							return;
						}
						_mostAccessed(id, item);
						resolve(item);
					}).catch(next);
				}
			});
		};
		this.update = function(id, item, updatedLocally){
			return new Promise(function(resolve, reject){
				var sendToServerWithTryHandle = router.getSendToServerWithTryHandle(id);//todo could improve efficiency here for when no remote
				if(!sendToServerWithTryHandle.hasNext()){
					resolve();
					return;
				}
				var msg = {
					type:UPDATE,
					itemId:id, 
					item:item,
					dontMarkAsUpdated:updatedLocally
				};
				sendToServerWithTryHandle.sendToNext(msg);
				msg = {
					type:UPDATE,
					itemId:id,
					item:item,
					dontMarkAsUpdated:true/* only ever mark as updated on one machine*/
				};
				while(sendToServerWithTryHandle.hasNext()){
					sendToServerWithTryHandle.sendToNext(msg);
				}
				if(!updatedLocally)_mostAccessed(id, item);
				resolve();
			});
		};
		function _mostAccessed(id, item){
			if(mostAccessed.has(id)){
				if(considerCachingLocally(id, item)){
					cacheLocally(id, item);
				}
				else mostAccessed.bringToFront(id);
			}
			else mostAccessed.add(id);
		}
		function has(id){
			return router.has(id);
		}
	};
	return _RemoteCache;
})();