/* Trade landing-page content for /for/[slug] SEO/ad pages.
   Who We Help grid lives on /marketing-for-service-companies.
   Homepage (`/`) is electrician-led. Titles/H1s follow docs/SITE-STRUCTURE-AND-SEO-GUIDE.md Part 7. */

export type TradeFaq = { q: string; a: string };

export type TradeLanding = {
  slug: string;
  /** Matches homepage Who We Help label */
  label: string;
  icon: string;
  /** Singular owner-facing noun, e.g. electrician */
  ownerNoun: string;
  /** Plural for “companies”, e.g. electrical companies */
  companyPlural: string;
  /** Primary search phrase near start of title/H1 */
  keyword: string;
  /** Full document title including | Local Service Rocket (60–90 chars) */
  title: string;
  description: string;
  /** Single H1, 20–60 chars, keyword near start */
  h1: string;
  heroSub: string;
  problemH2: string;
  problemBody: string[];
  solutionH2: string;
  solutionBody: string[];
  /** Short proof line under testimonials eyebrow */
  proofAngle: string;
  /** Which case study to spotlight first */
  spotlight: 'rewired' | 'honest-hanks' | 'dry-duck' | 'hooked-up';
  faqs: TradeFaq[];
  /** Part 7 FAQ section H2. Defaults in TradeLayout if omitted. */
  faqH2?: string;
  ctaH2: string;
  ctaLine: string;
};

const brand = 'Local Service Rocket';

function t(segment: string) {
  return `${segment} | ${brand}`;
}

