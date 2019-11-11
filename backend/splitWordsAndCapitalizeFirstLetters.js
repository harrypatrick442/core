const capitalizeFirstLetter = require('./capitalizeFirstLetter');
module.exports = function(str){
		var resStr='';
		var currentStr='';
		var i=0;
		var previousIsNumber=false;
		var length = str.length;
		while(i<length){
			var c = str[i];
			var currentIsNumber=isNumber(c);
			if((isUpperCase(c)&&!currentIsNumber)||currentIsNumber&&!previousIsNumber){
				if(currentStr.length>0){
					appendWord(currentStr);
					currentStr='';
				}
				currentStr+=c;
			}
			else{
				currentStr+=c;
			}
			previousIsNumber = currentIsNumber;
			i++;
		}
		if(currentStr.length>0)
			appendWord(currentStr);
		function appendWord(toAppend){
				if(resStr.length>0)resStr+=' ';
				resStr+=capitalizeFirstLetter(toAppend);	
		}
		return resStr;
	
};
function isNumber(c){
	return ['0','1','2','3','4','5','6','7','8','9'].indexOf(c)>=0;
}
function isUpperCase(c){
	return c==c.toUpperCase();
}