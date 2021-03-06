var Enumerable = (function () {
    var _Enumerable = function (moveNext, current, reset) {
        this['moveNext'] = moveNext;
        this['current'] = current;
        this['reset'] = reset;
    };
    _Enumerable['fromArray'] = function (arr) {
        return new (function (arr) {
            var index = -1;
            var length = arr['length'];
            return new _Enumerable(function () {
                index++;
                return index < length;
            },
            function () {
                return arr[index];
            },
            function () {
                index = -1;
            });
        })(arr);
    };
	if(typeof window !='undefined')
		window['Enumerable']=_Enumerable;
    return _Enumerable;
})();