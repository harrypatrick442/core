var GoogleMaps = window['GoogleMaps']=new (function () {
    var initialized = false;
	var callbacks=[];
	var initializing=false;
    this[S.GET] = function (callback) {
        if (!initialized)
        {	
			callbacks.push(callback);
			if(!initializing)
				initialize();
			return;
        }
        callback();
    };
	initialize();
	function initialize(){
		initializing=true;
		var p ={};
		p[S.URL]='https://maps.googleapis.com/maps/api/js?key='+Configuration[S.GET_GOOGLE]()[S.GET_MAPS]()[S.GET_KEY]()+'&libraries=places';
		p[S.CALLBACK]=callback;
		JSONP[S.RUN](p);
	}
	function callback(){
		initialized=true;
		each(callbacks, function(callback){callback();});
	}
})();