var RouletteWheel = (function(){
	var _RouletteWheel = function (idAndMagnitudePairs){
		var totalMagnitude = 0;
		var pairs =[];
		each(idAndMagnitudePairs, function(idAndMagnitudePair){
			var magnitude = idAndMagnitudePair[1];
			var id = idAndMagnitudePair[0];
			totalMagnitude+=magnitude;
			pairs.push({[S.ID]:id, [S.TOTAL_MAGNITUDE]:totalMagnitude});
		});
		return new RouletteWheel(pairs, totalMagnitude);
	};
	_RouletteWheel.fromMap=function(mapIdToMagnitude){
		var pairs =[];
		var totalMagnitude=0;
		for(var id in mapIdToMagnitude){
			var magnitude = mapIdToMagnitude[id];
			totalMagnitude+=magnitude;
			pairs.push({[S.ID]:id, [S.TOTAL_MAGNITUDE]:totalMagnitude});
		}
		return new RouletteWheel(pairs, totalMagnitude);
	};
	return _RouletteWheel;
	function RouletteWheel(pairs, totalMagnitude){
		this.spin = function(){
			var random = Random.getRandomNumber(0, totalMagnitude);
			var index = binarySearchRoundUp(pairs.length, function(index){return pairs[index][S.TOTAL_MAGNITUDE];}, random);
			return pairs[index][S.ID];
		};
	};
})();