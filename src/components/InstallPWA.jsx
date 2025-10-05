import { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    }
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
      }}
    >
      <button
        onClick={installApp}
        style={{
          background: 'transparent',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/download.gif"
          alt="Download App"
          style={{
            width: '120%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      </button>
      <span
        style={{
          color: '#4c82bcff',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        }}
      >
        Install App
      </span>
    </div>
  );
};

export default InstallPWA;
