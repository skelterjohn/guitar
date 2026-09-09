import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdateAvailableBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="update-banner" role="status" aria-live="polite">
      <span>A new version of the site is available.</span>
      <button
        type="button"
        className="update-banner-refresh"
        onClick={() => updateServiceWorker(true)}
      >
        Refresh
      </button>
    </div>
  );
}
