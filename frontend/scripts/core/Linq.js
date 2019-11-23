Enumerable.prototype[S.TO_LIST] = function () {
	this[S.RESET]();
	var list = [];
	var self = this;
	while (this[S.MOVE_NEXT]()) {
		list.push(self[S.CURRENT]());
	}
	return list;
};
Enumerable.prototype[S.TO_OBJ] = function (getKey, getValue) {
	this[S.RESET]();
	this[S.RESET]();
	var map = {};
	var self = this;
	while (this[S.MOVE_NEXT]()) {
		var current = self[S.CURRENT]();
		map[getKey(current)]=getValue(current);
	}
	return map;
};
Enumerable.prototype[S.GROUP_BY] = function(func){
	var self = this;
	var map={};
	while (this[S.MOVE_NEXT]()) {
		var current = self[S.CURRENT]();
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
	return Enumerable[S.FROM_ARRAY](values);
};
Enumerable.prototype[S.SELECT] = function (func) {
	var self = this;
	return new Enumerable(this[S.MOVE_NEXT],
		function current() {
			return func(self[S.CURRENT]());
		},
		this[S.RESET]);
};
Enumerable.prototype[S.TAKE] = function (n) {
	return (function(n, self){
		var count=0;
		return new Enumerable(function(){
			var next = self[S.MOVE_NEXT]();
			if(next){
				count++;
				if(count<=n)
					return true;
			}
			return false;
		},
		self[S.CURRENT],
		self[S.RESET]);
	})(n, this);
};
Enumerable.prototype[S.LEAVE] = function (n) {
	var self = this;
	var count=0;
	return new Enumerable(function(){
		var next = self[S.MOVE_NEXT]();
		if(next){
			count++;
			if(count>n)
				return true;
		}
		return false;
	},
	self[S.CURRENT],
	self[S.RESET]);
};
Enumerable.prototype[S.WHERE] = function (func) {
	var self = this;
	return new Enumerable(function () {
			do {
				if (!self[S.MOVE_NEXT]()) return false;
			} while (!func(self[S.CURRENT]()));
			return true;
		},
		this[S.CURRENT],
		this[S.RESET]);
};
Enumerable.prototype[S.ORDER_BY] = function (func, comparer) {
	return _linqOrderBy(this, func, comparer!=undefined?comparer:function(a, b){
		return a<b?-1:(a>b?1:0);
	});
};
Enumerable.prototype[S.ORDER_BY_DESC] = function (func, comparer) {
	return _linqOrderBy(this, func, comparer!==undefined?function(a, b){return -comparer(a, b);}:function(a, b){
		
		return a<b?1:(a>b?-1:0);
	});
};
function _linqOrderBy(self, func, compare){
	self[S.RESET]();
	var list=[];
	while (self[S.MOVE_NEXT]()) {
		list.push(self[S.CURRENT]());
	}
list = list.sort(function(a, b){
		var valA = func(a);
		var valB = func(b);
		return compare(valA, valB);
	});
	return Enumerable[S.FROM_ARRAY](list);	
}
Enumerable.prototype[S.FIRST] = function (func) {
	if (!this[S.MOVE_NEXT]()) throw new Error('No first item');
		return this[S.CURRENT]();
};
Enumerable.prototype[S.FIRST_OR_DEFAULT] = function () {
		this[S.MOVE_NEXT]();
		return this[S.CURRENT]();
};
Enumerable.prototype[S.REVERSE]=function(){
	this[S.RESET]();
	return Enumerable[S.FROM_ARRAY](this[S.TO_LIST]()['reverse']());
};
Enumerable.prototype[S.SUM]=function(func){
	this.reset();	
	var sum=0;
	while (this.moveNext()) {
		sum+=func(this.current());
	}
	return sum;
};
Enumerable.prototype[S.COUNT]=function(){
	this[S.RESET]();	
	var count=0;
	while (this[S.MOVE_NEXT]()) {
		count++;
	}
	return count;
};
Enumerable.prototype[S.EACH]=function(func){
	this[S.RESET]();	
	while (this[S.MOVE_NEXT]()) {
		func(this[S.CURRENT]());
	}
};
Array.prototype[S.SELECT] = function (func) {
	return Enumerable[S.FROM_ARRAY](this)[S.SELECT](func);
};
Array.prototype[S.TO_OBJ] = function (getKey, getValue) {
	return Enumerable[S.FROM_ARRAY](this)[S.TO_OBJ](getKey, getValue);
};
Array.prototype[S.WHERE] = function (func) {
	return Enumerable[S.FROM_ARRAY](this)[S.WHERE](func);
};
Array.prototype[S.GROUP_BY] = function (func) {
	return Enumerable[S.FROM_ARRAY](this)[S.GROUP_BY](func);
};
Array.prototype[S.ORDER_BY]=function(func, comparer){
	return Enumerable[S.FROM_ARRAY](this)[S.ORDER_BY](func, comparer);
};
Array.prototype[S.ORDER_BY_DESC]=function(func, comparer){
	return Enumerable[S.FROM_ARRAY](this)[S.ORDER_BY_DESC](func, comparer);
};
Array.prototype[S.EACH]=function(func){
	return Enumerable[S.FROM_ARRAY](this)[S.EACH](func);
};
Array.prototype[S.TAKE]=function(n){
	return Enumerable[S.FROM_ARRAY](this)[S.TAKE](n);
};
Array.prototype[S.LEAVE]=function(n){
	return Enumerable[S.FROM_ARRAY](this)[S.LEAVE](n);
};
Array.prototype[S.SUM] = function(func){
	return Enumerable[S.FROM_ARRAY](this)[S.SUM](func);
};