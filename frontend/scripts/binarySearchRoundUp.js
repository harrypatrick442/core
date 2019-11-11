function binarySearchRoundUp(length, getAtIndex, target){
  var startIndex = length - 1;
  var endIndex = 0;
  while(startIndex >=0) {
    var middleIndex = Math['floor']((startIndex + endIndex) / 2);
	var middleValue = getAtIndex(middleIndex);
    if( startIndex - endIndex<=1) {
		if(endIndex==length-1){
			return endIndex;
		}
		if(startIndex==0)
			return 0;
		if(middleValue<target){
			return startIndex;
		}
		if(getAtIndex(endIndex)>=target) return endIndex;
		return startIndex;
    }
    if(target > middleValue) {
      endIndex = middleIndex;
    }
	else
	if(target<middleValue)
      startIndex = middleIndex;
  else return middleIndex;
  }
};