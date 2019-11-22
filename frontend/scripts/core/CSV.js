Date.prototype.addYears = function(nYears){
	return new Date(this.setMonth(this.getMonth()+(12*nYears)));
};
Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}
Date.fromUKString=function(ukString){
	if(typeof(ukString)!=='svar CSV = window['CSV']=new (function(){
	var _Configuration;
	_Configuration = function(delimiter, newLineMark, quotationMark){
		if(delimiter==undefined)delimiter=",";
		if(newLineMark==undefined) newLineMark = "\r\n";
		if(quotationMark==undefined)quotationMark = '"';
		this[S.GET_DELIMITER]=function(){return delimiter};
		this[S.GET_NEW_LINE_MARK]=function(){return newLineMark;};
		this[S.GET_QUOTATION_MARK]=function(){return quotationMark;};
	};
	var defaultConfiguration;
	_Configuration[S.GET_DEFAULT]=function(){
		if(!defaultConfiguration)defaultConfiguration= new _Configuration();
		return defaultConfiguration;
	};
	this[S.CONFIGURATION]=_Configuration;
	this[S.WRITER]=function Writer(a, b){
		var regEexpReplaceQuotationMarks=new RegExp('"', "g");
		var configuration;
		var writeToDownload;
		var writerBuffer;
		if(typeof(a)=='object'){
			configuration = a;
			writeToDownload = b;
		}
		else{
			configuration = _Configuration[S.GET_DEFAULT]();
			writeToDownload = a;
		}
		if(writeToDownload==undefined)writeToDownload=true;
		writerBuffer = new StringBuilder();
        this[S.ADD_ROW] = function(cells)
        {
			var firstCell=true;
            each(cells, function(cell){
                if (firstCell) firstCell = false;
                else writerBuffer[S.WRITE](configuration[S.GET_DELIMITER]());
                parseCell(writerBuffer, cell?cell:'');
            });
            writerBuffer[S.WRITE](configuration[S.GET_NEW_LINE_MARK]());
        };
		this[S.TO_STRING]=function(){
			return writerBuffer[S.TO_STRING]();
		};
        function parseCell(writerBuffer, str)
        {
			var write = writerBuffer[S.WRITE];
            if (needsToBeEscaped(str))
            {
				var quotationMark=configuration[S.GET_QUOTATION_MARK]();
                write(quotationMark);
                write(escapeCell(str));
                write(quotationMark);
                return;
            }
            write(str);
        }
        function escapeCell(str) {
			var quotationMark=configuration[S.GET_QUOTATION_MARK]();
            return str.replace(regEexpReplaceQuotationMarks, quotationMark+quotationMark);
        }
        function needsToBeEscaped(cell)
        {
            if (cell.indexOf(configuration[S.GET_QUOTATION_MARK]())>=0)
                return true;
            if (cell.indexOf(configuration[S.GET_DELIMITER]())>=0)
                return true;
			var newLineMark = configuration[S.GET_NEW_LINE_MARK]();
            for(var i=0; i< newLineMark.length; i++){
				var c = newLineMark[i];
                if (cell.indexOf(c)>=0)
                    return true;
            }
            return false;
        }
	};
	this[S.READER]=function Reader(){
		throw new Error('Not Implemented Exception');
	};
	
	function Downloader(){
		throw new Error('Not Implemented Exception');
	}
	function StringBuilder(){
		var str='';
		this[S.WRITE]=function(s){
			str+=s;
		};
		this[S.TO_STRING]=function(){
			return str;
		};
	}
})();