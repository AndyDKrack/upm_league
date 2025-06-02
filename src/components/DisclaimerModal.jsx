import React from 'react';

export default function DisclaimerModal({ onAccept }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: 24, borderRadius: 8, maxWidth: 400, textAlign: 'center'
      }}>
        <h2>Disclaimer!</h2>
        <p>
          By continuing, you agree that your data is handled safely and anonymously.<br />
          This is within the limits of the law (provided by the Data Protection Law - Republic of Kenya) and our privacy policy.<br />
          Right-click and copying are disabled.
        </p>
        <button
          onClick={onAccept}
          style={{ marginTop: 16, padding: '8px 24px', borderRadius: 4, background: '#2563eb', color: 'white', border: 'none' }}
        >
          OK
        </button>
      </div>
    </div>
  );
}