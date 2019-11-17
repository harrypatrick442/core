module.exports = new (function(){
	this.addParameters = function(url, parameters){
		var lastIndex =url.length - 1;
		var originalUrl = url;
		var needsAnd = false;
		if(url[lastIndex]!=='&'){
			var index =url.indexOf('?');
			if(index<0) url+='?';
			else if(index!=lastIndex){
				needsAnd= true;
			}
		}
		parameters.forEach(function(parameter){
			var value = parameter[1];
			if(value!==undefined&&value!==null){
				if(needsAnd){
					url+='&';
				}
				url+=parameter[0];
				url+='=';
				url+=value;
				needsAnd = true;
			}
		});
		if(url[url.length-1]==='?')url=originalUrl;
		return url;
	};
	this.addParameter=function(url, key, value){
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
	this.setSlashes=function(str, beginning, end){
		if(beginning){
			if(str[0]!='/')1
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
})();