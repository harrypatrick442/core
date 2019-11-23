var Validators = function(){
	EventEnabledBuilder(this);
	var self = this;
	var validators =[];
	var valid;
	this[S.ADD]=function(validator){
		validators.push(validator);
		validator.addEventListener(S.VALID_CHANGED, validChanged);
		valid = valid &&validator[S.GET_VALID]();
	};
	this[S.ALL_VALID]=allValid;
	this[S.GET_VALID]=allValid;
	function allValid(){
		for(var i=0, validator; validator = validators[i]; i++){
			if(!validator[S.GET_VALID]())return false;
		}
		return true;
	}	
	function validChanged(e){
		var previousValid=valid;
		valid = e[S.VALID]&&allValid();
		if(valid!==previousValid){
			dispatchValidChanged(valid);
		}
	}
	function dispatchValidChanged(valid){
		var p = {};
		p[S.TYPE]= S.VALID_CHANGED;
		p[S.VALID]=valid;
		self[S.DISPATCH_EVENT](p);
	}
};