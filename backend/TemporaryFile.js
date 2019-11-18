const Identifier = require('./Identifier');
const WeakReference = require('./WeakReference');
const each = require('./each');
const fs = require('fs');
const path = require('path');
const WEAK_REFERENCE='w';
const FILE_NAME_WITH_EXTENSION = 'f';
const TEMPORARY_FILES_DIRECTORY = path.join(__dirname, './../temp/');
	const regExpSplitPath=new RegExp('\/|\\\\');
module.exports = new (function(){
	var activeFiles = [];
	var lastCleanup = getTime();
	createIfDoesntExistSync(TEMPORARY_FILES_DIRECTORY);
	this.new=function(a, b){
		var extension, callback;
		if(typeof(a)==='function'){
			callback = a;
		}
		else{
			callback = b;
			extension = a;
		}
		if(!extension)extension = 'tmp';
		var temporaryFile =new TemporaryFile(extension);
		try{
			/*if(callback){
				fs.open(temporaryFile.getAbsolutePath(), 'w', secondPart);
			}else{*/
				fs.openSync(temporaryFile.getAbsolutePath(), 'w');
				secondPart();
			//}
		}catch(err){
			secondPart(err);
		}
		function secondPart(err){
			if(err){
				callback(err);
				return;
			}
			activeFiles.push({[WEAK_REFERENCE]:new WeakReference(temporaryFile), [FILE_NAME_WITH_EXTENSION]:temporaryFile.getFileNameWithExtension()});
			callback&&callback(undefined, temporaryFile);
		}
		return temporaryFile;
	};
	function TemporaryFile(extension){
		var uniqueFileName = Identifier.getGuaranteedUniqueHexString();
		var fileNameWithExtension = uniqueFileName+'.'+extension;
		var absolutePath = path.join(TEMPORARY_FILES_DIRECTORY, fileNameWithExtension);
		this.getFileNameWithExtension=function(){
			return fileNameWithExtension;
		};
		this.dispose = function(){
			try{
				fs.unlink(absolutePath);
			}
			catch(ex){
				
			}
		};
		this.getAbsolutePath = function(){
			return absolutePath;
		};
	}
	function cleanupIfTime(){
		var now = getTime();
		if(now - lastCleanup<DELAY_CLEANUP)return;
		cleanup();
		lastCleanup = now;
	}
	function cleanup(){
		var index=0;
		var length=activeFiles.length;
		while(index<length){
			var activeFile = activeFiles[index];
			if(activeFile[WEAK_REFERENCD].isAlive()){
				index++;
				continue;
			};
			activeFiles.splice(activeFiles.indexOf(activeFile), 1);
			activeFile.dispose();
			length--;
		}
	}
	function getTime(){
		return new Date().getTime();
	}
	function createIfDoesntExistSync(dirPath){
		var splits = splitPath(dirPath);
		if(!splits[0])throw new Error('invalid file path');
		var incrementalPath = splits[0];
		var length = splits.length;
		var i=1;
		while(i<length){
			
			try {
				// Query the entry
				stats = fs.lstatSync(incrementalPath);

				// Is it a directory?
				if (!stats.isDirectory()) {
					// Yes it is
					fs.mkdirSync(incrementalPath);
				}
			}
			catch (e) {
				console.log(e);
				try{
					fs.mkdirSync(incrementalPath);
					}
					catch(ex){}
			}
			incrementalPath+=path.sep+splits[i++];
		}
	};
	function splitPath(path){
		return path.split(regExpSplitPath)
	}
})();