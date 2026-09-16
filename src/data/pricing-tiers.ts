/* Shared Flight Plan pricing tiers for /get-started and the homepage offer.
   Band = revenue when the tier fits, not a promise. Keep in sync with /flight-plan stages. */

export type PricingRow = { label: string; value: string; href?: string };

export type PricingTier = {
  step: string;
  name: string;
  band: string;
  price: string;
  unit: string;
  /** Keep unit the same weight/color as the price (e.g. Orbit % of ad spend) */
  unitStrong?: boolean;
  sub: string;
  /** Which card to highlight as the default path */
  featured?: boolean;
  rows: PricingRow[];
};

export const pricingTiers: PricingTier[] = [
  {
    step: '1',
    name: 'Pre-flight',
    band: '$20-25K MONTHS',
    price: 'from $500',
    unit: '/mo',
    sub: 'Organic + LSA booking jobs',
    featured: true,
    rows: [
      { label: 'Website build (if needed)', value: '$2k' },
      { label: 'LSA setup', value: '$500' },
      { label: 'Per booked call we QA', value: '$25' },
    ],
  },
  {
    step: '2',
    name: 'Liftoff',
    band: '$25-100K MONTHS',
    price: '$1.5k',
    unit: '/mo',
    sub: 'SEO and Search ads together',
    rows: [
      { label: 'Deeper SEO and Google Search', value: 'included' },
      { label: 'Branding: logo, truck, cards, shirts', value: '$5k', href: '/services/branding' },
      { label: 'Search ad spend to start', value: '$50/day' },
      { label: 'Traffic you own, not rented', value: 'the goal' },
    ],
  },
  {
    step: '3',
    name: 'Orbit',
    band: '$100-200K MONTHS',
    price: '20% of ad spend',
    unit: '+ $1.5k/mo',
    unitStrong: true,
    sub: 'Scaled Search, hiring, risk cover',
    rows: [
      { label: 'Hiring sprint setup (optional)', value: '$500' },
      { label: 'Hiring sprint while live (optional)', value: '$500/mo' },
      { label: 'Hiring ads, about 10 days (optional)', value: '$30-50/day' },
      { label: 'Risk cover as budgets scale', value: 'built in' },
    ],
  },
];
