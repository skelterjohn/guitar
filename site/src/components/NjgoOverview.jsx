export default function NjgoOverview({ logo, paragraphs }) {
  const hasParagraphs = Array.isArray(paragraphs) && paragraphs.length > 0;
  if (!logo && !hasParagraphs) {
    return null;
  }

  return (
    <section className="njgo-overview" aria-label="About">
      {logo && (
        <div className="njgo-overview-logo-wrap">
          <img
            className="njgo-overview-logo"
            src={logo}
            alt="New Jersey Guitar Orchestra"
            width={189}
            height={441}
          />
        </div>
      )}
      {hasParagraphs && (
        <div className="njgo-overview-text">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </section>
  );
}