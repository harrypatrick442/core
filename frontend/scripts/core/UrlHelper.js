var UrlHelper = new (function(){
	this[S.ADD_PARAMETERS]=function(url, parameters){
		if(!parameters)return url;
		for(var key in parameters)url = addParameter(url, key, parameters[key]);
		return url;
	};
	this[S.ADD_PARAMETER]=addParameter;
	function addParameter(url, key, value){
		var lastIndex=url.length-1;
		var lastChar = url[lastIndex];
		if(lastChar!='&')
		{
			var index =url.indexOf('?');
			if(index<0){
				url+='?';
			}
			else if(index!=lastIndex){
				url+='&';
			}
		}
		url+=key;
		if(value!==undefined&&value!==null){
			url+='=';
			url+=value;
		}
		return url;
	};
	this[S.SET_SLASHES]=function(str, beginning, end){
		if(beginning){
			if(str[0]!='/')
				str='/'+str;
		}
		else if(str[0]=='/'){
				str=str.substr(1, str.length-1);
		}
		if(end){
			if(str[str.length-1]!='/')
				str=str+'/';
		}
		else if(str[str.length-1]=='/')
			str=str.substr(0, str.length-1);
		return str;
	};
	this[S.GET_WEBSOCKET_URL]=function(surfix, host){
		var loc = window.location;
		var host = host?host:loc['host'];
		var	new_uri, port;
		if (loc['protocol'] === "https:") {
			new_uri = "wss:";
			port=':443';
		} else {
			new_uri = "ws:";
			port=':80';
		}
		new_uri += "//" + host+port;
		new_uri += /*loc.pathname +*/'/'+ surfix;
		return new_uri;
	};
	this[S.GET_LONGPOLL_URL]=function(surfix, location){
		var loc = window.location;
		var host = location?location:loc['host'];
		return loc['protocol'] + "//" + host+ '/'+surfix;
	};
})();