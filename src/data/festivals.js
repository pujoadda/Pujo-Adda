// India-Wide Festival Database & Calendar Engine
export const INDIAN_STATES = [
  { id: 'WB', name: 'West Bengal', districts: ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Darjeeling', 'Nadia'] },
  { id: 'DL', name: 'Delhi NCR', districts: ['Central Delhi', 'South Delhi', 'North Delhi', 'Gurugram', 'Noida'] },
  { id: 'MH', name: 'Maharashtra', districts: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur'] },
  { id: 'TN', name: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai'] },
  { id: 'KA', name: 'Karnataka', districts: ['Bengaluru Urban', 'Mysuru'] },
  { id: 'UP', name: 'Uttar Pradesh', districts: ['Varanasi', 'Lucknow', 'Agra', 'Ayodhya'] },
  { id: 'OD', name: 'Odisha', districts: ['Cuttack', 'Bhubaneswar', 'Puri'] }
];

export const FESTIVAL_CATEGORIES = [
  { id: 'all', name: 'All Festivals', icon: '🪔' },
  { id: 'durga-puja', name: 'Durga Puja', icon: '🪔' },
  { id: 'kali-puja', name: 'Kali Puja & Diwali', icon: '🔱' },
  { id: 'lakshmi-puja', name: 'Kojagari Lakshmi Puja', icon: '🪷' },
  { id: 'jagaddhatri-puja', name: 'Jagaddhatri Puja', icon: '👑' },
  { id: 'saraswati-puja', name: 'Saraswati Puja', icon: '🪕' },
  { id: 'christmas', name: 'Christmas', icon: '🎄' },
  { id: 'holi', name: 'Holi / Dol Jatra', icon: '🎨' },
  { id: 'eid', name: 'Eid-ul-Fitr', icon: '🌙' },
  { id: 'rath-yatra', name: 'Rath Yatra', icon: '🚩' },
  { id: 'navratri', name: 'Ganesh Utsav / Navratri', icon: '⚔️' },
  { id: 'fair', name: 'Cultural Fair / Mela', icon: '🎡' },
  { id: 'food', name: 'Food & Culinary Festival', icon: '🍴' }
];

export const FESTIVALS_LIST = [
  {
    id: 'fest-durga-puja-2026',
    name: 'Durga Puja 2026',
    bengaliName: 'দুর্গাপূজা ২০২৬',
    category: 'durga-puja',
    state: 'West Bengal',
    district: 'Kolkata',
    startDate: '2026-10-16',
    endDate: '2026-10-21',
    season: 'Autumn (Sharad)',
    status: 'LIVE NOW',
    isUNESCO: true,
    tagline: 'UNESCO Intangible Cultural Heritage of Humanity',
    description: 'The premier 5-day grand carnival of Bengal featuring artistic pandals, traditional sabeki idols, dhunuchi naach, and midnight food walks across Kolkata.',
    bannerImage: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1200&q=80',
      '/images/festivals/IMG_bd8c0653-e245-4525-a232-2a7b4015ed87.jpg',
      '/images/festivals/IMG_947add4e-9b5b-4de6-9187-a576c2befeb7.jpg'
    ],
    spotsCount: 26,
    verifiedSource: 'Government of West Bengal Tourism & Forum for Durgotsab'
  },
  {
    id: 'fest-kali-puja-2026',
    name: 'Kali Puja & Diwali 2026',
    bengaliName: 'কালীপূজা ও দীপাবলী',
    category: 'kali-puja',
    state: 'West Bengal',
    district: 'Kolkata',
    startDate: '2026-11-08',
    endDate: '2026-11-09',
    season: 'Autumn',
    status: 'UPCOMING',
    isUNESCO: false,
    tagline: 'Festival of Lights & Divine Shakti',
    description: 'Illumination of thousands of clay lamps (diyas), midnight pujas at Dakshineswar, Kalighat, and neighborhood paras with sacred flames and fireworks.',
    bannerImage: '/images/festivals/IMG_947add4e-9b5b-4de6-9187-a576c2befeb7.jpg',
    galleryImages: [
      '/images/festivals/IMG_947add4e-9b5b-4de6-9187-a576c2befeb7.jpg',
      '/images/festivals/IMG_aafe31cf-f255-42af-b541-d594b34a7a79.jpg'
    ],
    spotsCount: 14,
    verifiedSource: 'Kolkata Municipal Corporation'
  },
  {
    id: 'fest-lakshmi-puja-2026',
    name: 'Kojagari Lakshmi Puja 2026',
    bengaliName: 'কোজাগরী লক্ষ্মীপূজা',
    category: 'lakshmi-puja',
    state: 'West Bengal',
    district: 'Kolkata',
    startDate: '2026-10-25',
    endDate: '2026-10-25',
    season: 'Autumn (Sharad Purnima)',
    status: 'UPCOMING',
    isUNESCO: false,
    tagline: 'Devotion, Floor Alpana & Harvest Blessing',
    description: 'Celebrated on the full moon night (Sharad Purnima) following Durga Puja. Bengali households and community pandals create elaborate floor art (alpana) and light diyas to welcome Goddess Lakshmi.',
    bannerImage: '/images/festivals/IMG_aafe31cf-f255-42af-b541-d594b34a7a79.jpg',
    galleryImages: [
      '/images/festivals/IMG_aafe31cf-f255-42af-b541-d594b34a7a79.jpg'
    ],
    spotsCount: 12,
    verifiedSource: 'Bengal Cultural Heritage Board'
  },
  {
    id: 'fest-jagaddhatri-puja-2026',
    name: 'Jagaddhatri Puja 2026',
    bengaliName: 'জগদ্ধাত্রী পূজা (চন্দননগর ও হেলাপুকুর)',
    category: 'jagaddhatri-puja',
    state: 'West Bengal',
    district: 'Hooghly',
    startDate: '2026-11-18',
    endDate: '2026-11-22',
    season: 'Autumn',
    status: 'UPCOMING',
    isUNESCO: false,
    tagline: 'World Famous Light Illumination & Towering Pandals',
    description: 'Famous 4-day grand festival of Goddess Jagaddhatri in Chandannagar and Helapukur featuring immense decorated pandals, intricate 3D light craft, and grand night-long immersion processions.',
    bannerImage: '/images/festivals/IMG_bd8c0653-e245-4525-a232-2a7b4015ed87.jpg',
    galleryImages: [
      '/images/festivals/IMG_bd8c0653-e245-4525-a232-2a7b4015ed87.jpg'
    ],
    spotsCount: 20,
    verifiedSource: 'Chandannagar Municipal Corporation & Helapukur Central Committee'
  },
  {
    id: 'fest-saraswati-puja-2026',
    name: 'Saraswati Puja 2026',
    bengaliName: 'সরস্বতী পূজা (বসন্ত পঞ্চমী)',
    category: 'saraswati-puja',
    state: 'West Bengal',
    district: 'Kolkata',
    startDate: '2026-02-01',
    endDate: '2026-02-01',
    season: 'Spring (Vasant)',
    status: 'UPCOMING',
    isUNESCO: false,
    tagline: 'Bengali Valentine\'s Day & Worship of Wisdom',
    description: 'Celebration of knowledge, music, and art on Vasant Panchami. Students in yellow basanti attire offer prayers with veena and books to Goddess Saraswati across Kolkata schools, colleges, and clubs.',
    bannerImage: '/images/festivals/IMG_20ce6846-ccc2-4c38-98c6-762bf02cdc9b.jpg',
    galleryImages: [
      '/images/festivals/IMG_20ce6846-ccc2-4c38-98c6-762bf02cdc9b.jpg'
    ],
    spotsCount: 15,
    verifiedSource: 'Kolkata School & College Durgotsab Forum'
  },
  {
    id: 'fest-christmas-2026',
    name: 'Kolkata Christmas Festival',
    bengaliName: 'ক্রিসমাস উৎসব',
    category: 'christmas',
    state: 'West Bengal',
    district: 'Kolkata',
    startDate: '2026-12-20',
    endDate: '2026-12-31',
    season: 'Winter',
    status: 'UPCOMING',
    isUNESCO: false,
    tagline: 'Park Street Illumination & St. Paul\'s Cathedral Carols',
    description: 'Park Street lights up with dazzling LED overhead displays, festive night market, live musical bands, plum cakes at Flurys, and midnight mass at St. Paul\'s Cathedral.',
    bannerImage: '/images/festivals/IMG_7b8c9eda-fb13-43cb-b0ab-da532a6eb434.jpg',
    galleryImages: [
      '/images/festivals/IMG_7b8c9eda-fb13-43cb-b0ab-da532a6eb434.jpg'
    ],
    spotsCount: 8,
    verifiedSource: 'West Bengal Tourism Development Corporation'
  },
  {
    id: 'fest-ganesh-utsav-2026',
    name: 'Mumbai Ganesh Utsav 2026',
    bengaliName: 'গণেশ উৎসব',
    category: 'navratri',
    state: 'Maharashtra',
    district: 'Mumbai City',
    startDate: '2026-09-14',
    endDate: '2026-09-24',
    season: 'Monsoon/Autumn',
    status: 'UPCOMING',
    isUNESCO: false,
    tagline: 'Lalbaugcha Raja & Oceanic Visarjan Processions',
    description: '10-day grand festival of Lord Ganesha in Mumbai, featuring Lalbaugcha Raja, GSB Seva Mandal, and oceanic sea immersion with water celebrations on Anant Chaturdashi.',
    bannerImage: '/images/festivals/IMG_e2f1c203-467b-48e1-9f99-326cb8be6900.jpg',
    galleryImages: [
      '/images/festivals/IMG_e2f1c203-467b-48e1-9f99-326cb8be6900.jpg'
    ],
    spotsCount: 18,
    verifiedSource: 'Brihanmumbai Municipal Corporation (BMC)'
  },
  {
    id: 'fest-dover-lane-2026',
    name: 'Dover Lane Music Conference',
    bengaliName: 'ডোভার লেন সঙ্গীত সম্মেলন',
    category: 'fair',
    state: 'West Bengal',
    district: 'Kolkata',
    startDate: '2026-01-22',
    endDate: '2026-01-25',
    season: 'Winter',
    status: 'UPCOMING',
    isUNESCO: false,
    tagline: 'India\'s Legendary All-Night Classical Music Festival',
    description: 'Over 70 years of classical vocal, sitar, sarod, and tabla performances by maestro classical artists at Nazrul Mancha.',
    bannerImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
    ],
    spotsCount: 3,
    verifiedSource: 'Dover Lane Music Conference Society'
  },
  {
    id: 'fest-rath-yatra-2026',
    name: 'Puri & Kolkata Rath Yatra 2026',
    bengaliName: 'রথযাত্রা ২০২৬',
    category: 'rath-yatra',
    state: 'Odisha',
    district: 'Puri',
    startDate: '2026-07-12',
    endDate: '2026-07-20',
    season: 'Monsoon',
    status: 'UPCOMING',
    isUNESCO: false,
    tagline: 'The Chariot Festival of Lord Jagannath',
    description: 'Millions pull massive wooden chariots of Lord Jagannath, Balabhadra, and Subhadra along Grand Road in Puri and ISKCON Kolkata.',
    bannerImage: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80'
    ],
    spotsCount: 5,
    verifiedSource: 'Shree Jagannath Temple Administration'
  }
];
