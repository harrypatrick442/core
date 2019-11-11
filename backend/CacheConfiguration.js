module.exports = (function(){
	const configuration = require('./../configuration/Configuration');
	const cacheConfiguration = configuration.getCache();
	const inMemoryEnabledAll=cacheConfiguration.getInMemoryEnabled();
	const onDiskEnabledAll=cacheConfiguration.getOnDiskEnabled();
	const remoteEnabledAll=cacheConfiguration.getRemoteEnabled();
	var CacheConfiguration = function (cacheSpecificConfiguration){
		this.getInMemoryEnabled = function(){
			return inMemoryEnabledAll&&cacheSpecificConfiguration.getInMemoryEnabled();
		};
		this.getOnDiskEnabled=function(){
			return onDiskEnabledAll&&cacheSpecificConfiguration.getOnDiskEnabled();
		};
		this.getRemoteEnabled = function(){
			return remoteEnabledAll&&cacheSpecificConfiguration.getRemoteEnabled();
		};
		this.getMaxSizeOnDisk = cacheSpecificConfiguration.getMaxSizeOnDisk;
		this.getMaxSizeOnDiskMostAccessed = cacheSpecificConfiguration.getMaxSizeOnDiskMostAccessed;
		this.getMaxSizeInMemory = cacheSpecificConfiguration.getMaxSizeInMemory;
		this.getProportionMaxSizeOnDiskResizeFrom=cacheSpecificConfiguration.getProportionMaxSizeOnDiskResizeFrom;
		this.getProportionMaxSizeInMemoryResizeFrom=cacheSpecificConfiguration.getProportionMaxSizeInMemoryResizeFrom;
		this.getProportionMaxSizeOnDiskResizeTo=cacheSpecificConfiguration.getProportionMaxSizeOnDiskResizeTo;
		this.getProportionMaxSizeInMemoryResizeTo=cacheSpecificConfiguration.getProportionMaxSizeInMemoryResizeTo;
		this.getNChangesUpdateInMemoryItemSize=cacheSpecificConfiguration.getNChangesUpdateInMemoryItemSize;
		this.getDelayUpdateInMemoryItemSize=cacheSpecificConfiguration.getDelayUpdateInMemoryItemSize;
	};
	CacheConfiguration.createDefault = function(){
		return new CacheConfiguration({
			getInMemoryEnabled:returnTrue,
			getOnDiskEnabled:returnTrue,
			getRemoteEnabled:returnTrue,
			getMaxSizeOnDisk:cacheConfiguration.getMaxSizeOnDisk, 
			getMaxNItemsOnDiskMostAccessed:cacheConfiguration.getMaxNItemsOnDiskMostAccessed,
			getMaxSizeInMemory:cacheConfiguration.getMaxSizeInMemory, 
			getProportionMaxSizeOnDiskResizeFrom:cacheConfiguration.getProportionMaxSizeOnDiskResizeFrom,
			getProportionMaxSizeInMemoryResizeFrom:cacheConfiguration.getProportionMaxSizeInMemoryResizeFrom,
			getProportionMaxSizeOnDiskResizeTo:cacheConfiguration.getProportionMaxSizeOnDiskResizeTo,
			getProportionMaxSizeInMemoryResizeTo:cacheConfiguration.getProportionMaxSizeInMemoryResizeTo,
			delayUpdateItemSize:cacheConfiguration.getDelayUpdateInMemoryItemSize,
			getNChangesUpdateInMemoryItemSize:cacheConfiguration.getNChangesUpdateInMemoryItemSize,
			getDelayUpdateInMemoryItemSize:cacheConfiguration.getDelayUpdateInMemoryItemSize
		});
	};
	function returnTrue(){return true;}
	return CacheConfiguration;
})();