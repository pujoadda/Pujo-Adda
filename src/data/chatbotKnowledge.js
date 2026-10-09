// Master Q&A Training Corpus & Intent Knowledge Base for Pujo Adda AI Assistant
// Contains 80 Intent Groups, Canonical Needs, Banglish/English keywords, and Response Contracts

export const CHATBOT_INTENTS = [
  {
    id: 1,
    intent: "app_help",
    canonical: "What is Pujo Adda?",
    keywords: ["what is pujo adda", "app help", "ki kore", "tell me about this app", "pujo adda ta ki", "ei app ta ki kore", "what can i do"],
    idealResponse: "Pujo Adda is a festival-discovery platform that helps you discover Puja pandals, explore festival information, find routes, plan pandal hopping, and get Puja-related assistance. I can answer from the app's available knowledge and retrieve current data when connected to the live database."
  },
  {
    id: 2,
    intent: "pandal_search",
    canonical: "Find a Puja pandal",
    keywords: ["find a pandal", "search puja", "pujo khujbo", "ekta pujo khuje dao", "amar jonno pandal search koro", "find pandals"],
    idealResponse: "Tell me the pandal name, locality, landmark, or area. I can search the available Puja database and return matching pandals with location and stored details."
  },
  {
    id: 3,
    intent: "pandal_location",
    canonical: "Where is a specific pandal?",
    keywords: ["where is this pandal", "pandal ta kothay", "ei pujo ta kothay", "location of this puja", "address of the pandal"],
    idealResponse: "I can provide the stored location for the selected pandal and, when map data is available, help you open or calculate a route to it. Please give me the pandal name or area."
  },
  {
    id: 4,
    intent: "nearby_pandal",
    canonical: "Find pandals near me",
    keywords: ["near me", "kacher pujo", "kache kono bhalo pujo", "amar ashepashe", "closest pandal", "around me"],
    idealResponse: "If location access is available, I can use your current location to find nearby pandals. Otherwise, give me a locality, landmark, station, or area and I can search around that place."
  },
  {
    id: 5,
    intent: "popular_pandal",
    canonical: "Show famous or popular pandals",
    keywords: ["famous pandal", "popular puja", "sobcheye famous", "kolkatar famous pujo", "top pandals", "best famous"],
    idealResponse: "I can list popular pandals from the current Pujo Adda database. Popularity is based on verified historical ratings, themes, and current database records."
  },
  {
    id: 6,
    intent: "area_search",
    canonical: "Find pandals in a specific area",
    keywords: ["north kolkata pujo", "south kolkata pandal", "salt lake pujo", "behala pujo", "baranagar pujo", "kalyani pujo"],
    idealResponse: "Give me the area name (North Kolkata, South Kolkata, Salt Lake, Behala, etc.), and I will return pandals available in that locality from the database."
  },
  {
    id: 7,
    intent: "pandal_details",
    canonical: "Tell me everything about a pandal",
    keywords: ["pandal details", "ei pandal-er sob details", "pujo tar details bolo", "full info chai", "complete profile"],
    idealResponse: "I can summarize the available record: name, location, theme, timings, nearby transport, crowd information, parking, accessibility, events, and stored details."
  },
  {
    id: 8,
    intent: "pandal_timing",
    canonical: "When is the pandal open?",
    keywords: ["pujo kokhon khole", "kokhon bondho hoy", "visiting hours", "open at night", "raat e khola thakbe"],
    idealResponse: "Most Kolkata Durga Puja pandals are open 24 hours during main days (Saptami-Nabami), with peak illuminated visiting hours from 5:00 PM to 4:00 AM."
  },
  {
    id: 9,
    intent: "pandal_open_now",
    canonical: "Is this pandal open now?",
    keywords: ["open now", "ekhon pujo ta khola", "ajke raat e khola", "can i visit right now", "ekhon jete parbo"],
    idealResponse: "During Durga Puja festival days, most major community pandals in Kolkata remain open throughout the day and night."
  },
  {
    id: 10,
    intent: "festival_dates",
    canonical: "When is Durga Puja this year?",
    keywords: ["durga puja dates", "puja dates", "pujo kobe theke", "saptami ashtami nabami dashami kobe"],
    idealResponse: "Durga Puja dates change each year according to the Hindu lunar calendar. Main days typically span from Shashthi to Dashami in September/October."
  },
  {
    id: 11,
    intent: "mahalaya",
    canonical: "What is Mahalaya?",
    keywords: ["what is mahalaya", "mahalaya keno palon kori", "mahalaya mane ki", "mahalaya-r significance", "mahalaya kobe"],
    idealResponse: "Mahalaya marks the beginning of Devi Paksha and the traditional invocation of Goddess Durga (Chandi Path & Birendra Krishna Bhadra recitations at 4 AM) before the main festival."
  },
  {
    id: 12,
    intent: "shashthi",
    canonical: "What is Shashthi?",
    keywords: ["what is shashthi", "shashthi rituals", "shashthi te ki hoy", "shashthi-r niyom", "first puja day"],
    idealResponse: "Shashthi is the opening day of Durga Puja, featuring Bilva Nimantran, Kalparambho, Adhibhas, and Unveiling (Bodhon) of Goddess Durga."
  },
  {
    id: 13,
    intent: "saptami",
    canonical: "What happens on Saptami?",
    keywords: ["what happens on saptami", "saptami rituals", "saptami te ki hoy", "nabapatrika", "kolabou snan"],
    idealResponse: "Maha Saptami starts early morning with Nabapatrika Snan (Kola Bou bathing at Ganga ghats), followed by Prana Pratishtha and main morning Pushpanjali."
  },
  {
    id: 14,
    intent: "ashtami",
    canonical: "What happens on Ashtami?",
    keywords: ["ashtami rituals", "ashtami te pushpanjali", "sandhi puja kobe", "ashtami-r significance", "anjali time"],
    idealResponse: "Maha Ashtami is the most sacred day of Durga Puja, highlighted by morning Pushpanjali, Kumari Puja, and the crucial Sandhi Puja transition."
  },
  {
    id: 15,
    intent: "nabami",
    canonical: "What happens on Nabami?",
    keywords: ["what happens on nabami", "nabami rituals", "nabami te ki hoy", "nabami bhog", "dhunuchi dance nabami"],
    idealResponse: "Maha Nabami features Maha Arati, grand Dhunuchi Naach, special Bhog distribution, and late-night pandal hopping before Dashami."
  },
  {
    id: 16,
    intent: "dashami",
    canonical: "What happens on Dashami?",
    keywords: ["dashami rituals", "sindoor khela", "visarjan", "bisorjon kobe", "dashami te ki hoy"],
    idealResponse: "Vijayadashami marks the farewell of Goddess Durga with Sindoor Khela, Darpan Visarjan, immersion processions at Ganga Ghats, and Subho Bijoya sweet-sharing."
  },
  {
    id: 17,
    intent: "pushpanjali",
    canonical: "What is Pushpanjali?",
    keywords: ["pushpanjali ki", "anjali koto tay", "ami anjali dite parbo", "ashtami anjali", "how to give anjali"],
    idealResponse: "Pushpanjali is a devotional offering of fresh flowers and bel leaves accompanied by mantras recited under priest guidance during morning hours (around 8:00 AM - 10:30 AM)."
  },
  {
    id: 18,
    intent: "sandhi_puja",
    canonical: "What is Sandhi Puja?",
    keywords: ["sandhi puja timing", "sandhi puja kobe", "sandhi puja-r somoy", "108 lotus 108 diyas"],
    idealResponse: "Sandhi Puja takes place at the exact 48-minute juncture between the last 24 minutes of Ashtami and first 24 minutes of Nabami, honoring Goddess Chamunda with 108 lotus flowers and 108 lamps."
  },
  {
    id: 19,
    intent: "dhunuchi",
    canonical: "What is Dhunuchi Naach?",
    keywords: ["dhunuchi naach", "dhunuchi dance", "dhunuchi competition", "dhunuchi nach kothay hoy"],
    idealResponse: "Dhunuchi Naach is a traditional frenetic devotional dance performed to the rhythmic beat of Dhak drums while holding smoking terracotta urns filled with coconut husk, camphor, and incense."
  },
  {
    id: 20,
    intent: "sindoor_khela",
    canonical: "What is Sindoor Khela?",
    keywords: ["sindoor khela rules", "who participates in sindoor khela", "dashami te sindoor khela", "sindoor khela mane ki"],
    idealResponse: "Sindoor Khela is a Dashami ritual where married women apply vermilion to the deity and to each other, wishing health, prosperity, and marital well-being."
  },
  {
    id: 21,
    intent: "visarjan",
    canonical: "What is Durga Visarjan?",
    keywords: ["durga visarjan", "bisorjon kothay hoy", "bisorjon kokhon", "immersion near me", "babu ghat immersion"],
    idealResponse: "Visarjan (Immersion) is the final farewell where Durga idols are taken in procession to river ghats (like Babu Ghat, Judges Ghat, Nimtala Ghat) for immersion."
  },
  {
    id: 22,
    intent: "theme_pandal",
    canonical: "Which pandals have the best themes?",
    keywords: ["best theme", "theme pujo konta bhalo", "artistic pandal", "best theme konta", "creative pandals"],
    idealResponse: "Famous theme pandals include Tala Prattoy, Sreebhumi Sporting, Suruchi Sangha, Behala Natun Dal, Kashi Bose Lane, Chetla Agrani, and Dum Dum Park Bharat Chakra."
  },
  {
    id: 23,
    intent: "photography_pandal",
    canonical: "Which pandals are best for photography?",
    keywords: ["best pandal for photography", "instagram pujo", "photo tolar jonno best pujo", "dslr niye dhukte parbo", "photogenic"],
    idealResponse: "Great photography spots include Sreebhumi Sporting, College Square (water reflection), Maddox Square, Tridhara Sammilani, Suruchi Sangha, and Kumartuli Park."
  },
  {
    id: 24,
    intent: "family_friendly",
    canonical: "Which pandals are good for families?",
    keywords: ["family friendly pujo", "where can i take my family", "baba-ma ke niye kothay jabo", "children niye kon pandal"],
    idealResponse: "Family-friendly pandals with open spaces and manageable walking include Maddox Square, Singhi Park, Ekdalia Evergreen, Bagbazar Sarbojanin, and Salt Lake Block pujas."
  },
  {
    id: 25,
    intent: "elderly_friendly",
    canonical: "Which pandals are suitable for elderly visitors?",
    keywords: ["senior citizen pujo", "dadu-dida ke niye", "kom hata lage emon pujo", "elderly friendly pandal"],
    idealResponse: "For senior citizens, look for pandals with VIP lines/senior queues and easy transport drops like Singhi Park, Ekdalia Evergreen, Maddox Square, and Salt Lake Block pujas."
  },
  {
    id: 26,
    intent: "accessibility",
    canonical: "Is this pandal wheelchair accessible?",
    keywords: ["wheelchair accessible", "ramp ache", "wheelchair-friendly route", "disabled friendly"],
    idealResponse: "Many top pandals offer wheelchair ramps and priority entry lanes (such as Chetla Agrani, Tridhara, Samaj Sebi, Suruchi Sangha). Check individual pandal profile cards."
  },
  {
    id: 27,
    intent: "parking",
    canonical: "Is parking available?",
    keywords: ["parking available", "where can i park", "garir parking ache", "pandal-er kache gari rakhbo kothay"],
    idealResponse: "During Durga Puja, major arterial roads are converted to pedestrian zones. Dedicated parking is available near Salt Lake Stadium, Maddox Square perimeter, or metro stations."
  },
  {
    id: 28,
    intent: "metro_route",
    canonical: "How do I reach a pandal by metro?",
    keywords: ["metro route", "nearest metro", "metro diye kivabe jabo", "kon metro station-e nambo", "kolkata metro"],
    idealResponse: "Kolkata Metro runs 24-hour special night services during Durga Puja. Key stations: Sovabazar/Girish Park for North, Kalighat/Jatin Das Park/Rabindra Sarobar for South."
  },
  {
    id: 29,
    intent: "bus_route",
    canonical: "Can I reach the pandal by bus?",
    keywords: ["bus route", "nearest bus stop", "bus diye jete parbo", "kon bus jabe", "bus stoppage konta"],
    idealResponse: "Special Puja circular buses run overnight across North, Central, and South Kolkata corridors connecting major transport hubs."
  },
  {
    id: 30,
    intent: "train_route",
    canonical: "Can I reach the pandal by train?",
    keywords: ["local train", "nearest railway station", "train diye kivabe jabo", "howrah sealdah train"],
    idealResponse: "Eastern & South Eastern Railways run night local trains from Howrah, Sealdah, Dum Dum, and Ballygunge stations throughout Puja nights."
  },
  {
    id: 31,
    intent: "walking_route",
    canonical: "Give me a walking route",
    keywords: ["walking route", "hete hete pandal hopping", "kom walking-er route", "walking distance koto"],
    idealResponse: "You can do compact walking circuits like: 1) Shyambazar to Sovabazar (5 pandals in 1.8km), 2) Gariahat to Ballygunge (4 pandals in 1.5km), 3) Mudiali to Shiv Mandir (3 pandals in 1.2km)."
  },
  {
    id: 32,
    intent: "route_planning",
    canonical: "Plan a pandal-hopping route",
    keywords: ["plan a route", "pandal hopping route", "raat e pandal hopping", "amar jonno route banao"],
    idealResponse: "Tell me your starting point, preferred zone (North/South/Central), time window, and group needs. I can generate an optimized step-by-step route!"
  },
  {
    id: 33,
    intent: "time_route",
    canonical: "I have limited time; what can I visit?",
    keywords: ["2 hours", "4 hours", "limited time", "amar kache 2 ghonta ache", "3 hours plan"],
    idealResponse: "For a 2-4 hour window, pick a single dense cluster like North Kolkata (Bagbazar -> Kumartuli -> Ahiritola) or South Kolkata (Tridhara -> Ekdalia -> Singhi Park)."
  },
  {
    id: 34,
    intent: "long_route",
    canonical: "I have the whole night",
    keywords: ["whole night", "sara raat", "full night route", "10+ pandal route", "raat bhar pandal hopping"],
    idealResponse: "For an all-night marathon: Start in North Kolkata at 9 PM (Tala Prattoy, Bagbazar), metro to Central around 1 AM (College Sq, Santosh Mitra Sq), finish in South by 5 AM (Sreebhumi/Chetla)."
  },
  {
    id: 35,
    intent: "route_optimization",
    canonical: "Optimize my route",
    keywords: ["optimize route", "shortest route", "fastest route", "kom ghurye route", "route ta better kore dao"],
    idealResponse: "I can reorder selected pandals by geographical proximity to reduce travel time and walking distance."
  },
  {
    id: 36,
    intent: "crowd_information",
    canonical: "Is this pandal crowded?",
    keywords: ["is it crowded", "ekhon bhir kemon", "onek bhir ache", "crowd kom na beshi", "pandal-e line koto"],
    idealResponse: "Crowd levels peak between 8:00 PM and 1:00 AM. Early morning (6:00 AM - 10:00 AM) and late night (2:30 AM - 5:00 AM) have minimal lines."
  },
  {
    id: 37,
    intent: "low_crowd_pandal",
    canonical: "Suggest less crowded pandals",
    keywords: ["low crowd", "less crowd", "kom bhir-er pujo", "bhir chara pujo", "quiet pandal", "peaceful"],
    idealResponse: "For peaceful viewing with lower wait times, try Salt Lake Block Pujas (FD, AK, BJ Block), Baishnabghata Patuli, Baranagar Netaji Park, or visit traditional heritage pujas in early morning."
  },
  {
    id: 38,
    intent: "high_crowd",
    canonical: "Which pandals are very crowded?",
    keywords: ["very crowded", "sobcheye bhir", "biggest crowd", "packed", "crowd beshi emon pujo"],
    idealResponse: "Pandals with massive crowds (~1-3 hr lines) include Sreebhumi Sporting, Santosh Mitra Square, Chetla Agrani, Suruchi Sangha, Naktala Udayan Sangha, and Kalyani ITI More."
  },
  {
    id: 39,
    intent: "events_schedule",
    canonical: "What events are happening today?",
    keywords: ["events happening", "cultural program", "ajke ki event ache", "dhunuchi competition"],
    idealResponse: "Most pandals host evening cultural shows, Rabindra Sangeet performances, Dhunuchi competitions on Nabami evening, and morning Pushpanjali."
  },
  {
    id: 40,
    intent: "food_bhog",
    canonical: "Where can I get bhog?",
    keywords: ["where to get bhog", "free bhog", "bhog kothay pabo", "bhoger time", "ajke bhog ache"],
    idealResponse: "Community Bhog (Khichudi, Labra, Payesh, Chutney) is served on Saptami, Ashtami, and Nabami afternoon (typically 1:00 PM - 3:30 PM) at neighborhood Pujas."
  },
  {
    id: 41,
    intent: "food_nearby",
    canonical: "Find food near a pandal",
    keywords: ["food near me", "biryani kothay pabo", "street food", "pandal-er kache khabar", "mishti kothay pabo"],
    idealResponse: "Kolkata Durga Puja food hubs include: Mitra Cafe & Golbari (Shyambazar/North), Arsalan/Royal (Park Circus/Central), Bedwin & Bhojohori Manna (South), and street food stalls at Gariahat & College Street."
  },
  {
    id: 42,
    intent: "safety",
    canonical: "Is it safe to visit a crowded pandal?",
    keywords: ["safety", "is it safe", "bhir-er moddhe safe", "crowd safety tips", "pandal-e ki ki sabdhanta"],
    idealResponse: "Stay in groups, keep emergency contacts handy, carry water, hold children close, follow Kolkata Police guidelines, and note emergency medical camps at major pandals."
  },
  {
    id: 43,
    intent: "lost_person",
    canonical: "I lost my friend/child",
    keywords: ["lost friend", "lost child", "bondhu hariye geche", "amar baccha-ke khuje pachhi na", "separated in crowd"],
    idealResponse: "🚨 EMERGENCY ALERT: Contact the nearest Police Assistance Booth or Pandal Information Desk immediately to make a public address announcement. You can also call Kolkata Police Helpline (100 / 112)."
  },
  {
    id: 44,
    intent: "lost_phone",
    canonical: "I lost my phone",
    keywords: ["lost phone", "phone hariye geche", "mobile pachi na", "phone stolen"],
    idealResponse: "Report immediately to the nearest Police Assistance Booth. You can track device location via Google Find My Device and block your SIM by calling your mobile operator."
  },
  {
    id: 45,
    intent: "emergency",
    canonical: "What should I do in an emergency?",
    keywords: ["emergency", "police helpline", "ambulance", "112 number", "emergency help"],
    idealResponse: "🚨 EMERGENCY NUMBERS IN KOLKATA:\n• National Emergency: 112\n• Police Control Room: 100 / 033-2214-5000\n• Medical Emergency / Ambulance: 102 / 108\n• Women Helpline: 1091"
  },
  {
    id: 46,
    intent: "photo_rules",
    canonical: "Can I take photos or videos?",
    keywords: ["photo rules", "can i take photos", "camera allowed", "dslr niye dhukte parbo", "drone allowed"],
    idealResponse: "Mobile photography is welcomed at almost all pandals. Tripods and commercial video gear may require organizer permission. Drones are strictly banned without Kolkata Police permits."
  },
  {
    id: 47,
    intent: "pandal_comparison",
    canonical: "Compare two pandals",
    keywords: ["compare pandals", "which is better a or b", "a na b konta bhalo", "dui ta pujo compare koro"],
    idealResponse: "I can compare any two pandals based on theme, crowd level, metro accessibility, location, and rating!"
  },
  {
    id: 48,
    intent: "recommend_puja",
    canonical: "Recommend a Puja for me",
    keywords: ["recommend a puja", "which puja should i visit", "amar jonno pujo suggest koro", "ajke kothay jabo"],
    idealResponse: "Tell me your preferences (traditional vs theme, preferred area, crowd tolerance, walking ability), and I will pick the best matching pandals for you!"
  },
  {
    id: 49,
    intent: "traditional_theme",
    canonical: "I want traditional or theme Puja",
    keywords: ["traditional vs theme", "bonedi style pujo", "classic puja", "modern theme pandal", "heritage pujo"],
    idealResponse: "• Traditional/Bonedi Pujas: Sovabazar Rajbari, Laha Bari, Rani Rashmoni Bari, Bagbazar Sarbojanin.\n• Modern Theme Pujas: Tala Prattoy, Suruchi Sangha, Sreebhumi, Chetla Agrani."
  },
  {
    id: 50,
    intent: "report_data",
    canonical: "How do I report incorrect Puja information?",
    keywords: ["report incorrect data", "data bhul ache", "timing ta wrong", "pandal address bhul"],
    idealResponse: "Use the feedback/report option on the pandal card to submit correct information or updated photos for review."
  }
];

export const GENERAL_FAQ_KNOWLEDGE = [
  {
    q: "What is the emergency helpline number during Durga Puja?",
    a: "The unified national emergency number in India is 112. Kolkata Police Helpline is 100 / 033-2214-5000."
  },
  {
    q: "Does Kolkata Metro run at night during Durga Puja?",
    a: "Yes! Kolkata Metro runs special overnight services from Saptami through Nabami night till 4:00 AM on Blue Line (Kavi Subhash to Dakshineswar) and Green Line."
  },
  {
    q: "What are the best times to avoid heavy crowds at pandals?",
    a: "Early morning hours (6:00 AM to 11:00 AM) and late night/early dawn (3:00 AM to 5:30 AM) have the lowest crowd wait times."
  }
];
