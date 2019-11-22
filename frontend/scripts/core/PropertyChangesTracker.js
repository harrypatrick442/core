var PropertyChangesTracker = window['PropertyChangesTracker']=function(model, propertyNames, propertyChanged){
	var mapPropertyNameToInitialValue={};
	var propertyBindings=[];
	var _propertyChanged;
	each(propertyNames, function(propertyName){
		var loopBreak = new LoopBreak();
		var propertyBinding = PropertyBinding[S.STANDARD](model, model, propertyName, function(value){
			if(loopBreak[S.TRIGGER]())return;
			_propertyChanged&&_propertyChanged(propertyName, value);
		});
		propertyBindings.push(propertyBinding);
	});
	mapInitialValues();
	_propertyChanged=propertyChanged;
	this[S.GET_CHANGED]=function(){
		for(var i=0; i<propertyBindings.length; i++){
			var propertyBinding = propertyBindings[i];
			var propertyName = propertyBinding[S.GET_NAME]();
			var initialValue = mapPropertyNameToInitialValue[propertyName];
			var currentValue = propertyBinding[S.GET]();
			if(initialValue!=currentValue){
				//console.log('property '+propertyName+' changed from '+initialValue+' to '+currentValue);
				return true;
			}
		}
		return false;
	};
	this[S.RESET]=function(){
		mapInitialValues();
	};
	function mapInitialValues(){
		each(propertyBindings, function(propertyBinding){
			mapPropertyNameToInitialValue[propertyBinding[S.GET_NAME]()]=propertyBinding[S.GET]();
		});
	}
};