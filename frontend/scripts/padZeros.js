function padZeros(str, nLength){
	while(str.length<nLength){
		str='0'+str;
	}
	return str;
}