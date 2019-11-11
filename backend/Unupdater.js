module.exports = function(params){
	var updateToDatabase= params.updateToDatabase;
	var cache = params.cache;
	const Unupdaters = require('./Unupdaters');
	const Iterator = require('./../../../core/backend/Iterator');
	Unupdaters.add(this);
	this.unupdate = function(){
		return new Promise(function(resolve, reject){
			var iteratorUpdatedIdsSnapshot = new Iterator(cache.getUpdatedIds());
			next();
			function next(){
				if(!iteratorUpdatedIdsSnapshot.hasNext()){
					resolve();
					return;
				}
				var id=iteratorUpdatedIdsSnapshot.next();
				if(!cache.has(id)){
					next();
					return;
				}
				var item = cache.getById(id, true/* dont consider promoting cos its an internal operation*/);
				updateToDatabase(id, item).then(function(){
					cache.unupdate(id);
					next();
				}).catch(function(err){
					console.error(err);
					next();
				});
			}
		});
	};
};