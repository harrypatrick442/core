var Validator = new (function(){
	var self = this;
	var INPUT = 'input';
	var TEXTAREA='textarea';
	var SELECT='select';
	this[S.NOT_EMPTY]= function NotEmpty(me, model, propertyName){
		return new Validator(me, model, propertyName, function(value){
				return !Validation[S.IS_NULL_OR_EMPTY](value);
			}
		);
	};
	this[S.NUMBER]=function _Number(me, model, propertyName){
		return new Validator(me, model, propertyName, Validation[S.IS_NUMBER]);
	};
	this[S.CUSTOM]=function _Number(me, model, propertyName, validation){
		return new Validator(me, model, propertyName, validation);
	};
	this[S.INT]=function Int(me, model, propertyName){
		return new Validator(me, model, propertyName, Validation[S.IS_INT]);
	};
	this[S.INT_OR_EMPTY]=function(me, model, propertyName){
		return new Validator(me, model, propertyName, Validation[S.IS_INT_OR_EMPTY]);
	};
	this[S.DATE]= function _Date(me, model, propertyName){
		return new Validator(me, model, propertyName, Validation[S.IS_DATE]);
	};
	this[S.DATE_UK]= function _Date(me, model, propertyName){
		return new Validator(me, model, propertyName, Validation[S.IS_DATE_UK]);
	};
	this[S.DATE_UK_OR_EMPTY]= function _Date(me, model, propertyName){
		return new Validator(me, model, propertyName, Validation[S.IS_DATE_UK_OR_EMPTY]);
	};
	this[S.BOOLEAN]=function Boolean(me, model, propertyName){
		return new Validator(me, model, propertyName, Validation[S.IS_BOOLEAN]);
	};
	
	this[S.NOT_EMPTIES]= function NotEmpties(me, model, propertyNames){
		var list=[];
		each(propertyNames, function(propertyName){
			list.push(self[S.NOT_EMPTY](me, model, propertyName));
		});
		return list;
	};
	this[S.NUMBER_RANGE]=function(me, model, propertyNameFrom, propertyNameTo, min, max){
		
		var from, to;
		var validatorTo = self[S.CUSTOM](me, model, propertyNameTo, validateTo);
		var validatorFrom = self[S.CUSTOM](me, model, propertyNameFrom, validateFrom);
		function validateFrom(value){
			from = value;
			if(Validation[S.IS_NULL_OR_EMPTY](from))return true;
			if(!Validation[S.IS_INT](from))return false;
			if(from>max||from<min)return false;
			from = parseInt(from);
			if(Validation[S.IS_NULL_OR_EMPTY](to)||!Validation[S.IS_INT](to))return true;
			if(from>to)return false;
			validatorTo[S.SET](true);
			return true;
		}
		function validateTo(value){
			to = value;
			if(Validation[S.IS_NULL_OR_EMPTY](to))return true;
			if(!Validation[S.IS_INT](to))return false;
			to=parseInt(to);
			if(to>max||to<min)return false;
			if(Validation[S.IS_NULL_OR_EMPTY](from)||!Validation[S.IS_INT](from))return true;
			if(from>to)return false;
			validatorFrom[S.SET](true);
			return true;
		}
		var validators = new Validators();
		validators[S.ADD](validatorFrom);
		validators[S.ADD](validatorTo);
		return validators;
	};
	this[S.NUMBERS]=function _Number(me, model, propertyNames){
		var list=[];
		each(propertyNames, function(propertyName){
			list.push(self[S.NUMBER](me, model, propertyName));
		});
		return list;
	};
	this[S.INTS]=function Ints(me, model, propertyNames){
		var list=[];
		each(propertyNames, function(propertyName){
			list.push(self[S.INT](me, model, propertyName));
		});
		return list;
	};
	this[S.DATES]= function _Dates(me, model, propertyNames){
		var list=[];
		each(propertyNames, function(propertyName){
			list.push(self[S.DATE](me, model, propertyName));
		});
		return list;
	};
	this[S.BOOLEANS]=function Booleans(me, model, propertyNames){
		var list=[];
		each(propertyNames, function(propertyName){
			list.push(self[S.BOOLEAN](me, model, propertyName));
		});
		return list;
	};
	function Validator(me, model, propertyName, validation){
		EventEnabledBuilder(this);
		var self = this;
		var meChanged = me[S.BINDINGS_HANDLER][S.CHANGED];
		var propertyNameValid = propertyName+'Valid';
		var getterPropertyNameValid = PropertyHelper[S.GET_GETTER_NAME](propertyNameValid);
		var propertyBinding = PropertyBinding[S.STANDARD](me, model, propertyName, changed);
		var valid = validation(propertyBinding[S.GET]());
		var latestValue;
		this[S.GET_VALID]=function(){return valid;};
		this[S.UPDATE]=update;
		this[S.SET]=function(newValid){
			_update(newValid, valid);
		};
		me[getterPropertyNameValid]=function(){
			return valid;
		};
		function changed(value){
			latestValue=value;
			update();
		}
		function update(){
			var previousValid = valid;
			valid = validation(latestValue);
			_update(valid, previousValid);
		}
		function _update(valid, previousValid){
			if(valid!=previousValid){
				meChanged(propertyNameValid, valid);
				dispatchValidChanged(valid);
			}
		}
		function dispatchValidChanged(valid){
			var p={};
			p[S.TYPE]= S.VALID_CHANGED;
			p[S.VALID]=valid;
			self[S.DISPATCH_EVENT](p);
		}
	};
})();