var getWebsocketUrl = window['getWebsocketUrl']=function(surfix, location){
	var loc = location?location:window.location;
	var	new_uri, port;
	if (loc['protocol'] === "https:") {
		new_uri = "wss:";
		port=':443';
	} else {
		new_uri = "ws:";
		port=':80';
	}
	new_uri += "//" + loc['host']+port;
	new_uri += /*loc.pathname +*/'/'+ surfix;
	return new_uri;
};