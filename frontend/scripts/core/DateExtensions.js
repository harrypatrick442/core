Date.prototype.addYears = function(nYears){
	return new Date(this.setMonth(this.getMonth()+(12*nYears)));
};
Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}
Date.fromUKString=function(ukString){
	if(typeof(ukString)!=='string')return null;
	var s = ukString.split('/');
	if(s.length<3)return null;
	if(s.length>3)return null;
	var years = parseInt(s[2]);
	var months = parseInt(s[1]);
	var days = parseInt(s[0]);
	if(isNaN(years)||isNaN(months)||isNaN(days))return null;
	if(months<1||months>12)return null;
	var date = new Date(years, months-1, 1);
	if(isNaN(date.getTime()))return null;
	if(days<1||date.monthDays()<days)return null;
	date.setDate(days);
	return date;
};