const RepositoriesHelper = require('repositories_helper');module.exports={
	get Ajax(){return require('./backend/Ajax')},
	get binarySearchRoundDown(){return require('./backend/binarySearchRoundDown')},
	get binarySearchRoundUp(){return require('./backend/binarySearchRoundUp')},
	get bubbleSort(){return require('./backend/bubbleSort')},
	get capitalizeFirstLetter(){return require('./backend/capitalizeFirstLetter')},
	get CaseSensitiveRequire(){return require('./backend/CaseSensitiveRequire')},
	get ChannelType(){return require('./backend/ChannelType')},
	get CircularBuffer(){return require('./backend/CircularBuffer')},
	get configuration(){return require('./backend/configuration')},
	get copyProperties(){return require('./backend/copyProperties')},
	get Dal(){return require('./backend/Dal')},
	get delete_DalPornSite(){return require('./backend/delete_DalPornSite')},
	get each(){return require('./backend/each')},
	get shuffle(){return require('./backend/shuffle')},
	get Enumerable(){return require('./backend/Enumerable')},
	get EventEnabledBuilder(){return require('./backend/EventEnabledBuilder')},
	get files(){return require('./backend/files')},
	get fisherYatesShuffle(){return require('./backend/fisherYatesShuffle')},
	get getTime(){return require('./backend/getTime')},
	get HashBuilder(){return require('./backend/HashBuilder')},
	get Identifier(){return require('./backend/Identifier')},
	get IPHelper(){return require('./backend/IPHelper')},
	get Iterator(){return require('./backend/Iterator')},
	get Linq(){return require('./backend/Linq')},
	get Longpoll(){return require('./backend/Longpoll')},
	get Longpolls(){return require('./backend/Longpolls')},
	get LongpollTimeoutManager(){return require('./backend/LongpollTimeoutManager')},
	get parseArgs(){return require('./backend/parseArgs')},
	get Random(){return require('./backend/Random')},
	get requireRaw(){return require('./backend/requireRaw')},
	get RootPath(){return require('./backend/RootPath')},
	get RouletteWheel(){return require('./backend/RouletteWheel')},
	get Session(){return require('./backend/Session')},
	get Sessions(){return require('./backend/Sessions')},
	get Set(){return require('./backend/Set')},
	get splitWordsAndCapitalizeFirstLetters(){return require('./backend/splitWordsAndCapitalizeFirstLetters')},
	get StringsHelper(){return require('./backend/StringsHelper')},
	get TemporalCallback(){return require('./backend/TemporalCallback')},
	get TemporaryFile(){return require('./backend/TemporaryFile')},
	get throwNotImplemented(){ return ('./backend/throwNotImplemented');},
	get TicketedSend(){return require('./backend/TicketedSend')},
	get TicketedSend(){return require('./backend/TicketedSend')},
	get Timer(){return require('./backend/Timer')},
	get toUpperCaseUnderscoreSeperated(){return require('./backend/toUpperCaseUnderscoreSeperated')},
	get UrlHelper(){return require('./backend/UrlHelper')},
	get Validation(){return require('./backend/Validation')},
	get WeakReference(){return require('./backend/WeakReference')},
	getScriptsRelativePath:RepositoriesHelper.getGetScriptsRelativePath(),
	getScriptsAbsolutePath:RepositoriesHelper.getGetScriptsAbsolutePath()
};