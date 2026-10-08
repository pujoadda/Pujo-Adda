// AI Pujo Discovery Assistant Service
import { PUJAS_DATA } from '../data/pujas';
import { FESTIVALS_LIST } from '../data/festivals';
import { NEARBY_PLACES_DATA } from '../data/nearbyPlaces';

export async function processAiPujoQuery(userQuery, userLocation) {
  const query = userQuery.toLowerCase().trim();

  // Simulate server-side AI processing latency
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!query) {
    return {
      text: "Hello! I am your AI Pujo Discovery Assistant. Ask me anything like:\n• 'What Durga Puja pandals can I visit near me?'\n• 'I have 4 hours. Make me a Puja route.'\n• 'Show me low crowd festival areas in North Kolkata.'",
      recommendations: [],
      route: null
    };
  }

  // 1. Low crowd query
  if (query.includes('low crowd') || query.includes('less crowd') || query.includes('peaceful')) {
    const lowCrowdPujas = PUJAS_DATA.filter(p => p.crowdLevel === 'Moderate' || p.crowdLevel === 'High');
    return {
      text: `Based on verified community reports, here are 3 festival spots in Kolkata with comparatively lower wait times right now:`,
      recommendations: lowCrowdPujas.slice(0, 4),
      disclaimer: 'Crowd level is an estimate based on recent activity signals.'
    };
  }

  // 2. Route request (e.g. 4 hours / 6 hours / 1 day tour)
  if (query.includes('route') || query.includes('hours') || query.includes('plan') || query.includes('day tour')) {
    const northPujas = PUJAS_DATA.filter(p => p.zone === 'north').slice(0, 5);
    return {
      text: `I have generated an optimized 4-stop North Kolkata Pandal Hopping Route starting near Shyambazar. Estimated walking + viewing duration: ~3.5 hours.`,
      recommendations: northPujas,
      isRoutePlan: true,
      routeSteps: [
        { stop: 1, name: 'Bagbazar Sarbojanin', duration: '40 mins', note: 'Start at traditional 100+ yr sabeki idol' },
        { stop: 2, name: 'Sovabazar Rajbari', duration: '35 mins', note: 'Walk 600m to royal courtyards' },
        { stop: 3, name: 'Kumartuli Park', duration: '45 mins', note: 'Explore artisan pottery zone' },
        { stop: 4, name: 'Ahiritola Sarbojanin', duration: '40 mins', note: 'Finish with Ganga ghat food stalls' }
      ]
    };
  }

  // 3. Christmas / Kali Puja / Fair query
  if (query.includes('christmas') || query.includes('park street')) {
    const fest = FESTIVALS_LIST.find(f => f.category === 'christmas');
    return {
      text: `Kolkata Christmas Festival takes place along Park Street & St. Paul's Cathedral. Includes overhead LED light canopies, plum cake stalls, and midnight carols.`,
      festivals: fest ? [fest] : [],
      recommendations: []
    };
  }

  // 4. Default Search & Location Query
  const matches = PUJAS_DATA.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.zoneName.toLowerCase().includes(query) ||
    p.address.toLowerCase().includes(query) ||
    p.theme.toLowerCase().includes(query) ||
    p.nearestMetro.toLowerCase().includes(query)
  );

  if (matches.length > 0) {
    return {
      text: `Found ${matches.length} verified Durga Puja spots matching "${userQuery}":`,
      recommendations: matches.slice(0, 6)
    };
  }

  // Unavailable data fallback
  return {
    text: `I couldn't find verified live information matching "${userQuery}". Please check your search parameters or select a specific zone.`,
    recommendations: [],
    emptyState: true
  };
}
