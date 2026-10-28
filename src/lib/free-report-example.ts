/* Example businesses and AI answers from Claude Design Files/Free Google Report.dc.html.
   Used by free-report-render.ts as the no-id demo and as fallbacks while a live
   report is still loading. Press/industry mention counts stay example-only.
   Live reports overlay the 3 Map Pack searches, weekly review bars, H2/alt, SSL, usability,
   directory ticks, and a 2×3 ChatGPT/Gemini matrix. Not used at build time. */

export type ExampleAuth = {
  bbb: boolean;
  chamber: boolean;
  apple: boolean;
  bing: boolean;
  yp: boolean;
  nextdoor: boolean;
  yelp: boolean;
  angi: boolean;
  homeadvisor: boolean;
  thumbtack: boolean;
  facebook: boolean;
  instagram: boolean;
  youtube: boolean;
  linkedin: boolean;
  press: number;
  industry: number;
};

export type ExampleUx = {
  phoneHeader: boolean;
  clickCall: boolean;
  ctaFold: boolean;
  form: boolean;
  reviewsHome: boolean;
  map: boolean;
};

export type ExampleBiz = {
  name: string;
  short: string;
  pack: number | null;
  packRanks?: (number | null)[];
  you: boolean;
  scores: { gbp: number; rev?: number; web: number; spd?: number; site?: number; ads: number; ai: number };
  rating: number;
  reviews: number;
  weeks: number[];
  years: number;
  cat: string;
  secondary: number;
  address: boolean;
  addrShort: string;
  desc: boolean;
  descUnknown?: boolean;
  description?: string;
  descKeyword?: boolean;
  descServices?: boolean;
  descLocations?: boolean;
  photos?: number;
  hours: boolean;
  book: boolean;
  phone: boolean;
  closes: string;
  url: string;
  site: string;
  title: string;
  titleKw: 'yes' | 'partial' | 'no';
  h1: string;
  h1Kw: boolean;
  metaDesc: string | null;
  h2Kw: number;
  altKw: number;
  schema: boolean;
  schemaTypes?: string[];
  sitemap: number;
  servicePages: number;
  locationPages: number;
  psi: number;
  lcp: number;
  rd: number;
  ssl: boolean;
  privacy: boolean;
  terms: boolean;
  lsa: number | null;
  searchAds: boolean;
  transparency: boolean;
  gpt: number | null;
  gem: number | null;
  cited: boolean;
  ux: ExampleUx;
  auth: ExampleAuth;
  grid: (number | null)[];
  photo: string;
};

const N_ = null;

