module.exports = new (function(){
	const publicIp = require('public-ip');
	var myIp;
	this.getMyIp = function(callback){
		return new Promise(function(resolve, reject){
			if(myIp){
				resolve(myIp);
				return;
			}
			publicIp.v4().then(function(ip){
				myIp = ip;
				resolve(myIp);
			}).catch(reject);
		});
	};
})();