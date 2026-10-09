// AI Pujo Discovery Assistant Service
// Powered by Google Gemini API with fallback to built-in Smart Intent & Dataset Engine

import { PUJAS_DATA } from '../data/pujas';
import { FESTIVALS_LIST } from '../data/festivals';
import { CHATBOT_INTENTS } from '../data/chatbotKnowledge';

// Retrieve active Gemini API Key from localStorage or environment
export function getGeminiApiKey() {
  return localStorage.getItem('pujo_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveGeminiApiKey(key) {
  if (key) {
    localStorage.setItem('pujo_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('pujo_gemini_api_key');
  }
}

// Build system context string with database summary
function buildSystemPrompt() {
  const pandalsSummary = PUJAS_DATA.map(p =>
    `- ${p.name} (ID: ${p.id}, Zone: ${p.zoneName}, Metro: ${p.nearestMetro}, Crowd: ${p.crowdLevel}, Theme: "${p.theme}")`
  ).join('\n');

  return `You are Pujo Adda AI Assistant, an expert, friendly Durga Puja discovery & festival guide for Kolkata.

RULES:
1. Answer natural language user questions about Durga Puja pandals, routes, themes, rituals, transport, food, safety, and festival advice in English or Banglish/Bengali.
2. Ground your answers strictly on the Pujo Adda database records provided below. Never invent non-existent pandals, wrong timings, or fake locations.
3. If asked about emergency, lost child, or lost phone, provide immediate emergency guidance (Emergency Helpline: 112, Kolkata Police: 100).
4. Be concise, helpful, and festive!

DATABASE CONTEXT (${PUJAS_DATA.length} verified Kolkata Durga Pujas):
${pandalsSummary}`;
}

// Call Google Gemini API
async function callGeminiApi(apiKey, userQuery) {
  const systemPrompt = buildSystemPrompt();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemPrompt}\n\nUSER QUESTION: ${userQuery}\n\nProvide a helpful response. If specific pandals are relevant, mention them clearly.` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return replyText.trim();
}

// Local Smart Intent & Search Rule Engine
function processLocalSmartQuery(userQuery, userLocation) {
  const query = userQuery.toLowerCase().trim();

  // 1. Check matching intents from CHATBOT_INTENTS training corpus
  const matchedIntent = CHATBOT_INTENTS.find(intent =>
    intent.keywords.some(kw => query.includes(kw))
  );

  // 2. Emergency handling
  if (query.includes('emergency') || query.includes('lost child') || query.includes('lost friend') || query.includes('lost phone') || query.includes('police')) {
    return {
      text: `🚨 EMERGENCY ASSISTANCE:\n• National Emergency Helpline: 112\n• Kolkata Police Control Room: 100 / 033-2214-5000\n• Medical Emergency / Ambulance: 102 / 108\n\nIf you have lost someone or an item in a crowd, immediately approach the nearest Police Assistance Booth or Pandal Information Desk to make a public announcement.`,
      isEmergency: true,
      recommendations: []
    };
  }

  // 3. Low crowd query
  if (query.includes('low crowd') || query.includes('less crowd') || query.includes('peaceful') || query.includes('kom bhir') || query.includes('quiet')) {
    const lowCrowdPujas = PUJAS_DATA.filter(p => p.crowdLevel === 'Moderate' || p.crowdLevel === 'High');
    return {
      text: matchedIntent ? matchedIntent.idealResponse : `Based on database records, here are festival spots with comparatively manageable crowd wait times:`,
      recommendations: lowCrowdPujas.slice(0, 5),
      disclaimer: 'Crowd conditions fluctuate. Early morning (6:00 AM - 10:00 AM) has minimum wait times.'
    };
  }

  // 4. Route request / Pandal hopping itinerary
  if (query.includes('route') || query.includes('hours') || query.includes('plan') || query.includes('itinerary') || query.includes('raat') || query.includes('tour')) {
    let zoneFilter = 'north';
    if (query.includes('south')) zoneFilter = 'south';
    if (query.includes('central') || query.includes('salt lake') || query.includes('middle')) zoneFilter = 'middle';

    const selectedPujas = PUJAS_DATA.filter(p => p.zone === zoneFilter).slice(0, 5);
    const zoneLabel = zoneFilter === 'north' ? 'North Kolkata' : zoneFilter === 'south' ? 'South Kolkata' : 'Central / Salt Lake';

    return {
      text: `I have generated an optimized ${selectedPujas.length}-stop ${zoneLabel} Pandal Hopping Route starting near main metro stations. Estimated viewing duration: ~3.5 hours.`,
      recommendations: selectedPujas,
      isRoutePlan: true,
      routeSteps: selectedPujas.map((p, idx) => ({
        stop: idx + 1,
        name: p.name,
        duration: '35 mins',
        note: `Theme: ${p.theme} (Metro: ${p.nearestMetro})`
      }))
    };
  }

  // 5. Traditional vs Theme query
  if (query.includes('traditional') || query.includes('bonedi') || query.includes('heritage') || query.includes('sabeki')) {
    const traditionalPujas = PUJAS_DATA.filter(p => p.theme.toLowerCase().includes('traditional') || p.theme.toLowerCase().includes('heritage') || p.name.toLowerCase().includes('rajbari'));
    return {
      text: `Here are classic Traditional & Heritage Pujas known for authentic idol crafting and aristocratic heritage:`,
      recommendations: traditionalPujas.slice(0, 5)
    };
  }

  // 6. Direct search match in Pujas
  const matches = PUJAS_DATA.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.zoneName.toLowerCase().includes(query) ||
    p.address.toLowerCase().includes(query) ||
    p.theme.toLowerCase().includes(query) ||
    p.nearestMetro.toLowerCase().includes(query)
  );

  if (matches.length > 0) {
    return {
      text: matchedIntent ? `${matchedIntent.idealResponse}\n\nHere are matching verified Puja pandals:` : `Found ${matches.length} verified Durga Puja spots matching "${userQuery}":`,
      recommendations: matches.slice(0, 6)
    };
  }

  // 7. Generic matched intent fallback
  if (matchedIntent) {
    return {
      text: matchedIntent.idealResponse,
      recommendations: PUJAS_DATA.slice(0, 4)
    };
  }

  // Default fallback
  return {
    text: `I couldn't find exact verified records matching "${userQuery}". Try searching for specific zones (e.g. "North Kolkata", "South Kolkata"), "Metro routes", "Low crowd pandals", or ask about specific rituals!`,
    recommendations: PUJAS_DATA.slice(0, 4),
    emptyState: true
  };
}

// Main process function
export async function processAiPujoQuery(userQuery, userLocation) {
  const apiKey = getGeminiApiKey();

  // If Gemini API Key is available, call Gemini API
  if (apiKey) {
    try {
      const geminiText = await callGeminiApi(apiKey, userQuery);

      // Match referenced pandals from response text to render recommendation cards
      const queryLower = userQuery.toLowerCase();
      const textLower = geminiText.toLowerCase();

      const matchedPujas = PUJAS_DATA.filter(p =>
        textLower.includes(p.name.toLowerCase()) || queryLower.includes(p.name.toLowerCase())
      );

      return {
        text: geminiText,
        recommendations: matchedPujas.slice(0, 6),
        isGeminiPowered: true
      };
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local rule engine:", err.message);
      const fallbackResult = processLocalSmartQuery(userQuery, userLocation);
      return {
        ...fallbackResult,
        warning: `Gemini API Error: ${err.message}. Using Smart Rule Engine fallback.`
      };
    }
  }

  // Otherwise, use local smart engine
  await new Promise(resolve => setTimeout(resolve, 500));
  return processLocalSmartQuery(userQuery, userLocation);
}
