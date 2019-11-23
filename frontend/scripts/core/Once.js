function Once(callback){//multiple triggers synchronously results in one call to the callback.
	var set=false;
	this[S.TRIGGER] = function(){
		if(!set){
			setIt();
		}
	};
	function setIt(){
		setTimeout(function(){set=false; callback();}, 0);
		set=true;
	}
}