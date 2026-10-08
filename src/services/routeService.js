// Route Calculation & Optimization Engine for Pujo Adda

// Haversine formula to compute actual geographic distance in km
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
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
  return Math.round(R * c * 10) / 10 || 0.5;
}

// Calculate Multi-Stop Route (e.g. Dunlop -> Pandal 1 -> Pandal 2 -> Shyambazar)
export function optimizeMultiStopRoute(startLocation, pandalList, mode = 'walking') {
  if (!pandalList || pandalList.length === 0) {
    return { stops: [], totalKm: 0, totalMins: 0 };
  }

  // Nearest-neighbor TSP approximation for route ordering
  let remaining = [...pandalList];
  let currentPos = startLocation;
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
  if (!routePathCoords || routePathCoords.length === 0) return false;
  let minDist = Infinity;
  for (const point of routePathCoords) {
    const d = calculateDistanceKm(currentCoords.lat, currentCoords.lng, point[0], point[1]);
    if (d < minDist) minDist = d;
  }
  return minDist > maxThresholdMinsKm;
}
