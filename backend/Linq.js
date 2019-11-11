(function(){
	var Enumerable = require('./Enumerable');
	Enumerable.prototype.toList = function () {
		var list = [];
		var self = this;
		while (this.moveNext()) {
			list.push(self.current());
		}
		return list;
	};
	Enumerable.prototype.select = function (func) {
		var self = this;
		return new Enumerable(this.moveNext,
			function current() {
				return func(self.current());
			},
			this.reset);
	};
	Enumerable.prototype.where = function (func) {
		var self = this;
		return new Enumerable(function () {
				do {
					if (!self.moveNext()) return false;
				} while (!func(self.current()));
				return true;
			},
			this.current,
			this.reset);
	};
	Enumerable.prototype.first = function (func) {
		if (!this.moveNext()) throw new Error('No first item');
			return this.current();
	};
	Enumerable.prototype.firstOrDefault = function () {
			this.moveNext();
			return this.current();
	};
	Enumerable.prototype.each=function(func){
		while (this.moveNext()) {
			func(this.current());
		}
	};
	Enumerable.prototype.count=function(func){
		var count=0;
		while (this.moveNext()) {
			count++;
		}
		return count;
	};
	Enumerable.prototype.sum=function(){
		var sum=0;
		while (this.moveNext()) {
			sum+=this.current();
		}
		return sum;
	};
	Enumerable.prototype.toObj = function(funcKey, funcValue){
		var obj={};
		while (this.moveNext()) {
			var current = this.current();
			obj[funcKey(current)]= funcValue(current);
		}
		return obj;
	};
	Enumerable.prototype.toMap = function(funcKey, funcValue){
		var map=new Map();
		while (this.moveNext()) {
			var current = this.current();
			map.set(funcKey(current),funcValue(current));
		}
		return map;
	};
	Enumerable.prototype.orderBy = function (func, comparer) {
		return _linqOrderBy(this, func, comparer!=undefined?comparer:function(a, b){
			return a<b?-1:(a>b?1:0);
		});
	};
	Enumerable.prototype.orderByDesc = function (func, comparer) {
		return _linqOrderBy(this, func, comparer!==undefined?function(a, b){return -comparer(a, b);}:function(a, b){
			return a<b?1:(a>b?-1:0);
		});
	};
	function _linqOrderBy(self, func, compare){
		self.reset();
		var list=[];
		while (self.moveNext()) {
			list.push(self.current());
		}
		list = list.sort(function(a, b){
			var valA = func(a);
			var valB = func(b);
			return compare(valA, valB);
		});
		return Enumerable.fromArray(list);	
	}
	Enumerable.prototype.groupBy = function(func){
		var self = this;
		var map={};
		while (this.moveNext()) {
			var current = self.current();
			var res = func(current);
			var group=map[res];
			if(!group){
				group = [];
				map[res]=group;
			}
			group.push(current);
		}
		var values =[];
		for(var i in map){
			values.push(map[i]);
		}
		return Enumerable.fromArray(values);
	};
	global.Array.prototype.toMap = function(funcKey, funcValue){
		return Enumerable.fromArray(this).toMap(funcKey, funcValue);
	};
	global.Array.prototype.toObj = function(funcKey, funcValue){
		return Enumerable.fromArray(this).toObj(funcKey, funcValue);
	};
	global.Array.prototype.select = function (func) {
		return Enumerable.fromArray(this).select(func);
	};
	global.Array.prototype.where = function (func) {
		return Enumerable.fromArray(this).where(func);
	};
	global.Array.prototype.orderBy=function(func, comparer){
		return Enumerable.fromArray(this).orderBy(func, comparer);
	};
	global.Array.prototype.orderByDesc=function(func, comparer){
		return Enumerable.fromArray(this).orderByDesc(func, comparer);
	};
	global.Array.prototype.each=function(func){
		return Enumerable.fromArray(this).each(func);
	};
	global.Array.prototype.groupBy = function (func) {
		return Enumerable.fromArray(this).groupBy(func);
	};
})();