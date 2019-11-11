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
					appendUpperCaseWithUnderscoreFirst(currentStr);
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
			appendUpperCaseWithUnderscoreFirst(currentStr);
		function appendUpperCaseWithUnderscoreFirst(toAppend){
				if(resStr.length>0)resStr+='_';
				resStr+=toAppend.toUpperCase();
		}
		return resStr;
};
function isUpperCase(c){
	return c==c.toUpperCase();
}
function isNumber(c){
	return ['0','1','2','3','4','5','6','7','8','9'].indexOf(c)>=0;
}