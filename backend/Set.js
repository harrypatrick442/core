module.exports = (function(){
	var each = require('./each');
	var _Set = function(params){
		var self = this;
		var getEntryId = params.getEntryId;
		var list =[];
		var mapIdToItem={};
		this.add=function(item){
			if(self.contains(item))return false;
			list.push(item);
			mapIdToItem[getEntryId(item)]=item;
			return true;
		};
		this.getById= function(id){
			return mapIdToItem[id];
		};
		this.remove=function(item){
			if(!self.contains(item)) return false;
			list.splice(list.indexOf(item), 1);
			delete mapIdToItem[getEntryId(item)];
			return true;
		};
		this.contains=function(item){
			return mapIdToItem[getEntryId(item)]?true:false;
		};
		this.getById= function(id){
			return mapIdToItem[id];
		};
		this.getEntries = function(){return list;};
		this.getEntryIds = function(){
			return Object.keys(mapIdToItem);
		};
		this.count = function(){
			return list.length;
		};
		this.each = function(func){
			each(list, func);
		};
		this.clear = function(){
			list =[];
			mapIdToItem={};
		};
	};
	return _Set;
})();