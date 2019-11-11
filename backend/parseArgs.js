module.exports = function(args){
	args=args||process.argv;
	return args.slice(2).reduce((acc,arg,cur,arr)=>{
     if(arg.match(/^--/)){
       acc[arg.substring(2)] = true;
       acc['_lastkey'] = arg.substring(2);
     } else
     if(arg.match(/^-[^-]/)){
       for(key of arg.substring(1).split('')){
         acc[key] = true
         acc['_lastkey'] = key
       }
     } else
       if(acc['_lastkey']){
         acc[acc['_lastkey']] = arg;
         delete acc['_lastkey'];
       } else
         acc[arg] = true;
     if(cur==arr.length-1)
       delete acc['_lastkey'];
     return acc;
   },{});
};