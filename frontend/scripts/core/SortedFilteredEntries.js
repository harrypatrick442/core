var SortedFilteredEntries = new (function () {
    var _SortedFilteredEntries = function (params) {
        var compare = params.compare;
        var element = params.element;
        var getEntryId = params.getEntryId;
        var self = this;
        var entries = [];
        var mapIdToEntry = {};
        this.containsEntryId = function (entryId) {
            return containsEntryId(entryId);
        };
        this.getByEntryId = function (entryId) {
            return mapIdToEntry[entryId];
        };
        this.getEntries = function () {
            return entries;
        };
        this.addEntry = function (entry) {
            if (containsEntry(entry)) {
                    return;
            }
            insertInPlace(entry);
        };
        this.removeEntry = function (entry) {
            var index = entries.indexOf(entry);
            if (index < 0) return;
            entries.splice(index, 1);
            element.removeChild(entry[S.GET_ELEMENT]());
            delete mapIdToEntry[getEntryId(entry)];
        };
        this.removeEntryById = function (entryId) {
			var entry = self.getByEntryId(entryId);
			if(!entry)return;
			self.removeEntry(entry);
        };
        this.clear = function () {
            while (entries.length > 0) {
                var entry = entries.splice(0, 1)[0];
                element.removeChild(entry[S.GET_ELEMENT]());
            }
			mapIdToEntry={};
        };
        function insertInPlace(entry) {
            map(entry);
            if (entries.length < 1) {
                entries.push(entry)
                element.appendChild(entry[S.GET_ELEMENT]());
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