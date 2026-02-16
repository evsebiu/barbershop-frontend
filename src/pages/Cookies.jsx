import React from 'react';

const CookiesPage = () => {
  return (
    <div className="legal-page-container">
      <main className="legal-wrapper">
        <div className="page-header">
          {/* Titlu cu clasa pentru gradientul metalic */}
          <h1 className="legal-page-title">Politica de Cookies</h1>
          <p className="page-intro">Transparența este importantă pentru noi.</p>
        </div>

        <div className="legal-card">
          <div className="content-section">
            <h2>
              <span className="legal-emoji">🍪</span> 1. Ce sunt cookie-urile?
            </h2>
            <p>
              Cookie-urile sunt fișiere mici de text stocate pe dispozitivul dumneavoastră mobil 
              atunci când accesați site-ul nostru. Ele ne ajută să vă oferim o experiență fluidă.
            </p>
          </div>

          <div className="content-section">
            <h2>
              <span className="legal-emoji">🍪</span> 2. Ce cookie-uri folosim?
            </h2>
            <p>Folosim strictul necesar:</p>

            <div className="cookie-table-wrapper">
              <table className="cookie-table">
                <thead>
                  <tr>
                    <th>NUME</th>
                    <th>TIP</th>
                    <th>SCOP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: '#fff' }}>JSESSIONID</td>
                    <td><span className="badge-essential">Strict Necesar</span></td>
                    <td>Autentificare și securitate.</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#fff' }}>cookiesAccepted</td>
                    <td><span className="badge-pref">Preferințe</span></td>
                    <td>Ține minte acordul tău.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="content-section">
            <h2>
              <span className="legal-emoji">🍪</span> 3. Control
            </h2>
            <p>
              Puteți șterge cookie-urile din setările browserului, dar asta vă va deloga de pe site.
            </p>
          </div>

          <div className="content-section" style={{ border: 'none' }}>
            <h2>
              <span className="legal-emoji">🍪</span> 4. Contact
            </h2>
            <p>
              Email: <a href="mailto:contact@hypebarbershop.ro" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>
                contact@hypebarbershop.ro
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CookiesPage;