export const EXAMPLE_BIZ: ExampleBiz[] = [
  {
    name: 'Small Jobs Electric, Inc.',
    short: 'Small Jobs Electric',
    pack: 1,
    packRanks: [1, 1, 2],
    you: false,
    scores: { gbp: 91, web: 83, ads: 55, ai: 12 },
    rating: 4.8,
    reviews: 2382,
    weeks: [9, 12, 11, 10, 9, 12, 10, 13, 8, 11, 10, 12],
    years: 15,
    cat: 'Electrician',
    secondary: 5,
    address: true,
    addrShort: 'Town ’N’ Country',
    desc: false,
    hours: true,
    book: true,
    phone: true,
    closes: 'Closes 6 PM',
    url: 'smalljobselectric.com',
    site: 'Small Jobs Electric',
    title: 'Home Electrical Repairs & Installations – Tampa Bay FL',
    titleKw: 'partial',
    h1: 'Tampa Bay’s Trusted Electrical Contractor',
    h1Kw: false,
    metaDesc:
      'Licensed Tampa Bay electrical contractor for repairs, panel upgrades, lighting & EV chargers. Same-day service. Call (813) 555-0142.',
    h2Kw: 4,
    altKw: 62,
    schema: true,
    sitemap: 200,
    servicePages: 6,
    locationPages: 0,
    psi: 57,
    lcp: 3452,
    rd: 2212,
    ssl: true,
    privacy: true,
    terms: false,
    lsa: null,
    searchAds: true,
    transparency: true,
    gpt: 2,
    gem: null,
    cited: false,
    ux: { phoneHeader: true, clickCall: true, ctaFold: true, form: true, reviewsHome: true, map: true },
    auth: {
      bbb: true,
      chamber: true,
      apple: true,
      bing: true,
      yp: true,
      nextdoor: true,
      yelp: true,
      angi: true,
      homeadvisor: true,
      thumbtack: false,
      facebook: true,
      instagram: true,
      youtube: true,
      linkedin: false,
      press: 6,
      industry: 4,
    },
    grid: [2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 4],
    photo: '/free-report/small-jobs.jpg',
  },
  {
    name: 'Mr. Electric of Tampa Bay',
    short: 'Mr. Electric',
    pack: 2,
    packRanks: [2, 3, 1],
    you: false,
    scores: { gbp: 87, web: 83, ads: 95, ai: 52 },
    rating: 4.9,
    reviews: 1099,
    weeks: [4, 6, 5, 5, 5, 6, 4, 7, 5, 6, 5, 4],
    years: 20,
    cat: 'Electrician',
    secondary: 4,
    address: true,
    addrShort: 'Carrollwood',
    desc: true,
    descKeyword: true,
    descServices: true,
    descLocations: true,
    hours: true,
    book: true,
    phone: true,
    closes: 'Open 24 hours',
    url: 'mrelectric.com/tampa-bay',
    site: 'Mr. Electric',
    title: 'Local Electricians in Tampa Bay | Mr. Electric',
    titleKw: 'yes',
    h1: 'Your Tampa Bay Electricians',
    h1Kw: true,
    metaDesc:
      'Mr. Electric of Tampa Bay provides licensed electricians for residential & commercial electrical repair, installation and upgrades. Call 24/7.',
    h2Kw: 6,
    altKw: 48,
    schema: true,
    sitemap: 200,
    servicePages: 0,
    locationPages: 6,
    psi: 30,
    lcp: 1798,
    rd: 6245,
    ssl: true,
    privacy: true,
    terms: true,
    lsa: 1,
    searchAds: true,
    transparency: true,
    gpt: 1,
    gem: 2,
    cited: false,
    ux: { phoneHeader: true, clickCall: true, ctaFold: true, form: true, reviewsHome: true, map: false },
    auth: {
      bbb: true,
      chamber: true,
      apple: true,
      bing: true,
      yp: true,
      nextdoor: true,
      yelp: true,
      angi: true,
      homeadvisor: true,
      thumbtack: true,
      facebook: true,
      instagram: true,
      youtube: true,
      linkedin: true,
      press: 12,
      industry: 9,
    },
    grid: [3, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 3, 2, 2, 3, 5, 4, 3, 3, 5, 6],
    photo: '/free-report/mr-electric.jpg',
  },
  {
    name: 'Brandon Electric',
    short: 'Brandon Electric',
    pack: 3,
    packRanks: [3, 2, 3],
    you: false,
    scores: { gbp: 81, web: 97, ads: 62, ai: 84 },
    rating: 4.8,
    reviews: 1480,
    weeks: [7, 8, 8, 7, 9, 6, 8, 7, 9, 8, 7, 8],
    years: 30,
    cat: 'Electrician',
    secondary: 6,
    address: true,
    addrShort: 'Brandon',
    desc: true,
    descKeyword: true,
    descServices: true,
    descLocations: true,
    hours: true,
    book: true,
    phone: true,
    closes: 'Closes 5 PM',
    url: 'brandonelectricinc.com',
    site: 'Brandon Electric',
    title: 'Tampa Electricians | Residential & Commercial | Brandon Electric',
    titleKw: 'yes',
    h1: 'Tampa’s Electricians Since 1993',
    h1Kw: true,
    metaDesc:
      'Brandon Electric: Tampa electricians since 1993. Residential & commercial wiring, panel upgrades, generators. Free estimates.',
    h2Kw: 5,
    altKw: 71,
    schema: true,
    sitemap: 200,
    servicePages: 6,
    locationPages: 0,
    psi: 70,
    lcp: 7502,
    rd: 2283,
    ssl: true,
    privacy: true,
    terms: true,
    lsa: 2,
    searchAds: false,
    transparency: true,
    gpt: 3,
    gem: 1,
    cited: true,
    ux: { phoneHeader: true, clickCall: true, ctaFold: true, form: true, reviewsHome: true, map: true },
    auth: {
      bbb: true,
      chamber: true,
      apple: true,
      bing: true,
      yp: true,
      nextdoor: false,
      yelp: true,
      angi: true,
      homeadvisor: false,
      thumbtack: false,
      facebook: true,
      instagram: true,
      youtube: false,
      linkedin: true,
      press: 3,
      industry: 5,
    },
    grid: [5, 4, 3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 3, 3, 3, 6, 4, 3, 3, 3, 7, 5, 4, 3, 3],
    photo: '/free-report/brandon-electric.jpg',
  },
  {
    name: 'Bayshore Home Services',
    short: 'Bayshore Home Services',
    pack: 4,
    packRanks: [4, 7, null],
    you: true,
    scores: { gbp: 52, web: 67, ads: 10, ai: 12 },
    rating: 5.0,
    reviews: 132,
    weeks: [1, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0],
    years: 7,
    cat: 'Electrician',
    secondary: 1,
    address: false,
    addrShort: 'Hidden',
    desc: false,
    hours: true,
    book: false,
    phone: true,
    closes: 'Closes 5 PM',
    url: 'bayshorehomeservices.com',
    site: 'Bayshore Home Services',
    title: 'Bayshore Home Services',
    titleKw: 'no',
    h1: 'Welcome to Our Website',
    h1Kw: false,
    metaDesc: null,
    h2Kw: 0,
    altKw: 0,
    schema: false,
    sitemap: 81,
    servicePages: 2,
    locationPages: 1,
    psi: 98,
    lcp: 2330,
    rd: 120,
    ssl: true,
    privacy: false,
    terms: false,
    lsa: null,
    searchAds: false,
    transparency: false,
    gpt: null,
    gem: null,
    cited: false,
    ux: { phoneHeader: false, clickCall: false, ctaFold: false, form: true, reviewsHome: false, map: false },
    auth: {
      bbb: false,
      chamber: false,
      apple: false,
      bing: false,
      yp: true,
      nextdoor: false,
      yelp: true,
      angi: false,
      homeadvisor: false,
      thumbtack: true,
      facebook: true,
      instagram: false,
      youtube: false,
      linkedin: false,
      press: 0,
      industry: 0,
    },
    grid: [N_, N_, N_, N_, N_, N_, 9, 8, 9, N_, N_, 7, 4, 6, N_, N_, 9, 7, 8, N_, N_, N_, N_, N_, N_],
    photo: '/free-report/bayshore.jpg',
  },
];

