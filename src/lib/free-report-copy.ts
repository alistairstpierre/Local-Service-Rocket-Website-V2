/* Builds well / okay / poorly headlines for the Free Google Report.
   Used by free-report-render.ts so a #1 shop never gets losing copy.
   Every line is filled from live ranks, coverage, speed, ads, and AI counts. */

export type CopyTier = 'well' | 'okay' | 'poor';

export function packTier(pack: number | null | undefined): CopyTier {
  if (pack === 1) return 'well';
  if (pack === 2 || pack === 3) return 'okay';
  return 'poor';
}

export function coverageTier(you: number, leader: number): CopyTier {
  if (you >= 15 || (leader > 0 && you >= leader)) return 'well';
  if (you >= 5) return 'okay';
  return 'poor';
}

export function siteTier(input: { psi: number; bestPsi: number; h1Kw: boolean; titleKw: 'yes' | 'partial' | 'no' }): CopyTier {
  const named = input.h1Kw || input.titleKw === 'yes';
  if (input.psi >= 80 && named) return 'well';
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
  tier: CopyTier;
  pack?: number | null;
  rivals: number;
  kwPlural: string;
  city: string;
  query: string;
}): { headline: string; sub: string } {
  const q = `‘${input.query}’`;
  if (input.tier === 'well') {
    return {
      headline: `You’re #1 for ${q} in ${input.city}.`,
      sub: 'Here’s how your profile, site and ads compare — and where the pack can still take a job from you.',
    };
  }
  if (input.tier === 'okay') {
    return {
      headline: `${input.rivals} ${input.kwPlural} in ${input.city} show up for ${q}. You’re #${input.pack}.`,
      sub: 'Here’s how your profile, site and ads compare.',
    };
  }
  return {
    headline: `${input.rivals} ${input.kwPlural} in ${input.city} show up for ${q}. You don’t.`,
    sub: 'Here’s how your profile, site and ads compare.',
  };
}

export function packHeadlineCopy(input: {
  tier: CopyTier;
  pack?: number | null;
  address: boolean;
}): string {
  if (input.tier === 'well') return 'You’re #1 in the pack. Here’s who you’re beating — and where they still show up.';
  if (input.tier === 'okay') return `You’re #${input.pack} in the pack. Here’s who’s above you.`;
  return input.address
    ? 'You’re not in the top 3 — even from your own address.'
    : 'You’re not in the top 3 — even from the center of your service area.';
}

export function gridAnswerCopy(input: {
  coverage: CopyTier;
  you: number;
  leader: string;
  leaderCov: number;
  second?: string;
  secondCov?: number;
  third?: string;
  thirdCov?: number;
}): string {
  const others = [
    `${input.leader} is in the top 3 at ${input.leaderCov} of 25`,
    input.second ? `${input.second} at ${input.secondCov ?? 0}` : '',
    input.third ? `${input.third} at ${input.thirdCov ?? 0}` : '',
  ]
    .filter(Boolean)
    .join('; ');

  if (input.coverage === 'well') {
    return `You hold the area: ${input.you} of 25 spots in the top 3. ${others}. Keep the profile complete so that circle doesn’t shrink.`;
  }
  if (input.coverage === 'okay') {
    return `You show up at ${input.you} of 25 spots. ${others}. They still take calls a mile out where you drop.`;
  }
  return `Across your area. ${others}. You: ${input.you} of 25. A stronger profile widens that circle — right now yours barely leaves the center.`;
}

export function webHeadlineCopy(input: {
  tier: CopyTier;
  psi: number;
  bestPsi: number;
  named: boolean;
}): string {
  if (input.tier === 'well') return 'Fast site, and it says what you do.';
  if (input.named && input.psi < input.bestPsi) return 'It says what you do. The page is still slower than the pack.';
  if (!input.named && input.psi >= 50) return 'Fast site. Google just can’t tell what it’s about.';
  return 'Your website is slowing you down.';
}

export function adsHeadlineCopy(input: { tier: CopyTier; youPay: boolean; payingRivals: number; rivalCount: number; city: string }): {
  headline: string;
  takeaway: string;
} {
  if (input.tier === 'well') {
    return {
      headline: 'You’re already buying this search.',
      takeaway: 'Keep the Google Guaranteed tile and the text ad honest. The shops that stop paying disappear from the top of the page.',
    };
  }
  if (input.payingRivals) {
    return {
      headline: `${input.payingRivals} of ${input.rivalCount} competitors have bought ads on this search.`,
      takeaway: 'A homeowner can see a Google Guaranteed badge or a paid text ad before they see the map.',
    };
  }
  return {
    headline: `Nobody in ${input.city} is paying for this search.`,
    takeaway: 'No Local Services Ads and no Search Ads on this keyword.',
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
    `Every one of the ${input.total} answers came back with a shortlist people call from. AI pulls from the same signals as the Map Pack: reviews, listings, and a website that says what you do.`;
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

export function mapCtaCopy(tier: CopyTier, city: string): string {
  if (tier === 'well') return `Want to stay #1 across ${city}, not just your own street?`;
  return `Want to rank across ${city}, not just your own street?`;
}

export function closerCopy(pack: CopyTier, count: number): { head: string; body: string } {
  if (pack === 'well') {
    return {
      head: count ? `One plan keeps all ${count} closed.` : 'One plan keeps the lead closed.',
      body: 'We keep the profile, site and ads tight — and coach you 1:1 every week so the #1 spot doesn’t slide.',
    };
  }
  return {
    head: `One plan closes all ${count}.`,
      body: 'We do the marketing (profile, site, ads) and coach you 1:1 every week so you understand every move and own the results. One team instead of eight vendors.',
  };
}
