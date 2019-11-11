const Timer = require('./Timer');
module.exports =  function(params){
	var self = this;
	var callback = params.callback;
	var maxNTriggers = params.maxNTriggers;
	var maxTotalDelay = params.maxTotalDelay;
	var delay = params.delay;
	if(!maxNTriggers&&!maxTotalDelay)maxTotalDelay=3*delay;
	var timerDelay = new Timer({callback:tick, delay:delay, nTicks:1});
	var timerMaxDelay = new Timer({callback:tick, delay:maxTotalDelay, nTicks:1});
	var nTriggers=0;
	this.trigger = function(){
		nTriggers++;
		if(!timerDelay.isRunning()){timerDelay.start(); timerMaxDelay.start(); return;}
		if(maxNTriggers&&nTriggers>maxNTriggers){
			tick();
			return;
		}
		timerDelay.reset();
	};
	function tick(){
		timerDelay.stop();
		timerMaxDelay.stop();
		nTriggers=0;
		callback();
	}
};