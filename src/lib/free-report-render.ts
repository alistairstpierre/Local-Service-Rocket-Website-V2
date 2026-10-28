/* Builds the Free Google Report HTML from PublicReport JSON plus the design
   example dataset. Used only by /free-report/view.astro after the Railway
   poll succeeds. Overall shop rankings stay hidden until every section is
   ready. The Profile line-by-line board stays hidden until About and photo
   counts are loaded for every shop. Layout matches
   the Map Pack redesign (3 phone searches) plus the rest of
   Claude Design Files/Free Google Report.dc.html. */

import {
  aiHeadlineCopy,
  aiTier,
  aiWhyCopy,
  closerCopy,
  gapsHeadingCopy,
  heroCopy,
  mapCtaCopy,
  packHeadlineCopy,
  packTier,
  packWhyCopy,
  siteTier,
  webHeadlineCopy,
  webWhyCopy,
} from './free-report-copy';
import {
  BOOKING_URL,
  EXAMPLE_AI_MATRIX,
  EXAMPLE_AI_PLATFORMS,
  EXAMPLE_AI_QUESTIONS,
  EXAMPLE_BIZ,
  EXAMPLE_BLURB,
  EXAMPLE_META,
  EXAMPLE_PACK_SEARCHES,
  type ExampleAuth,
  type ExampleBiz,
} from './free-report-example';

export type PublicReportBusiness = {
  name: string;
  isSubject: boolean;
  packPosition?: number;
  packRanks?: (number | null)[];
  scores: {
    gbp: number;
    reviews?: number;
    website: number;
    speed?: number;
    site?: number;
    ads: number;
    ai: number;
    overall: number;
  };
  gbp: {
    rating?: number;
    reviewCount: number;
    reviewsLastWeek?: number;
    reviewsLastMonth?: number;
    reviewsLast3Months?: number;
    reviewsLast6Months?: number;
    hasDescription: boolean;
    description?: string;
    descriptionFit?: { keyword: boolean; services: boolean; locations: boolean };
    descriptionUnknown?: boolean;
    gbpInfoLoaded?: boolean;
    hasPhone: boolean;
    hasWebsite: boolean;
    hasHours: boolean;
    hasBookOnline: boolean;
    hasAddressListed?: boolean;
    address?: string;
    yearsInBusiness?: number;
    category?: string;
    secondaryCategoryCount?: number;
    websiteUrl?: string;
    socialProfiles?: string[];
    webReviewSources?: string[];
    photoUrl?: string;
    photoCount?: number;
    reviewWeeks?: number[];
    packRanks?: (number | null)[];
    packGrid?: (number | null)[];
  };
  website?: {
    rootUrl: string;
    metaTitle?: string;
    metaDescription?: string;
    h1?: string;
    h1ContainsKeyword?: boolean;
    h2KeywordCount?: number;
    altKeywordPercent?: number;
    ssl?: boolean;
    phoneFound: boolean;
    schemaTypes: string[];
    sitemapPages: number;
    servicePages: number;
    locationPages: number;
    hasPrivacyPolicy: boolean;
    hasTermsOfService: boolean;
    reviewsOnHomepage?: boolean;
    hasMapEmbed?: boolean;
    listedOnBBB?: boolean;
    authoritativeSources?: { site: string; found: boolean }[];
    referringDomains?: number;
    totalBacklinks?: number;
    performanceScore?: number;
    lcpMs?: number;
    ux?: {
      phoneInHeader?: boolean;
      tapToCall?: boolean;
      ctaAboveFold?: boolean;
      hasForm?: boolean;
    };
  };
  ads?: {
    inLsa: boolean;
    lsaPosition?: number;
    lsaCompetitorCount?: number;
    runningSearchAds: boolean;
    afterHours?: boolean;
    fromLocation?: boolean;
    locationLabel?: string;
    advertiserFound?: boolean;
    advertiserLastSeen?: string;
    searchAd?: { title?: string; description?: string; url?: string };
  };
  ai?: {
    query?: string;
    mentioned: boolean;
    mentionCount?: number;
    chatGptMentioned?: boolean;
    geminiMentioned?: boolean;
    chatGptPosition?: number;
    geminiPosition?: number;
    cited?: boolean;
    citeCount?: number;
  };
};

export type PublicPackResult = {
  name: string;
  placeId?: string;
  position: number;
  rating?: number;
  reviewCount?: number;
  yearsInBusiness?: number;
  address?: string;
};

export type PublicPackSearch = {
  kind: 'near-me' | 'city' | 'emergency';
  query: string;
  results: PublicPackResult[];
};

export type PublicAiSearch = {
  questions: string[];
  platforms: ('chatgpt' | 'gemini')[];
  matrix: string[][][];
  answers: { question: string; platform: 'chatgpt' | 'gemini'; text: string }[];
  runs?: number;
};

/** Empty report so mergeReport uses EXAMPLE_BIZ. */
export function examplePublicReport(): PublicReport {
  return {
    subjectName: EXAMPLE_BIZ.find((b) => b.you)?.name || 'Your shop',
    city: EXAMPLE_META.city,
    keyword: EXAMPLE_META.keyword,
    primaryCategory: 'Electrician',
    overallScore: 0,
    pillars: { gbp: 0, reviews: 0, website: 0, ads: 0, ai: 0 },
    businesses: [],
    gaps: [],
    cta: { href: '/growth-audit', label: 'See how we close these gaps' },
    generatedAt: new Date().toISOString(),
    mapImageUrl: '/free-report/map.jpg',
    packSearches: EXAMPLE_PACK_SEARCHES,
  };
}

/** First-paint shell while the API job is still queued. Used by view.astro. */
export function loadingPublicReport(subjectName: string, city: string): PublicReport {
  return {
    subjectName: subjectName || 'Your shop',
    city: city || '',
    keyword: 'electrician',
    primaryCategory: 'Electrician',
    overallScore: 0,
    pillars: { gbp: 0, reviews: 0, website: 0, ads: 0, ai: 0 },
    businesses: [],
    gaps: [],
    cta: { href: '/growth-audit', label: 'See how we close these gaps' },
    generatedAt: new Date().toISOString(),
    stage: 'queued',
    ready: { hero: false, pack: false, website: false, ads: false, ai: false },
  };
}

export type PublicReport = {
  subjectName: string;
  city: string;
  keyword: string;
  primaryCategory?: string;
  keywordSource?: string;
  overallScore: number;
  pillars: { gbp: number; reviews?: number; website: number; ads: number; ai?: number };
  businesses: PublicReportBusiness[];
  aiSearch?: PublicAiSearch;
  gaps: string[];
  cta: { href: string; label: string };
  generatedAt?: string;
  /** One static map of the shop pin, reused on the Map Pack phones. */
  mapImageUrl?: string;
  /** Miles from the shop pin to each edge of that square map. */
  mapHalfMiles?: number;
  /** The three Map Pack searches shown as phones. */
  packSearches?: PublicPackSearch[];
  /** Edge length of packGrid (5 = 0 / 1 / 3 mile rings). Old reports only. */
  gridSize?: number;
  /** Miles for each Chebyshev ring, index 0 = the shop pin. Old reports only. */
  gridRingMiles?: number[];
  stage?: 'queued' | 'profile' | 'pack' | 'website' | 'ads' | 'ai' | 'complete';
  ready?: {
    hero: boolean;
    pack: boolean;
    website: boolean;
    ads: boolean;
    ai: boolean;
  };
};

export type ReportReady = NonNullable<PublicReport['ready']>;

const EMPTY_WEEKS = [0, 0, 0, 0, 0, 0, 0, 0];
const EMPTY_GRID = Array.from({ length: 25 }, () => null as number | null);

const OR = '#e8590c';
const INK = '#1a1a1a';
const Y = '#1b8a4b';
const N = '#d1402f';
const A = '#b7791f';
const TINT = '#fff7f1';
const WEEKS_N = 8;

function esc(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function shortName(name: string): string {
  const trimmed = name.split(',')[0]?.trim() || name;
  return trimmed.length > 24 ? `${trimmed.slice(0, 22)}…` : trimmed;
}

function hostOf(url?: string): string {
  if (!url) return '';
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] ?? url;
  }
}

function keywordRoots(keyword: string): string[] {
  const k = keyword.toLowerCase().trim();
  const roots = new Set([k]);
  if (k.endsWith('ians')) roots.add(k.slice(0, -1));
  if (k.endsWith('ian')) roots.add(k.slice(0, -3));
  if (k.endsWith('ers')) roots.add(k.slice(0, -1));
  if (k.endsWith('er')) roots.add(k.slice(0, -2));
  if (k.endsWith('ing')) roots.add(k.slice(0, -3));
  return [...roots].filter((r) => r.length >= 4);
}

function titleKwOf(title: string, keyword: string): 'yes' | 'partial' | 'no' {
  const lower = title.toLowerCase();
  const roots = keywordRoots(keyword);
  if (lower.includes(keyword.toLowerCase())) return 'yes';
  if (roots.some((r) => r !== keyword.toLowerCase() && lower.includes(r))) return 'partial';
  return 'no';
}

