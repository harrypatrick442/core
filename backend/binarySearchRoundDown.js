module.exports = function(length, getAtIndex, target){
  let startIndex = 0;
  let endIndex = length - 1;
  while(startIndex <= endIndex) {
    let middleIndex = Math.floor((startIndex + endIndex) / 2);
	var middleValue = getAtIndex(middleIndex);
    if(endIndex-startIndex<=1) {
		if(startIndex==length-1){
			return endIndex;
		}
		if(endIndex==0)
			return 0;
		
		if(middleValue>target){
			return startIndex;
		}
		if(getAtIndex(endIndex)>target) return middleIndex;
		return endIndex;
    }
    if(target > middleValue) {
      startIndex = middleIndex;
    }
	else
	if(target<middleValue)
      endIndex = middleIndex;
  else return middleIndex;
  }

};