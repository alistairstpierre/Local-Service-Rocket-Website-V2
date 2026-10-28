/* Builds well / okay / poorly headlines for the Free Google Report.
   Used by free-report-render.ts so a #1 shop never gets losing copy.
   Every line is filled from live ranks, coverage, speed, and AI counts. */

export type CopyTier = 'well' | 'okay' | 'poor';

export function packTier(pack: number | null | undefined, maps?: number): CopyTier {
  if (typeof maps === 'number') {
    if (maps >= 3) return 'well';
    if (maps >= 1) return 'okay';
    return 'poor';
  }
  if (pack === 1) return 'well';
  if (pack === 2 || pack === 3) return 'okay';
  return 'poor';
}

export function coverageTier(you: number, leader: number): CopyTier {
  if (you >= 15 || (leader > 0 && you >= leader)) return 'well';
  if (you >= 5) return 'okay';
  return 'poor';
}

export function siteTier(input: {
  psi: number;
  fastest: boolean;
  h1Kw: boolean;
  titleKw: 'yes' | 'partial' | 'no';
}): CopyTier {
  const named = input.h1Kw || input.titleKw === 'yes';
  if (input.fastest && named) return 'well';
  if (input.psi >= 50 || named) return 'okay';
  return 'poor';
}

export function adsTier(youPay: boolean, rivalPay: number): CopyTier {
  if (youPay) return 'well';
  if (rivalPay === 0) return 'okay';
  return 'poor';
}

export function aiTier(you: number, rival: number, total: number): CopyTier {
  if (you > 0 && you >= rival) return 'well';
  if (you > 0) return 'okay';
  return total > 0 ? 'poor' : 'okay';
}

export function heroCopy(input: {
  overall: number;
  pack?: number | null;
  rivals: number;
  kwPlural: string;
  city: string;
  query: string;
}): { headline: string; sub: string } {
  const q = `‘${input.query}’`;
  if (input.overall === 1) {
    return {
      headline: `You’re #1 for ${q} in ${input.city}.`,
      sub: 'Here’s how your profile, site and AI search compare — and where the pack can still take a job from you.',
    };
  }
  if (input.overall >= 2) {
    return {
      headline: `You’re #${input.overall} overall for ${q} in ${input.city}.`,
      sub:
        input.pack === 1
          ? 'You’re first in the Map Pack. The overall score still includes reviews, website, and AI — that’s why another shop can sit above you here.'
          : 'Here’s how your profile, site and AI search compare.',
    };
  }
  return {
    headline: `${input.rivals} ${input.kwPlural} in ${input.city} show up for ${q}. You don’t.`,
    sub: 'Here’s how your profile, site and AI search compare.',
  };
}

export function packHeadlineCopy(input: {
  tier: CopyTier;
  pack?: number | null;
  maps?: number;
  address: boolean;
}): string {
  if (typeof input.maps === 'number') {
    if (input.maps >= 3) {
      return input.pack === 1
        ? 'Three searches. You’re on every map.'
        : 'Three searches. You’re on all 3 maps.';
    }
    if (input.maps === 2) return 'Three searches. You’re on 2 of them.';
    if (input.maps === 1) return 'Three searches. You’re on 1 of them.';
    return 'Three searches. Three phones. You’re on none of them.';
  }
  if (input.tier === 'well') return 'You’re #1 in the pack. Here’s who you’re beating — and where they still show up.';
  if (input.tier === 'okay') return `You’re #${input.pack} in the pack. Here’s who’s above you.`;
  return input.address
    ? 'You’re not in the top 3 — even from your own address.'
    : 'You’re not in the top 3 — even from the center of your service area.';
}

export function webHeadlineCopy(input: {
  tier: CopyTier;
  psi: number;
  fastest: boolean;
  named: boolean;
}): string {
  if (input.tier === 'well') return 'Fast site, and it says what you do.';
  if (input.named && !input.fastest) return 'It says what you do. The page is still slower than the pack.';
  if (!input.named && (input.fastest || input.psi >= 50)) return 'Fast site. Google just can’t tell what it’s about.';
  return 'Your website is slowing you down.';
}

