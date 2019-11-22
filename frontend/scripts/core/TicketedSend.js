var TicketedSend = (function(){
	var DEFAULT_TIMEOUT=120000;
	var nTicket=0;
	var mapMysocketHashToMysocketHandle = {};
	var p={};
	p[S.CALLBACK]=doTimeouts;
	p[S.DELAY]=10000;
	p[S.N_TICKS]=-1;
	var timerTimeout = new Timer(p);
	timerTimeout[S.START]();
	var _TicketedSend;
	_TicketedSend	= function(mysocket, timeoutMs){
		this[S.SEND]=function(msg, callback, callbackTimeout){
			_TicketedSend[S.SEND](mysocket, msg, callback, timeoutMs, callbackTimeout);
		};
	};
	_TicketedSend[S.SEND]=function(mysocket, msg, callback, timeoutMs, callbackTimeout){
		if(!callback)throw new Error('No callback');
		var mysocketHash = HashBuilder(mysocket);
		var handle = mapMysocketHashToMysocketHandle[mysocketHash];
		if(!handle){
			var handle = new MysocketHandle(mysocket);
			mapMysocketHashToMysocketHandle[mysocketHash]=handle;
		}
		var ticket = generateTicket();
		handle[S.ADD_TICKETED_CALLBACK](callback, ticket, timeoutMs, callbackTimeout);
		msg[S.TICKET]=ticket;
		mysocket[S.SEND](msg);
	};
	return _TicketedSend;
	function MysocketHandle(mysocket){
		var mapTicketToCallbackAndTimeSent={};
		mysocket.addEventListener(S.MESSAGE, onMessage);
		this[S.ADD_TICKETED_CALLBACK]=function(callback, ticket, timeoutMs, callbackTimeout){
			var p ={};
			p[S.TIME_SENT]=getTime();
			p[S.CALLBACK]=callback;
			p[S.CUSTOM_TIMEOUT]=timeoutMs;
			p[S.CALLBACK_TIMEOUT]=callbackTimeout;
			mapTicketToCallbackAndTimeSent[ticket]=p;
		};
		this[S.DO_TIMEOUTS]=function(now){
			for(var ticket in mapTicketToCallbackAndTimeSent){
				var callbackAndTimeSent = mapTicketToCallbackAndTimeSent[ticket];
				var timeoutMs = callbackAndTimeSent[S.CUSTOM_TIMEOUT];
				var timeoutIfOlderThan = timeoutMs?(now - timeoutMs):now - DEFAULT_TIMEOUT;
				if(callbackAndTimeSent[S.TIME_SENT]<timeoutIfOlderThan)
				{
					var callbackTimeout=callbackAndTimeSent[S.CALLBACK_TIMEOUT];
					if(callbackTimeout){
						try{
							callbackTimeout();
						}
						catch(ex){
							console.error(ex);
						}
					}
					delete mapTicketToCallbackAndTimeSent[ticket];
				}
			}
			disposeIfHasNoPending();
		};
		function onMessage(e){
			console.error(e);
			var msg = e[S.MSG];
			var ticket = msg[S.TICKET];
			if(!ticket){
				return;
			}
			doCallbackForTicket(ticket, msg);
		}
		function hasTicketsPending(){
			for(var ticket in mapTicketToCallbackAndTimeSent) {
				if (mapTicketToCallbackAndTimeSent.hasOwnProperty(ticket)) {
					return true;
				}
			}
			return false;
		}
		function disposeIfHasNoPending(){
			if(!hasTicketsPending()){
				dispose();
			}
		}
		function doCallbackForTicket(ticket, msg){
			var callbackAndTimeSent = mapTicketToCallbackAndTimeSent[ticket];
			if(!callbackAndTimeSent){
				return;
			}
			callbackAndTimeSent[S.CALLBACK](msg);
			delete mapTicketToCallbackAndTimeSent[ticket];
			disposeIfHasNoPending();
		}
		function dispose(){
			delete mapMysocketHashToMysocketHandle[mysocket[S.GET_HASH]()];
			mysocket.removeEventListener(S.MESSAGE, onMessage);
		}
	}
	function doTimeouts(){
		var now = getTime();
		for(var mysocketHash in mapMysocketHashToMysocketHandle){
			var handle = mapMysocketHashToMysocketHandle[mysocketHash];
			handle[S.DO_TIMEOUTS](now);
		}
	}
	function getTime(){
		return new Date().getTime();
	}
	function generateTicket(){
		return 'ticket_'+String(getTime())+'_'+String(nTicket++);
	};
})();