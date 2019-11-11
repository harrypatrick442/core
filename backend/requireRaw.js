module.exports = (function(){
	const fs = require('fs');
	const _eval = require('eval');
	const path = require('path');
    const callsite = require('callsite');
	const MAP='_mapFilePathToObjects';
	var captureCode = "module.exports ={}; for(var j in global){ if(j=='global'||j=='module'||j=='exports'||j=='j')continue; module.exports[j]=global[j];}";
	return function(filePath, scope, includeGlobals){
		if(!scope)throw new Error('No scope provided');
		if(includeGlobals==undefined)includeGlobals=true;
		filePath = fixPathEnding(filePath);
		var callerDirectory = getCallerDirectory();
		filePath = path.resolve(callerDirectory, filePath);
		var objects;
		if(!scope[MAP])scope[MAP]={};
		else{
			objects = scope[MAP][filePath];
			if(objects)
			{
				return;
			}
		}
		objects = _eval(readFile(filePath)+captureCode, scope, includeGlobals);
		scope[MAP][filePath]=objects;
		copyToScope(scope, objects);
		return scope;
	};
	function readFile(filePath){
		return fs.readFileSync(filePath);
	}
	function copyToScope(scope, objects){
		for(var i in objects){
			scope[i]=objects[i];
		}
	}
	function fixPathEnding(filePath){
		if(filePath.length<3)return filePath+'.js';
		if(filePath.substr(filePath.length-3, 3).toLowerCase()!='.js')return filePath+'.js';
		return filePath;
	}
	function getCallerDirectory(){
		var stack = callsite();
        var requester = stack[2].getFileName();
		return path.dirname(requester);
	}
})();