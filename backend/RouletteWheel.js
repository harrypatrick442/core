const binarySearchRoundUp = require('./binarySearchRoundUp');
const Random = require('./Random');
const each = require('./each');
require('./Linq');
const fs = require('fs');
const RJSON = require('relaxed-json');
const MAGNITUDE='m';
const TOTAL_MAGNITUDE='t';
const ID='i';
module.exports = (function(){
	var _RouletteWheel = function (idAndMagnitudePairs){
		var totalMagnitude = 0;
		var pairs =[];
		each(idAndMagnitudePairs, function(idAndMagnitudePair){
			var magnitude = idAndMagnitudePair[1];
			var id = idAndMagnitudePair[0];
			totalMagnitude+=magnitude;
			pairs.push({[ID]:id, [TOTAL_MAGNITUDE]:totalMagnitude});
		});
		return new RouletteWheel(pairs);
	};
	_RouletteWheel.fromFile = function(fileName, isTotalMagnitudes){
		if(isTotalMagnitudes==undefined)isTotalMagnitudes=true;
		var content= fs.readFileSync(fileName, 'utf8');
		var pairs = JSON.parse(content);
		var totalMagnitude=0;
		if(!isTotalMagnitudes){
			each(pairs, function(pair){
				var magnitude = pair[MAGNITUDE];
				totalMagnitude+=magnitude;
				pair[TOTAL_MAGNITUDE]=totalMagnitude;
				delete pair[MAGNITUDE];
			});
		}
		return new RouletteWheel(pairs);
	};
	return _RouletteWheel;
	function RouletteWheel(pairs){
		var totalMagnitude = pairs[pairs.length-1][TOTAL_MAGNITUDE];
		this.spin = function(){
			var random = Random.getRandomNumber(0, totalMagnitude);
			var index = binarySearchRoundUp(pairs.length, function(index){return pairs[index][TOTAL_MAGNITUDE];}, random);
			return pairs[index][ID];
		};
		this.saveToFile = function(fileName){
			fs.writeFileSync(fileName, JSON.stringify(pairs));
		};
	};
})();