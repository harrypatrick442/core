module.exports = new (function(){
	const uuidv4 = require('uuid/v4');
	var intformat = require('biguint-format')
	var FlakeId = require('flake-idgen');
	var flakeIdGen = new FlakeId();

	this.getUniqueUnpredictableGuid = function(){
		return uuidv4();
	};
	this.getGuaranteedUniqueDecimalString= function(){
		return intformat(flakeIdGen.next(), 'dec');
	};
	this.getGuaranteedUniqueHexString= function(){
		return intformat(flakeIdGen.next(), 'dec');
	};
})();