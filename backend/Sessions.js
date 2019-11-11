module.exports = (function(){
	var Session = require('./Session');
	return function(){
		var mapSessionIdToSession=[];
		var self = this;
		this.getById=function(sessionId){
			return mapSessionIdToSession[sessionId];
		};
		this.add=function(session){
			mapSessionIdToSession[session.getId()]=session;
			session.addEventListener('dispose', onDispose);
		};
		function onDispose(e){
			delete mapSessionIdToSession[e.session.getId()];
		}
	};
})();