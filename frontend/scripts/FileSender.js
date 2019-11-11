var FileSender = (function(){
	var CHUNK_SIZE = 1000000;
	var _FileSender = function(params){
		EventEnabledBuilder(this);
		var self = this;
		var url = params[S.URL];
		var sequentially = params[S.SEQUENTIALLY];
		var p={};
		p[S.URL]=url;
		var ajax = new Ajax(p);
		var queue = [];
		this[S.QUEUE] = function(params){
			var p={};
			var file =params[S.FILE];
			var inChunks = params[S.IN_CHUNKS];
			var url =params[S.URL];
			url =url+(url[url.length-1]=='/'?'':'/')+(inChunks?'chunks':'json');
			var sender = inChunks
			?
			new SenderChunks({[S.FILE]:file, [S.URL]:url, [S.TOKEN]:params[S.TOKEN]})
			:
			new Sender({[S.FILE_NAME]:params[S.FILE_NAME]?params[S.FILE_NAME]:(file?file['name']:''), [S.DATA]:params[S.DATA], [S.URL]:url});
			var handle = new Handle(sender);
			if(sequentially){
				queue.push(sender);
				if(queue.length<2){
					sendNext();
				}
			}
			else
				setTimeout(function(){
					queue.push(sender);
					sender.addEventListener(S.DONE, doneSendParallel);
					sender[S.SEND]();
				},0);
			dispatchQueued(handle);
			return handle;
		};
		function sendNext(){
			if(queue.length<1)return false;
			var nextSender = queue.splice(0, 1)[0];
			nextSender.addEventListener(S.DONE, doneSendSequentially);
			return true;
		}
		function dispatchQueued(handle){
			var p={};
			p[S.TYPE]= S.QUEUED;
			p[S.HANDLE]=handle;
			self.dispatchEvent(p);
		}
		function doneSendParallel(e){
			e[S.SENDER].removeEventListener(S.DONE);
			removeFromQueue(e[S.SENDER]);
			if(queue.length<1)dispatchDone();
		}
		function doneSendSequentially(e){
			e[S.SENDER].removeEventListener(S.DONE);
			removeFromQueue(e[S.SENDER]);
			sendNext()&&dispatchDone();
		}
		function dispatchDone(){
			var p={};
			p[S.TYPE]= S.DONE;
			self.dispatchEvent(p);
		}
		function removeFromQueue(sender){
			var index = queue.indexOf(sender);
			if(index<0)return;
			queue.splice(index, 1);
		}
	};
	return _FileSender;
	function SenderChunks(params){
		EventEnabledBuilder(this);
		var self = this;
		var file =params[S.FILE];
		if(!file)
			throw new Error('No file provided');
		var token = params[S.TOKEN];
		if(!token)throw new Error('No token provided');
		var url = params[S.URL];
		
		var fileName =file[S.NAME];
		var successful=false;
		var chunkRanges = getChunkRanges(file);
		var chunkRangesIndex=0;
		var sendCalled=false;
		var fileReader = new FileReader();
		var dispatchedDone=false;
		var sender;
		fileReader.onload = function () {
			var data = fileReader.result;
			var finished = chunkRangesIndex>=chunkRanges.length;
			sender = new Sender({[S.DATA]:data, [S.URL]:url+('?token='+token)+(finished?'&finished=true':''), [S.CONTENT_TYPE]:'raw'});
			sender[S.ON_ERRORS]=onErrors;
			sender.addEventListener(S.DONE, onDone); 
			sender[S.SEND]();
		}
		fileReader.onerror = function(err){
			onErrors([err]);
			sendAbort();
		};
		function sendNextChunk(chunkRange){
			var blob = file.slice(chunkRange[0], chunkRange[1]);
			fileReader.readAsBinaryString(blob);
		}
		this[S.SEND]= function(){
			if(sendCalled)return;
			sendCalled=true;
			sendNextChunk(getNextChunkRange());
			dispatchOnSending();
		};
		this[S.ABORT] = function(){
			sender&&sender[S.ABORT]();
			sendAbort();
		};
		this[S.GET_SUCCESSFUL] = function(){
			return successful;
		};
		this[S.GET_FILE_NAME] = function(){
			return fileName;
		};
		function callbackFailed(errors){
			onErrors(errors);
		}
		function onDone(e){
			var result = e[S.SENDER][S.GET_RESULT]();
			if(!result[S.SUCCESSFUL]){
				var err = result[S.ERROR];
				onErrors([err?err:new Error('Unknown server side error occured')]);
				return;
			}
			var nextChunkRange = getNextChunkRange();
			var percentage = chunkRangesIndex*100/chunkRanges.length;
			dispatchOnProgress(percentage);
			if(nextChunkRange){
				sendNextChunk(nextChunkRange);
				return;
			}
			successful = true;
			dispatchDone();
		}
		function getNextChunkRange(){
			return chunkRanges[chunkRangesIndex++];
		}
		function onErrors(errors){
			dispatchOnErrors(errors);
			dispatchDone();
			sendAbort();
		}
		function dispatchOnErrors(errors){
			self[S.ON_ERRORS](errors);
		}
		function dispatchDone(){
			if(dispatchedDone)return;
			dispatchedDone=true;
			var p ={};
			p[S.TYPE]= S.DONE;
			p[S.SENDER]=self;
			self.dispatchEvent(p);
		}
		function dispatchOnProgress(percent){
			self[S.ON_PROGRESS]&&self[S.ON_PROGRESS](percent);
		}
		function dispatchOnSending(){
			self[S.ON_SENDING]&&self[S.ON_SENDING]();
		}
		function getChunkRanges(file){
			var length = file.size;
			if(length===undefined)throw new Error();
			var chunkRanges = [];
			var startIndex=0;
			var endIndex;
			while(true){
				var endIndex = startIndex+CHUNK_SIZE;
				if(endIndex>length)
				{
					endIndex=length;
					chunkRanges.push([startIndex, endIndex]);
					return chunkRanges;
				}
				chunkRanges.push([startIndex, endIndex]);
				startIndex=endIndex;
			}
		}
		function sendAbort(){
			var p={};
			p[S.DATA]='';
			p[S.URL]=url+'?token='+token+'&abort=true';
			new Ajax()[S.POST](p);
		}
	}
	function Sender(params){
		EventEnabledBuilder(this);
		var self = this;
		var url = params[S.URL];
		var data = params[S.DATA];
		var contentType = params[S.CONTENT_TYPE];
		if(!contentType){
			contentType='json';
		}
		if(data===undefined||data===null){
			throw new Error('No data to send');
		}
		var ajax = new Ajax();
		var fileName = params[S.FILE_NAME];
		var ajaxHandle;
		var dispatchedDone=false;
		var result;
		this[S.SEND]= function(){
			var p={};
			p[S.DATA]=data;
			p[S.CALLBACK_FAILED]=callbackFailed;
			p[S.CALLBACK_SUCCESSFUL]=callbackSuccessful;
			p[S.URL]=url;
			p[S.CONTENT_TYPE]=contentType;
			ajaxHandle = ajax[S.POST](p);
			sending(ajaxHandle);
		};
		
		this[S.ABORT] = function(){
			ajaxHandle&&ajaxHandle.abort();
		};
		this[S.GET_SUCCESSFUL] = function(){
			return ajaxHandle[S.GET_SUCCESSFUL]();
		};
		this[S.GET_FILE_NAME] = function(){
			return fileName;
		};
		this[S.GET_RESULT]=function(){
			return result;
		};
		function callbackSuccessful(res){
			result = JSON.parse(res);
		}
		function callbackFailed(errors){
			dispatchOnErrors(errors);
			dispatchDone();
		}
		function sending(ajaxHandle){
			ajaxHandle[S.ON_DONE]=dispatchDone;
			ajaxHandle[S.ON_PROGRESS]=onProgress;
			onSending();
		}
		function dispatchDone(){
			if(dispatchedDone)return;
			dispatchedDone=true;
			var p ={};
			p[S.TYPE]= S.DONE;
			p[S.SENDER]=self;
			self.dispatchEvent(p);
		}
		function dispatchOnErrors(errors){
			self[S.ON_ERRORS](errors);
		}
		function onProgress(percent){
			self[S.ON_PROGRESS]&&self[S.ON_PROGRESS](percent);
		}
		function onSending(){
			self[S.ON_SENDING]&&self[S.ON_SENDING]();
		}
	}
	function Handle(sender){
		EventEnabledBuilder(this);
		var self = this;
		this[S.ABORT] = sender[S.ABORT];
		sender.addEventListener(S.DONE, dispatchDone);
		sender[S.ON_PROGRESS] = dispatchProgress;
		sender[S.ON_SENDING] = dispatchSending;
		sender[S.ON_ERRORS] = onErrors;
		var errors;
		this[S.GET_FILE_NAME] = sender[S.GET_FILE_NAME];
		this[S.GET_SUCCESSFUL]=sender[S.GET_SUCCESSFUL];
		this[S.GET_ERRORS]=function(){
			return errors;
		};
		function dispatchProgress(percent){
			var p={};
			p[S.TYPE]= S.PROGRESS; 
			p[S.SENDING_HANDLE]=self;
			p[S.PERCENT]=percent;
			p[S.PROPORTION]=percent/100;
			self.dispatchEvent(p);
		}
		function dispatchDone(){
			var p={};
			p[S.TYPE]= S.DONE;
			p[S.SENDING_HANDLE]=self;
			p[S.SUCCESSFUL]=sender[S.GET_SUCCESSFUL]();
			self.dispatchEvent(p);
		}
		function dispatchSending(){
			var p={};
			p[S.TYPE]= S.SENDING;
			p[S.HANDLE]=self;
			self.dispatchEvent(p);
		}
		function onErrors(e){
			console.error(e);
			errors = e;
		}
	}
})();