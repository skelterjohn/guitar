function bioParagraphs(bio) {
  if (typeof bio !== 'string' || !bio.trim()) return [];
  return bio.split('\n\n').map((paragraph) => paragraph.trim()).filter(Boolean);
}

export default function NjgoDirector({ name, image, bio }) {
  const paragraphs = bioParagraphs(bio);

  return (
    <article className="njgo-director">
      {image && (
        <div className="njgo-director-photo-wrap">
          <img
            className="njgo-director-photo"
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="njgo-director-bio">
        {name && <h2 className="njgo-director-name">{name}</h2>}
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