function nameKeywordFit(name: string, keyword: string): 'yes' | 'weak' | 'no' {
  const text = name.toLowerCase();
  const kw = keyword.toLowerCase().trim();
  if (!kw) return 'no';
  if (new RegExp(`\\b${escapeRegExp(kw)}s?\\b`).test(text)) return 'yes';
  const stems = keywordRoots(kw).filter((r) => r !== kw && r !== `${kw}s`);
  if (stems.some((r) => new RegExp(`\\b${escapeRegExp(r)}(?:al)?\\b`).test(text))) return 'weak';
  return 'no';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Real profile URL, not a bare host like "yelp.com". */
function hasListing(list: string[] | undefined, needle: string): boolean {
  return (list ?? []).some((item) => {
    const raw = item.trim();
    if (!raw.toLowerCase().includes(needle)) return false;
    try {
      const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
      return url.pathname.replace(/\/+$/, '').length > 0;
    } catch {
      return false;
    }
  });
}

function namesRoughlyMatch(a: string, b: string): boolean {
  const n = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const x = n(a);
  const y = n(b);
  return Boolean(x && y && (x === y || x.includes(y) || y.includes(x)));
}

function overlayAuth(example: ExampleAuth, live: PublicReportBusiness, ready?: ReportReady): ExampleAuth {
  const socials = live.gbp.socialProfiles;
  const reviews = live.gbp.webReviewSources;
  const sources = live.website?.authoritativeSources;
  const listed = (needle: string) => sources?.find((s) => s.site.includes(needle))?.found;
  const siteOn = !ready || ready.website;
  const heroOn = !ready || ready.hero;
  const blank: ExampleAuth = {
    bbb: false,
    chamber: false,
    apple: false,
    bing: false,
    yp: false,
    nextdoor: false,
    yelp: false,
    angi: false,
    homeadvisor: false,
    thumbtack: false,
    facebook: false,
    instagram: false,
    youtube: false,
    linkedin: false,
    press: 0,
    industry: 0,
  };
  const base = siteOn || heroOn ? example : blank;
  return {
    ...base,
    bbb: Boolean(live.website?.listedOnBBB || hasListing(reviews, 'bbb') || listed('bbb')),
    chamber: Boolean(listed('chamber') || hasListing(reviews, 'chamber') || hasListing(socials, 'chamber')),
    apple: Boolean(listed('apple')),
    bing: Boolean(listed('bing')),
    yp: Boolean(listed('yellowpages')),
    nextdoor: Boolean(listed('nextdoor')),
    facebook: socials ? hasListing(socials, 'facebook.com') : heroOn ? example.facebook : false,
    instagram: socials ? hasListing(socials, 'instagram.com') : heroOn ? example.instagram : false,
    youtube: socials ? hasListing(socials, 'youtube.com') : heroOn ? example.youtube : false,
    linkedin: socials ? hasListing(socials, 'linkedin.com') : heroOn ? example.linkedin : false,
    yelp: Boolean(listed('yelp') || hasListing(reviews, 'yelp')),
    angi: Boolean(listed('angi') || hasListing(reviews, 'angi')),
    homeadvisor: Boolean(listed('homeadvisor') || hasListing(reviews, 'homeadvisor')),
    thumbtack: Boolean(listed('thumbtack') || hasListing(reviews, 'thumbtack')),
    press: 0,
    industry: 0,
  };
}

const SERVICE_WORDS = [
  'panel',
  'generator',
  'ev charger',
  'ev charging',
  'charger',
  'lighting',
  'wiring',
  'outlet',
  'repair',
  'install',
  'inspection',
  'commercial',
  'residential',
  'emergency',
  'rewire',
  'ceiling fan',
  'surge',
  'troubleshoot',
  'upgrade',
  'new construction',
  'whole home',
];

function gradeDescription(
  text: string | undefined,
  keyword: string,
  city: string
): { keyword: boolean; services: boolean; locations: boolean } {
  if (!text) return { keyword: false, services: false, locations: false };
  const t = text.toLowerCase();
  const kw = keyword.toLowerCase().trim();
  const hasKeyword = Boolean(kw) && new RegExp(`\\b${escapeRegExp(kw)}s?\\b`).test(t);
  const hasServices = SERVICE_WORDS.some((word) => t.includes(word));
  const cityParts = city
    .toLowerCase()
    .split(/[,\s/]+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 3 && !['and', 'the'].includes(part));
  const hasCity = cityParts.some((part) => t.includes(part));
  const hasServing = /\b(serving|service area|communities|surrounding|greater|metro)\b/.test(t);
  return { keyword: hasKeyword, services: hasServices, locations: hasCity || hasServing };
}

function overlayBiz(
  example: ExampleBiz,
  live: PublicReportBusiness,
  keyword: string,
  city: string,
  ready?: ReportReady
): ExampleBiz {
  const siteOn = !ready || ready.website;
  const adsOn = !ready || ready.ads;
  const aiOn = !ready || ready.ai;
  const packOn = !ready || ready.pack;
  const heroOn = !ready || ready.hero;
  const title = live.website?.metaTitle ?? (siteOn ? example.title : live.name);
  const url = hostOf(live.website?.rootUrl || live.gbp.websiteUrl) || (siteOn ? example.url : '');
  const fit =
    live.gbp.descriptionFit ??
    (live.gbp.description ? gradeDescription(live.gbp.description, keyword, city) : undefined);
  return {
    ...example,
    name: live.name,
    short: shortName(live.name),
    pack: live.packPosition ?? null,
    packRanks: live.packRanks?.length === 3 ? live.packRanks : live.gbp.packRanks,
    you: live.isSubject,
    scores: {
      gbp: live.scores.gbp,
      rev: live.scores.reviews,
      web: siteOn ? live.scores.website : 0,
      spd: siteOn ? live.scores.speed : 0,
      site: siteOn ? live.scores.site : 0,
      ads: adsOn ? live.scores.ads : 0,
      ai: aiOn ? live.scores.ai : 0,
    },
    rating: live.gbp.rating ?? (heroOn ? example.rating : 0),
    reviews: live.gbp.reviewCount,
    weeks: live.gbp.reviewWeeks?.length === 8 ? live.gbp.reviewWeeks : heroOn ? example.weeks : EMPTY_WEEKS,
    cat: live.gbp.category ?? (heroOn ? example.cat : ''),
    secondary: live.gbp.secondaryCategoryCount ?? (heroOn ? example.secondary : 0),
    address: live.gbp.hasAddressListed ?? (heroOn ? example.address : false),
    addrShort: live.gbp.address ?? (live.gbp.hasAddressListed === false ? 'Hidden' : heroOn ? example.addrShort : '…'),
    desc: live.gbp.hasDescription,
    descUnknown:
      !heroOn ||
      (!live.gbp.hasDescription &&
        live.gbp.gbpInfoLoaded !== true &&
        Boolean(ready) &&
        !(ready && ready.pack && ready.website && ready.ai)),
    description: live.gbp.description,
    descKeyword: fit?.keyword,
    descServices: fit?.services,
    descLocations: fit?.locations,
    photos: live.gbp.photoCount ?? (heroOn && !ready ? example.photos : 0),
    hours: live.gbp.hasHours,
    book: live.gbp.hasBookOnline,
    phone: live.gbp.hasPhone,
    years: live.gbp.yearsInBusiness ?? (heroOn && !ready ? example.years : 0),
    photo: live.gbp.photoUrl || (heroOn && !ready ? example.photo : ''),
    grid: live.gbp.packGrid?.length === 25 ? live.gbp.packGrid : packOn && !ready ? example.grid : EMPTY_GRID,
    url,
    site: shortName(live.name),
    title,
    titleKw: titleKwOf(title, keyword),
    h1: live.website?.h1 ?? (siteOn ? example.h1 : '…'),
    h1Kw: live.website?.h1ContainsKeyword ?? (siteOn ? example.h1Kw : false),
    metaDesc: live.website?.metaDescription ?? (siteOn ? example.metaDesc : null),
    h2Kw: live.website ? (live.website.h2KeywordCount ?? 0) : siteOn ? example.h2Kw : 0,
    altKw: live.website ? (live.website.altKeywordPercent ?? 0) : siteOn ? example.altKw : 0,
    ssl: live.website ? (live.website.ssl ?? live.website.rootUrl.startsWith('https')) : siteOn ? example.ssl : true,
    schema: (live.website?.schemaTypes.length ?? 0) > 0,
    schemaTypes: live.website?.schemaTypes ?? [],
    sitemap: live.website?.sitemapPages ?? (siteOn ? example.sitemap : 0),
    servicePages: live.website?.servicePages ?? (siteOn ? example.servicePages : 0),
    locationPages: live.website?.locationPages ?? (siteOn ? example.locationPages : 0),
    psi: live.website?.performanceScore ?? (siteOn ? example.psi : 0),
    lcp: live.website?.lcpMs ?? (siteOn ? example.lcp : 0),
    rd: live.website?.referringDomains ?? (siteOn ? example.rd : 0),
    privacy: live.website?.hasPrivacyPolicy ?? (siteOn ? example.privacy : false),
    terms: live.website?.hasTermsOfService ?? (siteOn ? example.terms : false),
    lsa: adsOn ? live.ads?.lsaPosition ?? (live.ads?.inLsa ? 1 : null) : null,
    searchAds: adsOn ? (live.ads?.runningSearchAds ?? false) : false,
    transparency: adsOn ? (live.ads?.advertiserFound ?? false) : false,
    gpt: aiOn ? live.ai?.chatGptPosition ?? (live.ai?.chatGptMentioned ? 1 : null) : null,
    gem: aiOn ? live.ai?.geminiPosition ?? (live.ai?.geminiMentioned ? 1 : null) : null,
    cited: aiOn ? (live.ai?.cited ?? false) : false,
    ux: {
      phoneHeader: live.website?.ux?.phoneInHeader ?? (siteOn ? example.ux.phoneHeader : false),
      clickCall: live.website?.ux?.tapToCall ?? (siteOn ? example.ux.clickCall : false),
      ctaFold: live.website?.ux?.ctaAboveFold ?? (siteOn ? example.ux.ctaFold : false),
      form: live.website?.ux?.hasForm ?? (siteOn ? example.ux.form : false),
      reviewsHome: live.website?.reviewsOnHomepage ?? (siteOn ? example.ux.reviewsHome : false),
      map: live.website?.hasMapEmbed ?? (siteOn ? example.ux.map : false),
    },
    auth: overlayAuth(example.auth, live, ready),
  };
}

function ghostBiz(name: string, pack: number | null, you = false): ExampleBiz {
  const example = EXAMPLE_BIZ.find((b) => b.you)!;
  return {
    ...example,
    name,
    short: shortName(name),
    pack,
    packRanks: [null, null, null],
    you,
    scores: { gbp: 0, rev: 0, web: 0, spd: 0, site: 0, ads: 0, ai: 0 },
    rating: 0,
    reviews: 0,
    weeks: EMPTY_WEEKS,
    years: 0,
    cat: '',
    secondary: 0,
    address: false,
    addrShort: '…',
    desc: false,
    hours: false,
    book: false,
    phone: false,
    photo: '',
    grid: EMPTY_GRID,
    url: '',
    site: shortName(name),
    title: name,
    titleKw: 'no',
    h1: '…',
    h1Kw: false,
    metaDesc: null,
    h2Kw: 0,
    altKw: 0,
    schema: false,
    schemaTypes: [],
    sitemap: 0,
    servicePages: 0,
    locationPages: 0,
    psi: 0,
    lcp: 0,
    rd: 0,
    ssl: true,
    privacy: false,
    terms: false,
    lsa: null,
    searchAds: false,
    transparency: false,
    gpt: null,
    gem: null,
    cited: false,
    ux: { phoneHeader: false, clickCall: false, ctaFold: false, form: false, reviewsHome: false, map: false },
    auth: {
      bbb: false,
      chamber: false,
      apple: false,
      bing: false,
      yp: false,
      nextdoor: false,
      yelp: false,
      angi: false,
      homeadvisor: false,
      thumbtack: false,
      facebook: false,
      instagram: false,
      youtube: false,
      linkedin: false,
      press: 0,
      industry: 0,
    },
  };
}

/** Profile line-by-line waits for DataForSEO About + photo counts. */
export function profileBoardReady(report: PublicReport): boolean {
  const ready = report.ready;
  if (!ready) return true;
  if (ready.hero && ready.pack && ready.website && ready.ai) return true;
  if (!ready.hero || report.businesses.length === 0) return false;
  return report.businesses.every((b) => b.gbp.gbpInfoLoaded === true);
}

function mergeReport(report: PublicReport): {
  biz: ExampleBiz[];
  keyword: string;
  marketQuery: string;
  city: string;
  generated: string;
  liveGaps: string[];
  mapImageUrl?: string;
  mapHalfMiles?: number;
  packSearches?: PublicPackSearch[];
  ready?: ReportReady;
} {
  const marketQuery = report.keyword || EXAMPLE_META.keyword;
  const keyword = report.primaryCategory || marketQuery;
  const city = report.city || EXAMPLE_META.city;
  const generated = report.generatedAt
    ? new Date(report.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : EXAMPLE_META.generated;
  const ready = report.ready;
  const streaming = Boolean(ready);

  const liveRivals = report.businesses
    .filter((b) => !b.isSubject)
    .sort((a, b) => (a.packPosition ?? 99) - (b.packPosition ?? 99));
  const liveYou = report.businesses.find((b) => b.isSubject);
  const exampleRivals = EXAMPLE_BIZ.filter((b) => !b.you);
  const exampleYou = EXAMPLE_BIZ.find((b) => b.you)!;

  const packPending = Boolean(ready && !ready.pack);
  const rivals = liveRivals.length
    ? liveRivals.slice(0, 3).map((live, i) =>
        overlayBiz(exampleRivals[i] ?? exampleRivals[0]!, live, keyword, city, ready)
      )
    : packPending
      ? [ghostBiz('Looking up #1', 1), ghostBiz('Looking up #2', 2), ghostBiz('Looking up #3', 3)]
      : liveYou
        ? []
        : exampleRivals;

  const you = liveYou
    ? overlayBiz(exampleYou, liveYou, keyword, city, ready)
    : streaming
      ? ghostBiz(report.subjectName || 'Your shop', null, true)
      : exampleYou;
  return {
    biz: [...rivals, you],
    keyword,
    marketQuery,
    city,
    generated,
    liveGaps: report.gaps,
    mapImageUrl: report.mapImageUrl,
    mapHalfMiles: report.mapHalfMiles,
    packSearches: report.packSearches?.length ? report.packSearches : undefined,
    ready,
  };
}

const WEIGHTS = { gbp: 0.3, rev: 0.2, web: 0.3, ai: 0.2 };

function weekAverage(weeks: number[]): number {
  const ws = weeks.slice(-WEEKS_N);
  if (!ws.length) return 0;
  return ws.reduce((sum, n) => sum + n, 0) / WEEKS_N;
}

function reviewScoreOf(b: ExampleBiz, bestAvg: number): number {
  const ws = b.weeks.slice(-WEEKS_N);
  const active = ws.filter((n) => n > 0).length / WEEKS_N;
  const pace = Math.min(1, weekAverage(b.weeks) / Math.max(0.1, bestAvg));
  return Math.round(active * 65 + pace * 35);
}

function applyReviewScores(biz: ExampleBiz[]): void {
  const bestAvg = Math.max(0.1, ...biz.map((b) => weekAverage(b.weeks)));
  for (const b of biz) {
    b.scores.rev = reviewScoreOf(b, bestAvg);
  }
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function speedScoreOf(b: ExampleBiz, bestLcp: number): number {
  if (b.lcp > 0 && bestLcp > 0) {
    const lcpScore = 100 * Math.min(1, bestLcp / b.lcp);
    return clampScore(lcpScore * 0.75 + b.psi * 0.25);
  }
  if (b.psi > 0) return clampScore(b.psi);
  return 0;
}

function siteScoreOf(b: ExampleBiz): number {
  let score = 10;
  if (b.titleKw === 'yes') score += 12;
  else if (b.titleKw === 'partial') score += 6;
  if (b.metaDesc) score += 8;
  if (b.h1Kw) score += 12;
  if (b.h2Kw > 0) score += 8;
  score += Math.round((b.altKw / 100) * 6);
  if (b.schema) score += 8;
  if (b.servicePages > 0) score += 8;
  if (b.locationPages > 0) score += 4;
  if (b.ssl) score += 4;
  if (b.privacy) score += 5;
  if (b.ux.phoneHeader) score += 3;
  if (b.ux.clickCall) score += 3;
  if (b.ux.ctaFold) score += 3;
  if (b.ux.form) score += 3;
  if (b.ux.reviewsHome) score += 3;
  if (b.ux.map) score += 2;
  score += Math.round(Math.min(b.rd / 40, 1) * 6);
  return clampScore(score);
}

function applyWebsiteScores(biz: ExampleBiz[]): void {
  const measured = biz.map((b) => b.lcp).filter((n) => n > 0);
  const bestLcp = measured.length ? Math.min(...measured) : 0;
  for (const b of biz) {
    const speed = speedScoreOf(b, bestLcp);
    const site = siteScoreOf(b);
    b.scores.spd = speed;
    b.scores.site = site;
    b.scores.web = clampScore(speed * 0.3 + site * 0.7);
  }
}

function overallOf(s: ExampleBiz['scores']): number {
  return Math.round(
    s.gbp * WEIGHTS.gbp + (s.rev ?? 0) * WEIGHTS.rev + s.web * WEIGHTS.web + s.ai * WEIGHTS.ai
  );
}

function exactScore(s: ExampleBiz['scores']): number {
  return s.gbp * WEIGHTS.gbp + (s.rev ?? 0) * WEIGHTS.rev + s.web * WEIGHTS.web + s.ai * WEIGHTS.ai;
}

function placeShort(n: number): string {
  const suffix =
    n % 10 === 1 && n !== 11 ? 'ST' : n % 10 === 2 && n !== 12 ? 'ND' : n % 10 === 3 && n !== 13 ? 'RD' : 'TH';
  return `${n}${suffix}`;
}

function rankBy(biz: ExampleBiz[], value: (b: ExampleBiz) => number) {
  return [...biz]
    .map((b) => ({ b, v: value(b) }))
    .sort((x, y) => y.v - x.v)
    .map((r, i) => ({
      place: placeShort(i + 1),
      placeColor: r.b.you ? (i === 0 ? OR : N) : i === 0 ? OR : '#8a8a8a',
      name: r.b.you ? 'You' : r.b.short,
      nameColor: r.b.you ? OR : INK,
      v: r.v,
      vColor: r.b.you ? OR : INK,
      bg: r.b.you ? TINT : '#fff',
      border: r.b.you ? '#f3c7ad' : '#e7e7e7',
      you: r.b.you,
      biz: r.b,
    }));
}

function rankPills(label: string, ranks: ReturnType<typeof rankBy>, dim = false): string {
  return `<div class="rpt-ranks${dim ? ' is-dim' : ''}">
    <span class="rpt-ranks-label">${esc(label)}</span>
    ${ranks
      .map(
        (k) => `<div class="rpt-rank" style="border-color:${k.border};background:${k.bg}">
      <span style="color:${k.placeColor}">${esc(k.place)}</span>
      <span class="rpt-rank-name" style="color:${k.nameColor}">${esc(k.name)}</span>
      <b style="color:${k.vColor}">${k.v}</b>
    </div>`
      )
      .join('')}
  </div>`;
}

function placeOrd(n: number): string {
  const suffix =
    n % 10 === 1 && n !== 11 ? 'ST' : n % 10 === 2 && n !== 12 ? 'ND' : n % 10 === 3 && n !== 13 ? 'RD' : 'TH';
  return `${n}${suffix} PLACE`;
}

function yes(sub = '') {
  return { t: '✓', color: '#fff', pill: Y, sub, size: '15px' };
}
function no(sub = '') {
  return { t: '✗', color: '#fff', pill: N, sub, size: '15px' };
}
function part(sub = '') {
  return { t: '~', color: '#fff', pill: A, sub, size: '15px' };
}
function num(t: string | number, sub = '', color = INK, size = '22px') {
  return { t: String(t), color, pill: 'transparent', sub, size };
}

function schemaCell(types: string[] | undefined, present: boolean): ReturnType<typeof yes> {
  const list = (types ?? []).filter(Boolean);
  const trade = list.find((t) =>
    /electrician|plumber|hvac|locksmith|roofer|homeandconstruction|localbusiness|professionalservice/i.test(t)
  );
  const extra = list.find((t) => /faqpage|service|aggregaterating|review/i.test(t));
  const generic = list.find((t) => /organization|website|webpage|breadcrumb/i.test(t));
  const label = (name?: string) => (name ? name.replace(/([a-z])([A-Z])/g, '$1 $2') : '');
  if (trade) return yes(extra ? `${label(trade)} · ${label(extra)}` : label(trade));
  if (generic) return part(label(generic));
  if (present || list.length) return part(label(list[0]) || 'generic only');
  return no('none');
}

type Cell = { t: string; color: string; pill: string; sub: string; size: string; bg?: string };

function row(label: string, sub: string, B: ExampleBiz[], fn: (b: ExampleBiz) => Cell) {
  return { label, sub, cells: B.map((b) => ({ ...fn(b), bg: b.you ? TINT : 'transparent' })) };
}

function stars(): string {
  return '<span class="rpt-stars">★★★★★</span>';
}

function pinInitial(name: string): string {
  return esc(name.replace(/[^A-Za-z0-9]/g, '').slice(0, 1) || '?');
}

function photoSlot(name: string, you: boolean, url?: string): string {
  if (url) {
    return `<div class="rpt-photo${you ? ' is-you' : ''} has-img"><img src="${esc(url)}" alt="" /></div>`;
  }
  return `<div class="rpt-photo${you ? ' is-you' : ''}" aria-hidden="true">${pinInitial(name)}</div>`;
}

const AI_ANSWER_CHARS = 420;

function clipAnswer(text: string, max = AI_ANSWER_CHARS): string {
  const clean = text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const sentence = slice.match(/^[\s\S]*?[.!](?=\s|$)/);
  const cut = sentence && sentence[0].length > 140 ? sentence[0] : slice.replace(/\s+\S*$/, '');
  return `${cut.trim()}…`;
}

function splitTitle(title: string, keyword: string): { before: string; match: string; after: string } {
  const roots = keywordRoots(keyword);
  const re = new RegExp(roots.map((r) => r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  const m = title.match(re);
  if (!m || m.index == null) return { before: title, match: '', after: '' };
  return { before: title.slice(0, m.index), match: m[0], after: title.slice(m.index + m[0].length) };
}

function ringOf(i: number): number {
  return Math.max(Math.abs(Math.floor(i / 5) - 2), Math.abs((i % 5) - 2));
}

/** Live reports send [0, 1, 3]. Older stored reports may still be 2 / 5. */
function ringMilesOf(report: PublicReport): [number, number, number] {
  const rings = report.gridRingMiles;
  if (rings && rings.length >= 3) {
    return [rings[0] ?? 0, rings[1] ?? 1, rings[rings.length - 1] ?? 3];
  }
  return [0, 1, 3];
}

function mileLabel(miles: number): string {
  return `${miles} MI OUT`;
}

function rangeTxt(arr: (number | null)[]): string {
  const v = arr.filter((x): x is number => x != null);
  const missed = arr.length - v.length;
  if (!v.length) return 'Not found';
  const mn = Math.min(...v);
  const ranks = mn === Math.max(...v) ? `#${mn}` : `#${mn}–${Math.max(...v)}`;
  return missed ? `${ranks} / gone` : ranks;
}

function rangeColor(arr: (number | null)[]): string {
  const v = arr.filter((x): x is number => x != null);
  if (!v.length) return N;
  const missed = arr.length - v.length;
  const mx = Math.max(...v);
  if (missed * 2 >= arr.length) return N;
  if (missed) return mx <= 10 ? A : N;
  return mx <= 3 ? Y : mx <= 10 ? A : N;
}

function covOf(b: ExampleBiz): number {
  return b.grid.filter((r) => r != null && r <= 3).length;
}

function boardHtml(
  title: string,
  heads: { name: string; tag: string; tagColor: string; bg: string; radius: string }[],
  rows: { label: string; sub: string; cells: Cell[] }[],
  extraClass = ''
): string {
  const cols = `minmax(170px,1.2fr) repeat(${heads.length},minmax(120px,1fr))`;
  return `<div class="rpt-board ${extraClass}">
    <div class="rpt-board-inner">
      <div class="rpt-board-head" style="grid-template-columns:${cols}">
        <div class="rpt-board-kicker">${esc(title)}</div>
        ${heads
          .map(
            (h) => `<div class="rpt-board-who" style="background:${h.bg};border-radius:${h.radius}">
              <div class="rpt-board-tag" style="color:${h.tagColor}">${esc(h.tag)}</div>
              <div class="rpt-board-name">${esc(h.name)}</div>
            </div>`
          )
          .join('')}
      </div>
      ${rows
        .map(
          (rowItem) => `<div class="rpt-board-row" style="grid-template-columns:${cols}">
            <div class="rpt-board-label">${esc(rowItem.label)}<div class="rpt-board-sub">${esc(rowItem.sub)}</div></div>
            ${rowItem.cells
              .map(
                (c) => `<div class="rpt-board-cell" style="background:${c.bg}">
                  <div class="rpt-pill" style="background:${c.pill};color:${c.color};font-size:${c.size}">${esc(c.t)}</div>
                  <div class="rpt-cell-sub">${esc(c.sub)}</div>
                </div>`
              )
              .join('')}
          </div>`
        )
        .join('')}
    </div>
  </div>`;
}

function whyNote(copy: { why: string; improve: string }): string {
  return `<aside class="rpt-why">
    <p><b>Why it matters.</b> ${esc(copy.why)}</p>
    <p><b>How to improve.</b> ${esc(copy.improve)}</p>
  </aside>`;
}

function mapsOf(b: ExampleBiz): number {
  if (b.packRanks?.length) return b.packRanks.filter((rank) => rank != null && rank <= 3).length;
  return typeof b.pack === 'number' && b.pack <= 3 ? 1 : 0;
}

function youRankInSearch(search: PublicPackSearch, youName: string): number | null {
  return search.results.find((row) => namesRoughlyMatch(row.name, youName))?.position ?? null;
}

function packRankTone(rank: number | null, you: boolean): { color: string; bg: string; border: string } {
  if (rank == null) return { color: '#fff', bg: N, border: N };
  if (rank <= 3) return { color: '#fff', bg: Y, border: Y };
  if (you) return { color: OR, bg: '#fff', border: OR };
  return { color: A, bg: '#fff', border: A };
}

function phoneYouLine(rank: number | null, featured: boolean): { foot: string; rank: string; sub: string; color: string } {
  if (rank == null) {
    return {
      foot: featured
        ? ''
        : `<div class="rpt-phone-miss">you don’t appear at all</div>`,
      rank: 'Not found',
      sub: '',
      color: N,
    };
  }
  if (rank <= 3) {
    return { foot: '', rank: `#${rank}`, sub: 'On the map', color: Y };
  }
  const taps = rank - 3;
  return {
    foot: featured
      ? ''
      : `<div class="rpt-phone-miss is-warn">you’re ${taps} tap${taps === 1 ? '' : 's'} below this line</div>`,
    rank: `#${rank}`,
    sub: rank === 4 ? 'One spot from the map' : `${taps} tap${taps === 1 ? '' : 's'} below the map`,
    color: rank <= 10 ? (featured ? OR : A) : N,
  };
}

function phoneHtml(
  search: PublicPackSearch,
  index: number,
  featured: boolean,
  youName: string,
  mapBg: string
): string {
  const youRank = youRankInSearch(search, youName);
  const you = phoneYouLine(youRank, featured);
  const top = search.results.filter((row) => row.position <= 3).slice(0, 3);
  const hidden = featured && youRank != null && youRank > 3
    ? search.results.find((row) => namesRoughlyMatch(row.name, youName))
    : undefined;
  const label = featured
    ? `SEARCH ${index + 1} · YOUR BEST`
    : `SEARCH ${index + 1}`;
  const rows = top
    .map((row) => {
      const meta = [
        row.rating != null ? `${row.rating.toFixed(1)}` : '',
        row.reviewCount != null ? `(${fmt(row.reviewCount)})` : '',
        row.yearsInBusiness ? `${row.yearsInBusiness}+ yrs` : '',
      ]
        .filter(Boolean)
        .join(' · ');
      return `<div class="rpt-phone-row">
        <div>
          <div class="rpt-phone-name">${esc(row.name)}</div>
          ${meta ? `<div class="rpt-phone-meta">${esc(meta.replace(/^([\d.]+)/, '$1 ★'))}</div>` : ''}
        </div>
        <span>#${row.position}</span>
      </div>`;
    })
    .join('');
  const youBlock = hidden
    ? `<div class="rpt-phone-you-row">
        <div>
          <div class="rpt-mini-kicker">HIDDEN BEHIND THE TAP</div>
          <div class="rpt-phone-you-name">${esc(hidden.name)}</div>
          ${hidden.rating != null ? `<div class="rpt-phone-meta">${hidden.rating.toFixed(1)} ★ (${fmt(hidden.reviewCount ?? 0)})</div>` : ''}
        </div>
        <span>#${hidden.position}</span>
      </div>`
    : you.foot;
  return `<div class="rpt-phone${featured ? ' is-best' : ''}">
    <div class="rpt-phone-kicker${featured ? ' is-best' : ''}">${esc(label)}</div>
    <div class="rpt-phone-body">
      <div class="rpt-phone-bar"><span>9:41</span><span>●●● ▲ ▮</span></div>
      <div class="rpt-phone-q"><i></i><span>${esc(search.query)}</span></div>
      <div class="rpt-phone-map${mapBg ? ' has-map' : ''}">${mapBg}<div class="rpt-here"></div></div>
      ${rows}
      <div class="rpt-phone-more">More businesses →</div>
      ${youBlock}
    </div>
    <div class="rpt-phone-score">
      <div class="rpt-mini-kicker${featured ? ' is-best' : ''}">YOU</div>
      <div class="rpt-phone-rank" style="color:${you.color}">${esc(you.rank)}</div>
      ${you.sub ? `<div class="rpt-phone-sub">${esc(you.sub)}</div>` : ''}
    </div>
  </div>`;
}

function ctaBand(kicker: string, head: string, sub = '', href = BOOKING_URL, label = 'Book a free call'): string {
  return `<div class="rpt-cta-band">
    <div>
      <div class="rpt-kicker is-peach">${esc(kicker)}</div>
      <div class="rpt-cta-head">${esc(head)}</div>
      ${sub ? `<div class="rpt-cta-sub">${esc(sub)}</div>` : ''}
    </div>
    <a class="rpt-btn" href="${esc(href)}">${esc(label)}</a>
  </div>`;
}

export function renderReportHtml(report: PublicReport): string {
  const { biz: B, keyword, marketQuery, city, generated, liveGaps, mapImageUrl, packSearches: livePackSearches, ready } =
    mergeReport(report);
  const [, innerMi, outerMi] = ringMilesOf(report);
  applyReviewScores(B);
  applyWebsiteScores(B);
  const cityName = city.split(',')[0] ?? city;
  const mapBg = mapImageUrl
    ? `<img class="rpt-map-bg" src="${esc(mapImageUrl)}" alt="Map of the area we searched from" width="640" height="640" />`
    : '';
  const mapPlace = cityName
    ? `<div class="rpt-map-place">${esc(cityName)}</div>`
    : '';
  const packHasMap = Boolean(mapImageUrl);
  const wait = (key: keyof ReportReady | 'all', label: string, inner: string) => {
    const on =
      ready &&
      (key === 'all'
        ? !(ready.hero && ready.pack && ready.website && ready.ai && packHasMap)
        : key === 'pack'
          ? !ready.pack || !packHasMap
          : !ready[key]);
    if (!on) return inner;
    return `<div class="rpt-wait">${inner}<div class="rpt-wait-mask" role="status"><span class="rpt-spin" aria-hidden="true"></span><span>${esc(label)}</span></div></div>`;
  };
  const you = B.find((b) => b.you) ?? B[B.length - 1]!;
  const rivals = B.filter((b) => !b.you);
  const leader = rivals[0] ?? you;
  const kwPlural = keyword.endsWith('s') ? keyword : `${keyword}s`;
  const inPack = typeof you.pack === 'number' && you.pack <= 3;
  const youCenter = you.grid[12];
  const youCov = covOf(you);
  const weeksN = WEEKS_N;

  const pillarKeys = [
    ['GOOGLE PROFILE', 'gbp'],
    ['REVIEWS', 'rev'],
    ['WEBSITE', 'web'],
    ['AI SEARCH', 'ai'],
  ] as const;
  const shopCards = [...B]
    .map((b) => ({ b, sc: overallOf(b.scores), ex: exactScore(b.scores) }))
    .sort((x, y) => y.ex - x.ex)
    .map(({ b, sc }, i) => ({
      you: b.you,
      name: b.name,
      photo: b.photo,
      rating: b.rating ? b.rating.toFixed(1) : '—',
      reviews: fmt(b.reviews),
      years: 0,
      packText: b.you
        ? inPack
          ? `#${b.pack} in the Map Pack`
          : 'Not in the Map Pack'
        : `#${b.pack} in the Map Pack`,
      packColor: b.you ? (inPack ? Y : N) : INK,
      place: placeOrd(i + 1),
      placeColor: b.you ? (i < 3 ? OR : N) : i === 0 ? OR : '#8a8a8a',
      score: sc,
      scoreColor: b.you ? OR : INK,
      track: b.you ? '#f3d9c6' : '#f0f0f0',
      bar: b.you ? OR : INK,
      breakdown: pillarKeys.map(([short, key]) => ({ short, v: b.scores[key] ?? 0 })),
    }));
  const shopPairs = [shopCards.slice(0, 2), shopCards.slice(2, 4)].filter((pair) => pair.length);

  const packSearches: PublicPackSearch[] = livePackSearches?.length
    ? livePackSearches
    : !ready || ready.pack
      ? EXAMPLE_PACK_SEARCHES
      : [];
  const youMaps = mapsOf(you);
  const packLevel = packTier(you.pack, youMaps);
  const overallPlace =
    [...B].sort((a, b) => exactScore(b.scores) - exactScore(a.scores)).findIndex((b) => b.you) + 1;
  const packQuery = `${marketQuery} near me`.trim();
  const hero = heroCopy({
    overall: overallPlace,
    pack: you.pack,
    rivals: rivals.length,
    kwPlural,
    city: cityName,
    query: packQuery,
  });
  const heroHeadline = hero.headline;
  const heroSub = hero.sub;
  const packHeadline = packHeadlineCopy({
    tier: packLevel,
    pack: you.pack,
    maps: youMaps,
    address: you.address,
  });
  const searchFrom = you.address ? 'your address' : 'the middle of your service area — your address is hidden';
  const searchFromLabel = you.address
    ? `Searched “${packQuery}” from your address`
    : `Searched “${packQuery}” from the center of ${city} — your address is hidden`;

  const avgOf = (b: ExampleBiz) => b.weeks.slice(-weeksN).reduce((a, c) => a + c, 0) / weeksN;
  const activeOf = (b: ExampleBiz) => b.weeks.slice(-weeksN).filter((w) => w > 0).length;
  const maxW = Math.max(1, ...B.flatMap((b) => b.weeks.slice(-weeksN)));
  const rankGbp = rankBy(B, (b) => b.scores.gbp);
  const rankRev = rankBy(B, (b) => b.scores.rev ?? 0);
  const rankWeb = rankBy(B, (b) => b.scores.web);
  const rankSpeed = rankBy(B, (b) => b.scores.spd ?? 0);
  const rankSite = rankBy(B, (b) => b.scores.site ?? 0);
  const rankAi = rankBy(B, (b) => b.scores.ai);
  const orderGbp = rankGbp.map((r) => r.biz);
  const orderWeb = rankWeb.map((r) => r.biz);
  const headsFor = (order: ExampleBiz[]) =>
    order.map((b, i) => ({
      name: b.short,
      tag: b.you ? 'YOU' : `#${b.pack} IN PACK`,
      tagShort: b.you ? 'YOU' : `PACK #${b.pack}`,
      tagColor: b.you ? OR : '#8a8a8a',
      bg: b.you ? TINT : 'transparent',
      radius: i === order.length - 1 ? '0 18px 0 0' : '0',
    }));
  const headsGbp = headsFor(orderGbp);
  const headsWeb = headsFor(orderWeb);
  const reviewEngine = rankRev.map((r) => {
    const b = r.biz;
    const ws = b.weeks.slice(-weeksN);
    const avg = avgOf(b);
    const active = activeOf(b);
    const rp = rankRev.findIndex((row) => row.biz === b);
    return {
      ...b,
      tag: b.you ? 'YOU' : `#${b.pack} IN PACK`,
      tagColor: b.you ? OR : '#8a8a8a',
      revScore: b.scores.rev ?? 0,
      revPlace: `${placeShort(rp + 1)} PLACE`,
      revPlaceColor: rp === 0 ? OR : b.you ? N : '#8a8a8a',
      revScoreColor: b.you ? OR : INK,
      avg: avg.toFixed(1),
      avgColor: b.you ? (avg < 1 ? N : OR) : INK,
      bars: ws.map((w) => ({
        h: w ? Math.max(10, Math.round((w / maxW) * 100)) : 4,
        color: w ? (b.you ? OR : INK) : '#e3e3e3',
      })),
      active: `${active}/${weeksN}`,
      activeColor: active === weeksN ? Y : active <= weeksN / 2 ? N : INK,
    };
  });

  const gbpRows = [
    row('Keyword in business name', `More relevant for people searching “${marketQuery}”`, orderGbp, (b) => {
      const fit = nameKeywordFit(b.name, keyword);
      if (fit === 'yes') return yes(`“${marketQuery}”`);
      if (fit === 'weak') return part('says “electric”');
      return no('not in name');
    }),
    row('Primary category', 'The primary category you selected', orderGbp, (b) =>
      num(b.cat, b.cat.toLowerCase() === keyword.toLowerCase() ? 'matches search' : 'mismatch', b.cat.toLowerCase() === keyword.toLowerCase() ? INK : N, '13px')
    ),
    row('Secondary categories', 'The additional categories you selected', orderGbp, (b) => num(b.secondary, 'added', b.secondary <= 1 ? N : INK)),
    row('Address shown', 'Street address on the pin', orderGbp, (b) => (b.address ? yes(b.addrShort) : no('hidden'))),
    row('Business description', 'Keyword, services, and cities in the About', orderGbp, (b) => {
      if (b.descUnknown) return part('checking…');
      if (!b.desc) return no('missing');
      const graded = b.descKeyword != null || b.descServices != null || b.descLocations != null;
      if (!graded) return yes('written');
      const bits = [
        b.descKeyword ? 'keyword' : '',
        b.descServices ? 'services' : '',
        b.descLocations ? 'locations' : '',
      ].filter(Boolean);
      if (bits.length === 3) return yes('keyword · services · locations');
      if (bits.length) return part(bits.join(' · '));
      return part('written, no keyword');
    }),
    row('Photos on profile', 'Images on the listing', orderGbp, (b) =>
      b.photos ? num(fmt(b.photos), 'photos') : b.descUnknown ? part('checking…') : no('none listed')
    ),
    row('Hours · Book online', 'Actions on the profile', orderGbp, (b) =>
      b.hours && b.book ? yes('both') : b.hours || b.book ? part(b.hours ? 'hours only' : 'booking only') : no('neither')
    ),
    row('Phone on profile', 'Call button on the listing', orderGbp, (b) => (b.phone ? yes('listed') : no('missing'))),
  ];

  const measuredLcps = B.map((b) => b.lcp).filter((n) => n > 0);
  const bestLcp = measuredLcps.length ? Math.min(...measuredLcps) : 0;
  const isFastest = (b: ExampleBiz) => b.lcp > 0 && bestLcp > 0 && b.lcp === bestLcp;
  const lcpColor = (ms: number) => (ms <= 0 ? '#8a8a8a' : ms <= 2500 ? Y : ms <= 4000 ? A : N);
  const lcpNote = (ms: number) => {
    if (ms <= 0) return 'We couldn’t measure load time on this homepage.';
    if (ms <= 2500) return 'Under Google’s bar. Fast enough.';
    const over = ((ms - 2500) / 1000).toFixed(1);
    if (ms <= 4000) return `${over}s over the bar. Visitors start leaving.`;
    return `${over}s over the bar. Most visitors give up before it loads.`;
  };
  const barMaxS = Math.max(5, Math.ceil(Math.max(0, ...B.map((b) => b.lcp)) / 1000) || 5);
  const speed = rankSpeed.map((r, i) => {
    const b = r.biz;
    const seconds = b.lcp > 0 ? b.lcp / 1000 : 0;
    return {
      name: b.short,
      you: b.you,
      track: b.you ? '#f3d9c6' : '#f0f0f0',
      lcp: b.lcp > 0 ? `${seconds.toFixed(1)}s` : '—',
      lcpColor: lcpColor(b.lcp),
      note: lcpNote(b.lcp),
      barW: b.lcp > 0 ? Math.min(100, Math.round((seconds / barMaxS) * 100)) : 0,
      barMark: Math.round((2.5 / barMaxS) * 100),
      barMax: `${barMaxS}s`,
      bg: b.you ? TINT : '#fff',
      border: b.you ? '#f3c7ad' : '#e7e7e7',
      tag: b.you ? 'YOU' : `#${b.pack} IN PACK`,
      tagColor: b.you ? OR : '#8a8a8a',
      place: placeOrd(i + 1),
      placeColor: i === 0 ? OR : b.you ? N : '#8a8a8a',
      score: b.scores.spd ?? 0,
      scoreColor: b.you ? OR : INK,
    };
  });
  const speedPairs = [speed.slice(0, 2), speed.slice(2, 4)].filter((pair) => pair.length);

  const orderSite = rankSite.map((r) => r.biz);
  const serp = orderSite.map((b) => {
    const s = splitTitle(b.title, keyword);
    const st =
      b.titleKw === 'yes'
        ? { titlePill: Y, titleMark: '✓', titleStatus: `Says “${s.match.toLowerCase() || keyword}”` }
        : b.titleKw === 'partial'
          ? { titlePill: A, titleMark: '~', titleStatus: `“${s.match.toLowerCase()}” — close, not exact` }
          : { titlePill: N, titleMark: '✗', titleStatus: 'No service keyword' };
    const descKw = b.metaDesc ? titleKwOf(b.metaDesc, keyword) : 'no';
    return {
      site: b.site,
      url: b.url,
      initial: b.site[0] ?? '?',
      you: b.you,
      before: s.before,
      match: s.match,
      after: s.after,
      hlBg: s.match ? (b.titleKw === 'yes' ? '#e4f4ea' : '#fff3dc') : 'transparent',
      hlLine: s.match ? (b.titleKw === 'yes' ? Y : A) : 'transparent',
      desc:
        b.metaDesc ||
        'No meta description. Google picks random text from the page instead, “Welcome to our website. We are a family owned and operated business serving…”',
      descStyle: b.metaDesc ? 'normal' : 'italic',
      descPill: b.metaDesc ? (descKw === 'yes' ? Y : A) : N,
      descMark: b.metaDesc ? (descKw === 'yes' ? '✓' : '~') : '✗',
      descStatus: b.metaDesc
        ? descKw === 'yes'
          ? 'Written, says what you do'
          : 'Written, no service keyword'
        : 'Missing. Google picks random text',
      ...st,
      bg: b.you ? TINT : '#fff',
      border: b.you ? '#f3c7ad' : '#e7e7e7',
    };
  });
  const serpPairs = [serp.slice(0, 2), serp.slice(2, 4)].filter((pair) => pair.length);

  const seoRows = [
    row('H1 has keyword', 'The main headline on the homepage', orderWeb, (b) => (b.h1Kw ? yes('') : no(''))),
    row('H2 has keyword', 'At least one section heading on the homepage', orderWeb, (b) => (b.h2Kw > 0 ? yes('') : no(''))),
    row('Image alt text w/ keyword', 'Share of images described', orderWeb, (b) => num(`${b.altKw}%`, 'of images', b.altKw === 0 ? N : INK)),
    row('Schema markup', 'The business type Google can read', orderWeb, (b) => schemaCell(b.schemaTypes, b.schema)),
    row('Service pages', 'One page per service', orderWeb, (b) => num(b.servicePages, 'pages', b.servicePages < 3 ? N : INK)),
    row('Location pages', 'One page per city served', orderWeb, (b) => num(b.locationPages, 'pages')),
    row('SSL (https)', 'Padlock in the browser', orderWeb, (b) => (b.ssl ? yes('secure') : no('not secure'))),
    row('Privacy policy', 'The privacy page Google expects', orderWeb, (b) =>
      b.privacy ? yes('listed') : no('missing')
    ),
  ];

  const uxRows = [
    row('Phone number in header', 'Visible without scrolling', orderWeb, (b) => (b.ux.phoneHeader ? yes('') : no(''))),
    row('Tap-to-call on mobile', 'Number is a link', orderWeb, (b) => (b.ux.clickCall ? yes('') : no(''))),
    row('Call-to-action above the fold', 'A button at the top of the page', orderWeb, (b) => (b.ux.ctaFold ? yes('') : no(''))),
    row('Contact form', 'Any page', orderWeb, (b) => (b.ux.form ? yes('') : no(''))),
    row('Reviews shown on homepage', 'Stars a visitor can see', orderWeb, (b) => (b.ux.reviewsHome ? yes('') : no(''))),
    row('Map of service area', 'Embedded Google Map', orderWeb, (b) => (b.ux.map ? yes('') : no(''))),
  ];

  const flag = (k: keyof ExampleAuth, okSub = '', noSub = '') => (b: ExampleBiz) => (b.auth[k] ? yes(okSub) : no(noSub));

  const authGroups = [
    {
      label: 'QUALITY LINKS',
      rows: [
        row('Referring domains', 'Other websites linking here', orderWeb, (b) => num(fmt(b.rd), '', b.you ? N : INK)),
        row('Better Business Bureau', 'Exact name on bbb.org', orderWeb, flag('bbb', 'listed', 'not listed')),
        row('Chamber of Commerce', 'Exact name on a chamber page', orderWeb, flag('chamber', 'member', 'not listed')),
      ],
    },
    {
      label: 'SOCIAL',
      rows: [
        row('Facebook', 'Business page', orderWeb, flag('facebook')),
        row('Instagram', 'Linked from the website', orderWeb, flag('instagram')),
        row('YouTube', 'Channel with uploads', orderWeb, flag('youtube')),
        row('LinkedIn', 'Company page', orderWeb, flag('linkedin')),
      ],
    },
  ];

  const ring = (b: ExampleBiz, n: number) => b.grid.filter((_, i) => ringOf(i) === n);
  const dotCell = (r: number | null, i: number) => ({
    bg: r == null ? '#6b7280' : r <= 3 ? Y : r <= 10 ? '#f0b429' : N,
    ring: i === 12 ? '0 0 0 2px #fff, 0 0 0 4px #1a1a1a' : '0 0 0 1.5px #fff',
  });
  const hereTag = you.address ? 'YOUR ADDRESS' : `CENTER OF ${cityName.toUpperCase()}`;
  const hereLower = you.address ? 'your address' : 'the middle of your service area';
  const hereTxt = you.address ? 'your address' : 'the center';
  const centerLabel = you.address ? 'AT THE ADDRESS' : 'AT THE CENTER';
  const shownBg = you.address ? TINT : '#fff';
  const shownBorder = you.address ? OR : '#ececec';
  const hiddenBg = you.address ? '#fff' : TINT;
  const hiddenBorder = you.address ? '#ececec' : OR;
  const shownTag = you.address ? '● THIS IS YOU' : '';
  const hiddenTag = you.address ? '' : '● THIS IS YOU';
  const howDots = [1, 1, 2, 4, 6, 1, 1, 1, 3, 5, 1, 1, 1, 2, 4, 1, 1, 1, 3, 12, 2, 2, 4, null, null].map(dotCell);
  const readingOf = (b: ExampleBiz) => {
    const cov = covOf(b);
    const c = b.grid[12];
    const r2 = ring(b, 2).filter((x): x is number => x != null);
    const r2max = r2.length ? Math.max(...r2) : null;
    if (cov === 25) return `Top 3 at every spot within ${outerMi} miles of you.`;
    if (cov >= 20) return `Top 3 almost everywhere around you. Slips to #${r2max} at the edge.`;
    if (cov >= 10) return `Top 3 near ${hereTxt}, fades out by ${outerMi} miles.`;
    if (c === 1 && cov > 0) return `#1 at ${hereTxt}. Other shops cover more spots farther out.`;
    if (cov > 0) return `Only top 3 at a few spots near ${hereTxt}.`;
    if (c) return `#${c} at ${hereTxt}, not top 3 anywhere, gone by ${outerMi} miles.`;
    return `Not found anywhere within ${outerMi} miles.`;
  };
  const geoRows = [...B]
    .sort((x, y) => covOf(y) - covOf(x) || (x.grid[12] ?? 99) - (y.grid[12] ?? 99))
    .map((b, i) => {
      const cov = covOf(b);
      return {
        place: placeShort(i + 1),
        placeColor: i === 0 ? OR : b.you ? N : '#8a8a8a',
        name: b.you ? `You · ${b.short}` : b.short,
        nameColor: b.you ? OR : INK,
        bg: b.you ? TINT : '#fff',
        dots: b.grid.map(dotCell),
        reading: readingOf(b),
        cov,
        covColor: cov >= 20 ? Y : cov >= 10 ? A : N,
        c0: rangeTxt(ring(b, 0)),
        c0Color: rangeColor(ring(b, 0)),
        c1: rangeTxt(ring(b, 1)),
        c1Color: rangeColor(ring(b, 1)),
        c2: rangeTxt(ring(b, 2)),
        c2Color: rangeColor(ring(b, 2)),
      };
    });
  const liveAi = report.aiSearch?.questions.length && report.aiSearch.matrix.length ? report.aiSearch : undefined;
  const aiRuns = liveAi?.runs && liveAi.runs > 1 ? liveAi.runs : 3;
  const aiLede = `We asked ChatGPT and Gemini the three questions a ${cityName} homeowner actually types — ${aiRuns} times each, 18 checks total — and averaged who got named.`;
  const streaming = Boolean(ready);
  const PLATFORM_META: Record<string, { id: string; name: string; logo: string; bg: string }> = {
    chatgpt: { id: 'chatgpt', name: 'ChatGPT', logo: 'GPT', bg: '#10a37f' },
    gemini: { id: 'gemini', name: 'Gemini', logo: 'G', bg: '#4285f4' },
    gpt: { id: 'gpt', name: 'ChatGPT', logo: 'GPT', bg: '#10a37f' },
    gem: { id: 'gem', name: 'Gemini', logo: 'G', bg: '#4285f4' },
  };
  const CODE: Record<string, ExampleBiz> = { S: rivals[0] ?? you, M: rivals[1] ?? you, B: rivals[2] ?? you, Y: you };
  const AIQ = liveAi
    ? liveAi.questions
    : streaming
      ? [
          `best electrician in ${cityName}`,
          `electrician near me in ${cityName}`,
          `emergency electrician in ${cityName}`,
        ]
      : EXAMPLE_AI_QUESTIONS;
  const AIP = liveAi
    ? liveAi.platforms.map((id) => PLATFORM_META[id] ?? { id, name: id, logo: id.slice(0, 1).toUpperCase(), bg: '#5f6368' })
    : streaming
      ? [PLATFORM_META.chatgpt, PLATFORM_META.gemini]
      : EXAMPLE_AI_PLATFORMS;
  const nameMatrix: string[][][] = liveAi
    ? liveAi.matrix
    : streaming
      ? AIQ.map(() => AIP.map(() => [] as string[]))
      : EXAMPLE_AI_MATRIX.map((row) => row.map((cell) => cell.map((c) => CODE[c]?.name ?? '')));
  const shortOf = (name: string) => B.find((b) => namesRoughlyMatch(b.name, name))?.short ?? name;
  const indexOfBiz = (names: string[] | undefined, biz: ExampleBiz) =>
    (names ?? []).findIndex((n) => namesRoughlyMatch(n, biz.name));
  const aiTotal = AIQ.length * AIP.length;
  const mentionsOf = (b: ExampleBiz) => nameMatrix.flat().filter((cell) => indexOfBiz(cell, b) >= 0).length;
  const citedOf = (b: ExampleBiz) =>
    report.businesses.find((live) => namesRoughlyMatch(live.name, b.name))?.ai?.citeCount ??
    (liveAi ? 0 : nameMatrix.flat().filter((cell) => indexOfBiz(cell, b) >= 0).length);
  const youM = mentionsOf(you);
  const topRival = rivals.slice().sort((a, b) => mentionsOf(b) - mentionsOf(a))[0] ?? leader;
  const aiBoard = B.map((b) => {
    const m = mentionsOf(b);
    return { name: b.short, mentions: m, cited: citedOf(b), w: Math.max(2, Math.round((m / Math.max(aiTotal, 1)) * 100)), you: b.you, empty: b.you && m === 0 };
  });
  const aiMatrix = AIQ.map((text, qi) => ({
    text,
    cells: AIP.map((_, pi) => {
      const cell = nameMatrix[qi]?.[pi] ?? [];
      const others = Math.max(0, cell.length - 1);
      const yi = indexOfBiz(cell, you);
      return {
        top: cell[0] ? shortOf(cell[0]) : '—',
        sub: cell.length ? (others ? `+${others} other${others > 1 ? 's' : ''}` : 'only one named') : 'nobody named',
        you: yi >= 0 ? `✓ YOU · #${yi + 1}` : '✗ YOU',
        hit: yi >= 0,
      };
    }),
  }));
  const itemsFor = (qi: number, pi: number) =>
    (nameMatrix[qi]?.[pi] ?? []).map((name, i) => ({
      n: i + 1,
      name,
      text: EXAMPLE_BLURB[name] || B.find((b) => namesRoughlyMatch(b.name, name))?.short || 'a local option.',
    }));
  const gptAnswer = liveAi?.answers.find((a) => a.platform === 'chatgpt');
  const gemAnswer = liveAi?.answers.find((a) => a.platform === 'gemini');
  const gptQi = gptAnswer ? AIQ.indexOf(gptAnswer.question) : 0;
  const gemQi = gemAnswer ? AIQ.indexOf(gemAnswer.question) : Math.min(2, AIQ.length - 1);
  const gptPi = AIP.findIndex((p) => p.id === 'chatgpt' || p.id === 'gpt');
  const gemPi = AIP.findIndex((p) => p.id === 'gemini' || p.id === 'gem');
  const gptHit = indexOfBiz(nameMatrix[Math.max(0, gptQi)]?.[Math.max(0, gptPi)], you) >= 0;
  const gemHit = indexOfBiz(nameMatrix[Math.max(0, gemQi)]?.[Math.max(0, gemPi)], you) >= 0;
  const aiCols = AIP.length;
  const aiLevel = aiTier(youM, mentionsOf(topRival), aiTotal);
  const aiCopy = aiHeadlineCopy({
    tier: aiLevel,
    you: youM,
    total: aiTotal,
    rival: topRival.short,
    rivalCount: mentionsOf(topRival),
  });
  const aiHeadline = aiCopy.headline;

  const rankedSearches = packSearches
    .map((search, index) => ({ search, index, youRank: youRankInSearch(search, you.name) }))
    .sort((a, b) => (a.youRank ?? 99) - (b.youRank ?? 99));
  const featuredSearch = rankedSearches[0];
  const otherSearches = rankedSearches.slice(1);
  const phoneOrder = featuredSearch
    ? [otherSearches[0], featuredSearch, otherSearches[1]].filter(
        (item): item is NonNullable<typeof featuredSearch> => Boolean(item)
      )
    : [];

  const madeMapRows = (() => {
    const rows = new Map<string, { name: string; you: boolean; ranks: (number | null)[] }>();
    for (const search of packSearches) {
      for (const result of search.results) {
        const key = [...rows.keys()].find((name) => namesRoughlyMatch(name, result.name)) ?? result.name;
        const row = rows.get(key) ?? {
          name: result.name,
          you: namesRoughlyMatch(result.name, you.name),
          ranks: packSearches.map(() => null as number | null),
        };
        row.ranks[packSearches.indexOf(search)] = result.position;
        rows.set(key, row);
      }
    }
    if (![...rows.values()].some((row) => row.you)) {
      rows.set(you.name, { name: you.name, you: true, ranks: you.packRanks ?? packSearches.map(() => null) });
    }
    const sorted = [...rows.values()].sort((a, b) => {
      const am = a.ranks.filter((rank) => rank != null && rank <= 3).length;
      const bm = b.ranks.filter((rank) => rank != null && rank <= 3).length;
      if (bm !== am) return bm - am;
      const ab = Math.min(...a.ranks.filter((rank): rank is number => rank != null), 99);
      const bb = Math.min(...b.ranks.filter((rank): rank is number => rank != null), 99);
      return ab - bb;
    });
    const subject = sorted.find((row) => row.you);
    const rivals = sorted.filter((row) => !row.you).slice(0, 3);
    return (subject ? [...rivals, subject] : rivals).sort((a, b) => sorted.indexOf(a) - sorted.indexOf(b));
  })();

  const defaultGaps: { head: string; sub: string }[] = [];
  if (youMaps < 3) {
    defaultGaps.push({
      head: youMaps === 0 ? 'You’re not on any of the 3 maps.' : `You’re only on ${youMaps} of the 3 maps.`,
      sub: `${leader.short} made ${mapsOf(leader)} of 3. You: ${youMaps}.`,
    });
  }
  if (!you.address) {
    defaultGaps.push({
      head: 'Your address is hidden.',
      sub: 'Service-area profiles rarely get a pin. Every competitor shows a street address.',
    });
  }
  if (you.secondary <= 1) {
    defaultGaps.push({
      head: `Thin profile: ${you.secondary} secondary categor${you.secondary === 1 ? 'y' : 'ies'}.`,
      sub: 'Competitors list more secondary categories.',
    });
  }
  if (!(you.h1Kw && you.titleKw === 'yes')) {
    defaultGaps.push({
      head: `Your site title and H1 never say “${keyword}”.`,
      sub: `“${you.title}” ${you.metaDesc ? 'has a meta description.' : 'has no meta description.'} ${you.schema ? 'Schema is present.' : 'No schema.'}`,
    });
  }
  if (youM < mentionsOf(topRival)) {
    defaultGaps.push({
      head: `${AIP.length} AI assistants, ${aiTotal} answers, ${youM} mention${youM === 1 ? '' : 's'} of you.`,
      sub: `${topRival.short} was named in ${mentionsOf(topRival)}.`,
    });
  }
  if (!you.auth.bbb || !you.auth.chamber) {
    const miss = [!you.auth.bbb && 'BBB', !you.auth.chamber && 'Chamber'].filter(Boolean).join(' and ');
    defaultGaps.push({
      head: `Missing a quality backlink from ${miss}.`,
      sub: `The more quality backlinks you have, the better. Competitors have ${fmt(Math.min(...rivals.map((b) => b.rd), you.rd))}+ referring domains. You have ${fmt(you.rd)}.`,
    });
  }
  if (!defaultGaps.length) {
    defaultGaps.push({
      head: 'The remaining gaps are small execution details.',
      sub: 'Keep reviews coming and keep the profile complete so the pack cannot take the calls back.',
    });
  }
  const usableLiveGaps = liveGaps.filter(
    (g) => !/google reviews versus|\d+ google reviews|ads above the map|buying ads/i.test(g)
  );
  const gapCards = (
    usableLiveGaps.length
      ? usableLiveGaps.map((g) => ({
          head: g,
          sub: 'What this is costing you — and what closing it gets you.',
        }))
      : defaultGaps
  ).slice(0, 8);
  const wins = [
    ['Ranked across town, not just your street', 1],
    ['A review engine that runs itself', 1],
    ['A pin on the map', 1],
    ['A profile that turns the click into a call', 1],
    ['A site Google can rank', 1],
    ['The Google Guaranteed badge, top of page', 1],
    ['Recommended by name when people ask AI', 2],
    ['The trust signals Google cross-checks', 2],
  ] as const;
  const PH = ['Pre-flight', 'Liftoff', 'Orbit'];
  const gaps = gapCards.map((g, i) => ({
    ...g,
    n: String(i + 1).padStart(2, '0'),
    win: wins[i]?.[0] ?? 'Fixed in the flight plan',
    phaseN: wins[i]?.[1] ?? 1,
    phase: `FIXED IN ${(PH[(wins[i]?.[1] ?? 1) - 1] ?? 'Pre-flight').toUpperCase()}`,
  }));
  const phases = [
    { n: 1, name: 'Pre-flight', goal: '1–3 booked jobs a day and $25k+ months.', includes: 'Google profile fixed · Website (if needed) · 1:1 coaching · LSAs set up', featured: true },
    { n: 2, name: 'Liftoff', goal: '$25–100k months on traffic you own.', includes: 'Everything in Pre-flight · Deeper SEO · Managed Google Ads', featured: false },
    { n: 3, name: 'Orbit', goal: 'Scale past $100k months without it breaking.', includes: 'Everything in Liftoff · Scaling spend, managed · Risk cover built in', featured: false },
  ];

  const namedOnSite = Boolean(you.h1Kw || you.titleKw === 'yes');
  const youFastest = isFastest(you);
  const siteLevel = siteTier({ psi: you.psi, fastest: youFastest, h1Kw: you.h1Kw, titleKw: you.titleKw });
  const webHeadline = webHeadlineCopy({
    tier: siteLevel,
    psi: you.psi,
    fastest: youFastest,
    named: namedOnSite,
  });
  const gapsHead = gapsHeadingCopy({ pack: packLevel, count: gaps.length });
  const close = closerCopy(packLevel, gaps.length);
  const ctaHref = report.cta?.href || '/growth-audit';
  const rankingsReady =
    !ready || Boolean(ready.hero && ready.pack && ready.website && ready.ai && mapImageUrl);
  const profileReady = profileBoardReady(report);
  const shopRanking = `<div class="rpt-shop-grid">
        ${shopPairs
          .map(
            (pair) => `<div class="rpt-shop-pair">
            ${pair
              .map(
                (c) => `<article class="rpt-shop${c.you ? ' is-you' : ''}">
              <div class="rpt-shop-photo">${photoSlot(c.name, false, c.photo)}${c.you ? '<div class="rpt-shop-badge">YOU</div>' : ''}</div>
              <div class="rpt-shop-body">
                <div class="rpt-shop-top">
                  <div class="rpt-shop-copy">
                    <div class="rpt-card-name">${esc(c.name)}</div>
                    <div class="rpt-meta"><b>${esc(c.rating)}</b>${stars()}<span>(${esc(c.reviews)})</span></div>
                    <div class="rpt-shop-pack" style="color:${c.packColor}">${esc(c.packText)}</div>
                  </div>
                  <div class="rpt-shop-place">
                    <div class="rpt-shop-place-l" style="color:${c.placeColor}">${esc(c.place)}</div>
                    <div class="rpt-shop-score" style="color:${c.scoreColor}">${c.score}</div>
                  </div>
                </div>
                <div class="rpt-shop-bd-head"><span>SCORE BREAKDOWN</span><span>/100</span></div>
                <div class="rpt-shop-bars">
                  ${c.breakdown
                    .map(
                      (p) => `<div>
                    <div class="rpt-shop-row-top"><span>${esc(p.short)}</span><b style="color:${c.scoreColor}">${p.v}</b></div>
                    <div class="rpt-shop-track" style="background:${c.track}"><div class="rpt-shop-bar" style="background:${c.bar};width:${p.v}%"></div></div>
                  </div>`
                    )
                    .join('')}
                </div>
              </div>
            </article>`
              )
              .join('')}
          </div>`
          )
          .join('')}
      </div>
      <div class="rpt-shop-foot">
        <span>Ranked by overall score: Google profile 30% · reviews 20% · website 30% · AI search 20%.</span>
        <a href="#gaps">See every gap ↓</a>
      </div>`;
  const heroHold = `<div class="rpt-rank-hold" role="status">
        <span class="rpt-spin" aria-hidden="true"></span>
        <div>
          <div class="rpt-rank-hold-title">Check back for the full rankings when loading completes.</div>
          <div class="rpt-rank-hold-sub">Overall place and scores wait until profile, Map Pack, website, and AI search are all in.</div>
        </div>
      </div>`;

  return `
  <div class="rpt">
    <div class="rpt-hero">
      <div class="rpt-eyebrow">FREE GOOGLE REPORT<span> · ${esc(generated)}</span></div>
      ${
        rankingsReady
          ? `<h1>${esc(heroHeadline)}</h1>
      <p class="rpt-lede">${esc(heroSub)}</p>
      <div class="rpt-search"><span class="rpt-search-icon" aria-hidden="true"></span><span>${esc(packQuery)}</span></div>
      ${shopRanking}`
          : `<h1>We’re building your Google report.</h1>
      <p class="rpt-lede">Check back for the full rankings when loading completes. The sections below fill in as each check finishes.</p>
      ${city ? `<div class="rpt-search"><span class="rpt-search-icon" aria-hidden="true"></span><span>${esc(packQuery)}</span></div>` : ''}
      ${heroHold}`
      }
    </div>

    ${wait(
      'pack',
      mapImageUrl ? 'Running 3 Map Pack searches' : 'Loading the map of the area we searched',
      `<section class="rpt-sec">
      <div class="rpt-sec-label"><span>01</span><i></i><span>GOOGLE MAP PACK</span></div>
      <h2>${esc(packHeadline)}</h2>
      <p class="rpt-lede">This is the first screen a ${esc(cityName)} homeowner sees for each search. The map shows three businesses. Everyone else is a tap away that most people never make.</p>
      ${whyNote(packWhyCopy())}
      ${rankPills('PROFILE SCORE', rankGbp)}

      <div class="rpt-phones">
        ${phoneOrder
          .map((item) =>
            phoneHtml(item.search, item.index, item === featuredSearch, you.name, mapBg)
          )
          .join('')}
      </div>

      <div class="rpt-made">
        <div class="rpt-mini-kicker is-muted">WHO MADE THE MAP · OUT OF 3 SEARCHES</div>
        <div class="rpt-made-grid">
          ${madeMapRows
            .map((row, i) => {
              const maps = row.ranks.filter((rank) => rank != null && rank <= 3).length;
              const chips = row.ranks
                .map((rank) => {
                  const tone = packRankTone(rank, row.you);
                  return `<span class="rpt-made-chip" style="background:${tone.bg};color:${tone.color};border-color:${tone.border}">${rank == null ? '—' : `#${rank}`}</span>`;
                })
                .join('');
              return `<article class="rpt-made-card${row.you ? ' is-you' : ''}">
                <div class="rpt-mini-kicker${row.you ? ' is-best' : ' is-muted'}">${placeShort(i + 1)}${row.you ? ' · YOU' : ''}</div>
                <div class="rpt-made-name">${esc(row.name)}</div>
                <div class="rpt-made-chips">${chips}</div>
                <div class="rpt-made-count" style="color:${maps ? Y : N}">${maps}<span> of 3 maps</span></div>
              </article>`;
            })
            .join('')}
        </div>
      </div>

      ${ctaBand('FREE 20-MIN CALL', mapCtaCopy(packLevel, cityName))}
    </section>`
    )}

    ${wait(
      'hero',
      'Counting reviews week by week',
      `<section class="rpt-sec is-tight">
      <h3>Who's winning the review war.</h3>
      <p class="rpt-lede">Not the biggest total, the steadiest stream. Google trusts a shop that gets reviews every week. Scored on weeks with a review (65%) and pace vs the fastest shop (35%), over the last ${weeksN} weeks.</p>
      ${rankPills('REVIEW SCORE', rankRev)}
      <div class="rpt-reviews">
        ${reviewEngine
          .map(
            (b) => `<article class="rpt-rev ${b.you ? 'is-you' : ''}">
              <div class="rpt-rev-top">
                <div>
                  <div>${esc(b.short)}</div>
                  <div class="rpt-rev-tag" style="color:${b.tagColor}">${esc(b.tag)}</div>
                </div>
                <div class="rpt-rev-score">
                  <div class="rpt-rev-place" style="color:${b.revPlaceColor}">${esc(b.revPlace)}</div>
                  <b style="color:${b.revScoreColor}">${b.revScore}</b>
                </div>
              </div>
              <div class="rpt-rev-avg"><b style="color:${b.avgColor}">${b.avg}</b><span>reviews / week</span></div>
              <div class="rpt-rev-bars">${b.bars.map((w) => `<i style="height:${w.h}%;background:${w.color}"></i>`).join('')}</div>
              <div class="rpt-rev-axis"><span>${weeksN} wks ago</span><span>this week</span></div>
              <div class="rpt-rev-foot"><div><b style="color:${b.activeColor}">${b.active}</b><span>weeks with a review</span></div><div class="is-right"><b>${fmt(b.reviews)}</b><span>total · ${b.rating.toFixed(1)} ★</span></div></div>
            </article>`
          )
          .join('')}
      </div>
    </section>`
    )}

    ${
      profileReady
        ? `<section class="rpt-sec is-tight">
      <h3>Profile, line by line.</h3>
      ${boardHtml('GOOGLE BUSINESS PROFILE', headsGbp, gbpRows)}
    </section>`
        : `<section class="rpt-sec is-tight" aria-busy="true">
      <div class="rpt-rank-hold" role="status">
        <span class="rpt-spin" aria-hidden="true"></span>
        <div>
          <div class="rpt-rank-hold-title">Pulling About and photos from each Google listing.</div>
          <div class="rpt-rank-hold-sub">This board waits until the business description and photo counts are in for every shop.</div>
        </div>
      </div>
    </section>`
    }

    ${wait(
      'website',
      'Crawling sites and checking mobile speed',
      `<section class="rpt-sec">
      <div class="rpt-sec-label"><span>02</span><i></i><span>WEBSITE</span></div>
      <h2>${esc(webHeadline)}</h2>
      <p class="rpt-lede">How fast the homepage loads on a phone, and whether the site says what you do and lets a visitor call you. The board below covers that line by line.</p>
      ${whyNote(webWhyCopy())}
      ${rankPills('WEBSITE SCORE', rankWeb)}

      <div class="rpt-web-head">
        <div class="rpt-web-head-title">SPEED</div>
        <div class="rpt-web-head-note">Three phone tests, average of the two fastest. Google’s bar is 2.5 seconds.</div>
      </div>
      <div class="rpt-shop-grid is-tight">
        ${speedPairs
          .map(
            (pair) => `<div class="rpt-shop-pair">
            ${pair
              .map(
                (s) => `<article class="rpt-lcp ${s.you ? 'is-you' : ''}" style="border-color:${s.border};background:${s.bg}">
              <div class="rpt-lcp-top">
                <div><div class="rpt-lcp-name">${esc(s.name)}</div><div class="rpt-lcp-tag" style="color:${s.tagColor}">${esc(s.tag)}</div></div>
                <div class="rpt-lcp-place"><div style="color:${s.placeColor}">${esc(s.place)}</div><b style="color:${s.scoreColor}">${s.score}</b></div>
              </div>
              <div class="rpt-lcp-time" style="color:${s.lcpColor}">${esc(s.lcp)}</div>
              <div class="rpt-lcp-sub">to load on a phone</div>
              <div class="rpt-lcp-track" style="background:${s.track}"><i style="width:${s.barW}%;background:${s.lcpColor}"></i><em style="left:${s.barMark}%"></em></div>
              <div class="rpt-lcp-axis"><span>0s</span><span>2.5s · Google’s bar</span><span>${esc(s.barMax)}</span></div>
              <div class="rpt-lcp-note">${esc(s.note)}</div>
            </article>`
              )
              .join('')}
            </div>`
          )
          .join('')}
      </div>

      <div class="rpt-web-head">
        <div class="rpt-web-head-title">WHAT GOOGLE READS</div>
        <div class="rpt-web-head-note">The title and description, exactly as they appear in a search</div>
      </div>
      <div class="rpt-shop-grid is-tight">
        ${serpPairs
          .map(
            (pair) => `<div class="rpt-shop-pair">
            ${pair
              .map(
                (s) => `<article class="rpt-blue ${s.you ? 'is-you' : ''}" style="border-color:${s.border};background:${s.bg}">
              <div class="rpt-blue-body">
                <div class="rpt-blue-site"><div class="rpt-fav">${esc(s.initial)}</div><div><div>${esc(s.site)}</div><div class="rpt-blue-url">https://${esc(s.url)}</div></div></div>
                <div class="rpt-blue-block is-title">
                  <div class="rpt-blue-kicker">PAGE TITLE</div>
                  <div class="rpt-blue-title">${esc(s.before)}<span style="background:${s.hlBg};border-bottom:2px solid ${s.hlLine}">${esc(s.match)}</span>${esc(s.after)}</div>
                </div>
                <div class="rpt-blue-block is-desc">
                  <div class="rpt-blue-kicker is-muted">META DESCRIPTION</div>
                  <div class="rpt-blue-desc" style="font-style:${s.descStyle}">${esc(s.desc)}</div>
                </div>
              </div>
              <div class="rpt-blue-checks">
                <div><span class="rpt-mark" style="background:${s.titlePill}">${s.titleMark}</span><div><div class="rpt-mini-kicker is-muted">PAGE TITLE</div><div>${esc(s.titleStatus)}</div></div></div>
                <div><span class="rpt-mark" style="background:${s.descPill}">${s.descMark}</span><div><div class="rpt-mini-kicker is-muted">META DESCRIPTION</div><div>${esc(s.descStatus)}</div></div></div>
              </div>
            </article>`
              )
              .join('')}
            </div>`
          )
          .join('')}
      </div>

      ${boardHtml('SEO & SETTINGS', headsWeb, seoRows)}
      <div class="rpt-mini-kicker is-muted rpt-block-kicker">CAN A VISITOR ACTUALLY CALL YOU?</div>
      ${boardHtml('USABILITY', headsWeb, uxRows)}

      <h3 class="rpt-after">The backlinks that matter.</h3>
      <p class="rpt-lede">The more quality backlinks you have, the better. We only pull the most important ones here. Shops should still use a citation service for the rest of the directories.</p>
      <div class="rpt-board">
        <div class="rpt-board-inner">
          <div class="rpt-board-head" style="grid-template-columns:minmax(170px,1.2fr) repeat(${headsWeb.length},minmax(120px,1fr))">
            <div class="rpt-board-kicker">BACKLINKS</div>
            ${headsWeb
              .map(
                (h) => `<div class="rpt-board-who" style="background:${h.bg};border-radius:${h.radius}">
                  <div class="rpt-board-tag" style="color:${h.tagColor}">${esc(h.tag)}</div>
                  <div class="rpt-board-name">${esc(h.name)}</div>
                </div>`
              )
              .join('')}
          </div>
          ${authGroups
            .map(
              (g) => `<div class="rpt-auth-label">${esc(g.label)}</div>${g.rows
                .map(
                  (rowItem) => `<div class="rpt-board-row is-tight" style="grid-template-columns:minmax(170px,1.2fr) repeat(${headsWeb.length},minmax(120px,1fr))">
                    <div class="rpt-board-label">${esc(rowItem.label)}<div class="rpt-board-sub">${esc(rowItem.sub)}</div></div>
                    ${rowItem.cells
                      .map(
                        (c) => `<div class="rpt-board-cell" style="background:${c.bg}">
                          <div class="rpt-pill" style="background:${c.pill};color:${c.color};font-size:${c.size}">${esc(c.t)}</div>
                          <div class="rpt-cell-sub">${esc(c.sub)}</div>
                        </div>`
                      )
                      .join('')}
                  </div>`
                )
                .join('')}`
            )
            .join('')}
        </div>
      </div>
      ${ctaBand(
        'FREE 20-MIN CALL',
        siteLevel === 'well' ? 'Keep the site saying what you do.' : isFastest(you) ? 'Fast site. It just needs to say what you do.' : 'Most of these are week-one fixes.',
        'Title, H1, description and schema are quick wins. We’ll show you what to change first and why.'
      )}
    </section>`
    )}

  </div>

  ${wait(
    'ai',
    'Asking ChatGPT and Gemini each question a few times',
    `<section class="rpt-ai">
    <div class="rpt-ai-inner">
      <div class="rpt-sec-label is-peach"><span>03</span><i></i><span>AI SEARCH · CHATGPT & GEMINI</span></div>
      <h2>${esc(aiHeadline)}</h2>
      <p class="rpt-lede is-dim">${esc(aiLede)}</p>
      ${whyNote(aiWhyCopy())}
      ${rankPills('AI SCORE', rankAi, true)}
      <div class="rpt-ai-top">
        <div class="rpt-ai-board">
          <div class="rpt-mini-kicker is-dim">NAMED IN … OF ${aiTotal} ANSWERS</div>
          ${aiBoard
            .map(
              (b) => `<div class="rpt-ai-row">
                <div class="${b.you ? 'is-you' : ''}">${esc(b.name)}</div>
                <div class="rpt-ai-bar"><i style="width:${b.w}%"></i></div>
                <div><b class="${b.empty ? 'is-bad' : ''}">${b.mentions}</b><span> · cited ${b.cited}×</span></div>
              </div>`
            )
            .join('')}
        </div>
      </div>
      <div class="rpt-ai-matrix" style="--ai-cols:${aiCols}">
        <div class="rpt-ai-matrix-head">
          <div class="rpt-mini-kicker is-dim">WHAT A HOMEOWNER ASKED · WHO GOT NAMED FIRST</div>
          ${AIP.map((p) => `<div class="rpt-ai-plat"><span style="background:${p.bg}">${esc(p.logo)}</span><b>${esc(p.name)}</b></div>`).join('')}
        </div>
        ${aiMatrix
          .map(
            (q) => `<div class="rpt-ai-q">
              <div>“${esc(q.text)}”</div>
              ${q.cells
                .map(
                  (c) => `<div class="rpt-ai-cell"><b>${esc(c.top)}</b><span>${esc(c.sub)}</span><em class="${c.hit ? 'is-hit' : 'is-miss'}">${esc(c.you)}</em></div>`
                )
                .join('')}
            </div>`
          )
          .join('')}
      </div>

      <div class="rpt-mini-kicker is-dim rpt-block-kicker">TWO OF THE ${aiTotal} ANSWERS</div>
      <div class="rpt-chats">
        <article class="rpt-chat">
          <header><span class="rpt-ai-logo" style="background:#10a37f">GPT</span><b>ChatGPT</b><time>${esc(generated)}</time></header>
          <div class="rpt-chat-body">
            <div class="rpt-bubble">${esc(gptAnswer?.question ?? AIQ[0] ?? '')}</div>
            ${
              gptAnswer?.text
                ? clipAnswer(gptAnswer.text).split(/\n+/).map((p) => `<p>${esc(p)}</p>`).join('')
                : `<p>Here are some of the top-rated ${esc(kwPlural)} in ${esc(cityName)}, based on recent reviews and local reputation:</p>`
            }
            ${itemsFor(Math.max(0, gptQi), Math.max(0, gptPi))
              .map((it) => `<div class="rpt-chat-item"><span>${it.n}.</span><div><b>${esc(it.name)}</b>, ${esc(it.text)}</div></div>`)
              .join('')}
          </div>
          <footer class="${gptHit ? 'is-hit' : 'is-miss'}"><span>${gptHit ? '✓' : '✗'}</span><div><b>${esc(you.name)} ${gptHit ? 'is mentioned' : 'isn’t mentioned'}</b><div>${gptHit ? 'Named in the answer' : 'Not named, not cited'}</div></div></footer>
        </article>
        <article class="rpt-chat">
          <header><span class="rpt-ai-logo" style="background:#4285f4">G</span><b>Gemini</b><time>${esc(generated)}</time></header>
          <div class="rpt-chat-body">
            <div class="rpt-bubble">${esc(gemAnswer?.question ?? AIQ[Math.max(0, gemQi)] ?? '')}</div>
            ${
              gemAnswer?.text
                ? clipAnswer(gemAnswer.text).split(/\n+/).map((p) => `<p>${esc(p)}</p>`).join('')
                : `<p>For an emergency ${esc(keyword)} in ${esc(cityName)}, these providers offer 24/7 or same-day service and are consistently well reviewed:</p>`
            }
            ${itemsFor(Math.max(0, gemQi), Math.max(0, gemPi))
              .map((it) => `<div class="rpt-chat-item"><span>•</span><div><b>${esc(it.name)}</b>, ${esc(it.text)}</div></div>`)
              .join('')}
          </div>
          <footer class="${gemHit ? 'is-hit' : 'is-miss'}"><span>${gemHit ? '✓' : '✗'}</span><div><b>${esc(you.name)} ${gemHit ? 'is mentioned' : 'isn’t mentioned'}</b><div>${gemHit ? 'Named in the answer' : 'Not named, not cited'}</div></div></footer>
        </article>
      </div>
      <div class="rpt-cta-band is-light">
        <div>
          <div class="rpt-kicker">FREE 20-MIN CALL</div>
          <div class="rpt-cta-head">AI pulls from the same signals as the Map Pack.</div>
        </div>
        <a class="rpt-btn" href="${BOOKING_URL}">Book a free call</a>
      </div>
    </div>
  </section>`
  )}

  <div class="rpt">
    ${wait(
      'all',
      'Scoring the gaps against the pack',
      `<section class="rpt-sec" id="gaps">
      <div class="rpt-sec-label"><span>04</span><i></i><span>${esc(gapsHead.label)}</span></div>
      <h2>${esc(gapsHead.headline)}</h2>
      <p class="rpt-lede">${esc(gapsHead.lede)}</p>
      <div class="rpt-gaps">
        ${gaps
          .map(
            (g) => `<article class="rpt-gap">
              <div class="rpt-gap-top"><div class="rpt-gap-n">${g.n}</div><div><div class="rpt-gap-head">${esc(g.head)}</div><div class="rpt-gap-sub">${esc(g.sub)}</div></div></div>
              <div class="rpt-gap-foot"><div><span>→</span>${esc(g.win)}</div><em>${esc(g.phase)}</em></div>
            </article>`
          )
          .join('')}
      </div>

      <div class="rpt-close">
        <div>
          <div class="rpt-kicker is-peach">FREE 20-MIN CALL</div>
          <div class="rpt-close-head">${esc(close.head)}</div>
          <p>${esc(close.body)}</p>
          <div class="rpt-stats">
            <div><b>$10M+</b><span>client revenue</span></div>
            <div><b>600%</b><span>growth in a year · Rewired</span></div>
            <div><b>5 → 15</b><span>crew, same client</span></div>
          </div>
          <div class="rpt-close-actions">
            <a class="rpt-btn" href="${BOOKING_URL}">Book a free call</a>
            <a class="rpt-btn is-ghost" href="${esc(ctaHref.startsWith('http') ? ctaHref : '/flight-plan')}">See the full flight plan</a>
          </div>
          <div class="rpt-fine">30 minutes. We walk through your report and the three fixes first.</div>
        </div>
        <div class="rpt-phases">
          ${phases
            .map(
              (ph) => `<div class="rpt-phase ${ph.featured ? 'is-featured' : ''}">
                <div class="rpt-phase-n">${ph.n}</div>
                <div>
                  <div class="rpt-phase-top"><b>${esc(ph.name)}</b></div>
                  <div class="rpt-phase-goal">${esc(ph.goal)}</div>
                  <div class="rpt-phase-inc">${esc(ph.includes)}</div>
                </div>
              </div>`
            )
            .join('')}
        </div>
      </div>
    </section>`
    )}
    <p class="rpt-foot">Generated ${esc(generated)} · Data from Google Search, Google Maps, PageSpeed Insights, ChatGPT and Gemini.<br />This report currently works for US businesses only.</p>
  </div>`;
}
