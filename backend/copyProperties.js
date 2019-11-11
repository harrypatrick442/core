module.exports = function(from, to, propertyNames){
	each(propertyNames,  function(propertyName){
		to[propertyName]=from[propertyName];
	});
};