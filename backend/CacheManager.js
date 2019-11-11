module.exports = (function(){
	var totalOnDiskSizeBytes=0;
	return function(params){
		const ShouldCacheTypes = require('./ShouldCacheTypes');
		const _delete = params._delete;
		const moveToOnDiskFromInMemoryTotalSizeRoundUp = params.moveToOnDiskFromInMemoryTotalSizeRoundUp;
		const moveToDatabaseFromOnDiskTotalSizeRoundUp = params.moveToDatabaseFromOnDiskTotalSizeRoundUp;
		const cacheConfiguration = params.cacheConfiguration;
		const maxSizeInMemory= cacheConfiguration.getMaxSizeInMemory();
		const maxSizeOnDisk = cacheConfiguration.getMaxSizeOnDisk();
		const percentMaxSizeOnDiskResizeTo= cacheConfiguration.getProportionMaxSizeOnDiskResizeTo();
		const percentMaxSizeInMemoryResizeTo= cacheConfiguration.getProportionMaxSizeInMemoryResizeTo();
		const percentMaxSizeOnDiskResizeFrom= cacheConfiguration.getProportionMaxSizeOnDiskResizeFrom();
		const percentMaxSizeInMemoryResizeFrom= cacheConfiguration.getProportionMaxSizeInMemoryResizeFrom();
		const lowerBoundResizeInMemory = maxSizeInMemory*percentMaxSizeInMemoryResizeTo;
		const lowerBoundResizeOnDisk= maxSizeOnDisk*percentMaxSizeOnDiskResizeTo;
		const upperBoundResizeInMemory = maxSizeInMemory*percentMaxSizeInMemoryResizeFrom;
		const upperBoundResizeOnDisk= maxSizeOnDisk*percentMaxSizeOnDiskResizeFrom;
		const clear = params.clear;
		var currentOnDiskCacheSize=0;
		var currentInMemoryCacheSize=0;
		this.shouldCache=function(id, item){
			console.log('should cache');
			console.log(id); 
			console.log(item);
			return ShouldCacheTypes.ON_DISK;//todo
		};
		this.considerCachingLocally = function(id, item){
			return true;
		};
		this.onDiskCacheChangedSize = function(size){
			currentOnDiskCacheSize=size;
			if(currentOnDiskCacheSize>upperBoundResizeOnDisk){
				var reduceBySize = currentOnDiskCacheSize- lowerBoundResizeOnDisk;
				if(reduceBySize>0)moveToDatabaseFromOnDiskTotalSizeRoundUp(reduceBySize);//for now synchronous.
			}
		};
		this.inMemoryCacheChangedSize = function(size){
			currentInMemoryCacheSize=size;
			if(currentInMemoryCacheSize>upperBoundResizeInMemory){
				scheduleRelocateFromInMemoryToOnDisk();
			}
		};
		function scheduleRelocateFromInMemoryToOnDisk(){
			setTimeout(reallocateFromInMemoryToDisk,0);//todo implement properly but this should do nicely to debug it. if it works right no errors with already in.
			
		}
		function reallocateFromInMemoryToDisk(){
			var reduceBySize = currentInMemoryCacheSize- lowerBoundResizeInMemory;
			if(reduceBySize>0)moveToOnDiskFromInMemoryTotalSizeRoundUp(reduceBySize);//for now synchronous.
		}
	};
})();