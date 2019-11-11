var bubbleSort = function(arr, compare){
	var len = arr.length;
	for (var i = 0; i < len-1; i++) {
		for (var j = 0; j < len-i-1; j++) {
			if (compare(arr[j],arr[j + 1])) {
				var tmp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = tmp;
			}
		}
	}
	return arr;
};