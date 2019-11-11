module.exports=new(function(){
	var _instance;
	const GET = 'get';
	const UPDATE='update';
	const MESSAGE='message';
	this.initialize = function(params){
		if(!_instance){
			_instance = new _RemoteCacheHandler(params);
		}
		console.log('initializing remote cache handler');
	};
	function _RemoteCacheHandler(params){
		var router = params.router;
		var cache = params.cache;
		if(!router)throw new Error('No router provided');
		router.addEventListener(MESSAGE, onMessage);
		function onMessage(msgIn){
			var msg = msgIn.msg;
			switch(msg.type){
				case GET:
					console.log(msgIn);
					get(msg, msgIn.channel);
				break;
				case UPDATE:
					update(msg);
				break;
			}
		}
		function get(msg, channel){
			var ticket = msg.ticket;
			if(!ticket || msg.type!==GET)return;
			var itemId = msg.itemId;
			var res={ticket:ticket}
			if(itemId){
				var item = cache.getLocal(itemId);
				res.item=item;
			}
			channel.send(res);
		}
		function update(msg){
			console.log('GOT UPDATE');
			var dontMarkAsUpdated = msg.dontMarkAsUpdated;
			cache.merge(msg.itemId, msg.item, dontMarkAsUpdated);
		}
	}
})();