	
module.exports =new (function() {
	const Timer = require('./Timer');
	var longpollss=[];
	var timer = new Timer({
		delay:10000,
		callback:checkTimeouts,
		nTicks:-1
	});
	timer.start();
	this.add =  function(longpolls){
		longpollss.push(longpolls);
	};
	function checkTimeouts(){
		longpollss.forEach(function(longpolls){
			longpolls.forEach(function(longpoll){
				longpoll.checkTimeout();
			});
		});
	}
})();
