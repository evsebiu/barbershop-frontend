import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const AppointmentConfirmed = () => {
  const location = useLocation();
  const { appointment } = location.state || {};

  // Fallback dacă userul intră direct pe link fără date
  if (!appointment) {
    return (
      <div className="legal-page-container">
        <main className="legal-wrapper">
            <div className="legal-card" style={{textAlign: 'center', padding: '4rem 2rem'}}>
                <h2 style={{color: 'var(--accent-gold)', marginBottom: '1rem'}}>Ups!</h2>
                <p className="page-intro">Nu am găsit datele programării.</p>
                <Link to="/" className="btn-cta" style={{marginTop: '2rem'}}>
                    Înapoi la Home
                </Link>
            </div>
        </main>
      </div>
    );
  }

  // Formatare dată în română
  const formattedDate = new Date(appointment.startTime).toLocaleString('ro-RO', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="legal-page-container">
      {/* Folosim clasa standard legal-wrapper care acum e responsive din CSS */}
      <main className="legal-wrapper">
        <div className="legal-card confirmed-card">
          
          {/* Iconiță Succes */}
          <div className="success-icon-wrapper">
            <span className="success-icon">✓</span>
          </div>

          <h1 className="legal-page-title">Programare Reușită</h1>
          <p className="page-intro">Te așteptăm cu plăcere la salon!</p>

          {/* Bonul Fiscal Digital */}
          <div className="receipt-container">
            <h3 className="receipt-header">Detalii Rezervare</h3>

            <div className="receipt-row">
              <span className="receipt-label">Frizer</span>
              <span className="receipt-value">{appointment.barberName}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">Data</span>
              {/* Capitalize prima literă din zi/lună */}
              <span className="receipt-value" style={{textTransform: 'capitalize'}}>
                {formattedDate}
              </span>
            </div>

            <div className="receipt-row">
              <span className="receipt-label">Serviciu</span>
              <span className="receipt-value">{appointment.serviceName}</span>
            </div>

            <div className="total-row">
              <span>TOTAL</span>
              <span>{appointment.price} RON</span>
            </div>
          </div>

          <p className="confirmation-notice">
            Am trimis confirmarea și pe email la:<br/>
            <strong>{appointment.clientEmail}</strong>
          </p>

          <Link to="/" className="btn-cta" style={{ marginTop: '2.5rem', width: '100%', textAlign: 'center', display: 'inline-block' }}>
            Înapoi la Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AppointmentConfirmed;