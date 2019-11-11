module.exports= (function(){
	const CALL="CALL ";
    var sql = require("mssql");
    var each = require('./../../../core/backend/each');
	var _Dal = function(configuration){
		const config = configuration.toJSON();
		this.nonQuery = function(params){
			return new Promise(function(resolve, reject){
				var storedProcedure = params.storedProcedure;
				var parameters = params.parameters;
				var connection = new sql.ConnectionPool(config);
				connection.connect().then(function(connection) {
					var request = new sql.Request(connection);
					setInputs(parameters, request);
					request.execute(storedProcedure).then(resolve).catch(function(err) {
						console.error(err);
						reject(err);
					});
				});
			});
		};
		this.query = function(params){
			return new Promise(function(resolve, reject){
				var storedProcedure = params.storedProcedure;
				var parameters = params.parameters?params.parameters:[];
				var callback= params.callback;
				var connection = new sql.ConnectionPool(config);
				connection.connect().then(function(connection) {
					var request = new sql.Request(connection);
					setInputs(parameters, request);
					request.execute(storedProcedure).then(function(result) {
						callback&&callback(result);//gradually removing this.
						resolve(result);
					}).catch(function(err) {
						console.error(err);
						reject(err);
					});
				})
				.catch(function(err) {
					console.error(err);
					reject(err);
				});
			});
		};
		this.bulkInsert = function(params){
			var table = params.table;
			var callback= params.callback;
			var connection = new sql.ConnectionPool(config);
			connection.connect().then(function(connection) {
				var request = new sql.Request(connection);
				request.bulk(table).then(function(result) {
					callback(result);
				}).catch(function(err) {
					console.log(err.message); 
					throw err;
				});
			});
		};
		function setInputs(parameters, request){
			each(parameters, function(parameter){
				if(parameter.out)
					request.output(parameter.name, parameter.type, parameter.value);
				else{
					if(parameter.type)
						request.input(parameter.name, parameter.type, parameter.value);
					else 
						request.input(parameter.name, parameter.value);
				}
			});
		}
	};
	return _Dal;
})();
