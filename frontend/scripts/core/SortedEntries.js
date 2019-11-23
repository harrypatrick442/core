var OrderedItems = new (function () {
    var _OrderedItems = function (params) {
        var self = this;
        var element = params[S.ELEMENT];
        var createEntry = params[S.CREATE_ENTRY];
		var propertyName = params[S.PROPERTY_NAME];
		var model = params[S.MODEL];
		var propertyNameItems = params[S.PROPERTY_NAME_ITEMS];
		var propertyNameItemId = params[S.PROPERTY_NAME_ITEM_ID];
		var entries=[];
		var mapItemIdToEntry={};
		itemsChanged(propertyBindingItems['get']());
		function itemsChanged(value){
			var unseenItems = items.slice();
			for(var i=0; i<value.length; i++){
				var item = value[i];
				var index = items.indexOf(item);
				if(index>=0){
					unseenItems.splice(index, 1);
					return;
				}
				items.push(
			});
			each(unseenItems, function(unseenItem){
				removeItem();
			});
		}
		
		
		
		
        function insertInPlace(entry) {
            if (entries.length < 1) {
                entries.push(entry);
                element.appendChild(entry['getElement']());
                return;
            }
            var lastIndex = entries.length - 1;
            var insertAtIndex = _findInsertPosition(0, lastIndex, entry);
            if (insertAtIndex <= lastIndex) {
				element.insertBefore(entry[S.GET_ELEMENT](),entries[insertAtIndex][S.GET_ELEMENT]());
                entries.splice(insertAtIndex, 0, entry);
				
                return;
            }
            entries.push(entry);
            element.appendChild(entry[S.GET_ELEMENT]());
        }
        function map(entry) {
            mapIdToEntry[getEntryId(entry)] = entry;
        }
        function _findInsertPosition(fromIndex, toIndex, entry) {
            var n = toIndex - fromIndex;
            if (n < 5) {
                return findInsertPositionByIteration(fromIndex, toIndex, entry);
            }
            var middleIndex = Math.floor(n / 2) + fromIndex;
            var middleEntry = entries[middleIndex];
            var greaterThan = compare(entry, middleEntry);
            return greaterThan ? _findInsertPosition(middleIndex+1, toIndex, entry) : _findInsertPosition(fromIndex, middleIndex, entry);
        }
        function findInsertPositionByIteration(fromIndex, toIndex, entry) {
            for (var i = fromIndex; i<=toIndex; i++){
                var entryAtIndex = entries[i];
                if (!compare(entry, entryAtIndex)) {
                    return i;
                }
            }
            return toIndex+1;
        }
        function containsEntry(entry) { return containsEntryId(getEntryId(entry)); }
        function containsEntryId(entryId) { return mapIdToEntry[entryId] ? true : false; }
    };
    return _SortedFilteredEntries;
})();