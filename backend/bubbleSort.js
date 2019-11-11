module.exports =function(arr, compare){
	let len = arr.length;
	for (let i = 0; i < len-1; i++) {
		for (let j = 0; j < len-i-1; j++) {
			if (compare(arr[j],arr[j + 1])) {
				let tmp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = tmp;
			}
		}
	}
	return arr;
};