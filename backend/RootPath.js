module.exports = new (function(){
	var path = require('path');
	var _rootPath = path.resolve(__dirname, './../../');
	this.get=function(){
		return _rootPath;
	};
})();