import EmailIcon from './EmailIcon.jsx';

const WEBMASTER_EMAIL = 'jasmuth@gmail.com';

export default function NjgoFooter() {
  return (
    <footer className="njgo-footer">
      <a
        className="njgo-footer-email"
        href={`mailto:${WEBMASTER_EMAIL}`}
        aria-label="Email webmaster"
      >
        <EmailIcon />
        webmaster
      </a>
    </footer>
  );
}
