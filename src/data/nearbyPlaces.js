// Verified Nearby Places & Facilities Data across Kolkata Zones
export const NEARBY_CATEGORIES = [
  { id: 'restaurant', name: 'Restaurants & Food', icon: '🍴' },
  { id: 'hotel', name: 'Hotels & Lodging (OYO/Stay)', icon: '🏨' },
  { id: 'pub', name: 'Pubs & Bars', icon: '🍺' },
  { id: 'metro', name: 'Metro Stations', icon: '🚇' },
  { id: 'train', name: 'Railway Stations', icon: '🚆' },
  { id: 'bus', name: 'Bus Stops', icon: '🚌' },
  { id: 'hospital', name: 'Hospitals & Emergency', icon: '🏥' },
  { id: 'police', name: 'Police Help Desk', icon: '👮' },
  { id: 'pharmacy', name: 'Pharmacies', icon: '💊' },
  { id: 'atm', name: 'ATMs', icon: '🏧' },
  { id: 'toilet', name: 'Public Toilets', icon: '🚻' },
  { id: 'parking', name: 'Official Parking Lots', icon: '🅿️' }
];

export const NEARBY_PLACES_DATA = [
  // RESTAURANTS & CAFES
  {
    id: 'rest-1',
    category: 'restaurant',
    name: 'Arsalan Restaurant - Park Circus',
    address: '7 Point Crossing, Park Circus, Kolkata - 700017',
    coords: { lat: 22.5442, lng: 88.3654 },
    rating: 4.8,
    cuisine: 'Kolkata Biryani, Mughlai, Kebabs',
    pricing: '₹600 for two',
    timing: '11:00 AM - 12:00 AM',
    phone: '033-22894444',
    verified: true,
    source: 'Verified Partner Business'
  },
  {
    id: 'rest-2',
    category: 'restaurant',
    name: '6 Ballygunge Place',
    address: '6, Ballygunge Place, Kolkata - 700019',
    coords: { lat: 22.5268, lng: 88.3642 },
    rating: 4.9,
    cuisine: 'Authentic Bengali Thali, Kosha Mangsho, Daab Chingri',
    pricing: '₹1200 for two',
    timing: '12:00 PM - 10:30 PM',
    phone: '033-24603922',
    verified: true,
    source: 'Verified Business Directory'
  },
  {
    id: 'rest-3',
    category: 'restaurant',
    name: 'Mitra Cafe - Sovabazar',
    address: '47, Central Avenue, Sovabazar Metro Gate 1, Kolkata - 700005',
    coords: { lat: 22.5972, lng: 88.3631 },
    rating: 4.85,
    cuisine: 'Brain Chop, Fish Diamond Fry, Mutton Kabiraji',
    pricing: '₹350 for two',
    timing: '5:00 PM - 10:00 PM',
    phone: '09830342345',
    verified: true,
    source: 'Heritage Food Guild'
  },

  // HOTELS / OYO / LODGING
  {
    id: 'hotel-1',
    category: 'hotel',
    name: 'The Oberoi Grand Kolkata',
    address: '15, Jawaharlal Nehru Road, Esplanade, Kolkata - 700013',
    coords: { lat: 22.5608, lng: 88.3518 },
    rating: 4.9,
    pricing: '₹9,500 / night',
    amenities: ['5-Star', 'Pool', 'Free WiFi', 'Valet Parking'],
    verified: true,
    source: 'Official Hotel Guild'
  },
  {
    id: 'hotel-2',
    category: 'hotel',
    name: 'Townhouse Express OYO - Gariahat',
    address: 'Rashbehari Avenue, Gariahat Crossing, Kolkata - 700029',
    coords: { lat: 22.5192, lng: 88.3668 },
    rating: 4.4,
    pricing: '₹1,800 / night',
    amenities: ['AC', 'Free WiFi', '24h Checkin'],
    verified: true,
    source: 'OYO Licensed Feed'
  },

  // METRO STATIONS
  {
    id: 'metro-shyambazar',
    category: 'metro',
    name: 'Shyambazar Metro Station (Blue Line)',
    address: 'Shyambazar 5-Point Crossing, Kolkata',
    coords: { lat: 22.6002, lng: 88.3698 },
    line: 'Blue Line (Kavi Subhash ↔ Dakshineswar)',
    firstTrain: '06:45 AM',
    lastTrain: '09:45 PM (Extended to 12:00 AM on Saptami-Navami)',
    verified: true,
    source: 'Kolkata Metro Railway Authority'
  },
  {
    id: 'metro-kalighat',
    category: 'metro',
    name: 'Kalighat Metro Station (Blue Line)',
    address: 'SP Mukherjee Road, Kalighat Crossing, Kolkata',
    coords: { lat: 22.5215, lng: 88.3498 },
    line: 'Blue Line (Kavi Subhash ↔ Dakshineswar)',
    firstTrain: '06:45 AM',
    lastTrain: '12:00 AM (Puja Night Special)',
    verified: true,
    source: 'Kolkata Metro Railway Authority'
  },
  {
    id: 'metro-sealdah',
    category: 'metro',
    name: 'Sealdah Metro Station (Green Line)',
    address: 'Sealdah Railway Complex, Kolkata',
    coords: { lat: 22.5678, lng: 88.3712 },
    line: 'Green Line (Howrah Maidan ↔ Salt Lake Sector V)',
    firstTrain: '07:00 AM',
    lastTrain: '10:00 PM',
    verified: true,
    source: 'Metro Railway Kolkata'
  },

  // HOSPITALS & EMERGENCY
  {
    id: 'hosp-1',
    category: 'hospital',
    name: 'SSKM / PG Hospital (Government Emergency)',
    address: '244, AJC Bose Road, Near Rabindra Sadan, Kolkata - 700020',
    coords: { lat: 22.5392, lng: 88.3448 },
    phone: '033-22231589 / 102 (Ambulance)',
    emergency24x7: true,
    verified: true,
    source: 'WB Health Department'
  },
  {
    id: 'hosp-2',
    category: 'hospital',
    name: 'RG Kar Medical College & Hospital',
    address: '1, Khudiram Bose Sarani, Belgachia, Kolkata - 700004',
    coords: { lat: 22.6045, lng: 88.3752 },
    phone: '033-25557675 / 102',
    emergency24x7: true,
    verified: true,
    source: 'WB Health Department'
  },

  // POLICE HELP DESK
  {
    id: 'police-1',
    category: 'police',
    name: 'Kolkata Police Headquarters & Control Room',
    address: '18, Lalbazar Street, Kolkata - 700001',
    coords: { lat: 22.5718, lng: 88.3512 },
    phone: '100 / 033-22143230 / 1090 (Senior Citizen)',
    verified: true,
    source: 'Kolkata Police Official'
  },
  {
    id: 'police-2',
    category: 'police',
    name: 'Women & Child Safety Helpline Kolkata',
    address: 'Lalbazar / Dial 1091 Direct',
    coords: { lat: 22.5700, lng: 88.3500 },
    phone: '1091 / 112',
    verified: true,
    source: 'National Emergency Response System'
  }
];
