var Timer= global['Timer']=(function(){
	var _Timer = function(params)
	{
		var self = this;
		var delay = params[S.DELAY];
		var callback = params[S.CALLBACK];
		var nTicks = params[S.N_TICKS];
		var nTicksCount = 0;
		var interval;
		var isRunning=false;
		if (nTicks == undefined)
		{
			nTicks = -1;
		}
		if (delay == undefined)
		{
			delay = 1000;
		}
		function tick()
		{
			if (nTicks >= 0)
			{
				nTicksCount++;
				if (nTicksCount >= nTicks)
					self[S.STOP]();
			}
			callback();
		};
		this[S.STOP] = _cancelInterval;
		this[S.RESET] = function(keepRunning)
		{
			nTicksCount = 0;
			if(keepRunning)
			{
				if(!isRunning)return;
				clearInterval(interval);
				interval = setInterval(tick, delay);
			}else{
				_cancelInterval();
			}
				
		};
		this[S.START]=function(){
			if(isRunning)return;
			_setInterval();
		};
		this[S.SET_DELAY] = function(value){
			self[S.RESET]();
			delay = value;
			_setInterval();
		};
		this[S.IS_RUNNING] = function(){return isRunning;};
		function _setInterval()
		{
			isRunning=true;
			interval = setInterval(tick, delay);
		}
		function _cancelInterval()
		{
			isRunning=false;
			if (!interval)return;
			clearInterval(interval);
			interval=null;
		}
	};
	return _Timer;
})();