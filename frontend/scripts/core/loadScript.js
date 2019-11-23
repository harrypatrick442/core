var loadScripts = window['loadScript']=function(url){
	var s = document.createElement('script');
	s.type='text/javascript';
	s.src = url;
	document.body.appendChild(s);
};