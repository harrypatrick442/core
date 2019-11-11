var WaitAllResponses = function(callback){
	var waitings=[];
	var nNoCallback=0;
	var waitingHashesInOrder=[];
	var mapHashToResult={};
	return function(callbackWaiting){
		if(!callbackWaiting)nNoCallback++;
		else
		{
			waitings.push(callbackWaiting);
			var hash = HashBuilder(callbackWaiting);
			waitingHashesInOrder.push(hash);
		}
		return function(result){
			if(callbackWaiting){
				var index = waitings.indexOf(callbackWaiting);
				if(index<0)return;
				waitings.splice(index, 1);
				mapHashToResult[callbackWaiting[S.GET_HASH]()]=result;
				callbackWaiting.apply(null, arguments);
			}
			else
				nNoCallback--;
			if(waitings.length+nNoCallback>0)return;
			callback.apply(null, getResultsInOrderAddedAndEmpty());
		};
	};
	function getResultsInOrderAddedAndEmpty(){
		var results=[];
		each(waitingHashesInOrder, function(hash){
			results.push(mapHashToResult[hash]);
		});
		mapHashToResult=null;
		return results;
	}
};