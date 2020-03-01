module.exports = (function(){
	
	var DEFAULT_CONTENT_TYPE='application/json';
	const ESOCKETTIMEDOUT='ESOCKETTIMEDOUT';
	const POST='post';
	const GET='get';
	const PUT='put';
	const PATCH='patch';
	const DELETE='delete';
	function Ajax(request, isTor){
		var _Ajax= function(params){
			var url = params.url;
			this.post = function(params){
				if(!params.url)
					params.url = url;
				return _Ajax.post(params);
			};
			this.get = function(params){
				if(!params.url)
					params.url = url;
				return _Ajax.get(params);
			};
		};
		_Ajax.post = function(params){
			return ajax(params, POST);
		};
		_Ajax.get= function(params){
			return ajax(params, GET);
		};
		_Ajax.put= function(params){
			return ajax(params, PUT);
		};
		_Ajax.patch= function(params){
			return ajax(params, PATCH);
		};
		_Ajax.delete= function(params){
			return ajax(params, DELETE);
		};
		
		_Ajax.postWithPromise = function(params){
			return ajaxPromise(params, POST);
		};
		_Ajax.getWithPromise= function(params){
			return ajaxPromise(params, GET);
		};
		_Ajax.putWithPromise= function(params){
			return ajaxPromise(params, PUT);
		};
		_Ajax.patchWithPromise= function(params){
			return ajaxPromise(params, PATCH);
		};
		_Ajax.deleteWithPromise= function(params){
			return ajaxPromise(params, DELETE);
		};
		function ajaxPromise(params, method){
			return new Promise(function(resolve, reject){	
				var handle;
				params.callbackSuccessful=function(){
					resolve(handle)
				};
				params.callbackFailed=function(err){
					reject(handle);
				};
				handle= ajax(params, method);
			});
		};
		function ajax(params, method){
			var url = params.url;
			var parameters = params.parameters;
			var callbackSuccessful = params.callbackSuccessful;
			var callbackFailed= params.callbackFailed;
			var contentType = params.contentType?params.contentType:DEFAULT_CONTENT_TYPE;
			var timeout = params.timeout;
			var data = params.data;
			var headers = params.headers;
			if(!headers){headers = {};}
			if(!headers['Content-Type'])
				headers['Content-Type']= contentType;
			addUrlParameters(url, parameters);
			var obj = {
				headers: headers,
				uri: url,
				body: data,
				method: method
			};
			if(timeout)obj.timeout=timeout;
			return new Handle(obj, data, callbackSuccessful, callbackFailed);
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
		function Handle(obj, dataSending, callbackSuccessful, callbackFailed){
			var self = this;
			var data=[],statusCode,response, _buffer, error;
			var bytesTransmitted=0;
			var size = dataSending?dataSending.length:0;
			setTimeout(function(){
				console.log(obj);
					var req = request(obj, function(err, res, body){
						var successful = false;
						response = res;
						if((!err)&&response&&((statusCode = response.statusCode)== 200)||statusCode==201||statusCode===204) {
							successful = true;
							done();
							callbackSuccessful&&callbackSuccessful(body);
							return;
						}
						error = err;
						if(!error)	error = new Error('Returned status code: '+response.statusCode);
						if(isTor)console.log('is tor');
						done();
						callbackFailed&&callbackFailed(error);
					});
					req.on('data', function(chunk){
						bytesTransmitted += chunk.length;
						data.push(chunk);
					});
			},0);
			this.getCookies = function(){return response.headers['set-cookie'];};
			this.getData = function(format){
				return getDataBuffer().toString(format);
			};
			this.getDataBuffer=getDataBuffer;
			function getDataBuffer(){
				if(!_buffer)_buffer = Buffer.concat(data)	;
				return _buffer;
			}
			this.getError = function(){return error;};
			this.getStatusCode= function(){return statusCode;};
			this.abort = function(){};
			this.getResponse = function(){
				return response;
			};
			this.getSuccessful = function(){
				return successful;
			};
			function done(){
				self.onDone&&self.onDone(self);
			}
			/*function onError(e){
				error = e;
				console.error(e);
				callbackFailed&&callbackFailed(e);
			}*/
			function onProgress(e){
				self.onProgress&&self.onProgress(bytesSent/size);
			}
		}
		return _Ajax;
	}
	var _Ajax = new Ajax(require('request'));
	const torRequest= require('tor-request');
	_Ajax.Tor = new Ajax(torRequest.request, true);
	return _Ajax;
})();