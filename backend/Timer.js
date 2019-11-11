module.exports =(function(){
	return function(params)
	{
		var self = this;
		var delay = params.delay;
		var callback = params.callback;
		var nTicks = params.nTicks;
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
					self.stop();
			}
			try
			{
				callback();
			} catch (ex)
			{
				console.log(ex);
			}
		};
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
		this.stop = _cancelInterval;
		this.reset = function()
		{
			nTimesCount = 0;
			_cancelInterval();
		};
		this.start=function(){
			if(isRunning)return;
			_setInterval();
			return self;
		};
		this.setDelay = function(){
			self.reset();
			delay = value;
			_setInterval();
		};
		this.isRunning = function(){return isRunning;};
	};
})();