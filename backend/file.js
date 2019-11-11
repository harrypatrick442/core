module.exports =(function(){
	const fs = require('fs');
	this[S.READ_JSON]=function(){
		try{
			var contents = rs.readFileSync(fs);
			return JSON.parse(contents);
		}
		catch(ex){
			console.error(ex);
		}
	};
})();