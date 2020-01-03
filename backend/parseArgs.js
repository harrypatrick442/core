require('./Linq');
const StringsHelper = require('./StringsHelper');
module.exports = function(args){
	args=args||process.argv;
	return args.slice(2).select((arg)=>{
		var splits = arg.split('=');
		var value=splits[1];
		var key = splits[0];
		if(key.indexOf('-')>=0&&key.indexOf('--')<0&&value!==undefined&&value.length>1)throw new Error('Single dash flags can only be used with a single character argument');
		return [StringsHelper.replaceAll(key, '-', ''),value!==undefined?value:true];
	}).toObj(arg=>arg[0], arg=>arg[1]);
};