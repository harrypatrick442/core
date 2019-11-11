module.exports = function(params){
	const MAX_MOST_ACCESSED_SIZE_DEFAULT=10;
	var maxMostAccessedSize= params?params.maxMostAccessedSize:undefined;
	if(!maxMostAccessedSize)maxMostAccessedSize= MAX_MOST_ACCESSED_SIZE_DEFAULT;
	var mostAccessed = new Set();
	this.add = function(id){
		mostAccessed.add(id);
		overflow();
	};
	this.bringToFront = function(id){
		mostAccessed.delete(id);
		mostAccessed.add(id);
	}
	this.has = function(id){
		return mostAccessed.has(id);
	};
	this.getSize = function(){return mostAccessed.size;};
	this.getSet = function(){
		return mostAccessed;
	};
	this.remove = function(id){
		mostAccessed.delete(id);
	};
	function overflow(){
		var id;
		var nDeleted = 0;
		var nDelete = mostAccessed.size - maxMostAccessedSize;
		if(nDelete<=0)return;
		var iterator = mostAccessed.keys();
		while(!(id=iterator.next()).done&&nDeleted<nDelete){
			mostAccessed.delete(id);
			nDeleted++;
		}
	};
};