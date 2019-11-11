module.exports = new(function(){
	var updaters = new Set();
	const Configuration = require('./../configuration/Configuration');
	const cacheConfiguration = Configuration.getCache();
	const delayUnupdate = cacheConfiguration.getDelayUnupdate();
	const ShutdownManager = require('./../shutdown/ShutdownManager');
	ShutdownManager.addBeforeShutDown(onBeforeShutdown);
	var isUnupdating = false;
	var shutdownCallback;
	var shutdownCalled = false;
	var unupdaters = new Set();
	scheduleNextUnupdate();
	this.add = function(unupdater){
		unupdaters.add(unupdater);
	};
	function unupdate(){
		return new Promise(function(resolve, reject){
			isUnupdating = true;
			var iterator = unupdaters.values();
			next();
			function next(){
				var _next = iterator.next();
				if(_next.done){
					isUnupdating = false;
					scheduleNextUnupdate();
					resolve();
					return;
				}
				var unupdater = _next.value;
				unupdater.unupdate().then(function(){
					next();
				}).catch(function(err){
					console.error(err);
					next();
				});
			}
		});
	};
	function scheduleNextUnupdate(){
		if(shutdownCalled)return;
		if(shutdownCallback){
			shutdownCallback();
			shutdownCallback = null;
			shutdownCalled = true;
			return;
		}
		setTimeout(unupdate, delayUnupdate);
	}
	function onBeforeShutdown(){
		if(isUnupdating){	
			if(shutdownCallback)throw new Error('Already shutting down');
			return (function(){
				var _resolve;
				var _reject;
				shutdownCallback =function(){
					unupdate().then(_resolve).catch(reject);
				};
				return new Promise(function(resolve, reject){
					_resolve = resolve;
					_reject = reject;
				});
			})();
		}
		shutdownCalled = true;
		return unupdate();
	}
})();