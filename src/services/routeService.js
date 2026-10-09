// Route Calculation & Optimization Engine for Pujo Adda

// Haversine formula to compute actual geographic distance in km
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return 0.5;
  }
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const result = Math.round(R * c * 10) / 10;
  return isNaN(result) ? 0.5 : result;
}

// Calculate Multi-Stop Route (e.g. Dunlop -> Pandal 1 -> Pandal 2 -> Shyambazar)
export function optimizeMultiStopRoute(startLocation, pandalList, mode = 'walking') {
  if (!pandalList || !Array.isArray(pandalList) || pandalList.length === 0) {
    return { stops: [], totalKm: 0, totalMins: 0 };
  }

  // Ensure startLocation has valid coords
  const safeStartPos = (startLocation && startLocation.lat != null && startLocation.lng != null)
    ? startLocation
    : { lat: 22.5726, lng: 88.3639 };

  // Filter out any invalid items without coords
  let remaining = pandalList.filter(p => p && p.coords && p.coords.lat != null && p.coords.lng != null);
  if (remaining.length === 0) {
    return { stops: [], totalKm: 0, totalMins: 0 };
  }

  let currentPos = safeStartPos;
  let orderedStops = [];
  let totalKm = 0;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let minDist = calculateDistanceKm(
      currentPos.lat,
      currentPos.lng,
      remaining[0].coords.lat,
      remaining[0].coords.lng
    );

    for (let i = 1; i < remaining.length; i++) {
      const dist = calculateDistanceKm(
        currentPos.lat,
        currentPos.lng,
        remaining[i].coords.lat,
        remaining[i].coords.lng
      );
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    const nextStop = remaining[nearestIdx];
    totalKm += minDist;
    orderedStops.push({ ...nextStop, legDistanceKm: minDist });
    currentPos = nextStop.coords;
    remaining.splice(nearestIdx, 1);
  }

  const speedKmH = mode === 'walking' ? 4.5 : mode === 'transit' ? 25 : 18;
  const totalMins = Math.round((totalKm / speedKmH) * 60 + orderedStops.length * 15);

  return {
    stops: orderedStops,
    totalKm: Math.round(totalKm * 10) / 10,
    totalMins
  };
}

// Check off-route detection (threshold ~150 meters)
export function isUserOffRoute(currentCoords, routePathCoords, maxThresholdMinsKm = 0.25) {
  if (!currentCoords || currentCoords.lat == null || currentCoords.lng == null) return false;
  if (!routePathCoords || !Array.isArray(routePathCoords) || routePathCoords.length === 0) return false;
  let minDist = Infinity;
  for (const point of routePathCoords) {
    if (point && point.length >= 2) {
      const d = calculateDistanceKm(currentCoords.lat, currentCoords.lng, point[0], point[1]);
      if (d < minDist) minDist = d;
    }
  }
  return minDist > maxThresholdMinsKm;
}

// OSRM Real Road Routing Engine Integration
export async function fetchRealOSRMRoute(origin, destination, mode = 'driving') {
  if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
    return null;
  }

  const profile = mode === 'walking' || mode === 'walk' ? 'foot' : mode === 'bike' ? 'bike' : 'driving';
  const url = `https://router.project-osrm.org/route/v1/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMins = Math.round(route.duration / 60);
      const steps = route.legs[0]?.steps?.map((s) => ({
        instruction: `${s.maneuver.type} ${s.name ? 'onto ' + s.name : ''}`,
        distanceMeters: Math.round(s.distance)
      })) || [];

      return {
        path: coordinates,
        distanceKm: parseFloat(distanceKm),
        durationMins,
        steps
      };
    }
  } catch (err) {
    console.warn('OSRM Routing Engine notice:', err.message);
  }
  return null;
}

// Find Nearest Pandal by real road route distance among top candidate pandals
export async function findTrueNearestPandal(userLocation, pandalList, mode = 'walking') {
  if (!userLocation?.lat || !userLocation?.lng || !pandalList || pandalList.length === 0) {
    return null;
  }

  const validPujas = pandalList.filter(
    (p) => p.coords && typeof p.coords.lat === 'number' && typeof p.coords.lng === 'number'
  );

  if (validPujas.length === 0) return null;

  // Initial filtering using straight-line Haversine distance
  const candidatesWithStraightDist = validPujas.map((p) => {
    const straightKm = calculateDistanceKm(userLocation.lat, userLocation.lng, p.coords.lat, p.coords.lng);
    return { puja: p, straightKm };
  });

  candidatesWithStraightDist.sort((a, b) => a.straightKm - b.straightKm);
  const topCandidates = candidatesWithStraightDist.slice(0, 5);

  let bestPandal = topCandidates[0].puja;
  let minRoadDistanceKm = topCandidates[0].straightKm * 1.3;
  let bestRouteRes = null;

  for (const item of topCandidates) {
    const routeRes = await fetchRealOSRMRoute(userLocation, item.puja.coords, mode);
    const roadKm = routeRes ? routeRes.distanceKm : item.straightKm * 1.3;
    if (roadKm < minRoadDistanceKm) {
      minRoadDistanceKm = roadKm;
      bestPandal = item.puja;
      bestRouteRes = routeRes;
    }
  }

  return {
    pandal: bestPandal,
    roadDistanceKm: Math.round(minRoadDistanceKm * 10) / 10,
    routeInfo: bestRouteRes
  };
}
