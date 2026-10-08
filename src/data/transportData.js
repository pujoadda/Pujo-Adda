// Master Metro & Bus Database for Kolkata & West Bengal Public Transport

export const METRO_LINES = [
  {
    id: 'blue',
    name: 'Blue Line (North-South Corridor)',
    color: '#0284c7',
    gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
    stationsCount: 26,
    firstTrain: '06:50 AM',
    lastTrain: '09:40 PM (Puja Special: 04:00 AM Night Service)',
    frequency: 'Peak: 5 mins | Off-Peak: 8 mins',
    stations: [
      { id: 'm-dakshineswar', name: 'Dakshineswar', code: 'DKN', zone: 'north', sequence: 1, lat: 22.6548, lng: 88.3582, interchange: ['Railway'] },
      { id: 'm-baranagar', name: 'Baranagar', code: 'BNRG', zone: 'north', sequence: 2, lat: 22.6450, lng: 88.3712, interchange: [] },
      { id: 'm-noapara', name: 'Noapara', code: 'NPR', zone: 'north', sequence: 3, lat: 22.6375, lng: 88.3912, interchange: ['Yellow Line'] },
      { id: 'm-dumdum', name: 'Dum Dum', code: 'DDM', zone: 'north', sequence: 4, lat: 22.6220, lng: 88.3776, interchange: ['Railway'] },
      { id: 'm-belgachia', name: 'Belgachia', code: 'BGC', zone: 'north', sequence: 5, lat: 22.6042, lng: 88.3820, interchange: [] },
      { id: 'm-shyambazar', name: 'Shyambazar', code: 'SYB', zone: 'north', sequence: 6, lat: 22.6001, lng: 88.3705, interchange: [] },
      { id: 'm-sovabazar', name: 'Sovabazar Sutanuti', code: 'SBZ', zone: 'north', sequence: 7, lat: 22.5925, lng: 88.3665, interchange: [] },
      { id: 'm-girishpark', name: 'Girish Park', code: 'GPK', zone: 'central', sequence: 8, lat: 22.5858, lng: 88.3601, interchange: [] },
      { id: 'm-mgroad', name: 'Mahatma Gandhi Road', code: 'MGD', zone: 'central', sequence: 9, lat: 22.5804, lng: 88.3591, interchange: [] },
      { id: 'm-central', name: 'Central', code: 'CEN', zone: 'central', sequence: 10, lat: 22.5694, lng: 88.3585, interchange: [] },
      { id: 'm-chandnichowk', name: 'Chandni Chowk', code: 'CCH', zone: 'central', sequence: 11, lat: 22.5645, lng: 88.3562, interchange: [] },
      { id: 'm-esplanade', name: 'Esplanade', code: 'ESP', zone: 'central', sequence: 12, lat: 22.5646, lng: 88.3517, interchange: ['Green Line', 'Purple Line (Prop)'] },
      { id: 'm-parkstreet', name: 'Park Street', code: 'PST', zone: 'south', sequence: 13, lat: 22.5532, lng: 88.3508, interchange: [] },
      { id: 'm-maidan', name: 'Maidan', code: 'MDN', zone: 'south', sequence: 14, lat: 22.5458, lng: 88.3498, interchange: [] },
      { id: 'm-rabindrasadan', name: 'Rabindra Sadan', code: 'RBS', zone: 'south', sequence: 15, lat: 22.5385, lng: 88.3489, interchange: [] },
      { id: 'm-netajibhavan', name: 'Netaji Bhavan', code: 'NBV', zone: 'south', sequence: 16, lat: 22.5312, lng: 88.3475, interchange: [] },
      { id: 'm-jatindaspark', name: 'Jatin Das Park', code: 'JDP', zone: 'south', sequence: 17, lat: 22.5255, lng: 88.3468, interchange: [] },
      { id: 'm-kalighat', name: 'Kalighat', code: 'KGT', zone: 'south', sequence: 18, lat: 22.5186, lng: 88.3462, interchange: [] },
      { id: 'm-rabindrasarobar', name: 'Rabindra Sarobar', code: 'RSR', zone: 'south', sequence: 19, lat: 22.5085, lng: 88.3460, interchange: ['Railway'] },
      { id: 'm-tollygunge', name: 'Mahanayak Uttam Kumar (Tollygunge)', code: 'TLG', zone: 'south', sequence: 20, lat: 22.4976, lng: 88.3458, interchange: [] },
      { id: 'm-netaji', name: 'Netaji (Kudghat)', code: 'NTJ', zone: 'south', sequence: 21, lat: 22.4862, lng: 88.3450, interchange: [] },
      { id: 'm-masterda', name: 'Masterda Surya Sen (Bansdroni)', code: 'MSS', zone: 'south', sequence: 22, lat: 22.4765, lng: 88.3551, interchange: [] },
      { id: 'm-gitanjali', name: 'Gitanjali (Naktala)', code: 'GTJ', zone: 'south', sequence: 23, lat: 22.4710, lng: 88.3695, interchange: [] },
      { id: 'm-kavinazrul', name: 'Kavi Nazrul (Garia)', code: 'KNZ', zone: 'south', sequence: 24, lat: 22.4655, lng: 88.3840, interchange: [] },
      { id: 'm-satyajitray', name: 'Shahid Satyajit Ray', code: 'SSR', zone: 'south', sequence: 25, lat: 22.4580, lng: 88.3965, interchange: [] },
      { id: 'm-kavisubhash', name: 'Kavi Subhash (New Garia)', code: 'KSB', zone: 'south', sequence: 26, lat: 22.4502, lng: 88.4020, interchange: ['Railway', 'Orange Line'] }
    ]
  },
  {
    id: 'green',
    name: 'Green Line (East-West Corridor)',
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #16a34a, #15803d)',
    stationsCount: 12,
    firstTrain: '07:00 AM',
    lastTrain: '09:45 PM',
    frequency: 'Every 8-10 mins',
    stations: [
      { id: 'm-howrahmaidan', name: 'Howrah Maidan', code: 'HMD', zone: 'howrah', sequence: 1, lat: 22.5850, lng: 88.3240, interchange: [] },
      { id: 'm-howrah', name: 'Howrah Station', code: 'HWH', zone: 'howrah', sequence: 2, lat: 22.5835, lng: 88.3425, interchange: ['Railway'] },
      { id: 'm-mahakaran', name: 'Mahakaran', code: 'MHK', zone: 'central', sequence: 3, lat: 22.5710, lng: 88.3480, interchange: [] },
      { id: 'm-esplanade-g', name: 'Esplanade', code: 'ESP-G', zone: 'central', sequence: 4, lat: 22.5646, lng: 88.3517, interchange: ['Blue Line'] },
      { id: 'm-sealdah-g', name: 'Sealdah', code: 'SDAH-G', zone: 'central', sequence: 5, lat: 22.5670, lng: 88.3710, interchange: ['Railway'] },
      { id: 'm-phoolbagan', name: 'Phoolbagan', code: 'PBG', zone: 'central', sequence: 6, lat: 22.5712, lng: 88.3902, interchange: [] },
      { id: 'm-saltlakestadium', name: 'Salt Lake Stadium', code: 'SLS', zone: 'saltlake', sequence: 7, lat: 22.5715, lng: 88.4055, interchange: [] },
      { id: 'm-bengalchemical', name: 'Bengal Chemical', code: 'BCM', zone: 'saltlake', sequence: 8, lat: 22.5750, lng: 88.4120, interchange: [] },
      { id: 'm-citycentre', name: 'City Centre', code: 'CC1', zone: 'saltlake', sequence: 9, lat: 22.5800, lng: 88.4160, interchange: [] },
      { id: 'm-centralpark', name: 'Central Park', code: 'CPK', zone: 'saltlake', sequence: 10, lat: 22.5840, lng: 88.4210, interchange: [] },
      { id: 'm-karunamoyee', name: 'Karunamoyee', code: 'KRN', zone: 'saltlake', sequence: 11, lat: 22.5875, lng: 88.4270, interchange: ['Bus Terminal'] },
      { id: 'm-sec5', name: 'Salt Lake Sector V', code: 'SV5', zone: 'saltlake', sequence: 12, lat: 22.5780, lng: 88.4350, interchange: [] }
    ]
  },
  {
    id: 'purple',
    name: 'Purple Line (Joka - Majerhat Corridor)',
    color: '#9333ea',
    gradient: 'linear-gradient(135deg, #9333ea, #7e22ce)',
    stationsCount: 6,
    firstTrain: '08:00 AM',
    lastTrain: '08:00 PM',
    frequency: 'Every 25 mins',
    stations: [
      { id: 'm-joka', name: 'Joka', code: 'JKA', zone: 'south', sequence: 1, lat: 22.4435, lng: 88.3045, interchange: [] },
      { id: 'm-thakurpukur', name: 'Thakurpukur', code: 'TKP', zone: 'south', sequence: 2, lat: 22.4632, lng: 88.3090, interchange: [] },
      { id: 'm-sakerbazar', name: 'Sakherbazar', code: 'SKB', zone: 'south', sequence: 3, lat: 22.4785, lng: 88.3120, interchange: [] },
      { id: 'm-behalachowrasta', name: 'Behala Chowrasta', code: 'BCR', zone: 'south', sequence: 4, lat: 22.4920, lng: 88.3175, interchange: [] },
      { id: 'm-behalabazar', name: 'Behala Bazar', code: 'BBZ', zone: 'south', sequence: 5, lat: 22.5030, lng: 88.3210, interchange: [] },
      { id: 'm-taratala', name: 'Taratala', code: 'TTL', zone: 'south', sequence: 6, lat: 22.5135, lng: 88.3245, interchange: [] },
      { id: 'm-majerhat', name: 'Majerhat', code: 'MJH', zone: 'south', sequence: 7, lat: 22.5240, lng: 88.3295, interchange: ['Railway'] }
    ]
  }
];