export function adsHeadlineCopy(input: {
  tier: CopyTier;
  youPay: boolean;
  payingRivals: number;
  rivalCount: number;
  city: string;
  historyCount?: number;
  afterHours?: boolean;
  fromLocation?: boolean;
  locationLabel?: string;
}): {
  headline: string;
  takeaway: string;
} {
  const place = input.locationLabel || input.city;
  const local =
    input.fromLocation
      ? ` Only ads that Google showed from ${place} — not ads running in another city.`
      : '';
  const night =
    'Live Local Services Ads and Search Ads can be off at night or on a schedule.';
  if (input.afterHours && !input.youPay) {
    return {
      headline: `This report ran outside 8am–6pm in ${input.city}. Live ads were not on the page.`,
      takeaway: input.historyCount
        ? `Google Ads Transparency still shows recent ads for ${input.historyCount} of these shops. Re-run the report between 8am and 6pm to see the live Local Services Ads and Search Ads from ${place}.`
        : `Live ads are usually off overnight. Re-run the report between 8am and 6pm local time to see the ads that show from ${place}.`,
    };
  }
  if (input.tier === 'well') {
    return {
      headline: 'You’re already buying this search.',
      takeaway: `Keep the Google Guaranteed tile and the text ad honest. The shops that stop paying disappear from the top of the page.${local}`,
    };
  }
  if (input.payingRivals) {
    return {
      headline: `${input.payingRivals} of ${input.rivalCount} competitors have bought ads on this search.`,
      takeaway: `A homeowner can see a Google Guaranteed badge or a paid text ad before they see the map.${local}`,
    };
  }
  if (input.historyCount) {
    return {
      headline: `Nobody in ${input.city} is paying for this search right now.`,
      takeaway: `${night}${local} Google Ads Transparency still shows recent ads for ${input.historyCount} of these shops.`,
    };
  }
  return {
    headline: `Nobody in ${input.city} is paying for this search right now.`,
    takeaway: `${night}${local} No Local Services Ads, no Search Ads, and no recent ads in Transparency either.`,
  };
}

export function aiHeadlineCopy(input: {
  tier: CopyTier;
  you: number;
  total: number;
  rival: string;
  rivalCount: number;
}): { headline: string; why: string } {
  const whyBase =
    `We asked each question 3 times on ChatGPT and 3 times on Gemini (18 checks) and averaged the shortlists. AI pulls from the same signals as the Map Pack: reviews, listings, and a website that says what you do.`;
  if (input.tier === 'well') {
    return {
      headline: `Named in ${input.you} of ${input.total} AI answers. You’re on the shortlist.`,
      why: `${whyBase} You made ${input.you} of them.`,
    };
  }
  if (input.tier === 'okay') {
    return {
      headline: `Named in ${input.you} of ${input.total} AI answers. ${input.rival}: ${input.rivalCount}.`,
      why: `${whyBase} You made ${input.you}. ${input.rival} still shows up more.`,
    };
  }
  return {
    headline: `Named in ${input.you} of ${input.total} AI answers. ${input.rival}: ${input.rivalCount}.`,
    why: `${whyBase} Right now none of them point to you.`,
  };
}

export function gapsHeadingCopy(input: { pack: CopyTier; count: number }): { label: string; headline: string; lede: string } {
  if (input.pack === 'well') {
    return {
      label: 'WHERE YOU CAN STILL WIDEN THE LEAD',
      headline: input.count === 1 ? '1 gap still sits between you and a locked-in #1.' : `${input.count} gaps still sit between you and a locked-in #1.`,
      lede: 'Small misses the pack can still use. Closing them keeps the calls coming to you.',
    };
  }
  if (input.pack === 'okay') {
    return {
      label: 'WHERE YOU’RE LOSING GROUND',
      headline: `${input.count} gaps between you and #1.`,
      lede: 'What’s missing, what closing it gets you, and when it gets fixed.',
    };
  }
  return {
    label: 'WHERE YOU’RE LOSING',
    headline: `${input.count} gaps between you and the top 3.`,
    lede: 'What’s missing, what closing it gets you, and when it gets fixed.',
  };
}

export function packWhyCopy(): { why: string; improve: string } {
  return {
    why: 'The map on the phone only shows three shops. If you’re not one of them, most people never tap further.',
    improve:
      'Keep your Google profile complete and fresh, ask for reviews every week, and make your website easier to use.',
  };
}

export function webWhyCopy(): { why: string; improve: string } {
  return {
    why: 'People open a few tabs and call the shop that looks easiest to work with.',
    improve:
      'Make the site fast, clear, and easy to call. Write pages for the jobs you do — that helps Google and AI too. Links from other sites still help, especially with AI.',
  };
}

export function aiWhyCopy(): { why: string; improve: string } {
  return {
    why: 'Homeowners ask ChatGPT who to call, then they pick from that list.',
    improve:
      'Write website pages and publish articles containing the exact phrase you want to target. A big review count helps a lot too.',
  };
}

export function mapCtaCopy(tier: CopyTier, city: string): string {
  if (tier === 'well') return `Want to stay on every map a ${city} homeowner sees?`;
  return `Want to show up on all 3 searches in ${city}, not just one?`;
}

export function closerCopy(pack: CopyTier, _count: number): { head: string; body: string } {
  const head = 'Work with a company that makes your Google the perfect way for more customers to find you.';
  if (pack === 'well') {
    return {
      head,
      body: 'We keep the profile and site tight — and coach you 1:1 every week so the #1 spot doesn’t slide.',
    };
  }
  return {
    head,
    body: 'We do the marketing (profile and site) and coach you 1:1 every week so you understand every move and own the results. One team instead of eight vendors.',
  };
}
