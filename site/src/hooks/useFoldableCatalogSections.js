import { useCallback, useState } from 'react';

export default function useFoldableCatalogSections() {
  const [expandedSectionIds, setExpandedSectionIds] = useState(() => new Set());

  const expandSection = useCallback((sectionId) => {
    setExpandedSectionIds((prev) => new Set(prev).add(sectionId));
  }, []);

  const collapseSection = useCallback((sectionId) => {
    setExpandedSectionIds((prev) => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
  }, []);

  const revealSection = useCallback((sectionId) => {
    expandSection(sectionId);
  }, [expandSection]);

  return {
    expandedSectionIds,
    expandSection,
    collapseSection,
    revealSection,
  };
}
