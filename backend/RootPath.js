const callsite = require('callsite');
const path = require('path');
module.exports = new (function(){
	var rootPath;
	var initialized = false;
	this.initialize = function(dir){
		if(initialized)throw new Error('Aready initialized');
		initialized = true;
		if(dir){
			rootPath = dir;
			return;
		}
		var stack = callsite();
		var requester = stack[1].getFileName();
		rootPath =path.dirname(requester);
	};
	this.get=function(){
		if(!initialized)throw new Error('Not initialize');
		return rootPath;
	};
})();