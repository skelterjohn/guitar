import { useEffect } from 'react';

function setMeta(attr, key, value) {
  const el = document.querySelector(`meta[${attr}="${key}"]`);
  if (el) el.setAttribute('content', value);
}

function setLink(rel, href) {
  const el = document.querySelector(`link[rel="${rel}"]`);
  if (el) el.setAttribute('href', href);
}

export default function usePageMeta({
  title,
  description,
  url,
  noindex = false,
}) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setLink('canonical', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);

    let robots = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, nofollow');
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, url, noindex]);
}
