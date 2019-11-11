(function(){
	const Module = require('module');
	const path = require('path');
	const fs = require('fs');
    const callsite = require('callsite');
	const commondir = require('commondir');
	Module.prototype.require = (function(old){return function(str){
		if(isPath(str))checkPathExists(str);
		return old.apply(this, arguments);
	};})(Module.prototype.require);
	function getCallerFile(){
		var stack = callsite();
        return stack[4].getFileName();
	}
	function isPath(str){
		return str.indexOf('./')>=0||str.indexOf('.\\')>=0;
	}
	function checkPathExists(filePath){
		filePath = fixPathEnding(filePath);
		var callerFile = getCallerFile();
		if(callerFile.indexOf('node_modules')>=0)return true;
		var callingDirectory = path.dirname(callerFile);
		filePath=path.resolve(callingDirectory, filePath);
		var commonDirectory = commondir([filePath, callerFile]);
		var filePathRelativeToCommonDirectory= path.relative(commonDirectory, filePath);
		var pathComponents = filePathRelativeToCommonDirectory.split(path.sep);
		if(!checkIfRelativePathExists(commonDirectory, pathComponents))
			throw new Error('The file: '+filePath+' does not exist with this case');
	}
	function fixPathEnding(filePath){
		if(filePath.length<3)return filePath+'.js';
		if(filePath.substr(filePath.length-3, 3).toLowerCase()!='.js')return filePath+'.js';
		return filePath;
	}
	function checkIfRelativePathExists(commonDirectory, pathComponents) {
		var currentPath = commonDirectory;
		while(pathComponents.length>0){
			var pathComponent = pathComponents.splice(0, 1)[0];
			var fileNames = fs.readdirSync(currentPath);
			if (fileNames.indexOf(pathComponent) === -1)return false;
			currentPath = path.join(currentPath, pathComponent);
		}
		return true;
	}
})();