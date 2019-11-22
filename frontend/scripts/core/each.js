var each = window['each']=function(arr, callback){
	for(var i=0; i<arr.length; i++){
		callback(arr[i]);
	}
};