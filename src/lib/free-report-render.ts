/* Builds the Free Google Report HTML from PublicReport JSON plus the design
   example dataset. Used only by /free-report/view.astro after the Railway
   poll succeeds. Layout matches Claude Design Files/Free Google Report.dc.html. */

import {
  adsHeadlineCopy,
  adsTier,
  aiHeadlineCopy,
  aiTier,
  closerCopy,
  coverageTier,
  gapsHeadingCopy,
  gridAnswerCopy,
  heroCopy,
  mapCtaCopy,
  packHeadlineCopy,
  packTier,
  siteTier,
  webHeadlineCopy,
} from './free-report-copy';
import {
  BOOKING_URL,
  EXAMPLE_AI_MATRIX,
  EXAMPLE_AI_PLATFORMS,
  EXAMPLE_AI_QUESTIONS,
  EXAMPLE_BIZ,
  EXAMPLE_BLURB,
  EXAMPLE_META,
  type ExampleAuth,
  type ExampleBiz,
} from './free-report-example';

export type PublicReportBusiness = {
  name: string;
  isSubject: boolean;
  packPosition?: number;
  scores: { gbp: number; website: number; ads: number; ai: number; overall: number };
  gbp: {
    rating?: number;
    reviewCount: number;
    reviewsLastWeek?: number;
    reviewsLastMonth?: number;
    reviewsLast3Months?: number;
    reviewsLast6Months?: number;
    hasDescription: boolean;
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
    reviewWeeks?: number[];
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
    advertiserFound?: boolean;
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

export type PublicAiSearch = {
  questions: string[];
  platforms: ('chatgpt' | 'gemini')[];
  matrix: string[][][];
  answers: { question: string; platform: 'chatgpt' | 'gemini'; text: string }[];
};

/** Empty report so mergeReport uses EXAMPLE_BIZ. */
export function examplePublicReport(): PublicReport {
  return {
    subjectName: EXAMPLE_BIZ.find((b) => b.you)?.name || 'Your shop',
    city: EXAMPLE_META.city,
    keyword: EXAMPLE_META.keyword,
    primaryCategory: 'Electrician',
    overallScore: 0,
    pillars: { gbp: 0, website: 0, ads: 0, ai: 0 },
    businesses: [],
    gaps: [],
    cta: { href: '/get-started', label: 'See how we close these gaps' },
    generatedAt: new Date().toISOString(),
    mapImageUrl: '/free-report/map.jpg',
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
    pillars: { gbp: 0, website: 0, ads: 0, ai: 0 },
    businesses: [],
    gaps: [],
    cta: { href: '/get-started', label: 'See how we close these gaps' },
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
  pillars: { gbp: number; website: number; ads: number; ai?: number };
  businesses: PublicReportBusiness[];
  aiSearch?: PublicAiSearch;
  gaps: string[];
  cta: { href: string; label: string };
  generatedAt?: string;
  /** One static map of the shop pin, reused on the Map Pack SERP, grids, and search-from cards. */
  mapImageUrl?: string;
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

const SHOP_PIN_SVG = `<svg class="rpt-from-icon" viewBox="0 0 40 48" aria-hidden="true"><path d="M20 46c8-10 16-18.4 16-28A16 16 0 1 0 4 18c0 9.6 8 18 16 28z" fill="${OR}" stroke="#fff" stroke-width="2"/><path d="M13.5 20.2V16.8c0-1.1.8-2 1.9-2h9.2c1.1 0 1.9.9 1.9 2v3.4H13.5zm0 1.6h13v6.6c0 1-.8 1.8-1.8 1.8h-9.4c-1 0-1.8-.8-1.8-1.8V21.8zm4.4 1.4h4.2v4.2h-4.2v-4.2z" fill="#fff"/></svg>`;

const SERVICE_AREA_SVG = `<svg class="rpt-from-area" viewBox="0 0 120 72" aria-hidden="true"><ellipse cx="60" cy="36" rx="54" ry="30" fill="${OR}" fill-opacity=".10" stroke="${OR}" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="4 3"/><ellipse cx="60" cy="36" rx="34" ry="18" fill="${OR}" fill-opacity=".12" stroke="${OR}" stroke-opacity=".7" stroke-width="1.5"/><ellipse cx="60" cy="36" rx="14" ry="8" fill="${OR}" fill-opacity=".2" stroke="${OR}" stroke-width="1.5"/><circle cx="60" cy="36" r="3.2" fill="${OR}" stroke="#fff" stroke-width="1.4"/></svg>`;

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

function hasHost(list: string[] | undefined, needle: string): boolean {
  return (list ?? []).some((item) => item.toLowerCase().includes(needle));
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
    bbb: live.website?.listedOnBBB ?? (siteOn ? example.bbb : false),
    chamber: listed('chamber') ?? (siteOn ? example.chamber : false),
    apple: listed('apple') ?? (siteOn ? example.apple : false),
    bing: listed('bing') ?? (siteOn ? example.bing : false),
    yp: listed('yellowpages') ?? (siteOn ? example.yp : false),
    nextdoor: listed('nextdoor') ?? (siteOn ? example.nextdoor : false),
    facebook: socials ? hasHost(socials, 'facebook.com') : heroOn ? example.facebook : false,
    instagram: socials ? hasHost(socials, 'instagram.com') : heroOn ? example.instagram : false,
    youtube: socials ? hasHost(socials, 'youtube.com') : heroOn ? example.youtube : false,
    linkedin: socials ? hasHost(socials, 'linkedin.com') : heroOn ? example.linkedin : false,
    yelp: reviews ? hasHost(reviews, 'yelp') : heroOn ? example.yelp : false,
    angi: reviews ? hasHost(reviews, 'angi') : heroOn ? example.angi : false,
    homeadvisor: reviews ? hasHost(reviews, 'homeadvisor') : heroOn ? example.homeadvisor : false,
    thumbtack: reviews ? hasHost(reviews, 'thumbtack') : heroOn ? example.thumbtack : false,
    press: 0,
    industry: 0,
  };
}

function overlayBiz(example: ExampleBiz, live: PublicReportBusiness, keyword: string, ready?: ReportReady): ExampleBiz {
  const siteOn = !ready || ready.website;
  const adsOn = !ready || ready.ads;
  const aiOn = !ready || ready.ai;
  const packOn = !ready || ready.pack;
  const heroOn = !ready || ready.hero;
  const title = live.website?.metaTitle ?? (siteOn ? example.title : live.name);
  const url = hostOf(live.website?.rootUrl || live.gbp.websiteUrl) || (siteOn ? example.url : '');
  return {
    ...example,
    name: live.name,
    short: shortName(live.name),
    pack: live.packPosition ?? null,
    you: live.isSubject,
    scores: {
      gbp: live.scores.gbp,
      web: siteOn ? live.scores.website : 0,
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
    you,
    scores: { gbp: 0, web: 0, ads: 0, ai: 0 },
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

function mergeReport(report: PublicReport): {
  biz: ExampleBiz[];
  keyword: string;
  marketQuery: string;
  city: string;
  generated: string;
  liveGaps: string[];
  mapImageUrl?: string;
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

  const rivals = liveRivals.length
    ? liveRivals.slice(0, 3).map((live, i) => overlayBiz(exampleRivals[i] ?? exampleRivals[0]!, live, keyword, ready))
    : streaming
      ? [ghostBiz('Looking up #1', 1), ghostBiz('Looking up #2', 2), ghostBiz('Looking up #3', 3)]
      : exampleRivals;

  const you = liveYou
    ? overlayBiz(exampleYou, liveYou, keyword, ready)
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
    ready,
  };
}

function overallOf(s: ExampleBiz['scores']): number {
  return Math.round(s.gbp * 0.35 + s.web * 0.28 + s.ads * 0.2 + s.ai * 0.17);
}

function exactScore(s: ExampleBiz['scores']): number {
  return s.gbp * 0.35 + s.web * 0.28 + s.ads * 0.2 + s.ai * 0.17;
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

function splitTitle(title: string, keyword: string): { before: string; match: string; after: string } {
  const roots = keywordRoots(keyword);
  const re = new RegExp(roots.map((r) => r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  const m = title.match(re);
  if (!m || m.index == null) return { before: title, match: '', after: '' };
  return { before: title.slice(0, m.index), match: m[0], after: title.slice(m.index + m[0].length) };
}

function rankCell(r: number | null): { t: string; bg: string; color: string } {
  if (r == null) return { t: '–', bg: '#cfd6dc', color: '#5f6368' };
  if (r <= 3) return { t: String(r), bg: Y, color: '#fff' };
  if (r <= 10) return { t: String(r), bg: '#f0b429', color: INK };
  return { t: String(r), bg: N, color: '#fff' };
}

function ringOf(i: number): number {
  return Math.max(Math.abs(Math.floor(i / 5) - 2), Math.abs((i % 5) - 2));
}

function rangeTxt(arr: (number | null)[]): string {
  const v = arr.filter((x): x is number => x != null);
  if (!v.length) return 'Not found';
  const mn = Math.min(...v);
  const mx = Math.max(...v);
  return mn === mx ? `#${mn}` : `#${mn}–${mx}`;
}

function rangeColor(arr: (number | null)[]): string {
  const v = arr.filter((x): x is number => x != null);
  if (!v.length) return N;
  const mx = Math.max(...v);
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
  const { biz: B, keyword, marketQuery, city, generated, liveGaps, mapImageUrl, ready } = mergeReport(report);
  const mapBg = mapImageUrl
    ? `<img class="rpt-map-bg" src="${esc(mapImageUrl)}" alt="" width="640" height="360" />`
    : '';
  const wait = (key: keyof ReportReady | 'all', label: string, inner: string) => {
    const on =
      ready &&
      (key === 'all' ? !(ready.hero && ready.pack && ready.website && ready.ads && ready.ai) : !ready[key]);
    if (!on) return inner;
    return `<div class="rpt-wait">${inner}<div class="rpt-wait-mask" role="status"><span class="rpt-spin" aria-hidden="true"></span><span>${esc(label)}</span></div></div>`;
  };
  const you = B.find((b) => b.you) ?? B[B.length - 1]!;
  const rivals = B.filter((b) => !b.you);
  const leader = rivals[0] ?? you;
  const cityName = city.split(',')[0] ?? city;
  const cityShort = city.toLowerCase();
  const kwPlural = keyword.endsWith('s') ? keyword : `${keyword}s`;
  const inPack = typeof you.pack === 'number' && you.pack <= 3;
  const youCenter = you.grid[12];
  const youCov = covOf(you);
  const weeksN = WEEKS_N;

  const pillarKeys = [
    ['GOOGLE PROFILE', 'gbp'],
    ['WEBSITE', 'web'],
    ['GOOGLE ADS', 'ads'],
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
      years: b.years,
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
      breakdown: pillarKeys.map(([short, key]) => ({ short, v: b.scores[key] })),
    }));
  const shopPairs = [shopCards.slice(0, 2), shopCards.slice(2, 4)].filter((pair) => pair.length);

  const heads = B.map((b, i) => ({
    name: b.short,
    tag: b.you ? 'YOU' : `#${b.pack} IN PACK`,
    tagShort: b.you ? 'YOU' : `PACK #${b.pack}`,
    tagColor: b.you ? OR : '#8a8a8a',
    bg: b.you ? TINT : 'transparent',
    radius: i === B.length - 1 ? '0 18px 0 0' : '0',
  }));

  const youPackLabel = inPack ? `#${you.pack} in the pack` : 'Not in the top 3';
  const youPackColor = inPack ? Y : N;

  const packLevel = packTier(you.pack);
  const coverLevel = coverageTier(youCov, covOf(leader));
  const hero = heroCopy({
    tier: packLevel,
    pack: you.pack,
    rivals: rivals.length,
    kwPlural,
    city: cityName,
    query: marketQuery,
  });
  const heroHeadline = hero.headline;
  const heroSub = hero.sub;
  const packHeadline = packHeadlineCopy({ tier: packLevel, pack: you.pack, address: you.address });
  const searchFrom = you.address ? 'your address' : 'the middle of your service area — your address is hidden';
  const searchFromLabel = you.address
    ? 'Searched from your address'
    : `Searched from the center of ${city} — your address is hidden`;

  const pins = [
    { n: 1, x: 22, y: 30 },
    { n: 2, x: 54, y: 52 },
    { n: 3, x: 76, y: 22 },
  ];

  const avgOf = (b: ExampleBiz) => b.weeks.slice(-weeksN).reduce((a, c) => a + c, 0) / weeksN;
  const activeOf = (b: ExampleBiz) => b.weeks.slice(-weeksN).filter((w) => w > 0).length;
  const maxW = Math.max(1, ...B.flatMap((b) => b.weeks.slice(-weeksN)));
  const reviewEngine = B.map((b) => {
    const ws = b.weeks.slice(-weeksN);
    const avg = avgOf(b);
    const active = activeOf(b);
    return {
      ...b,
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
    row('Keyword in business name', `More relevant for people searching “${marketQuery}”`, B, (b) => {
      const fit = nameKeywordFit(b.name, keyword);
      if (fit === 'yes') return yes(`“${marketQuery}”`);
      if (fit === 'weak') return part('says “electric”');
      return no('not in name');
    }),
    row('Primary category', 'What Google thinks you do', B, (b) =>
      num(b.cat, b.cat.toLowerCase() === keyword.toLowerCase() ? 'matches search' : 'mismatch', b.cat.toLowerCase() === keyword.toLowerCase() ? INK : N, '13px')
    ),
    row('Secondary categories', 'Extra services listed', B, (b) => num(b.secondary, 'added', b.secondary <= 1 ? N : INK)),
    row('Address shown', 'Street address on the pin', B, (b) => (b.address ? yes(b.addrShort) : no('hidden'))),
    row('Business description', 'The “About” paragraph', B, (b) => (b.desc ? yes('written') : no('missing'))),
    row('Hours · Book online', 'Actions on the profile', B, (b) =>
      b.hours && b.book ? yes('both') : b.hours || b.book ? part(b.hours ? 'hours only' : 'booking only') : no('neither')
    ),
    row('Years in business', 'How long Google shows the shop has been open', B, (b) =>
      b.years ? num(b.years, 'years') : no('not listed')
    ),
    row('Phone on profile', 'Call button on the listing', B, (b) => (b.phone ? yes('listed') : no('missing'))),
    row('Total reviews', 'Lifetime', B, (b) => num(fmt(b.reviews), `${b.rating.toFixed(1)} ★`, b.you ? N : INK)),
  ];

  const psiColor = (p: number) => (p >= 90 ? '#0cce6b' : p >= 50 ? '#ffa400' : '#ff4e42');
  const psiTrack = (p: number) => (p >= 90 ? '#dcf6e7' : p >= 50 ? '#fff0d6' : '#ffe3e1');
  const bestPsi = Math.max(...B.map((b) => b.psi));
  const speed = B.map((b) => ({
    ...b,
    deg: Math.round(b.psi * 3.6),
    color: psiColor(b.psi),
    track: psiTrack(b.psi),
    lcpLabel: `${(b.lcp / 1000).toFixed(1)}s`,
    tag: b.you ? (b.psi === bestPsi ? 'YOU · FASTEST SITE' : 'YOU') : `#${b.pack} IN PACK`,
    tagColor: b.you ? (b.psi === bestPsi ? Y : OR) : '#8a8a8a',
  }));

  const serp = B.map((b) => {
    const s = splitTitle(b.title, keyword);
    const st =
      b.titleKw === 'yes'
        ? { pill: Y, mark: '✓', status: `Says “${s.match.toLowerCase() || keyword}”` }
        : b.titleKw === 'partial'
          ? { pill: A, mark: '~', status: `“${s.match.toLowerCase()}” — close, not exact` }
          : { pill: N, mark: '✗', status: 'No service keyword' };
    return {
      ...b,
      ...s,
      ...st,
      desc:
        b.metaDesc ||
        'No meta description. Google picks random text from the page instead — “Welcome to our website. We are a family owned and operated business serving…”',
      descStyle: b.metaDesc ? 'normal' : 'italic',
      hlBg: s.match ? (b.titleKw === 'yes' ? '#e4f4ea' : '#fff3dc') : 'transparent',
      hlLine: s.match ? (b.titleKw === 'yes' ? Y : A) : 'transparent',
    };
  });

  const seoRows = [
    row('Page title has keyword', 'The blue link in Google', B, (b) =>
      b.titleKw === 'yes' ? yes(`“${keyword}”`) : b.titleKw === 'partial' ? part('close stem') : no('brand name only')
    ),
    row('Meta description', 'The grey text under the link', B, (b) => (b.metaDesc ? yes('written') : no('missing'))),
    row('H1 has keyword', 'Main headline on the homepage', B, (b) => (b.h1Kw ? yes('') : no(''))),
    row('H2s with keyword', 'Section headings, homepage', B, (b) => num(b.h2Kw, 'headings', b.h2Kw === 0 ? N : INK)),
    row('Image alt text w/ keyword', 'Share of images described', B, (b) => num(`${b.altKw}%`, 'of images', b.altKw === 0 ? N : INK)),
    row('Schema markup', 'Tells Google you’re a business', B, (b) => (b.schema ? yes('present') : no('none'))),
    row('Service pages', 'One page per service', B, (b) => num(b.servicePages, 'pages', b.servicePages < 3 ? N : INK)),
    row('Location pages', 'One page per city served', B, (b) => num(b.locationPages, 'pages')),
    row('SSL (https)', 'Padlock in the browser', B, (b) => (b.ssl ? yes('secure') : no('not secure'))),
    row('Privacy · Terms', 'Trust pages Google expects', B, (b) =>
      b.privacy && b.terms ? yes('both') : b.privacy || b.terms ? part(b.privacy ? 'privacy only' : 'terms only') : no('neither')
    ),
  ];

  const uxRows = [
    row('Phone number in header', 'Visible without scrolling', B, (b) => (b.ux.phoneHeader ? yes('') : no(''))),
    row('Tap-to-call on mobile', 'Number is a link', B, (b) => (b.ux.clickCall ? yes('') : no(''))),
    row('Call-to-action above the fold', '“Call now” / “Get a quote”', B, (b) => (b.ux.ctaFold ? yes('') : no(''))),
    row('Contact form', 'Any page', B, (b) => (b.ux.form ? yes('') : no(''))),
    row('Reviews shown on homepage', 'Stars a visitor can see', B, (b) => (b.ux.reviewsHome ? yes('') : no(''))),
    row('Map of service area', 'Embedded Google Map', B, (b) => (b.ux.map ? yes('') : no(''))),
  ];

  const CORE = ['bbb', 'chamber', 'apple', 'bing', 'yp', 'nextdoor'] as const;
  const LEAD = ['yelp', 'angi', 'homeadvisor', 'thumbtack'] as const;
  const SOC = ['facebook', 'instagram', 'youtube', 'linkedin'] as const;
  const cnt = (b: ExampleBiz, keys: readonly string[]) => keys.filter((k) => Boolean((b.auth as Record<string, unknown>)[k])).length;
  const ratio = (b: ExampleBiz, keys: readonly string[]): Cell => {
    const n = cnt(b, keys);
    return num(`${n}/${keys.length}`, '', n === keys.length ? Y : n <= keys.length / 3 ? N : INK);
  };
  const flag = (k: keyof ExampleAuth, okSub = '', noSub = '') => (b: ExampleBiz) => (b.auth[k] ? yes(okSub) : no(noSub));

  const authGroups = [
    {
      label: 'AT A GLANCE',
      rows: [
        row('Core listings', 'BBB, Chamber, Apple, Bing, Yellow Pages, Nextdoor', B, (b) => ratio(b, CORE)),
        row('Local lead sites', 'Yelp, Angi, HomeAdvisor, Thumbtack', B, (b) => ratio(b, LEAD)),
        row('Social profiles', 'Facebook, Instagram, YouTube, LinkedIn', B, (b) => ratio(b, SOC)),
        row('Websites linking to them', 'Referring domains', B, (b) => num(fmt(b.rd), '', b.you ? N : INK)),
      ],
    },
    {
      label: 'LISTINGS & CITATIONS',
      rows: [
        row('Better Business Bureau', 'bbb.org profile', B, flag('bbb', 'accredited', 'not listed')),
        row('Chamber of Commerce', 'Local chamber member page', B, flag('chamber', 'member', 'not a member')),
        row('Apple Maps', 'Siri and iPhone searches', B, flag('apple')),
        row('Bing Places', 'Bing and Copilot', B, flag('bing')),
        row('Yellow Pages', 'yellowpages.com', B, flag('yp')),
        row('Nextdoor', 'Neighborhood recommendations', B, flag('nextdoor')),
      ],
    },
    {
      label: 'LOCAL LEAD SITES',
      rows: [
        row('Yelp', 'Second-biggest review site', B, flag('yelp')),
        row('Angi', 'Formerly Angie’s List', B, flag('angi')),
        row('HomeAdvisor', 'Owned by Angi', B, flag('homeadvisor')),
        row('Thumbtack', 'Quote marketplace', B, flag('thumbtack')),
      ],
    },
    {
      label: 'SOCIAL',
      rows: [
        row('Facebook', 'Business page', B, flag('facebook')),
        row('Instagram', 'Linked from the website', B, flag('instagram')),
        row('YouTube', 'Channel with uploads', B, flag('youtube')),
        row('LinkedIn', 'Company page', B, flag('linkedin')),
      ],
    },
  ];

  const panelFor = (b: ExampleBiz) => ({
    name: b.short,
    tag: b.you ? 'YOU' : `#${b.pack} IN PACK`,
    tagColor: b.you ? OR : '#8a8a8a',
    bg: b.you ? TINT : '#fff',
    border: b.you ? '#f3c7ad' : '#e7e7e7',
    cov: covOf(b),
    covColor: covOf(b) >= 20 ? Y : covOf(b) >= 10 ? A : N,
    cells: b.grid.map((r, i) => ({ ...rankCell(r), border: i === 12 ? '3px solid #1a1a1a' : '0 solid transparent' })),
    c0: rangeTxt(b.grid.filter((_, i) => ringOf(i) === 0)),
    c0Color: rangeColor(b.grid.filter((_, i) => ringOf(i) === 0)),
    c1: rangeTxt(b.grid.filter((_, i) => ringOf(i) === 1)),
    c1Color: rangeColor(b.grid.filter((_, i) => ringOf(i) === 1)),
    c2: rangeTxt(b.grid.filter((_, i) => ringOf(i) === 2)),
    c2Color: rangeColor(b.grid.filter((_, i) => ringOf(i) === 2)),
  });
  const geoPanels = [panelFor(you), panelFor(leader)];
  const coverage = B.map((b) => ({
    name: b.short,
    cov: `${covOf(b)}/25`,
    w: Math.max(2, Math.round((covOf(b) / 25) * 100)),
    color: b.you ? OR : INK,
  }));
  const gridAnswer = gridAnswerCopy({
    coverage: coverLevel,
    you: youCov,
    leader: leader.short,
    leaderCov: covOf(leader),
    second: rivals[1]?.short,
    secondCov: rivals[1] ? covOf(rivals[1]) : undefined,
    third: rivals[2]?.short,
    thirdCov: rivals[2] ? covOf(rivals[2]) : undefined,
  });

  const lsaBiz = B.filter((b) => b.lsa).sort((a, b) => (a.lsa ?? 99) - (b.lsa ?? 99));
  const lsaTiles = lsaBiz.map((b) => ({
    name: b.name,
    rating: b.rating.toFixed(1),
    reviews: `(${fmt(b.reviews)})`,
    line: b.closes.startsWith('Open') ? `Open 24 hours · Serves ${cityName}` : `Serves ${cityName}`,
    badge: b.you ? 'YOU · GOOGLE GUARANTEED' : 'GOOGLE GUARANTEED',
    badgeColor: '#188038',
    badgeBg: '#188038',
    border: b.you ? OR : '#dadce0',
    borderStyle: 'solid',
    bg: b.you ? TINT : '#fff',
    nameWeight: b.you ? '700' : '400',
    you: b.you,
  }));
  while (lsaTiles.length < 3 && !you.lsa) {
    lsaTiles.push({
      name: you.name,
      rating: you.rating.toFixed(1),
      reviews: `(${fmt(you.reviews)})`,
      line: 'Not running Local Services Ads',
      badge: 'YOU — NOT HERE',
      badgeColor: N,
      badgeBg: N,
      border: OR,
      borderStyle: 'dashed',
      bg: TINT,
      nameWeight: '700',
      you: true,
    });
  }
  const adBiz = rivals.find((b) => b.searchAds && !b.lsa) || rivals.find((b) => b.searchAds) || leader;
  const liveAd = report.businesses.find((b) => b.ads?.searchAd?.title)?.ads?.searchAd;
  const ad = {
    site: adBiz.site,
    url: adBiz.url,
    initial: adBiz.site[0] ?? 'A',
    title: liveAd?.title || `Tampa ${keyword.replace(/^./, (c) => c.toUpperCase())} — Same-Day Service | Licensed & Insured`,
    desc: liveAd?.description || `Upfront pricing. ${fmt(adBiz.reviews)}+ five-star reviews. Panel upgrades, repairs, EV chargers. Call now for a free estimate.`,
  };
  const adsRows = [
    row('Local Services Ads', 'Google Guaranteed tiles', B, (b) => (b.lsa ? num(`#${b.lsa}`, 'slot', Y) : no('not running'))),
    row('Search Ads', 'Text ad on the keyword', B, (b) => (b.searchAds ? yes('running') : no('none'))),
    row('Ads history', 'Google Ads Transparency', B, (b) => (b.transparency ? yes('active advertiser') : no('no ads found'))),
  ];
  const payingRivals = rivals.filter((b) => b.lsa || b.searchAds).length;
  const youPay = Boolean(you.lsa || you.searchAds);
  const adsLevel = adsTier(youPay, payingRivals);
  const adsCopy = adsHeadlineCopy({
    tier: adsLevel,
    youPay,
    payingRivals,
    rivalCount: rivals.length,
    city,
  });
  const adsHeadline = adsCopy.headline;
  const adsTakeaway = adsCopy.takeaway;

  const liveAi = report.aiSearch?.questions.length && report.aiSearch.matrix.length ? report.aiSearch : undefined;
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
  const aiWhy = aiCopy.why;

  const youReviews8 = you.weeks.slice(-weeksN).reduce((a, c) => a + c, 0);
  const leaderReviews8 = leader.weeks.slice(-weeksN).reduce((a, c) => a + c, 0);
  const defaultGaps: { head: string; sub: string }[] = [];
  if (coverLevel !== 'well' || !inPack) {
    defaultGaps.push({
      head:
        packLevel === 'poor'
          ? 'You’re not in the Map Pack — not even at your own address.'
          : 'You’re in the pack at your address — and thin a mile out.',
      sub: `${youCenter ? `#${youCenter} at your front door. ` : ''}${leader.short} is top 3 at ${covOf(leader)} of 25 spots within 2 miles of you. You: ${youCov}.`,
    });
  }
  if (you.reviews + 20 < leader.reviews || youReviews8 < leaderReviews8) {
    defaultGaps.push({
      head: `${fmt(you.reviews)} reviews vs ${fmt(leader.reviews)} — and the pace is the real gap.`,
      sub: `You got ${youReviews8} reviews in the last ${weeksN} weeks. The pack leader got ${leaderReviews8}.`,
    });
  }
  if (!you.address) {
    defaultGaps.push({
      head: 'Your address is hidden.',
      sub: 'Service-area profiles rarely get a pin. Every competitor shows a street address.',
    });
  }
  if (!you.desc || you.secondary <= 1) {
    defaultGaps.push({
      head: `Thin profile: ${you.desc ? 'description present' : 'no description'}, ${you.secondary} secondary categor${you.secondary === 1 ? 'y' : 'ies'}.`,
      sub: 'Competitors list more secondary categories and post more often.',
    });
  }
  if (!(you.h1Kw && you.titleKw === 'yes')) {
    defaultGaps.push({
      head: `Your site title and H1 never say “${keyword}”.`,
      sub: `“${you.title}” ${you.metaDesc ? 'has a meta description.' : 'has no meta description.'} ${you.schema ? 'Schema is present.' : 'No schema.'}`,
    });
  }
  if (!youPay && payingRivals) {
    defaultGaps.push({
      head: `${payingRivals} competitor${payingRivals === 1 ? '' : 's'} run ads above the map.`,
      sub: 'Local Services Ads and Search Ads sit above the pack. You aren’t running ads.',
    });
  } else if (!youPay && packLevel === 'poor') {
    defaultGaps.push({
      head: 'Nobody is buying ads on this search.',
      sub: 'Local Services Ads and Search Ads sit above the pack when someone turns them on.',
    });
  }
  if (youM < mentionsOf(topRival)) {
    defaultGaps.push({
      head: `${AIP.length} AI assistants, ${aiTotal} answers, ${youM} mention${youM === 1 ? '' : 's'} of you.`,
      sub: `${topRival.short} was named in ${mentionsOf(topRival)}.`,
    });
  }
  if (cnt(you, CORE) < CORE.length) {
    defaultGaps.push({
      head: `${cnt(you, CORE)} of ${CORE.length} core listings.`,
      sub: `Competitors show up on the sites Google cross-checks, with ${fmt(Math.min(...rivals.map((b) => b.rd), you.rd))}+ referring domains. You have ${fmt(you.rd)}.`,
    });
  }
  if (!defaultGaps.length) {
    defaultGaps.push({
      head: 'The remaining gaps are small execution details.',
      sub: 'Keep reviews coming, keep the profile complete, and don’t let a rival buy the top of the page unchallenged.',
    });
  }
  const gapCards = (
    liveGaps.length
      ? liveGaps.map((g) => ({
          head: g,
          sub:
            /ads above the map/i.test(g) && !youPay
              ? 'You aren’t running ads.'
              : 'What this is costing you — and what closing it gets you.',
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
  const closesTxt = (n: number) => {
    const ids = gaps.filter((g) => g.phaseN === n).map((g) => g.n);
    return ids.length ? `CLOSES GAPS ${ids[0]}${ids.length > 1 ? `–${ids[ids.length - 1]}` : ''}` : 'KEEPS THEM CLOSED';
  };
  const phases = [
    { n: 1, name: 'Pre-flight', price: 'from $500/mo', goal: '1–3 booked jobs a day and $25k+ months.', includes: 'Google profile fixed · Website (if needed) · 1:1 coaching · LSAs set up · $25 per booked job', closes: closesTxt(1), featured: true },
    { n: 2, name: 'Liftoff', price: '$1.5k/mo', goal: '$25–100k months on traffic you own.', includes: 'Everything in Pre-flight · Deeper SEO · Managed Google Ads', closes: closesTxt(2), featured: false },
    { n: 3, name: 'Orbit', price: 'when you’re ready', goal: 'Scale past $100k months without it breaking.', includes: 'Everything in Liftoff · Scaling spend, managed · Risk cover built in', closes: closesTxt(3), featured: false },
  ];

  const namedOnSite = Boolean(you.h1Kw || you.titleKw === 'yes');
  const siteLevel = siteTier({ psi: you.psi, bestPsi, h1Kw: you.h1Kw, titleKw: you.titleKw });
  const webHeadline = webHeadlineCopy({ tier: siteLevel, psi: you.psi, bestPsi, named: namedOnSite });
  const gapsHead = gapsHeadingCopy({ pack: packLevel, count: gaps.length });
  const close = closerCopy(packLevel, gaps.length);
  const ctaHref = report.cta?.href || '/get-started';

  return `
  <div class="rpt">
    <div class="rpt-hero">
      <div class="rpt-eyebrow">FREE GOOGLE REPORT<span> · ${esc(generated)}</span></div>
      <h1>${esc(heroHeadline)}</h1>
      <p class="rpt-lede">${esc(heroSub)}</p>
      <div class="rpt-search"><span class="rpt-search-icon" aria-hidden="true"></span><span>${esc(marketQuery)} near ${esc(city)}</span></div>

      ${wait(
        'hero',
        'Finding the Map Pack and your Google profile',
        `<div class="rpt-shop-grid">
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
                    <div class="rpt-meta"><b>${esc(c.rating)}</b>${stars()}<span>(${esc(c.reviews)})</span>${c.years ? `<span>· ${c.years}+ yrs</span>` : ''}</div>
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
        <span>Ranked by overall score: Google profile 35% · website 28% · ads 20% · AI search 17%.</span>
        <a href="#gaps">See every gap ↓</a>
      </div>`
      )}
    </div>

    ${wait(
      'pack',
      'Searching 25 spots around the shop',
      `<section class="rpt-sec">
      <div class="rpt-sec-label"><span>01</span><i></i><span>GOOGLE MAP PACK</span></div>
      <h2>${esc(packHeadline)}</h2>
      <p class="rpt-lede">Searched “${esc(marketQuery)}” from ${esc(searchFrom)}, then from 24 more spots out to 2 miles. Three spots on the map decide who gets the call.</p>

      <div class="rpt-geo-top">
        <div class="rpt-serp">
          <div class="rpt-serp-head"><div class="rpt-mini-kicker is-muted">WHAT GOOGLE SHOWS</div><div class="rpt-serp-from">${esc(searchFromLabel)}</div></div>
          <div class="rpt-fake-map${mapImageUrl ? ' has-map' : ''}">
            ${mapBg}
            ${pins.map((pin) => `<div class="rpt-map-pin is-abs" style="left:${pin.x}%;top:${pin.y}%"><span>${pin.n}</span></div>`).join('')}
          </div>
          ${rivals
            .map(
              (r) => `<div class="rpt-serp-row">
                <div class="rpt-serp-name"><span>${esc(r.name)}</span><span>#${r.pack}</span></div>
                <div class="rpt-meta is-small"><span>${r.rating.toFixed(1)}</span>${stars()}<span>(${fmt(r.reviews)})</span></div>
                <div class="rpt-serp-line">${r.years}+ yrs · ${esc(r.addrShort)} · <span class="is-open">Open</span></div>
              </div>`
            )
            .join('')}
          <div class="rpt-serp-you">
            <div><div class="rpt-mini-kicker">YOU</div><div class="rpt-card-name">${esc(you.name)}</div></div>
            <div class="rpt-you-pack is-sm" style="color:${youPackColor}">${esc(youPackLabel)}</div>
          </div>
        </div>
        ${geoPanels
          .map(
            (g) => `<div class="rpt-geo" style="border-color:${g.border};background:${g.bg}">
              <div class="rpt-geo-head">
                <div><div class="rpt-mini-kicker" style="color:${g.tagColor}">${esc(g.tag)}</div><div class="rpt-card-name">${esc(g.name)}</div></div>
                <div class="rpt-geo-cov"><div style="color:${g.covColor}">${g.cov}</div><span>of 25 spots in top 3</span></div>
              </div>
              <div class="rpt-grid-map${mapImageUrl ? ' has-map' : ''}">
                ${mapBg}
                <div class="rpt-rings"></div>
                <div class="rpt-cells">${g.cells.map((c) => `<div><b style="background:${c.bg};color:${c.color};border:${c.border}">${esc(c.t)}</b></div>`).join('')}</div>
              </div>
              <div class="rpt-rings-stats">
                <div><div class="rpt-mini-kicker is-muted">${you.address ? 'AT THE ADDRESS' : 'AT THE CENTER'}</div><div style="color:${g.c0Color}">${esc(g.c0)}</div></div>
                <div><div class="rpt-mini-kicker is-muted">1 MILE OUT</div><div style="color:${g.c1Color}">${esc(g.c1)}</div></div>
                <div><div class="rpt-mini-kicker is-muted">2 MILES OUT</div><div style="color:${g.c2Color}">${esc(g.c2)}</div></div>
              </div>
            </div>`
          )
          .join('')}
      </div>

      <div class="rpt-legend is-map">
        <span><i class="dot is-green"></i>Top 3</span>
        <span><i class="dot is-yellow"></i>4–10</span>
        <span><i class="dot is-red"></i>11–20</span>
        <span><i class="dot is-grey"></i>Not found</span>
        <span><i class="dot is-ring"></i>Business address</span>
        <span class="rpt-map-credit">Map tiles</span>
      </div>

      <div class="rpt-geo-bottom">
        <div class="rpt-search-from">
          <div class="rpt-mini-kicker is-muted">WHERE WE SEARCH FROM</div>
          <div class="rpt-from-grid">
            <div class="rpt-from ${you.address ? 'is-active' : ''}">
              <div class="rpt-from-map is-shown${mapImageUrl ? ' has-map' : ''}">${mapBg}${SHOP_PIN_SVG}</div>
              <div class="rpt-from-title">Address shown</div>
              <div class="rpt-from-sub">We search from the pin on your profile.</div>
              ${you.address ? '<div class="rpt-from-tag">● THIS IS YOU</div>' : ''}
            </div>
            <div class="rpt-from ${you.address ? '' : 'is-active'}">
              <div class="rpt-from-map is-hidden${mapImageUrl ? ' has-map' : ''}">${mapBg}${SERVICE_AREA_SVG}</div>
              <div class="rpt-from-title">Address hidden</div>
              <div class="rpt-from-sub">We search from the middle of the service area on your profile.</div>
              ${you.address ? '' : '<div class="rpt-from-tag">● THIS IS YOU</div>'}
            </div>
          </div>
        </div>
        <div class="rpt-coverage">
          <div class="rpt-mini-kicker is-muted">TOP-3 COVERAGE</div>
          ${coverage
            .map(
              (a) => `<div class="rpt-cov-row">
                <div style="color:${a.color}">${esc(a.name)}</div>
                <div class="rpt-cov-bar"><i style="width:${a.w}%;background:${a.color}"></i></div>
                <strong>${esc(a.cov)}</strong>
              </div>`
            )
            .join('')}
          <div class="rpt-cov-note">Spots in the top 3, out of 25 within 2 miles</div>
        </div>
        <div class="rpt-callout">
          <div class="rpt-mini-kicker">THE BIG QUESTION</div>
          <div class="rpt-callout-head">Do the top 3 rank across your area — or only where they're located?</div>
          <div class="rpt-callout-body">${esc(gridAnswer)}</div>
        </div>
      </div>

      ${ctaBand('FREE 20-MIN CALL', mapCtaCopy(packLevel, cityName))}
    </section>`
    )}

    ${wait(
      'hero',
      'Counting reviews week by week',
      `<section class="rpt-sec is-tight">
      <h3>Consistency beats volume. New reviews, week by week.</h3>
      <p class="rpt-lede">Google trusts a steady stream more than a big number. The last ${weeksN} weeks, side by side.</p>
      <div class="rpt-reviews">
        ${reviewEngine
          .map(
            (b) => `<article class="rpt-rev ${b.you ? 'is-you' : ''}">
              <div class="rpt-rev-top"><div>${esc(b.short)}</div><span style="color:${b.you ? OR : '#8a8a8a'}">${b.you ? 'YOU' : `#${b.pack}`}</span></div>
              <div class="rpt-rev-avg"><b style="color:${b.avgColor}">${b.avg}</b><span>reviews / week</span></div>
              <div class="rpt-rev-bars">${b.bars.map((w) => `<i style="height:${w.h}%;background:${w.color}"></i>`).join('')}</div>
              <div class="rpt-rev-axis"><span>${weeksN} wks ago</span><span>this week</span></div>
              <div class="rpt-rev-foot"><div><b style="color:${b.activeColor}">${b.active}</b><span>weeks with a review</span></div><div class="is-right"><b>${fmt(b.reviews)}</b><span>total · ${b.rating.toFixed(1)} ★</span></div></div>
            </article>`
          )
          .join('')}
      </div>
    </section>

    <section class="rpt-sec is-tight">
      <h3>Profile, line by line.</h3>
      ${boardHtml('GOOGLE BUSINESS PROFILE', heads, gbpRows)}
    </section>`
    )}

    ${wait(
      'website',
      'Crawling sites and checking mobile speed',
      `<section class="rpt-sec">
      <div class="rpt-sec-label"><span>02</span><i></i><span>WEBSITE</span></div>
      <h2>${esc(webHeadline)}</h2>
      <p class="rpt-lede">Speed, what Google reads, and whether a visitor can actually call you.</p>

      <div class="rpt-mini-kicker is-muted rpt-block-kicker">MOBILE SPEED · GOOGLE PAGESPEED</div>
      <div class="rpt-speed">
        ${speed
          .map(
            (s) => `<article class="rpt-speed-card ${s.you ? 'is-you' : ''}">
              <div class="rpt-speed-ring" style="background:conic-gradient(${s.color} 0 ${s.deg}deg,${s.track} 0)"><div style="color:${s.color}">${s.psi}</div></div>
              <div><div class="rpt-card-name">${esc(s.short)}</div><div class="rpt-speed-lcp">Loads in <b>${esc(s.lcpLabel)}</b></div><div class="rpt-mini-kicker" style="color:${s.tagColor}">${esc(s.tag)}</div></div>
            </article>`
          )
          .join('')}
      </div>

      <div class="rpt-mini-kicker is-muted rpt-block-kicker">HOW EACH SITE SHOWS UP IN GOOGLE</div>
      <div class="rpt-serps">
        ${serp
          .map(
            (s) => `<article class="rpt-blue ${s.you ? 'is-you' : ''}">
              <div class="rpt-blue-body">
                <div class="rpt-blue-site"><div class="rpt-fav">${esc(s.site[0] ?? '?')}</div><div><div>${esc(s.site)}</div><div class="rpt-blue-url">https://${esc(s.url)}</div></div></div>
                <div class="rpt-blue-title">${esc(s.before)}<span style="background:${s.hlBg};border-bottom:2px solid ${s.hlLine}">${esc(s.match)}</span>${esc(s.after)}</div>
                <div class="rpt-blue-desc" style="font-style:${s.descStyle}">${esc(s.desc)}</div>
              </div>
              <div class="rpt-blue-foot">
                <div><span class="rpt-mark" style="background:${s.pill}">${s.mark}</span><div><div class="rpt-mini-kicker is-muted">TITLE</div><div>${esc(s.status)}</div></div></div>
                <div><span class="rpt-mark" style="background:${s.h1Kw ? Y : N}">${s.h1Kw ? '✓' : '✗'}</span><div><div class="rpt-mini-kicker is-muted">H1 ON PAGE</div><div>“${esc(s.h1)}”</div></div></div>
              </div>
            </article>`
          )
          .join('')}
      </div>

      ${boardHtml('SEO & SETTINGS', heads, seoRows)}
      <div class="rpt-mini-kicker is-muted rpt-block-kicker">CAN A VISITOR ACTUALLY CALL YOU?</div>
      ${boardHtml('USABILITY', heads, uxRows)}

      <h3 class="rpt-after">Who vouches for each business?</h3>
      <p class="rpt-lede">Google cross-checks you against the sites it already trusts. Listings, lead sites, and socials.</p>
      <div class="rpt-board">
        <div class="rpt-board-inner">
          <div class="rpt-board-head" style="grid-template-columns:minmax(170px,1.2fr) repeat(${heads.length},minmax(120px,1fr))">
            <div class="rpt-board-kicker">AUTHORITY</div>
            ${heads
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
                  (rowItem) => `<div class="rpt-board-row is-tight" style="grid-template-columns:minmax(170px,1.2fr) repeat(${heads.length},minmax(120px,1fr))">
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
        siteLevel === 'well' ? 'Keep the site saying what you do.' : you.psi === bestPsi ? 'Fast site. It just needs to say what you do.' : 'Most of these are week-one fixes.',
        'Title, H1, description and schema are quick wins. We’ll show you what to change first and why.'
      )}
    </section>`
    )}

    ${wait(
      'ads',
      'Checking Local Services Ads and Search Ads',
      `<section class="rpt-sec">
      <div class="rpt-sec-label"><span>03</span><i></i><span>GOOGLE ADS</span></div>
      <h2>${esc(adsHeadline)}</h2>
      <p class="rpt-lede">Before anyone scrolls to the map, this is the top of the page.</p>
      <div class="rpt-ads">
        <div class="rpt-ad-serp">
          <div class="rpt-search is-in"><span class="rpt-search-icon"></span><span>${esc(marketQuery)} ${esc(cityShort)}</span></div>
          <div class="rpt-ad-kicker">Sponsored</div>
          <div class="rpt-ad-sub">Local Services Ads · Google Guaranteed</div>
          <div class="rpt-lsa">
            ${lsaTiles
              .map(
                (t) => `<div class="rpt-lsa-tile" style="border:${t.borderStyle} 1px ${t.border};background:${t.bg}">
                  <div class="rpt-lsa-badge" style="color:${t.badgeColor}"><span style="background:${t.badgeBg}">✓</span>${esc(t.badge)}</div>
                  <div class="rpt-lsa-name" style="font-weight:${t.nameWeight}">${esc(t.name)}</div>
                  <div class="rpt-meta is-small"><span>${esc(t.rating)}</span><span class="rpt-stars">★</span> ${esc(t.reviews)}</div>
                  <div class="rpt-lsa-line">${esc(t.line)}</div>
                </div>`
              )
              .join('')}
          </div>
          <div class="rpt-ad-kicker">Sponsored</div>
          <div class="rpt-blue-site"><div class="rpt-fav">${esc(ad.initial)}</div><div><div>${esc(ad.site)}</div><div class="rpt-blue-url">https://${esc(ad.url)}</div></div></div>
          <div class="rpt-blue-title">${esc(ad.title)}</div>
          <div class="rpt-blue-desc">${esc(ad.desc)}</div>
          <div class="rpt-ad-map">↓ Map Pack appears below this</div>
        </div>
        <div class="rpt-ad-board">
          ${boardHtml('PAID', heads, adsRows, 'is-flush')}
          <div class="rpt-ad-take"><div class="rpt-mini-kicker">WHAT THIS MEANS</div><div>${esc(adsTakeaway)}</div></div>
        </div>
      </div>
    </section>`
    )}
  </div>

  ${wait(
    'ai',
    'Asking ChatGPT and Gemini three homeowner questions',
    `<section class="rpt-ai">
    <div class="rpt-ai-inner">
      <div class="rpt-sec-label is-peach"><span>04</span><i></i><span>AI SEARCH · CHATGPT & GEMINI</span></div>
      <h2>${esc(aiHeadline)}</h2>
      <p class="rpt-lede is-dim">We asked ChatGPT and Gemini the three questions a ${esc(cityName)} homeowner actually types. Every answer came back with a shortlist. Here's who made it.</p>
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
        <div class="rpt-callout">
          <div class="rpt-mini-kicker">WHY THIS MATTERS</div>
          <div class="rpt-callout-head">Homeowners are asking AI first, and calling from its shortlist.</div>
          <div class="rpt-callout-body">${esc(aiWhy)}</div>
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

      <div class="rpt-mini-kicker is-dim rpt-block-kicker">TWO OF THE ${aiTotal} ANSWERS, WORD FOR WORD</div>
      <div class="rpt-chats">
        <article class="rpt-chat">
          <header><span class="rpt-ai-logo" style="background:#10a37f">GPT</span><b>ChatGPT</b><time>${esc(generated)}</time></header>
          <div class="rpt-chat-body">
            <div class="rpt-bubble">${esc(gptAnswer?.question ?? AIQ[0] ?? '')}</div>
            ${
              gptAnswer?.text
                ? gptAnswer.text.split(/\n+/).map((p) => `<p>${esc(p)}</p>`).join('')
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
                ? gemAnswer.text.split(/\n+/).map((p) => `<p>${esc(p)}</p>`).join('')
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
      <div class="rpt-sec-label"><span>05</span><i></i><span>${esc(gapsHead.label)}</span></div>
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
          <div class="rpt-fine">20 minutes. We walk through your report, what we'd fix first and what it costs.</div>
        </div>
        <div class="rpt-phases">
          ${phases
            .map(
              (ph) => `<div class="rpt-phase ${ph.featured ? 'is-featured' : ''}">
                <div class="rpt-phase-n">${ph.n}</div>
                <div>
                  <div class="rpt-phase-top"><b>${esc(ph.name)}</b><span>${esc(ph.price)}</span></div>
                  <div class="rpt-phase-goal">${esc(ph.goal)}</div>
                  <div class="rpt-phase-inc">${esc(ph.includes)}</div>
                  <div class="rpt-phase-closes">${esc(ph.closes)}</div>
                </div>
              </div>`
            )
            .join('')}
        </div>
      </div>
    </section>`
    )}
    <p class="rpt-foot">Generated ${esc(generated)} · Data from Google Search, Google Maps, PageSpeed Insights, Google Ads Transparency, ChatGPT and Gemini.</p>
  </div>`;
}
