	
module.exports =(function() {
	const DELAY_TIMEOUT=18000;
	var EventEnabledBuilder=require('./EventEnabledBuilder');
	var _Longpoll = function(params){
		EventEnabledBuilder(this);
		var self = this;
		var app = params.app;
		var id = params.id;
		var url = params.url;
		var disposed = false;
		var messagesQueue =[];
		var currentRequest;
		var sendScheduled=false;
		var lastActive;
		removeGet();
		active();
		app.get(getUrl(), function(req, res, next){
			active();
			endPreviousRequest();
			currentRequest = new CurrentRequest(req, res);
			if(messagesQueue.length>0)
				scheduleSend();
		});
		this.send = function(msg){
			messagesQueue.push(msg);
			scheduleSend();
		};
		this.getDisposed = function(){
			return disposed;
		};
		this.getLastActive = function(){
			return lastActive;
		};
		this.dispose = function(){
			if(disposed)return;
			disposed=true;
			currentRequest&&currentRequest.send([{disposed:true}]);
			removeGet();
			dispatchDispose();
		};
		this.incomingMessage = function(msg){
			self.onMessage(msg);
		};
		this.getId = function(){return id;};
		this.checkTimeout = function(){
			if(getTime()-lastActive>DELAY_TIMEOUT){
				endPreviousRequest();
			}
		};
		function removeGet(){
			if(!id)return;
			var url = getUrl();
			var stack = app._router.stack;
			var i=0;
			while(i<stack.length){
				var layer = stack[i];
				if(layer.path ==   url){
					stack.splice(i, 1);
				}
				else
				i++;
			}
		}
		function endPreviousRequest(){
			currentRequest&&currentRequest.end();
			currentRequest = null;
		}
		function scheduleSend(){
			if(sendScheduled)return;
			if(!currentRequest)return;
			setTimeout(send, 0);
			sendScheduled=true;
		}
		function send(){
			if(!currentRequest)return;
			currentRequest.send(messagesQueue);
			messagesQueue=[];
			currentRequest=null;
			sendScheduled=false;
		}
		function dispatchDispose(){
			self.dispatchEvent({type:'dispose', longpoll:self});
		}
		function active(){
			lastActive = getTime();
		}
		function getUrl(){
			var str=url;
			if(url.substr(url.length-1,1)!='/')
				str+='/'
			return str+id;
		}
	};
	return _Longpoll;
	function getTime(){return new Date().getTime();}
	function CurrentRequest(req, res){
		this.end = function(){
			res.end();
		};
		this.send = function(msgs){
			res.json({msgs:msgs});
		};
	}
})();
