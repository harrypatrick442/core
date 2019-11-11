var JSONP = window['JSONP']=new (function(){
	var nCallback=0;
	this[S.RUN]=function(params)
	{
		var url = params[S.URL];
		if(!url)throw new Error('No url provided');
		var callback = params[S.CALLBACK];
		var data = params[S.DATA];
		var parameters = params[S.PARAMETERS];
		var timeout = params[S.TIMEOUT];
		var callbackTimeout = params[S.CALLBACK_TIMEOUT];
		var asyn = params[S.ASYNC];
		var defer = params[S.DEFER];
		if(!parameters)
			parameters=[];
		if(data!=undefined){
			var p = {};
			p[S.KEY]='data';
			p[S.VALUE]=data;
			parameters.push(p);
		}
		if(!timeout&&timeout!=-1)timeout = 5000;
		var script = E.SCRIPT();
		script['type'] = 'text/javascript';
		if (asyn!=undefined)
			script['async']=asyn;
		if (defer!=undefined)
			script['defer'] = defer;
		var uniqueCallbackName = getUniqueCallbackName();
		var url = constructScriptUrl(url, uniqueCallbackName);
		script.src = url;
		var handle = new Handle(script, timeout, callback, callbackTimeout, uniqueCallbackName);
		document.body.appendChild(script);
		return handle;
	};
	function Handle(script, timeout, callback, callbackTimeout, uniqueCallbackName){
		var self = this;
		var timerTimedOut;
		if(timeout!=-1){
			var p = {};
			p[S.DELAY]=timeout;
			p[S.N_TICKS]=1;
			p[S.CALLBACK]=timedOut;
			timerTimedOut = new Timer(p)[S.START]();
		}
		var disposed = false;
		var doneCallback=false;
		window[uniqueCallbackName] = function(response) {
			dispose();
			if(doneCallback)return;
			doneCallback=true;
			if (!callback)return;
			try
			{
				callback&&callback(response);
			} catch (ex)
			{
				console.error(ex);
			}
		
		};
		this[S.CANCEL]=function(){
			doneCallback=true;
			dispose();
		};
		function timedOut(){
			dispose();
			if(doneCallback)return;
			doneCallback=true;
			try
			{
				callbackTimeout&&callbackTimeout();
			}
			catch(ex)
			{
				console.error(ex);
			}
		}
		function dispose(){return;
			if(disposed)return;
			disposed = true
			timerTimedOut&&timerTimedOut[S.STOP]();
			document.body.removeChild(script);
			delete window[uniqueCallbackName];
		}
	}
	function constructScriptUrl(url, uniqueCallbackName, parameters){
		var str = url;
		str = UrlHelper[S.ADD_PARAMETER](str, 'callback', uniqueCallbackName);
		if(!parameters)return str;
		each(parameters, function(parameter){
			var key = parameter[S.KEY];
			var value = parameter[S.VALUE];
			str = UrlHelper[S.ADD_PARAMETER](str, key, value);
		});
		return str;
	}
	function getUniqueCallbackName(){
		return '_jsonp_callback_'+String(nCallback++);
	}
})();