const callsite = require('callsite');
const path = require('path');
module.exports = new (function(){
	var rootPath;
	var initialized = false;
	this.initialize = function(){
		if(initialized)throw new Error('Aready initialized');
		initialized = true;
		var stack = callsite();
		var requester = stack[1].getFileName();
		rootPath =path.dirname(requester);
	console.log(rootPath);
	};
	this.get=function(){
		if(!initialized)throw new Error('Not initialize');
		return rootPath;
	};
})();