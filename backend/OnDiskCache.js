module.exports =(function(){
	const ACCESSED='a';
	const UPDATED='u';
	const SIZE='s';
	const path = require('path');
	const fs = require('fs');
	const S = require('./../strings/S');
	const PromotionTypes= require('./PromotionTypes');
	const DirectoryHelper = require('./../helpers/DirectoryHelper');
	const MostAccessed = require('./MostAccessed');
	//Not designed for "simple" objects such as a single number 0. Designed to store proper objects.
	var mapNameToInstance=new Map();
	var onDiskCacheFolder = path.join(__dirname, '/on_disk_cache/');
	var mostAccessed = new Set();
	var totalSizeBytes = 0;
	var _OnDiskCache = function(params){
		var sizeBytes=0;
		var self = this;
		var name = params.name;
		var changedSize = params.changedSize;
		var considerPromoting = params.considerPromoting;
		var mostAccessed = new MostAccessed();
		var promote = params.promote;
		if(!name)throw new Error('No name supplied');
		if(mapNameToInstance.get(name))throw new Error('Instance with name "'+name+'" already created');
		mapNameToInstance.set(name, this);
		var dir = getDirectory(name);
		var mapIdToInfo=new Map();
		this.getById= function(id, internalOperation/* dont consider promoting in cache for this peration*/){
			var itemStr = readItemRawFromFile(id);
			if(!itemStr){
				deleteInfo(id);
				return null;
			}
			var item = JSON.parse(itemStr);
			var info = mapIdToInfo.get(id);
			info[ACCESSED]=getTime();
			repositionInfoToEnd(id, info);
			if(!internalOperation){
				if(mostAccessed.has(id)){
					var updated = info[UPDATED];
					var size = info[SIZE];
					if(considerPromoting(id, size, updated)){
						promote(id, item, updated); 
						deleteInfo(id);
						deleteFile(id);
					}
					else{
						mostAccessed.bringToFront(id);
					}
				}
				else mostAccessed.add(id);
			}
			return item;
		};
		this.getJSONStringById=function(id){
			var item = readItemRawFromFile(id);
			if(!item){
				deleteInfo(id);
				return null;
			}
			var info = mapIdToInfo.get(id);
			info[ACCESSED]=getTime();
			repositionInfoToEnd(id, info);
			if(mostAccessed.has(id)){
				var updated = info[UPDATED];
				var size = info[SIZE];
				if(considerPromoting(id, size, updated)){
					promote(id, JSON.parse(item), updated); 
					deleteInfo(id);
					deleteFile(id);
				}
			}
			return item;
		}
		this.add=function(id, item, updated, _addToMostAccessed){
			if(!item)return;
			addJSONString(id, JSON.stringify(item), updated);
			if(_addToMostAccessed)mostAccessed.add(id);
		};
		this.addJSONString = function(id, item, updated){
			if(!item)return;
			addJSONString(id, item, updated);
		};
		this.getSize = function(){
			return sizeBytes;
		};
		this.clear = function(){
			DirectoryHelper.deleteAllFilesInDirectorySync(dir, false, false);
		};
		function addJSONString(id, item, updated){
			if(mapIdToInfo.has(id))throw new Error('Already in cache');
			var info = {};
			info[ACCESSED]=getTime();
			var size = item.length;
			info[SIZE]= size;
			info[UPDATED]= updated;
			mapIdToInfo.set(id,info);
			writeRawItemToFile(id, item);
			fileChangedSize(0,size);
		}
		this.update = function(id, item, dontMarkAsUpdated){
			return update(id, undefined, item, dontMarkAsUpdated);
		};
		this.updateJSONString = function(id, item, dontMarkAsUpdated){
			return update(id, item, undefined, dontMarkAsUpdated);
		};
		this.has=function(id){
			return mapIdToInfo.has(id);
		};
		this.remove=function(id, onDelete){
			deleteInfo(id);
			if(onDelete){ 
				var item =readItemFromFile(id);
				if(item!==null)
					onDelete(id, item);
			}
			deleteFile(id);
		};
		this.getIdsToSet=function(set){
			mapIdToInfo.forEach(function(value, key){
				set.add(key);
			});
		};
		this.getUpdatedIds=function(){
			var ids=[];
			mapIdToInfo.forEach(function(info, id){
				if(info[UPDATED]){
					ids.push(id);
				}
			});
			return ids;
		};
		this.getItemsJSON = function(){
			var arr=[];
			mapIdToInfo.forEach(function(info, id){
				var item = readItemRawFromFile(id);
				if(item){
					arr.push({[S.DATA]:JSON.parse(item), [S.ACCESSED]:info[ACCESSED], [S.UPDATED]:info[UPDATED], [S.ID]:id, [S.CACHE_TYPE]:S.ON_DISK});
				}
			});
			return arr;
		};
		/*this.removeLastAccessedBeforeTime = function(time, onDeleteCallback, onlyDeleteCallbackUpdated){
			var iterator = mapIdToInfo.entries();
			var entry;
			while(!(entry=iterator.next()).done){
				var value = entry.value;
				var info = value[1];
				if(info[ACCESSED]<time)remove(value[0], info, onDeleteCallback, onlyDeleteCallbackUpdated);
			}
		};*/
		this.removeTotalSizeLeastAccessedRoundUp = function(size, onDeleteCallback, onlyDeleteCallbackUpdated){
			var iterator = mapIdToInfo.entries();
			var entry;
			var sizeDeleted=0;
			while(sizeDeleted<size&&(!(entry = iterator.next()).done)){
				var value = entry.value;
				var info = value[1];
				remove(value[0], info, onDeleteCallback, onlyDeleteCallbackUpdated);
				sizeDeleted+=info[SIZE];
			}
		};
		this.unupdate = function(id){
			var info = mapIdToInfo.get(id);
			if(info)info[UPDATED]=false;
		};
		function remove(id, info, onDeleteCallback, onlyDeleteCallbackUpdated){
			var updated = info[UPDATED];
			if(!onlyDeleteCallbackUpdated || updated){
				var item =readItemFromFile(id);
				if(item!==null)
					onDeleteCallback(id, item, updated);
			}
			deleteFile(id);
			mostAccessed.remove(id);
			fileChangedSize(info[SIZE], 0);
			mapIdToInfo.delete(id);
		}
		function deleteInfo(id){
			mostAccessed.remove(id);
			var info = mapIdToInfo.get(id);
			if(info){
				fileChangedSize(info[SIZE], 0);
			}
			mapIdToInfo.delete(id);
		}
		function update(id, itemString, itemObj, dontMarkAsUpdated){
			return new Promise(function(resolve, reject){
				if(!mapIdToInfo.has(id))throw new Error('Not in cache');
				var info = mapIdToInfo.get(id);
				info[ACCESSED]=getTime();
				if(!dontMarkAsUpdated)info[UPDATED]=true;
				var oldSize = info[SIZE];
				if(mostAccessed.has(id))
				{
					if(considerPromoting(id, oldSize, true)){
						if(!itemObj){
							itemObj = JSON.parse(itemString);
						}
						deleteInfo(id);
						deleteFile(id);
						promote(id, itemObj, true);
						//since its being updated for now we will assume its going to be updated more. Therefore its better its only in memory.
						//if(promotionType==PromotionTypes.DONT_KEEP_ON_DISK){
						resolve();
						return;
						//}
					}
					else mostAccessed.bringToFront(id);
				}
				else mostAccessed.add(id);
				if(!itemString)itemString = JSON.stringify(itemObj);
				var size = itemString.length;
				info[SIZE]=size;
				repositionInfoToEnd(id, info);
				writeRawItemToFile(id, itemString);
				fileChangedSize(oldSize,size);
				resolve();
			});
		}
		function fileChangedSize(from, to){
			var change = to - from;
			totalSizeBytes=totalSizeBytes+change;
			sizeBytes = sizeBytes + change;
			changedSize(sizeBytes);
		}
		function repositionInfoToEnd(id, info){
			mapIdToInfo.delete(id);
			mapIdToInfo.set(id, info);
		}
		function writeRawItemToFile(id, item){
			var filePath = getFilePath(id);
			try{
				fs.writeFileSync(filePath,item,'utf8');
				return true;
			}
			catch(err){
				console.error(err);
				return false;
			}
		}
		function deleteFile(id){
			var filePath = getFilePath(id);
			try {
			  fs.unlinkSync(filePath);
			  return true;
			} catch(err) {
			  console.error(err);
			  return false;
			}
		}
		function readItemFromFile(id){
			var raw = readItemRawFromFile(id);
			if(!raw)return null;//no, i dont store 0's in files.
			return JSON.parse(raw);
		}
		function readItemRawFromFile(id){
			var filePath = getFilePath(id);
			try{
				return fs.readFileSync(filePath,'utf8');
			}
			catch(err){
				console.error(err);
			}
		}
		function getFilePath(id){
			return path.join(dir, String(id));
		}
	};
	_OnDiskCache.getSize=function(){
		return totalSizeBytes;
	};
	return _OnDiskCache;
	function getDirectory(name){
		var dir = path.join(onDiskCacheFolder, name,'/');
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir, { recursive: true });
		}
		return dir;
	}
	function getTime(){
		return new Date().getTime();
	}
})();