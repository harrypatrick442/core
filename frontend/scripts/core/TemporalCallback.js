var TemporalCallback= global['TemporalCallback'] = (function(){
	var _TemporalCallback = function(params){
		var self = this;
		var callback = params[S.CALLBACK];
		var maxNTriggers = params[S.MAX_N_TRIGGERS];
		var maxTotalDelay = params[S.MAX_TOTAL_DELAY];
		var delay = params[S.DELAY];
		if(!maxNTriggers&&!maxTotalDelay)maxTotalDelay=3*delay;
		var p={};
		p[S.CALLBACK]=tick;
		p[S.DELAY]= delay;
		p[S.N_TICKS]=1;
		var timerDelay = new Timer(p);
		p={};
		p[S.CALLBACK]=tick;
		p[S.DELAY]= maxTotalDelay;
		p[S.N_TICKS]=1;
		var timerMaxDelay = new Timer(p);
		var nTriggers=0;
		this[S.TRIGGER]=function(){
			nTriggers++;
			if(!timerDelay[S.IS_RUNNING]()){timerDelay[S.START](); timerMaxDelay[S.START](); return;}
			if(maxNTriggers&&nTriggers>maxNTriggers){
				tick();
				return;
			}
			timerDelay['reset']();
		};
		function tick(){
			timerDelay['stop']();
			timerMaxDelay['stop']();
			nTriggers=0;
			callback();
		}
	};
	return _TemporalCallback;
})();