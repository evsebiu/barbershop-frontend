import React from 'react';

const ConsumerRights = () => {
  return (
    <div className="legal-page-container">
      {/* 1. WRAPPER PENTRU CENTRARE */}
      <main className="legal-wrapper">
        
        {/* HEADER PAGINĂ: Efect metalic auriu conform designului original */}
        <div className="page-header">
          <h1 className="legal-page-title">Protecția Consuma&shy;torilor</h1>
          <p className="page-intro">Informații legale privind drepturile dumneavoastră.</p>
        </div>

        {/* CARDUL PREMIUM CU LINIE AURIE */}
        <div className="legal-card">
          
          {/* SECȚIUNEA 1: IDENTITATE */}
          <div className="content-section">
            <h2><span className="legal-emoji">🏢</span> 1. Identitatea Profesionistului</h2>
            <p>În conformitate cu prevederile legale, vă informăm datele de identificare:</p>
            <ul className="rights-list">
              <li><strong>Denumire:</strong> CVL CONSTRUCTII IASI SRL</li>
              <li><strong>Sediul:</strong> Șoseaua Arcu nr. 8, Iași, România</li>
              <li><strong>CUI:</strong> RO12345678 | <strong>Reg. Com:</strong> J22/123/2024</li>
              <li><strong>Email:</strong> contact@hypebarbershop.ro</li>
            </ul>
          </div>

          {/* SECȚIUNEA 2: SERVICII */}
          <div className="content-section">
            <h2><span className="legal-emoji">✂️</span> 2. Caracteristicile Serviciilor</h2>
            <p>
              Hype Barbershop prestează servicii de frizerie și îngrijire personală masculină. 
              Prețul final (cu toate taxele incluse) este afișat clar înainte de confirmarea programării.
            </p>
          </div>

          {/* SECȚIUNEA 3: PLATA */}
          <div className="content-section">
            <h2><span className="legal-emoji">💳</span> 3. Prețuri și Plată</h2>
            <p>
              Prețurile sunt exprimate în RON și includ TVA. 
              Plata se efectuează la locație (cash sau card) după prestarea serviciului.
            </p>
          </div>

          {/* SECȚIUNEA 5: RETRAGERE */}
          <div className="content-section">
            <h2><span className="legal-emoji">🚫</span> 4. Dreptul de Retragere</h2>
            <p>
              Conform <strong>OUG 34/2014</strong>, consumatorul <span className="highlight">nu beneficiază de dreptul de retragere</span> în cazul 
              serviciilor de îngrijire personală odată ce acestea au fost prestate complet.
            </p>
          </div>

          {/* SECȚIUNEA 7: RECLAMAȚII ȘI ANPC */}
          <div className="content-section" style={{ border: 'none', marginBottom: 0 }}>
            <h2><span className="legal-emoji">⚖️</span> 5. Reclamații și Litigii</h2>
            <p>
              Orice nemulțumire poate fi adresată la <strong>contact@hypebarbershop.ro</strong>. 
              De asemenea, vă puteți adresa ANPC prin link-urile de mai jos:
            </p>

            {/* Bannerele ANPC stilizate (fundal alb conform originalului) */}
            <div className="anpc-banners">
              <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="nofollow">
                <img 
                  src="https://etamade-com.github.io/anpc-sal-sol-logo/anpc-sal.svg" 
                  alt="SAL" 
                />
              </a>
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="nofollow">
                <img 
                  src="https://etamade-com.github.io/anpc-sal-sol-logo/anpc-sol.svg" 
                  alt="SOL" 
                />
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ConsumerRights;