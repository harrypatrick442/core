var Settings = window['Settings']=function(settingsName){
	this['get'] = function (name)
	{
		try
		{
			var item = window.localStorage.getItem(settingsName + '_' + name);
			if(item==null||item==undefined)return;
			return JSON.parse(item);
		}
		catch(ex)
		{
			return undefined;
		}
	};
	this['set'] = function (name, obj)
	{
		try
		{
			window.localStorage.setItem(settingsName + '_' + name, JSON.stringify(obj));
		}
		catch(ex)
		{
			console.error(ex);
		}
	};
};