export const trades: TradeLanding[] = [
  {
    slug: 'electrician-marketing',
    label: 'Electrical',
    icon: '/assets/trade-electrical.svg',
    ownerNoun: 'electrician',
    companyPlural: 'electrical companies',
    keyword: 'marketing for electricians',
    title: t('Marketing for Electricians That Books Jobs'),
    description:
      'Marketing for electricians on Google: profile, Local SEO, LSAs, converting sites. Start around $500/month. Book onboarding online.',
    h1: 'Marketing for Electricians That Books Jobs',
    heroSub:
      'No $5k setup. No pitch call. $500 a month, and the fee only climbs when your shop does.',
    problemH2: 'Why Most Electrician Ads Waste Money',
    problemBody: [
      'Wrong Google category, a brochure site, or Search before the basics burns money.',
      'That looks like feast-or-famine weeks, idle techs, then panic hiring.',
    ],
    solutionH2: 'Google Systems Built for Electrical Shops',
    solutionBody: [
      'A flight plan, not a retainer dump: profile, website, Local Services Ads first, Search later. About $500/mo to start.',
      'Same path Rewired and Honest Hank\'s used: prove booked work before big ad spend.',
    ],
    proofAngle: 'Electrical shops we still work with years later.',
    spotlight: 'rewired',
    faqs: [
      {
        q: 'What does marketing for electricians include with LSR?',
        a: 'Google profile, converting site, Local Services Ads, Search when ready, reviews, optional hiring. We track booked jobs.',
      },
      {
        q: 'How is this different from the homepage?',
        a: 'Same offer: $500/mo start, fee climbs with the shop. This page is the ads landing to book.',
      },
      {
        q: 'Do you only work with residential electricians?',
        a: 'We specialize in residential shops that win on Google search, Maps, and reviews. If that is how customers find you, we are a fit.',
      },
      {
        q: 'What does an electrician marketing agency cost?',
        a: 'About $500/mo to start. Fee steps up only as you grow. Most shops only ever get quoted the other way around.',
      },
    ],
    faqH2: 'Before You Hire Marketing for Electricians',
    ctaH2: 'Skip the Pitch. Book Onboarding at $500',
    ctaLine: 'Watch the model, see the price, book yourself. No sales call.',
  },
  {
    slug: 'plumber-marketing',
    label: 'Plumbing',
    icon: '/assets/trade-plumbing.svg',
    ownerNoun: 'plumber',
    companyPlural: 'plumbing companies',
    keyword: 'plumber marketing',
    title: t('Plumber Marketing for Growing Shops'),
    description:
      'Marketing company for plumbers who want Google leads that book: Local SEO, LSAs, Search ads, and websites built for emergency and install intent.',
    h1: 'Plumber Marketing for Growing Shops',
    heroSub:
      'A marketing company for plumbers that runs Google as a system: Maps visibility, reviews, LSAs, and pages that convert emergency and install searches into booked jobs.',
    problemH2: 'Plumbing Leads Die Without a System',
    problemBody: [
      'Homeowners searching for a plumber are ready to book. If your profile is thin, your site confuses them, or ads land on a generic homepage, they call the next listing.',
      'Lead portals and lazy Facebook spend feel busy while the shops owning map pack and Local Services Ads quietly take the profitable work.',
    ],
    solutionH2: 'What a Marketing Company for Plumbers Should Do',
    solutionBody: [
      'We build plumber marketing around Keyword Planner demand, GBP done properly, review velocity, and paid lanes that match how plumbing is bought: Local Services Ads first, Search when the site and tracking can handle it.',
      'You get one partner accountable for booked work climbing from Google, not a rotating roster of account managers.',
    ],
    proofAngle: 'Same Google spine we use for electrical and waterproofing shops.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Is this a marketing company for plumbers only?',
        a: 'We work across home service trades. Plumbing is a core fit because search intent is strong and Google still decides who gets the call.',
      },
      {
        q: 'Do you run Google Ads for plumbers?',
        a: 'Yes. We usually start with Local Services Ads and foundations, then add Search once the profile and site convert. We don’t dump budget into paid before the basics work.',
      },
      {
        q: 'Can you help with emergency plumbing keywords?',
        a: 'Yes. We prioritize high-intent services and cities the way homeowners actually type them, then build pages and ads that match that demand without keyword stuffing.',
      },
      {
        q: 'What results should plumbing companies expect?',
        a: 'We optimize for booked jobs and revenue capacity, not screenshot vanity. Timeline depends on competition and how fast you sell and staff the work we generate.',
      },
    ],
    ctaH2: 'Want a Marketing Partner Built for Plumbers?',
    ctaLine: 'See the Flight Plan, then schedule onboarding when you’re ready.',
  },
  {
    slug: 'hvac-marketing',
    label: 'HVAC',
    icon: '/assets/trade-hvac.svg',
    ownerNoun: 'HVAC owner',
    companyPlural: 'HVAC companies',
    keyword: 'HVAC marketing',
    title: t('HVAC Marketing That Fills the Calendar'),
    description:
      'HVAC marketing for install and service shops: Google Business Profile, Local SEO, LSAs, and ads that book tune-ups, replacements, and emergency calls.',
    h1: 'HVAC Marketing That Fills the Calendar',
    heroSub:
      'Seasonal spikes don’t excuse a broken Google system. We build HVAC marketing that books service and replacement work year-round.',
    problemH2: 'Seasonal Panic Is Not a Growth Plan',
    problemBody: [
      'HVAC shops often overdose on ads when the heat hits, then go quiet in shoulder seasons. Without profile strength, reviews, and a converting site, paid spend fights itself every summer.',
      'Tech capacity and dispatch get chaotic because lead quality and timing were never engineered, only bought in a rush.',
    ],
    solutionH2: 'HVAC Marketing Built on Google Intent',
    solutionBody: [
      'We align Local SEO, LSAs, and Search to how homeowners search for HVAC repair, maintenance, and installs. Foundations first, then budget that scales with what your crew can actually run.',
      'Hiring campaigns sit beside demand gen when you’re ready for another tech, not after you’re already drowning.',
    ],
    proofAngle: 'Google systems for shops that live and die on booked calls.',
    spotlight: 'rewired',
    faqs: [
      {
        q: 'Do you handle both residential HVAC service and installs?',
        a: 'Yes. We prioritize the services and areas with real Keyword Planner demand and build pages, GBP services, and ads around those intents.',
      },
      {
        q: 'Can HVAC marketing help in the off-season?',
        a: 'That’s when foundations and maintenance offers matter most. We keep the profile and site strong so you’re not starting from zero every peak season.',
      },
      {
        q: 'Do you run Local Services Ads for HVAC?',
        a: 'When your trade and market support LSA, we turn it on early. It’s often the cleanest path to booked calls before heavy Search spend.',
      },
      {
        q: 'How do you track HVAC marketing results?',
        a: 'Booked jobs and Google-driven revenue trends beat perfect multi-touch attribution. We watch the pulse with you and fix leaks fast.',
      },
    ],
    ctaH2: 'Ready to Steady HVAC Demand on Google?',
    ctaLine: 'Watch the onboarding video, then book a call. No sales theater.',
  },
  {
    slug: 'roofing-marketing',
    label: 'Roofing',
    icon: '/assets/trade-roofing.svg',
    ownerNoun: 'roofer',
    companyPlural: 'roofing companies',
    keyword: 'roofing marketing',
    title: t('Roofing Marketing for Storm and Repair'),
    description:
      'Roofing marketing focused on Google trust: Local SEO, reviews, LSAs where available, and landing pages that turn storm and repair searches into estimates.',
    h1: 'Roofing Marketing for Storm and Repair',
    heroSub:
      'Storm chasers and thin websites burn trust. We build roofing marketing that ranks, reviews, and converts the homeowners already searching.',
    problemH2: 'Storm Season Without Trust Costs Jobs',
    problemBody: [
      'Roofing is noisy after weather events. Homeowners compare reviews, map presence, and how professional you look online before they allow anyone on the roof.',
      'Agencies that only buy leads or spray Facebook ads leave you indistinguishable from the worst door-knockers in town.',
    ],
    solutionH2: 'Roofing Marketing That Earns the Estimate',
    solutionBody: [
      'We tighten GBP, review velocity, service pages, and paid lanes so your company looks like the safe local choice. Structure before flashy creative.',
      'When you’re ready to grow the crew, hiring campaigns use the same direct style that works for other trades.',
    ],
    proofAngle: 'Proof over portals: Google systems owners can keep.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Is roofing marketing mostly storm leads?',
        a: 'Storm demand matters, but durable companies also win repair and replacement search year-round. We build for both instead of gambling only on weather.',
      },
      {
        q: 'Can you help with insurance-related roofing inquiries?',
        a: 'We optimize for how homeowners search and what converts on your site. Sales process for insurance work stays on your team; we supply qualified demand.',
      },
      {
        q: 'Do roofing companies need Local SEO or just ads?',
        a: 'Both. Ads without a trusted profile and site waste spend. SEO without capacity to answer and estimate wastes rankings. We sequence both.',
      },
      {
        q: 'What’s different about Local Service Rocket?',
        a: 'One primary partner, fees that scale with you, and booked-work accountability instead of lead theater.',
      },
    ],
    ctaH2: 'Want Roofing Marketing Homeowners Trust?',
    ctaLine: 'See client results, then schedule onboarding.',
  },
  {
    slug: 'waterproofing-marketing',
    label: 'Waterproofing',
    icon: '/assets/trade-waterproofing.svg',
    ownerNoun: 'waterproofing owner',
    companyPlural: 'waterproofing companies',
    keyword: 'waterproofing marketing',
    title: t('Waterproofing Marketing From Zero to Scale'),
    description:
      'Waterproofing marketing for basement and foundation shops: brand, Google profile, Local SEO, and ads that booked Dry Duck from a standing start toward $200k months.',
    h1: 'Waterproofing Marketing That Scales Fast',
    heroSub:
      'From new brands to established crews, we build waterproofing marketing on Google: site, profile, SEO first, ads when the foundation holds.',
    problemH2: 'New Brands Hit a Visibility Cliff',
    problemBody: [
      'Waterproofing searches are high-stakes for homeowners. A weak site or empty profile loses the job before you quote. New Google properties also get an early surge, then a brutal average-out if foundations are soft.',
      'Agencies that celebrate month-one spikes without preparing you for month two leave owners overstaffed and stressed.',
    ],
    solutionH2: 'The Dry Duck Playbook for Waterproofing',
    solutionBody: [
      'We launched Dry Duck with brand polish, a converting site, and Local SEO on starter economics, then rode the cliff and layered ads as the company matured toward $200k months and a real crew.',
      'Same honesty applies to existing waterproofing companies: structure first, paid second, fees that match risk as you grow.',
    ],
    proofAngle: 'Dry Duck: $0 → ~$200k months from a standing start.',
    spotlight: 'dry-duck',
    faqs: [
      {
        q: 'Do you only market basement waterproofing?',
        a: 'Basement waterproofing is a proven lane for us. If your waterproofing offer is residential and Google-driven, we should talk about fit.',
      },
      {
        q: 'Can you launch a brand-new waterproofing company?',
        a: 'Yes. Dry Duck started from ideation. We still tell you about the month-two cliff so capacity planning stays sane.',
      },
      {
        q: 'Should waterproofing companies start with SEO or ads?',
        a: 'We usually prioritize SEO and GBP foundations, then add advertising as rankings and conversion stabilize. Competition and cash flow can change the order.',
      },
      {
        q: 'What does waterproofing marketing cost to start?',
        a: 'Starter work can begin around a few hundred dollars a month for a lane. Larger multi-channel stacks scale as revenue and ad spend grow.',
      },
    ],
    ctaH2: 'Starting or Scaling Waterproofing on Google?',
    ctaLine: 'Read the Dry Duck story, then book onboarding.',
  },
  {
    slug: 'garage-door-marketing',
    label: 'Garage Doors',
    icon: '/assets/trade-garage-doors.svg',
    ownerNoun: 'garage door owner',
    companyPlural: 'garage door companies',
    keyword: 'garage door marketing',
    title: t('Garage Door Marketing That Gets Calls'),
    description:
      'Garage door marketing on Google: Local SEO, LSAs, repair and opener keywords, and pages that convert same-day service intent into booked jobs.',
    h1: 'Garage Door Marketing That Gets Calls',
    heroSub:
      'Repair and opener searches convert fast. We build garage door marketing so you show up, look trusted, and book the job.',
    problemH2: 'Same-Day Intent Needs Instant Trust',
    problemBody: [
      'Garage door customers often need help today. They skim map pack, reviews, and whether your site answers the obvious questions. Slow pages and thin profiles lose to the next tech.',
      'National lead mills skim the cream while local shops underinvest in the Google assets they actually own.',
    ],
    solutionH2: 'Local Google for Garage Door Companies',
    solutionBody: [
      'We fix category and services on GBP, build service pages for real Keyword Planner demand, turn on LSA when available, and keep ads honest about what you can schedule.',
      'Optional hiring campaigns help you add techs when booked work outruns the crew.',
    ],
    proofAngle: 'Booked-job marketing for fast-intent home services.',
    spotlight: 'hooked-up',
    faqs: [
      {
        q: 'Do you market both repair and new garage door installs?',
        a: 'Yes. We prioritize the services with demand in your market and make sure the site and ads match what you actually sell.',
      },
      {
        q: 'Are Local Services Ads available for garage doors?',
        a: 'Availability varies by market and Google’s categories. When LSA is an option, we use it early. Otherwise we lean on Search and organic.',
      },
      {
        q: 'How quickly can garage door marketing move?',
        a: 'Profile and conversion fixes can change call volume quickly. Sustained growth still needs review velocity and consistent follow-up from your office.',
      },
      {
        q: 'What’s the starting price?',
        a: 'Many shops begin around $500/month for a focused lane. We expand when results and capacity justify it.',
      },
    ],
    ctaH2: 'Want More Garage Door Jobs From Google?',
    ctaLine: 'Schedule onboarding after you see how the system works.',
  },
  {
    slug: 'pest-control-marketing',
    label: 'Pest Control',
    icon: '/assets/trade-pest-control.svg',
    ownerNoun: 'pest control owner',
    companyPlural: 'pest control companies',
    keyword: 'pest control marketing',
    title: t('Pest Control Marketing for Recurring Routes'),
    description:
      'Pest control marketing that books initial treatments and supports recurring routes: Google Local SEO, LSAs, and converting service pages.',
    h1: 'Pest Control Marketing for Real Routes',
    heroSub:
      'One-time panic searches and quarterly plans both start on Google. We build pest control marketing that captures both.',
    problemH2: 'Routes Stall Without Reliable Inbound',
    problemBody: [
      'Pest control grows on recurring revenue, but growth still needs a steady stream of new initial jobs. Weak map presence and generic ads fill the calendar with the wrong mix.',
      'Agencies that don’t understand route density push volume that your techs can’t profitably serve.',
    ],
    solutionH2: 'Google Demand Matched to Route Reality',
    solutionBody: [
      'We align GBP, service pages, reviews, and paid lanes to the pests and neighborhoods you actually want. Foundations first, then spend that respects capacity.',
      'Hiring support is available when route growth needs another tech, not a stack of unused leads.',
    ],
    proofAngle: 'Capacity-aware Google systems for home service routes.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Can you market residential and commercial pest control?',
        a: 'We focus on residential home service. If commercial is secondary, we can discuss scope; residential Google demand is the core specialty.',
      },
      {
        q: 'Do you help with seasonal pest campaigns?',
        a: 'Yes. We plan content, offers, and ads around seasonal search patterns without abandoning year-round profile strength.',
      },
      {
        q: 'Will you guarantee lead volume?',
        a: 'No outcome guarantees. We price and operate as a partner whose fees rise when you grow, which already aligns incentives.',
      },
      {
        q: 'What’s included in pest control marketing?',
        a: 'Local SEO and GBP, website conversion work, LSAs/Search as appropriate, reviews, reporting on booked work, and optional hiring ads.',
      },
    ],
    ctaH2: 'Ready to Grow Pest Control on Google?',
    ctaLine: 'Watch the video on Get Started, then book your onboarding.',
  },
  {
    slug: 'locksmith-marketing',
    label: 'Locksmiths',
    icon: '/assets/trade-locksmiths.svg',
    ownerNoun: 'locksmith',
    companyPlural: 'locksmith companies',
    keyword: 'locksmith marketing',
    title: t('Locksmith Marketing Without Lead Scams'),
    description:
      'Locksmith marketing that fights spammy competitors with real Google trust: Local SEO, reviews, honest ads, and a site homeowners believe.',
    h1: 'Locksmith Marketing Without Lead Scams',
    heroSub:
      'Locksmith search is full of fake urgency. We build marketing that makes your real local company the obvious safe choice.',
    problemH2: 'Spammy Listings Steal Honest Work',
    problemBody: [
      'Locksmith markets are littered with lead resellers and misleading ads. Homeowners are wary, so thin websites and weak reviews lose even when you’re the legitimate local option.',
      'Buying random leads often funds the same broken game instead of owning your Google presence.',
    ],
    solutionH2: 'Trust-First Locksmith Marketing on Google',
    solutionBody: [
      'We strengthen GBP, reviews, NAP consistency, and clear service pages, then run paid carefully so you don’t look like the scammers you’re competing against.',
      'The goal is booked lockout and install work from people who trust they’re calling a real shop.',
    ],
    proofAngle: 'Legitimate local operators deserve a clean Google spine.',
    spotlight: 'hooked-up',
    faqs: [
      {
        q: 'Can marketing help against locksmith spam?',
        a: 'Strong reviews, accurate profiles, and a professional site help homeowners choose you. We can’t police Google’s entire ecosystem, but we make the trustworthy option obvious.',
      },
      {
        q: 'Do you run Google Ads for locksmiths?',
        a: 'When it makes sense, yes, with tight messaging and landing pages. Foundations still come first so paid doesn’t amplify a weak brand.',
      },
      {
        q: 'Is 24/7 locksmith marketing supported?',
        a: 'We can advertise the hours and services you actually cover. Overselling availability destroys reviews and wastes spend.',
      },
      {
        q: 'What does it cost to start?',
        a: 'Starter lanes often begin near $500/month. We scale with results and ad spend rather than a giant setup ransom.',
      },
    ],
    ctaH2: 'Want Locksmith Marketing Homeowners Trust?',
    ctaLine: 'See how onboarding works, then schedule your call.',
  },
  {
    slug: 'appliance-repair-marketing',
    label: 'Appliance Repair',
    icon: '/assets/trade-appliance-repair.svg',
    ownerNoun: 'appliance repair owner',
    companyPlural: 'appliance repair companies',
    keyword: 'appliance repair marketing',
    title: t('Appliance Repair Marketing That Books'),
    description:
      'Appliance repair marketing for Google search and Maps: Local SEO, service pages by appliance, LSAs where available, and ads that book diagnostic calls.',
    h1: 'Appliance Repair Marketing That Books',
    heroSub:
      'Broken fridge searches don’t wait. We build appliance repair marketing so you rank, review, and convert before the homeowner calls a big-box referral.',
    problemH2: 'SKU Chaos Without Clear Landing Paths',
    problemBody: [
      'Appliance repair spans brands and machine types. Generic homepages force homeowners to hunt. They bounce to whoever names their problem clearly on Google.',
      'Lead marketplaces take a cut while you still need reviews, dispatch, and a profile that looks like a real company.',
    ],
    solutionH2: 'Structured Google for Appliance Repair',
    solutionBody: [
      'We use Keyword Planner demand to prioritize appliances and cities worth pages, clean up GBP services, and connect ads to pages that answer the diagnostic call question immediately.',
      'Tracking watches booked jobs so you know which appliances and areas deserve more budget.',
    ],
    proofAngle: 'Conversion-first sites for high-intent home service searches.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Do you create pages for every appliance brand?',
        a: 'We prioritize demand and what you actually service. Volume pages without capacity or parts reality just waste crawl and ad budget.',
      },
      {
        q: 'Can you help with same-day appliance repair ads?',
        a: 'Yes, when your dispatch can support it. We won’t advertise same-day if the office can’t deliver.',
      },
      {
        q: 'Is Local SEO enough for appliance repair?',
        a: 'Organic and GBP matter a lot. Paid fills gaps and defends competitive terms. Most shops need both sequenced correctly.',
      },
      {
        q: 'How do engagements usually start?',
        a: 'Around $500/month for a focused lane is common. We expand after the foundation is printing work.',
      },
    ],
    ctaH2: 'Ready to Book More Appliance Repair Jobs?',
    ctaLine: 'Get started online. No sales calls required.',
  },
  {
    slug: 'water-damage-marketing',
    label: 'Water Damage & Restoration',
    icon: '/assets/trade-water-damage-restoration.svg',
    ownerNoun: 'restoration owner',
    companyPlural: 'water damage companies',
    keyword: 'water damage marketing',
    title: t('Water Damage Marketing for Fast Response'),
    description:
      'Water damage and restoration marketing on Google: emergency intent pages, Local SEO, reviews, and ads that book mitigation calls when homeowners need help now.',
    h1: 'Water Damage Marketing for Fast Response',
    heroSub:
      'When water hits, homeowners search immediately. We build water damage marketing that makes your crew the trusted first call.',
    problemH2: 'Emergency Intent Punishes Weak Sites',
    problemBody: [
      'Water damage searches are urgent and skeptical. Slow sites, unclear service areas, and thin proof lose to whoever looks ready tonight.',
      'National aggregators dominate lazy keywords while local restorers underinvest in the assets that compound: profile, reviews, and conversion pages.',
    ],
    solutionH2: 'Restoration Marketing Built for Urgency',
    solutionBody: [
      'We align GBP categories and services, build clear mitigation and restoration paths on the site, and run paid carefully so after-hours claims match staffing.',
      'The Flight Plan still applies: foundations, owned traffic, then scale and hiring when volume demands it.',
    ],
    proofAngle: 'High-stakes trades need clarity, speed, and proof.',
    spotlight: 'dry-duck',
    faqs: [
      {
        q: 'Do you market mitigation and full restoration?',
        a: 'Yes. We prioritize the services you want to win and make the next step obvious for homeowners and adjusters where relevant.',
      },
      {
        q: 'Can marketing support 24/7 water damage response?',
        a: 'We advertise the coverage you actually offer. Fake 24/7 claims destroy reviews and waste spend.',
      },
      {
        q: 'How is this different from waterproofing marketing?',
        a: 'Related but not identical. Water damage is emergency restoration intent; waterproofing is often prevention and planned installs. Messaging and pages differ.',
      },
      {
        q: 'What’s a typical starting budget for management fees?',
        a: 'Starter management often begins near $500/month before larger ad spends. Media budget is separate and sized to market and capacity.',
      },
    ],
    ctaH2: 'Want Water Damage Calls You Can Actually Run?',
    ctaLine: 'See the system, then book onboarding.',
  },
  {
    slug: 'tree-service-marketing',
    label: 'Tree Service',
    icon: '/assets/trade-tree-service.svg',
    ownerNoun: 'tree service owner',
    companyPlural: 'tree service companies',
    keyword: 'tree service marketing',
    title: t('Tree Service Marketing That Wins Bids'),
    description:
      'Tree service marketing for removal, trimming, and storm work: Google Local SEO, reviews, and ads that turn property-owner searches into estimates.',
    h1: 'Tree Service Marketing That Wins Bids',
    heroSub:
      'Tree work is visual and trust-heavy. We build tree service marketing so your crew shows up first with proof, not just the lowest bid.',
    problemH2: 'Storm Work Without a Brand Is Chaos',
    problemBody: [
      'After storms, every truck looks the same to a stressed homeowner. Reviews, photos, and map presence decide who gets the estimate appointment.',
      'Buying generic leads ignores the Google assets that keep phones ringing between weather events.',
    ],
    solutionH2: 'Google Visibility for Tree Service Companies',
    solutionBody: [
      'We strengthen GBP with real work photos and services, build pages for removal, trimming, and stump work people search, and add paid when organic can’t cover demand.',
      'Hiring campaigns help you add climbers and ground crew when the calendar stays full.',
    ],
    proofAngle: 'Proof-heavy profiles for outdoor home services.',
    spotlight: 'rewired',
    faqs: [
      {
        q: 'Do you market residential tree service only?',
        a: 'Residential home service is the specialty. If commercial tree work is secondary, we can discuss whether Google demand supports it.',
      },
      {
        q: 'Can you help after major storm events?',
        a: 'Yes. We can surge ads and landing clarity carefully. Long-term growth still depends on reviews and profile strength between storms.',
      },
      {
        q: 'Should tree services invest in SEO or just Google Ads?',
        a: 'Both, sequenced. Organic and GBP lower acquisition cost; ads catch overflow and competitive terms.',
      },
      {
        q: 'How do we get started?',
        a: 'Watch the Get Started video and book onboarding. We’ll audit Google bottlenecks on the first call.',
      },
    ],
    ctaH2: 'Ready for Tree Service Marketing That Compounds?',
    ctaLine: 'Schedule onboarding when you’re ready to grow.',
  },
  {
    slug: 'landscaping-marketing',
    label: 'Landscaping',
    icon: '/assets/trade-landscaping.svg',
    ownerNoun: 'landscaping owner',
    companyPlural: 'landscaping companies',
    keyword: 'landscaping marketing',
    title: t('Landscaping Marketing for Design and Care'),
    description:
      'Landscaping marketing on Google for maintenance and install companies: Local SEO, project proof, and ads that book design consults and recurring care.',
    h1: 'Landscaping Marketing for Design and Care',
    heroSub:
      'Maintenance routes and install projects both start with trust online. We build landscaping marketing that fills both pipelines.',
    problemH2: 'Pretty Photos Alone Don’t Book Work',
    problemBody: [
      'Landscaping buyers browse, but they still search Google when they’re ready. Weak map presence and unclear service pages mean your portfolio never gets the call.',
      'Social-only marketing looks busy while competitors own “landscaping near me” and city install keywords.',
    ],
    solutionH2: 'Search Plus Proof for Landscaping Companies',
    solutionBody: [
      'We pair Local SEO and GBP with a site structure that showcases services and areas clearly, then add paid for competitive install and maintenance terms.',
      'Hiring support helps you staff crews when seasonal demand spikes.',
    ],
    proofAngle: 'Google systems beside the portfolio, not instead of it.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Do you market lawn care and full landscaping installs?',
        a: 'Yes, when both are residential and Google-driven. We prioritize the offers with demand and margin in your market.',
      },
      {
        q: 'Is Instagram enough for landscaping marketing?',
        a: 'It’s useful proof. It rarely replaces Google for high-intent local demand. We treat social as support, not the spine.',
      },
      {
        q: 'Can you help with seasonal landscaping campaigns?',
        a: 'Yes. We plan around spring/fall demand while keeping the profile healthy year-round.',
      },
      {
        q: 'What’s the usual starting fee?',
        a: 'Focused lanes often start near $500/month. Larger creative and ads stacks scale with revenue.',
      },
    ],
    ctaH2: 'Want Landscaping Leads From Google Intent?',
    ctaLine: 'See case studies, then book onboarding.',
  },
  {
    slug: 'towing-marketing',
    label: 'Towing',
    icon: '/assets/trade-towing.svg',
    ownerNoun: 'towing owner',
    companyPlural: 'towing companies',
    keyword: 'towing marketing',
    title: t('Towing Marketing That Captures Local Calls'),
    description:
      'Towing marketing for local operators: Google Business Profile, reviews, Local SEO, and ads that win roadside and light-duty calls without scammy tactics.',
    h1: 'Towing Marketing That Captures Local Calls',
    heroSub:
      'Roadside searches are frantic and full of junk listings. We build towing marketing that makes your real local company easy to trust and call.',
    problemH2: 'Junk Listings Crowd Out Real Tow Operators',
    problemBody: [
      'Towing search is messy: lead resellers, misleading distance claims, and thin sites. Drivers call whoever looks closest and safest in the moment.',
      'If your GBP, reviews, and hours are unclear, you lose to louder, less honest competitors.',
    ],
    solutionH2: 'Clean Local Presence for Towing Companies',
    solutionBody: [
      'We focus on accurate GBP data, review velocity, clear service pages, and careful paid that doesn’t imitate scam ads. Trust is the offer.',
      'Reporting stays tied to calls and jobs you can actually run in your coverage area.',
    ],
    proofAngle: 'Legitimate operators need clarity more than gimmicks.',
    spotlight: 'hooked-up',
    faqs: [
      {
        q: 'Do you work with light-duty and roadside towing?',
        a: 'Residential and consumer roadside demand is the closest fit. Heavy-duty or commercial-only fleets may need a different partner.',
      },
      {
        q: 'Can marketing fix Google Maps spam in towing?',
        a: 'We make your legitimate listing as strong as possible. Platform spam enforcement is Google’s job; strong reviews and accuracy still help drivers choose you.',
      },
      {
        q: 'Should towing companies use LSAs?',
        a: 'If available in your market and category, we evaluate it. Otherwise Search and organic do the heavy lifting.',
      },
      {
        q: 'How do we start?',
        a: 'Book onboarding via Get Started after watching how the partnership works.',
      },
    ],
    ctaH2: 'Want More Local Towing Calls You Can Trust?',
    ctaLine: 'Schedule onboarding. No sales calls.',
  },
  {
    slug: 'junk-removal-marketing',
    label: 'Junk Removal',
    icon: '/assets/trade-junk-removal.svg',
    ownerNoun: 'junk removal owner',
    companyPlural: 'junk removal companies',
    keyword: 'junk removal marketing',
    title: t('Junk Removal Marketing That Books Trucks'),
    description:
      'Junk removal marketing on Google: Local SEO, LSAs, same-week haul-away pages, and ads that fill trucks without relying only on franchised lead systems.',
    h1: 'Junk Removal Marketing That Books Trucks',
    heroSub:
      'Homeowners want junk gone this week. We build junk removal marketing that ranks locally and converts fast quotes into booked hauls.',
    problemH2: 'Franchise Leads Aren’t Ownership',
    problemBody: [
      'Many junk companies rent demand from brands and portals. When fees rise or territories tighten, you don’t own the Google equity.',
      'A weak local profile means every slow week starts from zero, even if your trucks and crew are ready.',
    ],
    solutionH2: 'Owned Google Demand for Junk Removal',
    solutionBody: [
      'We build GBP, reviews, city/service clarity, and paid lanes so your company captures “junk removal near me” demand directly.',
      'As volume grows, hiring campaigns help you add labor without guessing.',
    ],
    proofAngle: 'Own the channel, then scale trucks and crew.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Do you replace franchise junk marketing entirely?',
        a: 'We focus on owned Google systems. Some owners keep a franchise lane while we build independent demand; fit depends on contracts and goals.',
      },
      {
        q: 'Can you market cleanouts and furniture haul-away?',
        a: 'Yes. We prioritize the jobs you want on the calendar and match pages/ads to those searches.',
      },
      {
        q: 'How fast can junk removal marketing move?',
        a: 'Local intent can respond quickly once profile and conversion paths are clear. Reviews and consistency keep it compounding.',
      },
      {
        q: 'What’s the starting investment?',
        a: 'Management often starts near $500/month for a lane, with ad spend separate.',
      },
    ],
    ctaH2: 'Ready to Fill Junk Trucks From Google?',
    ctaLine: 'Watch Get Started, then book your onboarding slot.',
  },
  {
    slug: 'pressure-washing-marketing',
    label: 'Pressure Washing',
    icon: '/assets/trade-pressure-washing.svg',
    ownerNoun: 'pressure washing owner',
    companyPlural: 'pressure washing companies',
    keyword: 'pressure washing marketing',
    title: t('Pressure Washing Marketing for Local Jobs'),
    description:
      'Pressure washing marketing for residential exteriors: Google Local SEO, before/after proof, and ads that book house washes, driveways, and soft wash work.',
    h1: 'Pressure Washing Marketing for Local Jobs',
    heroSub:
      'Seasonal exterior cleaning still starts on Google. We build pressure washing marketing that books routes and one-off washes in your service area.',
    problemH2: 'Seasonal Shops Forget Foundations',
    problemBody: [
      'Pressure washing companies often go dark online between seasons, then scramble when weather turns. Rankings and reviews don’t like that pattern.',
      'Cheap postcard blasts can’t replace a strong map pack presence when homeowners decide this weekend.',
    ],
    solutionH2: 'Year-Round Google for Pressure Washing',
    solutionBody: [
      'We keep GBP and service pages healthy off-season, showcase proof, and surge ads when search demand rises, matched to crew capacity.',
      'The same Flight Plan stages apply as you go from solo operator to a small crew.',
    ],
    proofAngle: 'Stage-based growth for owner-operators and small crews.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Do you market soft wash and concrete cleaning?',
        a: 'Yes, when those are services you offer and people search in your market. We won’t invent pages for work you don’t sell.',
      },
      {
        q: 'Is pressure washing too small for an agency?',
        a: 'If you want to build a real company on Google, size is less important than commitment. Starter pricing exists for a reason.',
      },
      {
        q: 'Can you help with commercial pressure washing?',
        a: 'Residential is the specialty. Light commercial may fit if it’s still local Google-driven demand.',
      },
      {
        q: 'How do pricing and retainers work?',
        a: 'Start small, prove booked work, scale fees with growth and ad spend. Details on the Get Started page.',
      },
    ],
    ctaH2: 'Want Pressure Washing Jobs Lined Up?',
    ctaLine: 'Schedule onboarding and we’ll map the next Google moves.',
  },
  {
    slug: 'septic-marketing',
    label: 'Septic & Sewer',
    icon: '/assets/trade-septic-sewer.svg',
    ownerNoun: 'septic owner',
    companyPlural: 'septic and sewer companies',
    keyword: 'septic marketing',
    title: t('Septic Marketing for Pumping and Repair'),
    description:
      'Septic and sewer marketing on Google: Local SEO, emergency and maintenance pages, reviews, and ads that book pumping, repair, and camera work.',
    h1: 'Septic Marketing for Pumping and Repair',
    heroSub:
      'Septic problems aren’t DIY for most homeowners. We build septic marketing that captures urgent and maintenance searches in your area.',
    problemH2: 'Urgent Searches Need Clear Local Proof',
    problemBody: [
      'When a system backs up, homeowners search fast and pick whoever looks licensed, local, and available. Vague websites and thin reviews lose expensive jobs.',
      'Generic home-service agencies often underbuild the service pages septic buyers actually need.',
    ],
    solutionH2: 'Specialized Google for Septic & Sewer',
    solutionBody: [
      'We clarify GBP categories and services, build pages for pumping, repair, and inspection intents, and add paid when organic can’t cover emergency demand.',
      'Tracking focuses on booked jobs your trucks can run, not abstract funnel charts.',
    ],
    proofAngle: 'High-intent trades reward clarity and response speed.',
    spotlight: 'rewired',
    faqs: [
      {
        q: 'Do you market septic pumping and sewer line repair?',
        a: 'Yes. We prioritize the services you offer and the searches with real volume in your market.',
      },
      {
        q: 'Can septic marketing include emergency ads?',
        a: 'When staffing supports it. We won’t advertise 24/7 response you can’t deliver.',
      },
      {
        q: 'Is Local SEO enough in rural septic markets?',
        a: 'Often a strong profile and reviews go far. Competitive metros usually need paid as well. We size the mix to the map.',
      },
      {
        q: 'How do we begin?',
        a: 'Use Get Started to book onboarding after you understand the partnership model.',
      },
    ],
    ctaH2: 'Ready for Septic Marketing That Books Trucks?',
    ctaLine: 'See results from similar trades, then schedule your call.',
  },
  {
    slug: 'fencing-marketing',
    label: 'Fencing',
    icon: '/assets/trade-fencing.svg',
    ownerNoun: 'fencing owner',
    companyPlural: 'fencing companies',
    keyword: 'fencing marketing',
    title: t('Fencing Marketing That Books Installs'),
    description:
      'Fencing marketing for residential installers: Google Local SEO, project proof, and ads that turn fence searches into on-site estimates.',
    h1: 'Fencing Marketing That Books Installs',
    heroSub:
      'Fence projects are planned purchases with local search at the end. We build fencing marketing that gets you the estimate appointment.',
    problemH2: 'Project Buyers Compare Proof Fast',
    problemBody: [
      'Homeowners shopping fences compare photos, reviews, and whether you look like a real crew. Weak Google presence sends them to whoever posts recent work.',
      'Relying only on yard signs and referrals caps growth when you want a steadier install calendar.',
    ],
    solutionH2: 'Local Search Plus Portfolio Clarity',
    solutionBody: [
      'We upgrade GBP with real job photos and services, structure the site for fence types people search, and add paid for competitive install keywords.',
      'As the calendar fills, hiring campaigns help you add install labor.',
    ],
    proofAngle: 'Estimate-driven trades need trust before the site visit.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Do you market wood, vinyl, and chain-link fencing?',
        a: 'We build around the materials and jobs you sell, matched to Keyword Planner demand in your area.',
      },
      {
        q: 'Is fencing marketing mostly Google or social?',
        a: 'Google captures high intent. Social and photos support proof. We keep Google as the spine.',
      },
      {
        q: 'Can you help residential fence companies only?',
        a: 'Residential is the focus. Light commercial may fit case by case.',
      },
      {
        q: 'What’s a typical starting retainer?',
        a: 'Around $500/month for a starter lane is common before larger multi-channel stacks.',
      },
    ],
    ctaH2: 'Want More Fence Estimates From Google?',
    ctaLine: 'Book onboarding when you’re ready to grow the install calendar.',
  },
  {
    slug: 'painting-marketing',
    label: 'Painting',
    icon: '/assets/trade-painting.svg',
    ownerNoun: 'painting owner',
    companyPlural: 'painting companies',
    keyword: 'painting marketing',
    title: t('Painting Marketing for Interior and Exterior'),
    description:
      'Painting marketing for residential crews: Google Local SEO, review systems, and ads that book interior and exterior estimate appointments.',
    h1: 'Painting Marketing for Interior and Exterior',
    heroSub:
      'Painting buyers want trust and calendar availability. We build painting marketing that turns local searches into booked estimates.',
    problemH2: 'Portfolios Don’t Rank Themselves',
    problemBody: [
      'Beautiful job photos help after someone finds you. Getting found still depends on Maps, reviews, and clear service pages for interior, exterior, and cabinets where you offer them.',
      'Seasonal slowdowns hurt more when you never built organic equity in the busy months.',
    ],
    solutionH2: 'Google Systems for Painting Companies',
    solutionBody: [
      'We implement Local SEO and GBP foundations, make the site convert estimate requests, and add paid for competitive painting keywords when capacity allows.',
      'Hiring campaigns help you add painters when marketing outruns the crew, the Honest Hank’s style of staged growth.',
    ],
    proofAngle: 'Staged growth: prove demand, then add crew.',
    spotlight: 'honest-hanks',
    faqs: [
      {
        q: 'Do you market interior and exterior painting?',
        a: 'Yes. We prioritize the services with demand and margin for your company.',
      },
      {
        q: 'Can painting marketing include cabinet refinishing?',
        a: 'If you offer it and people search it locally, we can include it in the page and ads plan.',
      },
      {
        q: 'How important are reviews for painting companies?',
        a: 'Critical. Painting is trust and mess-anxiety. We help install a review habit crews actually run.',
      },
      {
        q: 'How do we start with Local Service Rocket?',
        a: 'Go to Get Started, watch how the partnership works, and schedule onboarding. No sales calls.',
      },
    ],
    ctaH2: 'Ready for Painting Marketing That Fills the Books?',
    ctaLine: 'See client stories, then schedule your onboarding.',
  },
];

export function getTradeBySlug(slug: string) {
  return trades.find((trade) => trade.slug === slug);
}

/** Homepage Who We Help: label → landing slug */
export const tradeLabelToSlug: Record<string, string> = Object.fromEntries(
  trades.map((trade) => [trade.label, trade.slug])
);
