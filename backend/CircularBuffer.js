module.exports = function(items){
	var arr = items?items:[];
	var index=0;
	this.next = function(){
		var item = items[index++];
		if(index>=arr.length)
			index=0;
		return item;
	};
};