module.exports = new (function(){
	/*Segmented LRU (SLRU)
	Where the probationary segment is the most accessed list within the on disk cache and the protected segment is the in memory cache.*/
	const CacheConfiguration = require('./CacheConfiguration');
	const InMemoryCache = require('./InMemoryCache');
	const OnDiskCache = require('./OnDiskCache');
	const RemoteCache = require('./RemoteCache');
	const RemoteCacheHandler = require('./RemoteCacheHandler');
	const ShouldCacheTypes= require('./ShouldCacheTypes');
	const Caches = require('./Caches');
	const CacheManager = require('./CacheManager');
	const Unupdaters = require('./Unupdaters');
	const Unupdater = require('./Unupdater');
	const S =require('./../strings/S');
	var _Cache = function(params){
		var cacheConfiguration = params.cacheConfiguration?params.cacheConfiguration:CacheConfiguration.createDefault();
		var name = params.name;
		var getFromDatabaseById = params.getFromDatabaseById;
		var updateToDatabase = params.updateToDatabase;
		var merge = params.merge;
		var router = params.router;
		var provideRemote = params.provideRemote;
		var shuttingDown = false;
		if(!name)throw new Error('No na	me provided');
		if(!getFromDatabaseById)throw new Error('No getFromDatabaseById method provided for cache '+name);
		if(!updateToDatabase)throw new Error('No updateToDatabase provided for cache '+name);
		if(!merge)throw new Error('No merge provided for cache '+name);
		var inMemoryCache = new InMemoryCache({name:name, changedSize:inMemoryCacheChangedSize,
		delayUpdateItemSize:cacheConfiguration.getDelayUpdateInMemoryItemSize(),
		nChangesUpdateItemSize:cacheConfiguration.getNChangesUpdateInMemoryItemSize()});
		var onDiskCache = new OnDiskCache({name:name, changedSize:onDiskCacheChangedSize, backToDatabase:updateToDatabase, 
		considerPromoting:considerPromoting, promote:promote});
		var remoteCache = new RemoteCache({name:name, router:router, considerCachingLocally:considerCachingLocally, cacheLocally:cacheLocally});
		if(provideRemote||provideRemote===undefined)
		{
			RemoteCacheHandler.initialize({
				router:router,
				cache:this
			});
		}
		this.getName = function(){return name;};
		Unupdaters.add(new Unupdater({cache:onDiskCache, updateToDatabase:updateToDatabase}));
		Unupdaters.add(new Unupdater({cache:inMemoryCache, updateToDatabase:updateToDatabase}));
		clear();
		Caches.add(this);
		var cacheManager = new CacheManager({
			moveToOnDiskFromInMemoryTotalSizeRoundUp:moveToOnDiskFromInMemoryTotalSizeRoundUp,
			moveToDatabaseFromOnDiskTotalSizeRoundUp:moveToDatabaseFromOnDiskTotalSizeRoundUp,
			cacheConfiguration:cacheConfiguration,
			clear:clear
		});
		this.getById = function(id){
			id = String(id);
			checkShuttingDown();
			return new Promise(function(resolve, reject){
				var item = getByIdLocal(id);
				if(item){
					resolve(item);
					return;
				}
				if(cacheConfiguration.getRemoteEnabled()&&remoteCache.canGet(id))//TODO implement remote machine part
				{
					remoteCache.get(id).then(function(item){
						if(item)
						{
							resolve(item);
							return;
						}
						getFromDatabaseAndConsiderCaching(id).then(function(item){
							resolve(item);
						}).catch(reject);
					}).catch(function(err){
						console.error(err);
						getFromDatabaseAndConsiderCaching(id).then(function(item){
							resolve(item);
						}).catch(reject);
					});
					return;
				}
				getFromDatabaseAndConsiderCaching(id).then(function(item){
					resolve(item);
				}).catch(reject);
			});
		};
		/*this.getJSONStringById = function(id){
			id = String(id);
			checkShuttingDown();
			return new Promise(function(resolve, reject){
				if(cacheConfiguration.getInMemoryEnabled()&&inMemoryCache.has(id)){
					var item = inMemoryCache.getById(id);
					resolve(item?JSON.stringify(item):null);
					return;
				}
				if(cacheConfiguration.getOnDiskEnabled()&&onDiskCache.has(id)){
					resolve(onDiskCache.getJSONStringById(id));
					return;
				}
				if(cacheConfiguration.getRemoteEnabled()&&remoteCache.canGet(id))//TODO implement remote machine part
				{
					remoteCache.get(id).then(function(item){
						console.log('item is: ');
						console.log(item);
						if(item)
						{
							resolve(item);
							return;
						}
						getFromDatabaseAndConsiderCaching(id).then(function(item){
							resolve(item?JSON.stringify(item):null);
						}).catch(reject);
					}).catch(reject);
					return;
				}
				getFromDatabaseAndConsiderCaching(id).then(function(item){
					resolve(item?JSON.stringify(item):null);
				}).catch(reject);
			});
		};
		*/this.update = function(id, item){ 
			id = String(id);
			checkShuttingDown();
			return new Promise(function(resolve, reject){
				updateLocal(id, item).then(function(updatedLocal){
					update_remote(id, item, updatedLocal).then(function(updatedToRemote){
						if(updatedLocal||updatedToRemote){
							resolve();
							return;
						}
						update_toDatabase(id, item).then(resolve).catch(reject);
					}).catch(reject);
				}).catch(reject);
			}); 
		};
		this.getLocalIds = function(){
			var set=new Set();
			inMemoryCache.getIdsToSet(set);
			onDiskCache.getIdsToSet(set);
			return Array.from(set);
		};
		this.hasLocal = function(id){
			id = String(id);
			return inMemoryCache.has(id)||onDiskCache.has(id);
		};
		this.getLocal = getByIdLocal;
		this.merge = function(id, itemIncoming, dontMarkAsUpdated){
			id = String(id);
			var itemLocal = getByIdLocal(id);
			if(!itemLocal){
				return;//todo
			}
			updateLocal(id, merge(itemIncoming, itemLocal), dontMarkAsUpdated);
		};
		this.getJSON=function(){
			return {[S.NAME]:name};
		};
		this.getItemsJSON = function(){
			var arr = inMemoryCache.getItemsJSON();
			return arr.concat(onDiskCache.getItemsJSON());
		};
		this.shutDown=function(){
			if(shuttingDown)throw new Error('Already shutting down');
			shuttingDown = true;
			return new Promise(function(resolve, reject){
				onDiskCache.removeTotalSizeLeastAccessedRoundUp(size, function(id, item){
				router.remove(id);
				updateToDatabase(id, item);
			}, true);
			});
		};
		function checkShuttingDown(){
			if(shuttingDown)throw new Error('Shutting down');
		}
		function updateLocal(id, item, dontMarkAsUpdated){
			id = String(id);
			return new Promise(function(resolve, reject){
				update_inMemory(id, item, dontMarkAsUpdated).then(function(updatedInMemory){
					console.log('update in emmroy is ');
					console.log(updatedInMemory);
					update_onDisk(id, item, dontMarkAsUpdated).then(function(updatedToDisk){
					console.log('update in emmroy is ');
					console.log(updatedToDisk); 
						resolve(updatedInMemory||updatedToDisk);
					}).catch(reject);
				}).catch(reject);
			});
		}
		function getByIdLocal(id){
			id = String(id);
			if(cacheConfiguration.getInMemoryEnabled()&&inMemoryCache.has(id)){
				return inMemoryCache.getById(id);
			}
			if(cacheConfiguration.getOnDiskEnabled()&&onDiskCache.has(id)){
				return onDiskCache.getById(id);
			}
		}
		function update_inMemory(id, item, dontMarkAsUpdated){
			return new Promise(function(resolve, reject){
				var updateInMemoryCache=cacheConfiguration.getInMemoryEnabled&&inMemoryCache.has(id);
				if(!updateInMemoryCache){
					resolve(false);
					return;
				}
				inMemoryCache.update(id, item, dontMarkAsUpdated).then(function(){
					resolve(true);
				}).catch(reject);
			});
		}
		function update_onDisk(id, item, dontMarkAsUpdated){
			return new Promise(function(resolve, reject){
				var updateOnDiskCache=cacheConfiguration.getOnDiskEnabled()&&onDiskCache.has(id);
				if(!updateOnDiskCache){
					resolve(false);
					return;
				}
				onDiskCache.update(id, item, dontMarkAsUpdated).then(function(){
					resolve(true);
				}).catch(reject);
			});
		}
		function update_remote(id, item, updatedLocally){
			return new Promise(function(resolve, reject){
				var updateRemote = cacheConfiguration.getRemoteEnabled()&&remoteCache.canUpdate(id);
				if(!updateRemote)//TODO implement remote machine part
				{
					resolve(false);
					return;
				}
				remoteCache.update(id, item, updatedLocally).then(function(){
					resolve(true);
				}).catch(reject);
			});
		}
		function update_toDatabase(id, item){
			return updateToDatabase(id, item);
		}
		function getFromDatabaseAndConsiderCaching(id){
			return new Promise(function(resolve, reject){
				getFromDatabaseById(id).then(function(item){
					if(!item){
						resolve();
						return;
					}//todo implement cache manager to decide when to cache.
					considerCaching(id, item);
					resolve(item);
				}).catch(reject);
			});
		}
		function considerCaching(id, item){ 
			var shouldCacheType = cacheManager.shouldCache(id, item);
			if(!shouldCacheType)return;
			switch(shouldCacheType){
				
				case ShouldCacheTypes.IN_MEMORY:
					inMemoryCache.add(id, item);
				break;
				default:
					onDiskCache.add(id, item);
				break;
			}
			router.add(id);
		}
		function moveToOnDiskFromInMemoryTotalSizeRoundUp(size){
			inMemoryCache.removeTotalSizeLeastAccessedRoundUp(size, function(id, item, updated){
				onDiskCache.add(id, item, updated, /*put in most accessed*/true);
			}, false);
		}
		function moveToDatabaseFromOnDiskTotalSizeRoundUp(size){
			onDiskCache.removeTotalSizeLeastAccessedRoundUp(size, function(id, item){
				router.remove(id);
				updateToDatabase(id, item);
			}, true);
		}
		function considerPromoting(id, roughSize, updated){
			return cacheConfiguration.getInMemoryEnabled();
		}
		function considerCachingLocally(id, item){
			return cacheManager.considerCachingLocally(id, item);
		}
		function cacheLocally(id, item){
			console.log('cached locally cache locally');
			
			console.log('CACHE LOCALLY');
			console.log(typeof(id)); 
			onDiskCache.add(id, item);
			router.add(id);
		}
		function promote(id, item, updated){
			inMemoryCache.add(id, item, updated);
			return true;
		}
		function clear(){
			onDiskCache.clear();
		}
		function onDiskCacheChangedSize(size){
			cacheManager.onDiskCacheChangedSize(size);
		}
		function inMemoryCacheChangedSize(size){
			cacheManager.inMemoryCacheChangedSize(size);
		}
	};
	return _Cache;
})();