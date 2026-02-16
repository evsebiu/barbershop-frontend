import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="legal-page-container">
      {/* 1. WRAPPER PENTRU CENTRARE */}
      <main className="legal-wrapper">
        
        {/* HEADER PAGINĂ: Efect metalic auriu */}
        <div className="page-header">
          <h1 className="legal-page-title">Termeni și Condiții</h1>
          <span className="last-updated">Actualizat: 03 Ianuarie 2026</span>
        </div>

        {/* CARDUL PREMIUM CU LINIE AURIE */}
        <div className="legal-card">
          
          {/* SECȚIUNEA 1 */}
          <div className="content-section">
            <h2><span className="legal-emoji">⚖️</span> 1. Introducere</h2>
            <p>
              Bine ați venit pe site-ul Hype Barbershop. Accesarea și utilizarea acestui website, 
              precum și programarea serviciilor noastre, implică acceptarea automată a termenilor 
              și condițiilor de mai jos.
            </p>
          </div>

          {/* SECȚIUNEA 2 */}
          <div className="content-section">
            <h2><span className="legal-emoji">🕒</span> 2. Programări și Anulări</h2>
            <p>Pentru a asigura eficiența serviciilor noastre și respectul față de toți clienții, aplicăm următoarele reguli:</p>
            <ul>
              <li>Programările se pot face online sau telefonic.</li>
              <li>Vă rugăm să ajungeți cu cel puțin <strong>5 minute</strong> înainte de ora stabilită.</li>
              <li>Anulările trebuie făcute cu cel puțin <strong>2 ore</strong> înainte.</li>
              <li>Întârzierea mai mare de 15 minute poate duce la anularea programării sau scurtarea serviciului.</li>
            </ul>
          </div>

          {/* SECȚIUNEA 3 */}
          <div className="content-section">
            <h2><span className="legal-emoji">👤</span> 3. Drepturile și Obligațiile</h2>
            <p>
              Clientul are obligația de a furniza date corecte în momentul programării. 
              Ne rezervăm dreptul de a refuza serviciile clienților care au un comportament inadecvat 
              sau care au istoric de neprezentări repetate.
            </p>
          </div>

          {/* SECȚIUNEA 4 */}
          <div className="content-section">
            <h2><span className="legal-emoji">🛡️</span> 4. Confidențialitate</h2>
            <p>
              Datele dumneavoastră personale sunt procesate în siguranță conform GDPR. Pentru detalii complete, 
              vă rugăm să consultați pagina noastră de <Link to="/gdpr" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Politica de Confidențialitate</Link>.
            </p>
          </div>

          {/* SECȚIUNEA 5 */}
          <div className="content-section">
            <h2><span className="legal-emoji">🔄</span> 5. Modificări</h2>
            <p>
              Hype Barbershop își rezervă dreptul de a modifica acești termeni oricând. 
              Continuarea utilizării serviciilor noastre după modificări reprezintă acceptul dumneavoastră.
            </p>
          </div>

          {/* SECȚIUNEA 6 */}
          <div className="content-section" style={{ border: 'none', marginBottom: 0 }}>
            <h2><span className="legal-emoji">✉️</span> 6. Contact</h2>
            <p>
              Pentru orice întrebări legate de acești termeni, ne puteți contacta la: 
              <a href="mailto:contact@hypebarbershop.ro" style={{ color: 'var(--accent-gold)', marginLeft: '5px', textDecoration: 'underline' }}>
                contact@hypebarbershop.ro
              </a>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Terms;