module.exports = new (function(){
	this.getRandomNumber=function(minInclusive, maxExclusive) {
	  return Math.random() * (maxExclusive - minInclusive) + minInclusive;
	};
	this.getInt=function(minInclusive, maxExclusive) {
	  return Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive);
	};
})();