export const EXAMPLE_META = {
  keyword: 'electrician',
  kwPlural: 'electricians',
  city: 'Tampa, FL',
  generated: 'Oct 21, 2026',
};

/** The three phones on the example Map Pack section (matches the redesign). */
export const EXAMPLE_PACK_SEARCHES = [
  {
    kind: 'near-me' as const,
    query: 'electrician near me',
    results: [
      { name: 'Small Jobs Electric, Inc.', position: 1, rating: 4.8, reviewCount: 2382, yearsInBusiness: 15 },
      { name: 'Mr. Electric of Tampa Bay', position: 2, rating: 4.9, reviewCount: 1099, yearsInBusiness: 20 },
      { name: 'Brandon Electric', position: 3, rating: 4.8, reviewCount: 1480, yearsInBusiness: 30 },
      { name: 'Bayshore Home Services', position: 4, rating: 5.0, reviewCount: 132 },
    ],
  },
  {
    kind: 'city' as const,
    query: 'electrician tampa fl',
    results: [
      { name: 'Small Jobs Electric, Inc.', position: 1, rating: 4.8, reviewCount: 2382 },
      { name: 'Brandon Electric', position: 2, rating: 4.8, reviewCount: 1480 },
      { name: 'Mr. Electric of Tampa Bay', position: 3, rating: 4.9, reviewCount: 1099 },
      { name: 'Bayshore Home Services', position: 7, rating: 5.0, reviewCount: 132 },
    ],
  },
  {
    kind: 'emergency' as const,
    query: 'emergency electrician tampa',
    results: [
      { name: 'Mr. Electric of Tampa Bay', position: 1, rating: 4.9, reviewCount: 1099 },
      { name: 'Small Jobs Electric, Inc.', position: 2, rating: 4.8, reviewCount: 2382 },
      { name: 'Brandon Electric', position: 3, rating: 4.8, reviewCount: 1480 },
    ],
  },
];

export const EXAMPLE_AI_QUESTIONS = [
  'best electrician in Tampa, FL',
  'electrician near me in Tampa for a panel upgrade',
  'who do I call for an emergency electrician in Tampa?',
];

export const EXAMPLE_AI_PLATFORMS = [
  { id: 'gpt', name: 'ChatGPT', logo: 'GPT', bg: '#10a37f', cites: false as const },
  { id: 'gem', name: 'Gemini', logo: 'G', bg: '#4285f4', cites: 'B' as const },
];

/** S/M/B = pack #1/#2/#3, Y = subject. Example shortlist order per question × platform. */
export const EXAMPLE_AI_MATRIX: string[][][] = [
  [['M', 'S', 'B'], ['B', 'M']],
  [['M', 'B'], ['B', 'M', 'S']],
  [['M', 'S'], ['M', 'B']],
];

export const EXAMPLE_BLURB: Record<string, string> = {
  'Small Jobs Electric, Inc.':
    'praised for fast residential repairs and transparent pricing, with thousands of 4.8-star reviews.',
  'Mr. Electric of Tampa Bay':
    'licensed, available 24/7, and consistently rated 4.9 stars for residential and commercial work.',
  'Brandon Electric':
    'family-owned since 1993, known for panel upgrades and generator installs across Tampa.',
};

export const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/booking/Tp6doLoKjJfMEvnKPOn1';
