const HashBuilder = require('./HashBuilder');
const Timer = require('./Timer');
module.exports = (function(){
	var DEFAULT_TIMEOUT=10000;
	var nTicket=0;
	var mapSenderHashToSenderHandle = {};
	var timerTimeout = new Timer({
		callback:doTimeouts, delay:10000, nTicks:-1
	});
	timerTimeout.start();
	var _TicketedSend;
	_TicketedSend	= function(sender, timeoutMs){
		this.send=function(msg, callback, callbackTimeout){
			_TicketedSend.send(sender, msg, callback, timeoutMs, callbackTimeout);
		};
	};
	_TicketedSend.sendCustom = function(params){
		return new Promise(function(resolve, reject){
			var responseChannel = params.responseChannel;
			var applyTicket = params.applyTicket;
			var send = params.send;
			var msg=params.msg;
			var timeoutMs = params.timeoutMs;
			var senderHash = HashBuilder(responseChannel);
			var handle = mapSenderHashToSenderHandle[senderHash];
			if(!handle){
				var handle = new SenderHandle(responseChannel);
				mapSenderHashToSenderHandle[senderHash]=handle;
			}
			var ticket = generateTicket();
			handle.addTicketedCallback(resolve, ticket, timeoutMs, reject);
			if(applyTicket){
				applyTicket(ticket, msg);
			}
			else msg.ticket=ticket;
			send(msg);
		});
	};
	_TicketedSend.send=function(sender, msg, callback, timeoutMs, callbackTimeout){
		if(!callback)throw new Error('No callback');
		var senderHash = HashBuilder(sender);
		var handle = mapSenderHashToSenderHandle[senderHash];
		if(!handle){
			var handle = new SenderHandle(sender);
			mapSenderHashToSenderHandle[senderHash]=handle;
		}
		var ticket = generateTicket();
		handle.addTicketedCallback(callback, ticket, timeoutMs, callbackTimeout);
		msg.ticket=ticket;
		console.log(msg);
		sender.send(msg);
	};
	return _TicketedSend;
	function SenderHandle(sender){
		var mapTicketToCallbackAndTimeSent={};
		sender.addEventListener('message', onMessage);
		this.addTicketedCallback=function(callback, ticket, timeoutMs, callbackTimeout){
			var p ={};
			p.timeSent=getTime();
			p.callback=callback;
			p.customTimeout=timeoutMs;
			p.callbackTimeout = callbackTimeout;
			mapTicketToCallbackAndTimeSent[ticket]=p;
		};
		this.doTimeouts=function(now){
			for(var ticket in mapTicketToCallbackAndTimeSent){
				var callbackAndTimeSent = mapTicketToCallbackAndTimeSent[ticket];
				var timeoutMs = callbackAndTimeSent.customTimeout;
				var timeoutIfOlderThan = timeoutMs?(now - timeoutMs):now - DEFAULT_TIMEOUT;
				if(callbackAndTimeSent.timeSent<timeoutIfOlderThan)
				{
					var callbackTimeout=callbackAndTimeSent.callbackTimeout;
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
			console.log(' on message');
			console.log(e);
			var msg = e.msg;
			var ticket = msg.ticket;
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
			callbackAndTimeSent.callback(msg);
			delete mapTicketToCallbackAndTimeSent[ticket];
			disposeIfHasNoPending();
		}
		function dispose(){
			delete mapSenderHashToSenderHandle[sender.getHash()];
			sender.removeEventListener('message', onMessage);
		}
	}
	function doTimeouts(){
		var now = getTime();
		for(var senderHash in mapSenderHashToSenderHandle){
			var handle = mapSenderHashToSenderHandle[senderHash];
			handle.doTimeouts(now);
		}
	}
	function getTime(){
		return new Date().getTime();
	}
	function generateTicket(){
		return 'ticket_'+String(getTime())+'_'+String(nTicket++);
	};
})();