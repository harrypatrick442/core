module.exports = (function(){
	const LongpollTimeoutManager = require('./LongpollTimeoutManager');
	var _Longpolls = function(){
		var mapIdToLongpoll={};
		LongpollTimeoutManager.add(this);
		this.add = function(longpoll){
			longpoll.addEventListener('dispose', onDispose);
			mapIdToLongpoll[longpoll.getId()]=longpoll;
		};
		this.getById= function(id){
			return mapIdToLongpoll[id];
		};
		this.forEach = function(func){
			for(var i in mapIdToLongpoll){
				func(mapIdToLongpoll[i]);
			}
		};
		function onDispose(e){
			var longpoll = e.longpoll;
			delete mapIdToLongpoll[longpoll.getId()];
		}
	};
	return _Longpolls;
})();