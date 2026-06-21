import useRepPassword from '../hooks/useRepPassword.js';
import RepPasswordModal from './RepPasswordModal.jsx';

export default function RepPasswordGate({
  children,
  enabled = true,
  blockContent = false,
}) {
  const { hasPassword, setPassword } = useRepPassword();

  if (!enabled) return children;

  return (
    <>
      {(!blockContent || hasPassword) && children}
      {!hasPassword && <RepPasswordModal onSubmit={setPassword} />}
    </>
  );
}
