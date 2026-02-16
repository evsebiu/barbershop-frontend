import React from 'react';
import Hero from '../components/Hero';
import BarberList from '../components/BarberList';

const Home = () => {
  return (
    <>
      {/* 2. HERO SECTION */}
      <Hero />

      {/* 3. ABOUT / CONCEPT SECTION */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-image-wrapper">
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070" alt="Hype Concept" />
            <div className="image-border"></div>
          </div>

          <div className="about-content">
            <span className="sub-heading">Filosofia Noastră</span>
            <h2 className="section-title" style={{ textAlign: 'left', left: 0, transform: 'none' }}>
              Mai mult decât un tuns
            </h2>
            <p className="about-text">
              La HypeBarbershop, am redefinit ritualul de îngrijire masculină. Nu vindem doar tunsori, ci oferim 
              o oră de deconectare totală într-un spațiu unde tradiția întâlnește arta.
            </p>

            <ul className="features-list">
              <li>
                <span className="icon">🎵</span>
                <div>
                  <strong>Playlist-uri Relaxante</strong>
                  <p>Atmosferă setată de playlist-uri Hip-Hop & Lo-Fi.</p>
                </div>
              </li>
              <li>
                <span className="icon">📐</span>
                <div>
                  <strong>Consultanță de Stil</strong>
                  <p>Analizăm fizionomia pentru a-ți propune tunsoarea ideală.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. TEAM SECTION */}
      <section id="barbers">
        <h2 className="section-title">Echipa Hype</h2>
        <div className="content-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '40px' }}>
            Alege specialistul potrivit pentru stilul tău și programează-te online.
          </p>
          <BarberList />
        </div>
      </section>
    </>
  );
};

export default Home;