export const BUS_ROUTES = [
  {
    routeNo: 'S-9',
    operator: 'WBTC (CSTC)',
    type: 'AC Non-AC Deluxe',
    origin: 'Dunlop Crossing',
    destination: 'Jadavpur Bus Stand',
    stops: ['Dunlop', 'Rathtala', 'Kamarhati', 'Shyambazar', 'Girsh Park', 'Esplanade', 'Exide', 'Gariahat', 'Jadavpur'],
    timing: '05:30 AM - 10:45 PM',
    frequency: 'Every 10 mins',
    fareRange: '₹10 - ₹35',
    upFirst: '05:30 AM',
    upLast: '10:45 PM',
    downFirst: '06:00 AM',
    downLast: '11:00 PM',
    liveAvailable: true,
    liveBusId: 'WBTC-S9-104',
    lat: 22.6001,
    lng: 88.3705,
    speedKm: 28,
    status: 'RUNNING'
  },
  {
    routeNo: 'AC-1',
    operator: 'WBTC (Volvo)',
    type: 'Low Floor Air-Conditioned',
    origin: 'Howrah Station',
    destination: 'Kolkata Airport Gate 1',
    stops: ['Howrah Station', 'Tea Board', 'Esplanade', 'Park Street', 'Exide', 'Gariahat', 'Ultadanga', 'Airport'],
    timing: '06:00 AM - 10:00 PM',
    frequency: 'Every 15 mins',
    fareRange: '₹20 - ₹60',
    upFirst: '06:00 AM',
    upLast: '10:00 PM',
    downFirst: '06:30 AM',
    downLast: '10:30 PM',
    liveAvailable: true,
    liveBusId: 'WBTC-AC1-402',
    lat: 22.5835,
    lng: 88.3425,
    speedKm: 32,
    status: 'BOARDING'
  },
  {
    routeNo: 'AC-24',
    operator: 'WBTC',
    type: 'AC Express',
    origin: 'Howrah Station',
    destination: 'Garia Bus Depot',
    stops: ['Howrah Station', 'Esplanade', 'Sealdah', 'Salt Lake Karunamoyee', 'Science City', 'Ruby Hospital', 'Garia'],
    timing: '06:15 AM - 09:30 PM',
    frequency: 'Every 12 mins',
    fareRange: '₹15 - ₹45',
    upFirst: '06:15 AM',
    upLast: '09:30 PM',
    downFirst: '06:45 AM',
    downLast: '10:00 PM',
    liveAvailable: false,
    status: 'SCHEDULED'
  },
  {
    routeNo: 'SBSTC-EXP',
    operator: 'SBSTC',
    type: 'Intercity Express Bus',
    origin: 'Kolkata (Esplanade)',
    destination: 'Durgapur / Asansol',
    stops: ['Esplanade', 'Dankuni Plaza', 'Bardhaman Bypass', 'Panagarh', 'Durgapur City Centre', 'Asansol Bus Stand'],
    timing: '05:00 AM - 09:00 PM',
    frequency: 'Every 30 mins',
    fareRange: '₹140 - ₹280',
    upFirst: '05:00 AM',
    upLast: '09:00 PM',
    downFirst: '05:30 AM',
    downLast: '09:30 PM',
    liveAvailable: true,
    liveBusId: 'SBSTC-DGR-889',
    lat: 22.5646,
    lng: 88.3517,
    speedKm: 45,
    status: 'RUNNING'
  },
  {
    routeNo: 'NBSTC-NJP',
    operator: 'NBSTC',
    type: 'Super Deluxe Express',
    origin: 'Kolkata (Karunamoyee)',
    destination: 'Siliguri (Tenzing Norgay Bus Terminus)',
    stops: ['Karunamoyee', 'Barasat', 'Krishnanagar', 'Malda Town', 'Kishanganj', 'Siliguri'],
    timing: '06:00 PM - 08:30 PM (Overnight)',
    frequency: '3 Daily Departures',
    fareRange: '₹380 - ₹650',
    upFirst: '06:00 PM',
    upLast: '08:30 PM',
    downFirst: '06:00 PM',
    downLast: '08:30 PM',
    liveAvailable: false,
    status: 'SCHEDULED'
  },
  {
    routeNo: '230',
    operator: 'PRIVATE',
    type: 'Non-AC Standard City Bus',
    origin: 'Kamarhati',
    destination: 'Howrah Station',
    stops: ['Kamarhati', 'Dunlop', 'Shyambazar', 'Central Avenue', 'Howrah Bridge', 'Howrah Station'],
    timing: '05:00 AM - 10:30 PM',
    frequency: 'Every 5 mins',
    fareRange: '₹10 - ₹20',
    upFirst: '05:00 AM',
    upLast: '10:30 PM',
    downFirst: '05:30 AM',
    downLast: '11:00 PM',
    liveAvailable: false,
    status: 'SCHEDULED'
  }
];

