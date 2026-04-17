import React, {useState} from 'react';

const bannerStyle = {
  position: 'fixed',
  top: '60px',
  right: '16px',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: '#232f3e',
  color: '#ffffff',
  fontSize: '0.8rem',
  padding: '5px 12px',
  borderRadius: '4px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  whiteSpace: 'nowrap',
};

const linkStyle = {
  color: '#ff9900',
  fontWeight: 700,
  textDecoration: 'none',
};

const closeStyle = {
  color: '#999',
  cursor: 'pointer',
  marginLeft: '8px',
  fontSize: '1rem',
  lineHeight: 1,
  background: 'none',
  border: 'none',
  padding: 0,
};

export default function FloatingBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={bannerStyle}>
      <span>Live:</span>
      <span>CloudOps Webinars &amp; Hands-on Workshops ·</span>
      <a
        href="https://aws-experience.com/amer/smb/events/series/Cloud-Operations-Enablement"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        Register ↗
      </a>
      <button
        onClick={() => setVisible(false)}
        style={closeStyle}
        aria-label="Close banner"
      >
        ✕
      </button>
    </div>
  );
}
