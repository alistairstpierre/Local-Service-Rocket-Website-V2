/* Shared Schema.org helpers for agency pages (docs/SITE-STRUCTURE-AND-SEO-GUIDE.md Part 5).
   Stable @ids: #business, #website, per-page #webpage / #service / #faq / #breadcrumbs.
   ImageObject fields reduce GSC “image metadata” warnings. Used by layouts + key pages. */

const SITE = 'https://localservicerocket.com';
const YEAR = new Date().getFullYear();

export const businessId = `${SITE}/#business`;
export const websiteId = `${SITE}/#website`;

export function absoluteUrl(path: string, site: URL | string = SITE) {
  const base = typeof site === 'string' ? site : site.href;
  return new URL(path.startsWith('/') ? path : `/${path}`, base).href;
}

export function schemaImageObject(
  imageUrl: string,
  opts: { id?: string } = {}
): Record<string, unknown> {
  return {
    '@type': 'ImageObject',
    ...(opts.id ? { '@id': opts.id } : {}),
    url: imageUrl,
    contentUrl: imageUrl,
    creator: {
      '@type': 'Organization',
      name: 'Local Service Rocket',
      url: `${SITE}/`,
    },
    copyrightNotice: `© ${YEAR} Local Service Rocket. All rights reserved.`,
    creditText: 'Local Service Rocket',
    acquireLicensePage: `${SITE}/get-started`,
  };
}

export function schemaLogoImage() {
  return schemaImageObject(`${SITE}/assets/lsr-logo.svg`, {
    id: `${SITE}/#logo-image`,
  });
}

export function schemaMainHeroImage() {
  return schemaImageObject(`${SITE}/assets/og-default.jpg`, {
    id: `${SITE}/#primary-hero-image`,
  });
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': businessId,
    name: 'Local Service Rocket',
    url: `${SITE}/`,
    logo: schemaLogoImage(),
    image: schemaMainHeroImage(),
    telephone: '+1-888-371-6365',
    email: 'hello@localservicerocket.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wellington',
      addressCountry: 'NZ',
    },
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'New Zealand' },
    ],
    sameAs: [],
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${SITE}/`,
    name: 'Local Service Rocket',
    publisher: { '@id': businessId },
    inLanguage: 'en-US',
  };
}

export function breadcrumbList(
  pageUrl: string,
  items: { name: string; path: string }[]
) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumbs`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageNode(opts: {
  pageUrl: string;
  name: string;
  description: string;
  type?: string | string[];
  mainEntityId?: string;
  primaryImageUrl?: string;
}) {
  const types = opts.type ?? 'WebPage';
  return {
    '@type': types,
    '@id': `${opts.pageUrl}#webpage`,
    url: opts.pageUrl,
    name: opts.name,
    description: opts.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': websiteId },
    about: { '@id': businessId },
    ...(opts.mainEntityId ? { mainEntity: { '@id': opts.mainEntityId } } : {}),
    ...(opts.primaryImageUrl
      ? {
          primaryImageOfPage: schemaImageObject(opts.primaryImageUrl, {
            id: `${opts.pageUrl}#primary-image`,
          }),
        }
      : { primaryImageOfPage: schemaMainHeroImage() }),
  };
}

export function faqPageNode(
  pageUrl: string,
  faqs: { q: string; a: string }[]
) {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

export function graph(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(), websiteNode(), ...nodes],
  };
}
