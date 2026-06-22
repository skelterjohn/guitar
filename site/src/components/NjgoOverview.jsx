import EmailIcon from './EmailIcon.jsx';
import NjgoLinks from './NjgoLinks.jsx';

const DIRECTOR_EMAIL = 'newjerseyguitarorchestra@gmail.com';

export default function NjgoOverview({ logo, paragraphs }) {
  const hasParagraphs = Array.isArray(paragraphs) && paragraphs.length > 0;
  if (!logo && !hasParagraphs) {
    return null;
  }

  return (
    <section className="njgo-overview" aria-label="About">
      <h1 className="njgo-page-title">
        <span className="njgo-page-title-line">New Jersey</span>
        <span className="njgo-page-title-line">Guitar Orchestra</span>
      </h1>
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
      <div className="njgo-overview-text">
        {hasParagraphs &&
          paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        <p className="njgo-overview-director">
          <a className="njgo-overview-email" href={`mailto:${DIRECTOR_EMAIL}`}>
            <EmailIcon />
            Jayson Martinez, Director
          </a>
        </p>
        <NjgoLinks />
      </div>
    </section>
  );
}