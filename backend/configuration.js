module.exports=new(function(){
	const fs = require('fs');
	const path = require('path');
	const FILE_PATH=path.join(__dirname, './../configuration.json');
	var _obj;
	var _debug;
	var _cdn;
	var _interserver;
	var _database;
	var _multimedia;
	var _users;
	var _dummies;
	var _google;
	var _ssh2;
	var _cache;
	this.getDummies = function(){
		if(!_dummies){
			var obj = getObj();
			if(!obj.dummies){
				obj.dummies= {};
			}
			_dummies = new Dummies(obj.dummies, save);
		}
		return _dummies;
	};
	this.getCache = function(){
		if(!_cache){
			var obj = getObj();
			if(!obj.cache){
				obj.cache={};
			}
			_cache = new Cache(obj.cache, save);
		}
		return _cache;
	};
	this.getUsers = function(){
		if(!_users){
			var obj = getObj();
			if(!obj.users){
				obj.users= {};
			}
			_users = new Users(obj.users, save);
		}
		return _users;
	};
	this.getUseHttps=function() {
		return getObj().useHttps;
	};
	this.getConsoleTapEnabled=function(){
		return getObj().consoleTapeEnabled;
	};
	this.setUseHttps=function(value) {
		getObj().useHttps=value;
	};
	this.getPrecompiledFrontend=function(){
		return getObj().precompiledFrontend;
	};
	this.setPrecompiledFrontend=function(value) {
		getObj().precompiledFrontend=value;
	};
	this.getUseCDNForSources=function(){
		return getObj().useCDNForSources;
	};
	this.setUseCDNForSources=function(value) {
		getObj().useCDNForSources=value;
	};
	this.getPullZone=function(){
		return getObj().pullZone;
	};
	this.setPullZone=function(value) {
		getObj().pullZone=value;
	};
	this.getDebug=function(){
		if(!_debug){
			var obj = getObj();
			if(!obj.debug){
				obj.debug= {};
			}
			_debug = new Debug(obj.debug, save);
		}
		return _debug;
	};
	this.getCDN=function(){
		if(!_cdn){
			var obj = getObj();
			if(!obj.CDN){
				obj.CDN= {};
			}
			_cdn = new CDN(obj.CDN, save);
		}
		return _cdn;
	};
	this.getInterserver=function(){
		if(!_interserver){
			var obj = getObj();
			if(!obj.interserver){
				obj.interserver= {};
			}
			_interserver = new Interserver(obj.interserver, save);
		}
		return _interserver;
	};
	this.getMultimedia = function(){
		if(!_multimedia){
			var obj = getObj();
			if(!obj.multimedia)
				obj.multimedia={};
			_multimedia = new Multimedia(obj.multimedia, save);
		}
		return _multimedia;
	};
	this.getSSH2 = function(){
		if(!_ssh2){
			var obj = getObj();
			if(!obj.ssh2)
				obj.ssh2={};
			_ssh2 = new SSH2(obj.ssh2, save);
		}
		return _ssh2;
	};
	this.getDatabase=function(){
		if(!_database){
			var obj = getObj();
			if(!obj.database){
				obj.database= {};
			}
			_database = new Database(obj.database, save);
		}
		return _database;
	};
	this.getGoogle=function(){
		if(!_google){
			var obj = getObj();
			if(!obj.google){
				obj.google= {};
			}
			_google = new Google(obj.google, save);
		}
		return _google;
	};
	function CDN(obj, save){
		this.getStorageZoneName=function(){
			return obj.storageZoneName;
		};
		this.setStorageZoneName=function(value) {
			obj.storageZoneName=value;
			save();
		};
		this.getReadonlyPassword=function(){
			return obj.readonlyPassword;
		};
		this.setReadonlyPassword=function(value) {
			obj.readonlyPassword=value;
			save();
		};
		this.getPassword=function(){
			return obj.password;
		};
		this.setPassword=function(value) {
			obj.password=value;
			save();
		};
		this.getUrl = function(){
			return obj.url;
			save();
		};
		this.setUrl = function(value) {
			obj.url=value;
			save();
		};
		this.getUrlTokenAuthenticationKey=function(){
			return obj.urlTokenAuthenticationKey;
		};
		this.setUrlTokenAuthenticationKey=function(value) {
			obj.urlTokenAuthenticationKey=value;
			save();
		};
		this.getPullZone=function(){
			return obj.pullZone;
		};
		this.setPullZone= function(value) {
			obj.pullZone=value;
			save();
		};
	}
	function CDN(obj, save){
		this.getStorageZoneName=function(){
			return obj.storageZoneName;
		};
		this.setStorageZoneName=function(value) {
			obj.storageZoneName=value;
			save();
		};
		this.getReadonlyPassword=function(){
			return obj.readonlyPassword;
		};
		this.setReadonlyPassword=function(value) {
			obj.readonlyPassword=value;
			save();
		};
		this.getPassword=function(){
			return obj.password;
		};
		this.setPassword=function(value) {
			obj.password=value;
			save();
		};
		this.getUrl = function(){
			return obj.url;
			save();
		};
		this.setUrl = function(value) {
			obj.url=value;
			save();
		};
		this.getUrlTokenAuthenticationKey=function(){
			return obj.urlTokenAuthenticationKey;
		};
		this.setUrlTokenAuthenticationKey=function(value) {
			obj.urlTokenAuthenticationKey=value;
			save();
		};
		this.getPullZone=function(){
			return obj.pullZone;
		};
		this.setPullZone= function(value) {
			obj.pullZone=value;
			save();
		};
	}
	function Debug(obj, save){
		this.getFilePathCase=function(){
			return obj.filePathCase;
		};
	}
	function Interserver(obj, save){
		var _servers;
		this.getPathWebsocket=function(){
			return obj.pathWebsocket;
		};
		this.getPathLongpoll=function(){return obj.pathLongpoll;};
		this.getServers = function(){
			if(!_servers){
				if(!obj.servers){
					obj.servers= [];
				}
				_servers = new Servers(obj.servers, save);
			}
			return _servers;
		};
		this.getLogPath=function(){
			return obj.logPath;
		};
	}
	function Database(obj, save){
		var self = this;
		this.getUser=function(){return obj.user;};
		this.getPassword=function(){return obj.password;};
		this.getServer = function(){return obj.server;};
		this.getDatabase = function(){return obj.database;};
		this.toJSON=function(){
			return {
				user:self.getUser(),
				password:self.getPassword(), 
				database:self.getDatabase(), 
				server:self.getServer()
			};
		};
	}
	function Servers(arrIn, save){
		var arr = [];
		arrIn.forEach(function(server){
			arr.push(new Server(server, save));
		});
		this.getArray=function(){
			return arr;
		};
	}
	function Server(obj, save){
		this.getIp = function(){
			return obj.ip;
		};
		this.getName=function(){
			return obj.name;
		};
		this.getPort = function(){
			return obj.port;
		};
		this.getHash = function(){
			return obj.hash;
		};
	}
	function Multimedia(obj, save){
		var _pictures;
		var _videos;
		/*var _servers;
		this.getServers = function(){
			if(!_servers){
				if(!obj.servers){
					obj.servers= [];
				}
				_servers = new Servers(obj.servers, save);
			}
			return _servers;
		};*/
		this.getMaxFileSize=function(){
			return obj.maxFileSize;
		};
		this.getDistributionCoordinator = function(){
			return obj.distributionCoordinator;
		};
		this.getDebugging = function(){
			return obj.debugging;
		};
		this.getUrlPath= function(){
			return obj.urlPath;
		};
		this.getPictures = function(){
			if(!_pictures){
				if(!obj.pictures){
					obj.pictures={};
				}
				_pictures = new Pictures(obj.pictures, save);
			}
			return _pictures;
		};
		this.getVideos = function(){
			if(!_videos){
				if(!obj.videos){
					obj.videos={};
				}
				_videos = new Videos(obj.videos, save);
			}
			return _videos;
		};
		function Pictures(obj, save){
			
			this.getFilePath=function(){
				return obj.filePath;
			}; 
		}
		function Videos(obj, save){
			
			this.getFilePath=function(){
				return obj.filePath;
			}; 
			this.getProfiles=function(){
				return obj.profiles;
			};
		}
	}
	function SSH2(obj, save){
		this.getPassphrase = function(){
			return obj.passphrase;
		};
		this.getPort = function(){return obj.port;};
	}
	function Users(obj, save){
		this.getOnlineNowMilliseconds = function(){
			return obj.onlineNowMilliseconds;
		};
		var _authentication;
		this.getAuthentication = function(){
			if(!_authentication){
				if(!obj.authentication){
					obj.authentication= {};
				}
				_authentication = new Authentication(obj.authentication, save);
			}
			return _authentication;
		};
		function Authentication(obj){
			var _password;
			var _username;
			this.getPassword = function(){
				if(!_password){
					if(!obj.password){
						obj.password= {};
					}
					_password = new Password(obj.password, save);
				}
				return _password;
			};
			this.getUsername = function(){
				if(!_username){
					if(!obj.username){
						obj.username= {};
					}
					_username = new Username(obj.username, save);
				}
				return _username;
			};
			function Password(obj){
				this.getMinLength = function(){return obj.minLength;};
			}
			function Username(obj){
				this.getMinLength = function(){return obj.minLength;};
				this.getMaxLength = function(){return obj.maxLength;};
			}
		}
	}
	function Dummies(obj, save){
		var _users;
		this.getUsers = function(){
			if(!_users){
				if(!obj.users){
					obj.users= {};
				}
				_users = new Users(obj.users, save);
			}
			return _users;
		};
		function Users(obj){
			this.getPassword = function(){
				return obj.password;
			};
			this.getEmail = function(){
				return obj.email;
			};
		}
	}
	function Cache(obj, save){
		this.getInMemoryEnabled = function(){
			return obj.inMemoryEnabled;
		};
		this.getOnDiskEnabled = function(){
			return obj.onDiskEnabled;
		};
		this.getRemoteEnabled = function(){
			return obj.remoteEnabled;
		};
	}
	function Google(obj, save){
		var _maps;
		this.getMaps = function(){
			if(!_maps){
				if(!obj.maps){
					obj.maps= {};
				}
				_maps = new Maps(obj.maps, save);
			}
			return _maps;
		};
		function Maps(obj){
			this.getKey = function(){
				return obj.key;
			};
		}
	}
	function getObj(){
		if(!_obj){
			_obj =readFile();
		}
		return _obj;
	}
	function readFile(){
		if(!fs.existsSync(FILE_PATH))return {};
		var data  = JSON.parse(fs.readFileSync(FILE_PATH));
		if(!data || typeof(data)!='object')return {};
		return data;
	}
	function save(){
		var obj = getObj();
		fs.writeFileSync(JSON.stringify(obj));
	}
})();