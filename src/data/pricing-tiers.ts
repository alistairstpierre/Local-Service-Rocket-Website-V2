/* Shared Flight Plan pricing tiers for /get-started and the homepage offer (PricingOffer.astro).
   "at" = revenue when the tier fits, not a promise. Keep in sync with /flight-plan stages. */

/** One run of text in an "On top" line: bold price, plain text, or muted note. */
export type PricingSegment = { t: string; kind?: 'strong' | 'muted'; href?: string };

/** Mobile card "On top" row: label + muted note on the left, price on the right. */
export type PricingExtra = { label: string; note: string; value: string; href?: string };

export type PricingTier = {
  step: string;
  name: string;
  at: string;
  price: {
    prefix?: string;
    amount: string;
    unit: string;
    /** Desktop: put the unit on its own line under the amount */
    unitBelow?: boolean;
    /** Mobile card unit when it differs from the desktop one */
    unitMobile?: string;
  };
  /** Mobile card line under the price */
  priceSub: string;
  getsTo: string;
  included: string[];
  /** Desktop table "On top" cell */
  onTop: PricingSegment[][];
  /** Mobile card "On top" rows */
  extras: PricingExtra[];
  /** Which column to highlight as the default path */
  featured?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    step: '1',
    name: 'Pre-flight',
    at: '$0-25k months',
    price: { prefix: 'from ', amount: '$500', unit: '/mo' },
    priceSub: 'Where most shops start',
    getsTo: '1-3 booked estimates a day and $25k+ months.',
    included: ['Google profile fixed', 'Website (if needed)', '1:1 coaching', 'LSAs set up'],
    onTop: [
      [{ t: '$25', kind: 'strong' }, { t: ' per booked estimate' }],
      [{ t: 'only when it books', kind: 'muted' }],
    ],
    extras: [{ label: 'Per booked estimate', note: 'only when it books', value: '$25' }],
    featured: true,
  },
  {
    step: '2',
    name: 'Liftoff',
    at: '$25-100k months',
    price: { amount: '$1.5k', unit: '/mo' },
    priceSub: 'SEO + managed Google ads',
    getsTo: '$100k months on leads you own, not rent.',
    included: ['Everything in Pre\u2011flight', 'Deeper SEO', 'Managed Google ads'],
    onTop: [
      [{ t: '$50/day', kind: 'strong' }, { t: ' ads' }],
      [{ t: 'paid to Google', kind: 'muted' }],
      [
        { t: '$5k', kind: 'strong' },
        { t: ' ' },
        { t: 'branding', href: '/services/branding' },
        { t: ' (optional)', kind: 'muted' },
      ],
    ],
    extras: [
      { label: 'Ad spend', note: 'paid to Google', value: '$50/day' },
      { label: 'Branding', note: 'optional', value: '$5k', href: '/services/branding' },
    ],
  },
  {
    step: '3',
    name: 'Orbit',
    at: '$100-200k months',
    price: {
      amount: '20%',
      unit: 'of ad spend + $1.5k/mo',
      unitBelow: true,
      unitMobile: 'of ad spend',
    },
    priceSub: '+ $1.5k/mo',
    getsTo: 'A crew that runs without you. A shop you can sell.',
    included: ['Everything in Liftoff', 'Scaling spend, managed', 'Risk cover built in'],
    onTop: [
      [{ t: 'Hiring sprints' }, { t: ' (optional)', kind: 'muted' }],
      [
        { t: '$500', kind: 'strong' },
        { t: ' setup + ' },
        { t: '$500/mo', kind: 'strong' },
      ],
    ],
    extras: [{ label: 'Hiring sprints', note: 'optional', value: '$500 + $500/mo' }],
  },
];
