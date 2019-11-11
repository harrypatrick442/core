module.exports = new (function(){
	const S = require('./../strings/S');
	const ACCESSED='a';
	const ITEM='i';
	const UPDATED='u';
	const DEFAULT_SAMPLE_SIZE =6;
	const sizeOf = require('object-sizeof');
	const getTime = require('./../../../core/backend/getTime');
	const MostAccessed = require('./MostAccessed');
	var _InMemoryCache = function(params){
		var name = params.name;
		var changedSize = params.changedSize;
		var delayUpdateItemSize = params.delayUpdateItemSize;
		var nChangesUpdateItemSize= params.nChangesUpdateItemSize;
		if(!name)throw new Error('No name supplied');
		var mapIdToCachedItem=new Map();
		var mostAccessed = new MostAccessed();
		var nChangesSinceItemSizeLastUpdated=0;
		var itemSizeLastUpdated = getTime();
		var currentApproximateItemSize=0;
		var previousSize=0;
		this.getById= function(id, internalOperation){
			var cachedItem = mapIdToCachedItem.get(id);
			if(!cachedItem)return null;
			if(!internalOperation)
				cachedItem[ACCESSED]=getTime();
			return cachedItem[ITEM];
		};
		this.has = function(id){
			return mapIdToCachedItem.has(id);
		};
		this.update = function(id, item, dontMarkAsUpdated){
			return new Promise(function(resolve, reject){
				if(!mapIdToCachedItem.has(id))throw new Error('Not in the cache');
				var cachedItem = mapIdToCachedItem.get(id);
				mapIdToCachedItem.delete(id);
				cachedItem[ACCESSED]=getTime();
				if(!dontMarkAsUpdated)cachedItem[UPDATED]=true;
				cachedItem[ITEM]=item;
				mapIdToCachedItem.set(id, cachedItem);
				mostAccessed.bringToFront(id);
				nChangesSinceItemSizeLastUpdated++;
				updateApproximateItemSizeIfNecessary();
				dispatchChangedSizeIfNecessary();
				resolve();
			});	
		};
		this.getIdsToSet=function(set){
			mapIdToCachedItem.forEach(function(value, key){
				set.add(key);
			});
		};
		this.getUpdatedIds=function(){
			var ids=[];
			mapIdToCachedItem.forEach(function(cachedItem, id){
				if(cachedItem[UPDATED]){
					ids.push(id);
				}
			});
			return ids;
		};
		this.add=function(id, item, updated){
			if(mapIdToCachedItem.has(id))throw new Error('Already in the cache');
			mapIdToCachedItem.set(id, {
				[ITEM]:item,
				[ACCESSED]:getTime(),
				[UPDATED]:updated
			});
			mostAccessed.add(id);
			nChangesSinceItemSizeLastUpdated++;
			updateApproximateItemSizeIfNecessary();
			dispatchChangedSizeIfNecessary();
		};
		this.remove=function(id){
			mapIdToCachedItem.delete(id);
			mostAccessed.remove(id);
			nChangesSinceItemSizeLastUpdated++;
			updateApproximateItemSizeIfNecessary();
			dispatchChangedSizeIfNecessary();
		};
		this.getApproximateItemSize=getApproximateItemSize;
		this.removeNItemsLeastAccessed = removeNItemsLeastAccessed;
		this.removeTotalSizeLeastAccessedRoundUp = function(size, onDeleteCallback){
			if(currentApproximateItemSize<=0)return;
			var nItems = size/currentApproximateItemSize;
			removeNItemsLeastAccessed(nItems, onDeleteCallback);
		};
		this.getItemsJSON = function(){
			var arr=[];
			mapIdToCachedItem.forEach(function(item, id){
				arr.push({[S.DATA]:item[ITEM], [S.ACCESSED]:item[ACCESSED], [S.UPDATED]:item[UPDATED], [S.ID]:id, [S.CACHE_TYPE]:S.IN_MEMORY});
			});
			return arr;
		};
		this.unupdate = function(id){
			var cachedItem = mapIdToCachedItem.get(id);
			cachedItem[UPDATED]=false;
		};
		function getCurrentSize(){
			return currentApproximateItemSize*mapIdToCachedItem.size;
		}
		function removeNItemsLeastAccessed(nItems, onDeleteCallback){
			var iterator = mapIdToCachedItem.entries();
			var entry;
			var n=0;
			while(n<nItems&&(!(entry = iterator.next()).done)){
				var value = entry.value;
				var id = value[0];
				var cachedItem = value[1];
				onDeleteCallback(id, cachedItem[ITEM], cachedItem[UPDATED]);
				mapIdToCachedItem.delete(id);
				mostAccessed.remove(id);
				n++;
			}
			nChangesSinceItemSizeLastUpdated+=n;
			updateApproximateItemSizeIfNecessary();
			dispatchChangedSizeIfNecessary();
		};
		function getApproximateItemSize(desiredSampleSize){
			if(!desiredSampleSize)desiredSampleSize = DEFAULT_SAMPLE_SIZE;
			var mostAccessedSet = mostAccessed.getSet();
			var sampleSize = desiredSampleSize>mostAccessedSet.size?mostAccessedSet.size:desiredSampleSize;
			if(sampleSize<=0)return 0;
			var totalSize=0;
			if(sampleSize===mostAccessedSet.size){
				mostAccessedSet.forEach(function(id){
					totalSize+=_getApproximateItemSize(mapIdToCachedItem.get(id));//include the metadata as this uses memory too
				});
				return totalSize/sampleSize;
			}
			//more items than the desired sample size so pick them randomly
			var keys = Array.from(mostAccessedSet);//should be neglidgable delay caused by this but in time might like to consider a better way. caching recently added item references in another buffer.
			var n =0;
			while(n<sampleSize){
				var index = Random.getInt(0, keys.length);
				var cachedItem = mapIdToCachedItem[keys[index]];
				totalSize+=_getApproximateItemSize(cachedItem);
				keys.splice(index, 1);
				n++;
			}
			return totalSize/sampleSize;
		}
		function _getApproximateItemSize(cachedItem){
			return sizeOf(cachedItem);
		}
		function updateApproximateItemSizeIfNecessary(){
			var now = getTime();
			if(now - itemSizeLastUpdated>=delayUpdateItemSize||nChangesSinceItemSizeLastUpdated>=nChangesUpdateItemSize){
				itemSizeLastUpdated = now;
				currentApproximateItemSize = getApproximateItemSize();
				nChangesSinceItemSizeLastUpdated=0;
			}
		}
		function dispatchChangedSizeIfNecessary(){
			var currentSize=getCurrentSize();
			if(!previousSize||previousSize!=currentSize){
				changedSize(currentSize);
			}
			previousSize = currentSize;
		}
	};
	return _InMemoryCache;
})();