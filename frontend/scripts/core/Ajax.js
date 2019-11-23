var Ajax = window['Ajax'] = (function(){
	
	var DEFAULT_CONTENT_TYPE='application/json';
	var _Ajax= function(params){
		params=params||{};
		var url = params[S.URL];
		this['post'] = function(params){
			params[S.URL] = params[S.URL]?params[S.URL]:url;
			return _Ajax['post'](params);
		};
		this.get = function(params){
			params[S.URL] = params[S.URL]?params[S.URL]:url;
			return _Ajax.get(params);
		};
	};
	_Ajax['post']= function(params){
		return ajax(params, true);
	};
	_Ajax.get= function(params){
		return ajax(params, false);
	};
	function ajax(params, isPost){
		var url = params[S.URL];
		var parameters = params['parameters'];
		var callbackSuccessful = params[S.CALLBACK_SUCCESSFUL];
		var callbackFailed= params['callbackFailed'];
		var callbackTimeout = params['callbackTimeout'];
		var mimeType = params[S.MIME_TYPE];
		var contentType = params['contentType']?params['contentType']:DEFAULT_CONTENT_TYPE;
		var timeout = params['timeout'];
		var xhr = new XMLHttpRequest();
		xhr.open(isPost?'POST':'GET', url, true);
		if(timeout)
			xhr.timeout=timeout;
		xhr.setRequestHeader('Content-Type', contentType);
		addUrlParameters(url, parameters);
		return new Handle(xhr, isPost?params[S.DATA]:undefined, callbackSuccessful, callbackFailed, callbackTimeout);
	}
	function addUrlParameters(url, parameters){
		if(!parameters)return url;
		var first=true;
		for(var key in parameters){
			if(first)first=false;else url+='&';
			url+=key;
			url+='=';
			url+=parameters[key];
		}
		return url;
	}
	function Handle(xhr, data, callbackSuccessful, callbackFailed, callbackTimeout){
		var self = this;
		var successful;
		var errors=[];
		var onceFailed = new Once(dispatchCallbackFailed);
		xhr.onload = function() {
			if (xhr.readyState === 4)
			{
				if(xhr.status === 200) {
					successful = true;
					callbackSuccessful&&callbackSuccessful(xhr.responseText);
					done();
					return;
				}
				successful= false;
				var errorMessage = 'Request failed.  Returned status of ' + xhr.status;
				var error = new Error(errorMessage);
				errors.push(error);
				console.error(errorMessage);
				scheduleCallbackFailed();
				done();
			}
		};
		if(callbackTimeout)
			xhr.ontimeout = callbackTimeout;
		xhr.onprogress = onProgress;
		xhr.send(data);
		xhr.onerror=onError;
		this['getXhr'] = function(){
			return xhr;
		};
		this['abort'] = xhr.abort;
		this['getSuccessful'] = function(){
			return successful;
		};
		function done(){
			setTimeout(function(){
			self['onDone']&&self['onDone'](self);
			},0);
		}
		function onError(e){
			console.error(e);
			errors.push(e);
			scheduleCallbackFailed();
		}
		function scheduleCallbackFailed(){
			onceFailed[S.TRIGGER]();
		}
		function dispatchCallbackFailed(){
			//console.log(errors);
			callbackFailed&&callbackFailed(errors);
		}
		function onProgress(e){
			self['onProgress']&&self['onProgress'](e['total']?(e['loaded']/e['total']):1);
		}
	}
	return _Ajax;
})();