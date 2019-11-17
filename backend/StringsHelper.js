module.exports = new (function(){
	this.format = function(str, args) {
		return str.replace(/{(\d+)}/g, function(match, number) { 
		  return typeof args[number] != 'undefined'
			? args[number]
			: match
		  ;
		});
	  };
	  this.replaceAll = function (str, search, replacement) {
		return str.replace(new RegExp(search, 'g'), replacement);
    };
})(); 