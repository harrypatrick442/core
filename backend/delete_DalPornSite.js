module.exports= new (function(){
		var config = require('./../configuration/Configuration').getDatabase();
		var Dal = require('./Dal').Dal;

		var dal = new Dal(config.toJSON());
		this.nonQuery = dal.nonQuery;
		this.query = dal.query;
		this.scalar = dal.scalar;
})();
