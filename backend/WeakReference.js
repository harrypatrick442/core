module.exports = function(value){
	var KEY_NAME='k';
	var weakMap = new WeakMap();
	weakMap.set(value, KEY_NAME);
	this.isAlive = isAlive;
	this.value = function(){
		return weakMap.get(KEY_NAME);
	};
	function isAlive(){
		return weakMap.has(KEY_NAME);
	}
};