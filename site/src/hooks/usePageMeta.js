import { useEffect } from 'react';

function setMeta(attr, key, value) {
  const el = document.querySelector(`meta[${attr}="${key}"]`);
  if (el) el.setAttribute('content', value);
}

function setLink(rel, href) {
  const el = document.querySelector(`link[rel="${rel}"]`);
  if (el) el.setAttribute('href', href);
}

export default function usePageMeta({ title, description, url }) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setLink('canonical', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
  }, [title, description, url]);
}
