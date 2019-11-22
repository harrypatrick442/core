var LoopBreak = window['LoopBreak']=function(){
	var triggered=false;
	this[S.TRIGGER]=function(){
		if(triggered)return true;
		triggered=true;
		setTimeout(function(){ triggered=false;}, 0);
		return false;
	};
};