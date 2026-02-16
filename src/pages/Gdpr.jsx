import React from 'react';

const Gdpr = () => {
  return (
    <div className="legal-page-container">
      {/* 1. WRAPPER PENTRU CENTRARE ȘI LĂȚIME */}
      <main className="legal-wrapper">
        
        {/* HEADER PAGINĂ: Efect metalic auriu conform originalgdpr.png */}
        <div className="page-header">
          <h1 className="legal-page-title">Confidențialitate (GDPR)</h1>
          <p className="page-intro">Datele tale sunt în siguranță. Iată cum le protejăm.</p>
        </div>

        {/* CARDUL PRINCIPAL CU LINIE AURIE SUS */}
        <div className="legal-card">
          
          {/* SECȚIUNEA 1: IDENTITATE */}
          <div className="content-section">
            <h2><span className="legal-emoji">🛡️</span> 1. Cine suntem?</h2>
            <p>
              Datele dumneavoastră sunt administrate de <strong> CVL CONSTRUCTII IASI SRL </strong> 
              (denumit în continuare "Operatorul"), cu sediul în Iași, Șoseaua Arcu 8. 
              Ne angajăm să respectăm confidențialitatea datelor dumneavoastră personale conform Regulamentului UE 2016/679 (GDPR).
            </p>
          </div>

          {/* SECȚIUNEA 2: COLECTARE DATE */}
          <div className="content-section">
            <h2><span className="legal-emoji">🛡️</span> 2. Ce date colectăm și de ce?</h2>
            <p>Colectăm doar datele strict necesare pentru a vă oferi serviciile noastre:</p>
            <ul className="rights-list">
              <li><strong>Nume și Prenume:</strong> Pentru a identifica rezervarea.</li>
              <li><strong>Număr de Telefon:</strong> Pentru confirmarea programării și notificări SMS.</li>
              <li><strong>Adresa de Email:</strong> Pentru a vă transmite un email de confirmare cu datele programării.</li>
            </ul>
            <p>Nu colectăm date sensibile și nu vindem datele dumneavoastră către terți.</p>
          </div>

          {/* SECȚIUNEA 3: RETENȚIE */}
          <div className="content-section">
            <h2><span className="legal-emoji">🛡️</span> 3. Cât timp păstrăm datele?</h2>
            <p>
              Datele necesare programărilor sunt păstrate pentru un timp limitat maxim <strong>1 an sau mai puțin</strong> de la ultima activitate, 
              după care vor fi anonimizate sau șterse, cu excepția datelor necesare pentru facturare.
            </p>
          </div>

          {/* SECȚIUNEA 4: DREPTURI */}
          <div className="content-section">
            <h2><span className="legal-emoji">🛡️</span> 4. Drepturile Dumneavoastră</h2>
            <p>Conform GDPR, aveți următoarele drepturi:</p>
            <ul className="rights-list">
              <li><strong>Dreptul de acces:</strong> Puteți cere o copie a datelor pe care le deținem.</li>
              <li><strong>Dreptul la rectificare:</strong> Puteți cere corectarea datelor greșite.</li>
              <li><strong>Dreptul la ștergere:</strong> Puteți cere ștergerea datelor asociate.</li>
              <li><strong>Dreptul la portabilitate:</strong> Puteți primi datele într-un format structurat.</li>
            </ul>
          </div>

          {/* SECȚIUNEA 5 & 6: SECURITATE ȘI CONTACT */}
          <div className="content-section">
            <h2><span className="legal-emoji">🛡️</span> 5. Securitatea Datelor</h2>
            <p>Site-ul nostru folosește criptare SSL (HTTPS) pentru toate transmisiile de date.</p>
          </div>

          <div className="content-section" style={{ border: 'none' }}>
            <h2><span className="legal-emoji">🛡️</span> 6. Contact</h2>
            <p>Pentru orice solicitare legată de datele personale, vă rugăm să ne contactați la:</p>
            <p style={{ color: 'var(--accent-gold)', fontWeight: '600', fontSize: '1.1rem' }}>
                contact@hypebarbershop.ro
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Gdpr;