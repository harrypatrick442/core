const publicIp = require('public-ip'),os = require('os');
module.exports = new (function(){
	var myIpv4,myLocalIpv4, myIpv6, myLocalIpv6;
	this.getMyIps=function(){
		return new Promise((resolve, reject)=>{
			getMyIpv4().then(()=>{
				//getMyIpv6().then(()=>{
					getMyLocalIps();
					resolve({myIpv4:myIpv4, myIpv6:null, myLocalIpv4:myLocalIpv4, myLocalIpv6:myLocalIpv6});
				//}).catch(reject);
			}).catch(reject);
		});
	};
	this.getMyIpv4 = getMyIpv4;
	this.getMyIpv6 = getMyIpv6;
	this.getMyLocalIpv4 = function(){
		return new Promise(function(resolve, reject){
			if(myLocalIpv4){
				resolve(myLocalIpv4);
				return;
			}
			getMyLocalIps();
			resolve(myLocalIpv4);
		});
	};
	this.getMyLocalIpv6 = function(){
		return new Promise(function(resolve, reject){
			if(myLocalIpv6){
				resolve(myLocalIpv6);
				return;
			}
			getMyLocalIps();
			resolve(myLocalIpv6);
		});
	};
	function getMyIpv4(callback){
		return new Promise(function(resolve, reject){
			if(myIpv4){
				resolve(myIpv4);
				return;
			}
			publicIp.v4().then(function(ip){
				myIpv4 = ip;
				resolve(myIpv4);
			}).catch(reject);
		});
	};
	function getMyIpv6(callback){
		return new Promise(function(resolve, reject){
			if(myIpv6){
				resolve(myIpv6);
				return;
			}
			publicIp.v6().then(function(ip){
				myIpv6 = ip;
				resolve(myIpv6);
			}).catch(reject);
		});
	};
	function getMyLocalIps(){
		var ifaces = os.networkInterfaces();
		for (var dev in ifaces) {
			ifaces[dev].forEach((details)=> { 
				if(details.internal !== false||(myLocalIpv4&&myLocalIpv6))return;
				if(!myLocalIpv4&&details.family === 'IPv4')
					myLocalIpv4=details.address;
				if(!myLocalIpv6&&details.family === 'IPv6')
					myLocalIpv6=details.address;
			});
		}
	}
})();