// Helper to search Metro routes
export function calculateMetroRoute(fromStationId, toStationId) {
  let fromSt = null;
  let toSt = null;
  let fromLine = null;
  let toLine = null;

  METRO_LINES.forEach(line => {
    line.stations.forEach(st => {
      if (st.id === fromStationId || st.name.toLowerCase() === (fromStationId || '').toLowerCase()) {
        fromSt = st;
        fromLine = line;
      }
      if (st.id === toStationId || st.name.toLowerCase() === (toStationId || '').toLowerCase()) {
        toSt = st;
        toLine = line;
      }
    });
  });

  if (!fromSt || !toSt) return null;

  const sameLine = fromLine.id === toLine.id;
  const stationDiff = Math.abs(fromSt.sequence - toSt.sequence);
  const distanceKm = (sameLine ? stationDiff : stationDiff + 4) * 1.2;

  // Fare formula
  let fare = 5;
  if (distanceKm > 2 && distanceKm <= 5) fare = 10;
  else if (distanceKm > 5 && distanceKm <= 10) fare = 15;
  else if (distanceKm > 10 && distanceKm <= 15) fare = 20;
  else if (distanceKm > 15) fare = 25;

  const durationMins = Math.round(distanceKm * 2.2 + (sameLine ? 0 : 7));

  return {
    from: fromSt,
    to: toSt,
    fromLine,
    toLine,
    sameLine,
    interchangeStation: sameLine ? null : 'Esplanade (Blue Line ↔ Green Line)',
    distanceKm: distanceKm.toFixed(1),
    durationMins,
    fare,
    totalStations: sameLine ? stationDiff + 1 : stationDiff + 4
  };
}
