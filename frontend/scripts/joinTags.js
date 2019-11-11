function joinTags(tags){
	if(!tags)return '';
	var str='';
	var first=true;
	tags[S.ORDER_BY](function(tag){return tag[S.TEXT];})[S.EACH](function(tag){
		if(first)first = false;
		else str+=',';
		str+=tag[S.TEXT];
	});
	return str;
}