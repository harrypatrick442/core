var BindingsHandlerBuilder = window['BindingsHandlerBuilder']= (function(){
	const verbose = false;
	var console = verbose?console:{log:function(){}, error:function(){}};
	return function(model){
		if(model[S.BINDINGS_HANDLER])return model[S.BINDINGS_HANDLER];
		model[S.BINDINGS_HANDLER] = new BindingsHandler(model);
		return model[S.BINDINGS_HANDLER];
	};
	function BindingsHandler(model){
		var self = this;
		var mapNameToModelBindings = {};
		this[S.CHANGED]=function(name, value){
			var bindings = mapNameToModelBindings[name];
			if(!bindings)return;
			bindings[S.CHANGED](value);
		};
		model[S.BIND] = function(name, callbackSet){
			var view = this;
			var viewBindings = getViewBindings(view);
			var bindings = mapNameToModelBindings[name];
			if(!bindings){
				var binding = new Binding(name, callbackSet);
				viewBindings[S.ADD](binding);
				var modelBindings = new ModelBindingsForName(name, binding);
				modelBindings.addEventListener(S.DISPOSE, callbackDisposeModelBindings);
				mapNameToModelBindings[name]=modelBindings;
				return viewBindings;
			}
			if(bindings[S.CONTAINS_CALLBACK_SET](callbackSet))return false;
			var binding = new Binding(name, callbackSet);
			viewBindings[S.ADD](binding);
			bindings[S.ADD](binding);
			return viewBindings;
		};
		model[S.UNBIND]=function(name, callbackSet){
			var bindings = mapNameToModelBindings[name];
			if(!bindings)return;
			var binding = bindings[S.GET_BY_CALLBACK_SET](callbackSet);
			if(!binding)return;
			binding[S.DISPOSE]();
		};
		this[S.DISPOSE]= function(){
			for(var i in mapNameToModelBindings){
				var modelBindings = mapNameToModelBindings[i];
				modelBindings[S.DISPOSE]();
			}
			mapNameToModelBindings={};
		};
		function getViewBindings(view){
			if(!view[S.BINDINGS]){
				view[S.BINDINGS] = new Bindings();
			}
			return view[S.BINDINGS];
		}
		function callbackDisposeViewBindings(e){
			
		}
		function callbackDisposeModelBindings(e){
			var name = e[S.BINDINGS][S.GET_NAME]();
			if(mapNameToModelBindings[name])
				delete mapNameToModelBindings[name];
		}
	}
	function Bindings(name, binding){
		EventEnabledBuilder(this);
		var self = this;
		var disposed = false;
		var list = [];
		this[S.ADD] = add;
		this[S.GET_LIST] = function(){
			return list;
		};
		this[S.DISPOSE] = dispose;
		this[S.REMOVE] = removeBinding;
		if(binding)
			self[S.ADD](binding);
		function dispose(){
			if(disposed)return;
			disposed = true;
			each(list.slice()/* because as we dispose them they will be calling back to remove themselves*/, function(binding){
				binding[S.DISPOSE]();
			});
			dispatchDispose(); //Not really needed because upon disposing the last binding the event will be dispatched.
		}
		function add(binding){
			listenForDispose(binding);
			list.push(binding);
		}
		function listenForDispose(binding){
			binding.addEventListener('dispose', callbackDispose);
		}
		function callbackDispose(e){
			removeBinding(e[S.BINDING]);
		}
		function removeBinding(binding){
			var index = list.indexOf(binding);
			if(index<0)return;
			list.splice(index, 1);
			if(list.length>0)return;
			dispose();
		}
		function dispatchDispose(){
			self.dispatchEvent({type:'dispose', bindings:self});
		}
	}
	function ModelBindingsForName(name, binding){
		var self = this;
		var bindings = new Bindings(name, binding);
		this[S.CONTAINS_CALLBACK_SET]=function(callbackSet){
			return getByCallbackSet(callbackSet)?true:false;
		};
		this[S.GET_BY_CALLBACK_SET] = getByCallbackSet;
		this[S.CHANGED]= function(value){
			each(bindings[S.GET_LIST](), function(binding){
				binding[S.CALL_CALLBACK_SET](value);
			});
		};
		this[S.ADD] = bindings[S.ADD];
		this[S.GET_LIST] = bindings[S.GET_LIST];
		this[S.DISPOSE] = bindings[S.DISPOSE];
		this.addEventListener = bindings.addEventListener;
		this.removeEventListener = bindings.removeEventListener;
		function getByCallbackSet(callbackSet){
			var listBindings = bindings[S.GET_LIST]();
			for(var i=0, binding; binding=listBindings[i]; i++){
				if(binding[S.GET_CALLBACK_SET]()==callbackSet){
					return binding;
				}
			}
		}
	}
	function Binding(name, callbackSet, dispose){
		EventEnabledBuilder(this);
		var self = this;
		var disposed = false;
		this[S.GET_CALLBACK_SET] = function(){
			return callbackSet;
		};
		this[S.CALL_CALLBACK_SET]=function(value){
			callbackSet(value);
		};
		this[S.DISPOSE] = function(){
			if(disposed)return;
			disposed = true;
			dispatchDispose();
		};
		function dispatchDispose(){
			var p={};
			p[S.TYPE]= S.DISPOSE;
			p[S.BINDING]=self;
			self.dispatchEvent(p);
		}
	}
})();