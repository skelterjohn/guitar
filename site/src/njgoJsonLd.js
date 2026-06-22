import { njgoDescription, njgoPageTitle, njgoUrl } from './seo.js';

const DIRECTOR_EMAIL = 'newjerseyguitarorchestra@gmail.com';

export function buildNjgoJsonLd({ members = [] } = {}) {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${njgoUrl}#website`,
      name: njgoPageTitle,
      url: njgoUrl,
      description: njgoDescription,
    },
    {
      '@type': 'MusicGroup',
      '@id': `${njgoUrl}#musicgroup`,
      name: 'New Jersey Guitar Orchestra',
      alternateName: 'NJGO',
      url: njgoUrl,
      description: njgoDescription,
      email: DIRECTOR_EMAIL,
    },
  ];

  if (members.length) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${njgoUrl}#roster`,
      name: 'NJGO performers',
      numberOfItems: members.length,
      itemListElement: members.map((member, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Person',
          name: member.name,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
