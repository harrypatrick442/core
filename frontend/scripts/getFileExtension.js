var getFileExtension= function(file){
	var fileName = file['name'];	
	return fileName['substr'](fileName.lastIndexOf('.') + 1).toLowerCase();
};