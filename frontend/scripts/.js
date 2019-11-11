var QuadTree;
(function() {
    var mapQuadrantToDistance={};
    function getDistanceFromLatLngs(latLng1, latLng2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(latLng2.lat - latLng1.lat);  // deg2rad below
        var dLon = deg2rad(latLng2.lng - latLng1.lng);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(latLng1.lat)) * Math.cos(deg2rad(latLng2.lat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    function middlePoint(a)
    {
        return {lat: (a.latFrom + a.latTo) / 2, lng: (a.lngFrom + a.lngTo) / 2};
    }
    QuadTree = new (function() {
        var nLevels = 19;
        this.getMyQuadrants = function(latLng)
        {
            var levelQuadNs = {};
            var latFrom = 90;
            var latTo = -90;
            var lngFrom = -180;
            var lngTo = 180;
            var lastQuadN = 0;
            var level = 0;
            while (level < nLevels)
            {
                var midLat = (latTo + latFrom) / 2;
                var midLng = (lngTo + lngFrom) / 2;
                var bit0;
                var bit1;
                if (latLng.lng < midLng)
                {
                    bit1 = 1;
                    lngTo = midLng;
                } else
                {
                    bit1 = 0;
                    lngFrom = midLng;
                }
                if (latLng.lat > midLat)
                {
                    bit0 = 1;
                    latTo = midLat;
                } else
                {
                    bit0 = 0;
                    latFrom = midLat;
                }
                lastQuadN = (lastQuadN * 4) + (2 * bit0) + bit1;
                levelQuadNs[level] = lastQuadN;
                level++;
            }
            return levelQuadNs;
        };
        function getStartLevel(radiusKm, lat)
        {
            var diameter = radiusKm * 2;
            var level = 0;
            var step = 6371 * Math.cos((Math.PI * lat) / 180);
            while (diameter < step)
            {
                level++;
                step = step / 2;
            }
            return level;
        }
        this.getQuadsForRadius = function(latLng, radiusKm)
        {//at 84 degrees radius  radius about one tenth at equater. equator.

            function withinRange(distance)
            {
                return (distance < 0 ? -distance : distance) < radiusKm;
            }
            var getAllChildQuadrants;
            getAllChildQuadrants = function(lastQuadN, latFrom, latTo, lngFrom, lngTo, level, minLevelPickFrom, maxLevel)
            {
                var middleLat = (latTo + latFrom) / 2;
                var middleLng = (lngTo + lngFrom) / 2;
                //01
                //23
                var newQuadrants = [
                    {latFrom: middleLat, latTo: latTo, lngFrom: middleLng, lngTo: lngTo},
                    {latFrom: middleLat, latTo: latTo, lngFrom: lngFrom, lngTo: middleLng},
                    {latFrom: latFrom, latTo: middleLat, lngFrom: middleLng, lngTo: lngTo},
                    {latFrom: latFrom, latTo: middleLat, lngFrom: lngFrom, lngTo: middleLng}];
                var children = [];
                var lastQuadNTimes4 = (lastQuadN * 4);
                latTo = midLat;
                lngFrom = midLng;
                var newLevel = level + 1;
                for (var i = 0; i < 4; i++)
                {
                    var newQuadrant = newQuadrants[i];
                    var newQuadN = lastQuadNTimes4 + i;
                    var toPush = level >= minLevelPickFrom;
                    var distance;
                    if (toPush)
                    {
                                distance=getDistanceFromLatLngs(middlePoint(newQuadrant), latLng);
                        toPush = withinRange(distance);
                    }
                    if (toPush)
                    {
                        mapQuadrantToDistance[newQuadN]=distance;
                        children.push({l: level, i: newQuadN});
                    } else {
                        if (level < maxLevel && level < nLevels)
                        {
                            var childChildren = getAllChildQuadrants(newQuadN, newQuadrant.latFrom, newQuadrant.latTo, newQuadrant.lngFrom, newQuadrant.lngTo, newLevel, minLevelPickFrom, maxLevel);
                            for (var j = 0; j < childChildren.length; j++)
                            {
                                children.push(childChildren[j]);
                            }
                        }
                    }
                }
                return children;
            };
            var startLevel = getStartLevel(radiusKm, latLng.lat);
            var latFrom = 90;
            var latTo = -90;
            var lngFrom = -180;
            var lngTo = 180;
            var lastQuadN = 0;
            var level = 0;
            while (level < nLevels)
            {
                if (level >= startLevel)
                {
                    return getAllChildQuadrants(lastQuadN, latFrom, latTo, lngFrom, lngTo, level, level + 3, level + 6);
                }
                var midLat = (latTo + latFrom) / 2;
                var midLng = (lngTo + lngFrom) / 2;
                var bit0;
                var bit1;
                if (latLng.lng < midLng)
                {
                    bit1 = 1;
                    lngTo = midLng;
                } else
                {
                    bit1 = 0;
                    lngFrom = midLng;
                }
                if (latLng.lat > midLat)
                {
                    bit0 = 1;
                    latTo = midLat;
                } else
                {
                    bit0 = 0;
                    latFrom = midLat;
                }
                lastQuadN = (lastQuadN * 4) + (2 * bit0) + bit1;
                level++;

            }
        };
        this.getDistanceFromQuad=function(quadrant)
        {var distance = mapQuadrantToDistance[quadrant];
            if(!distance)
                return;
            return distance.toFixed(1);
        };
    })();
})();