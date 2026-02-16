import React from 'react';

const About = () => {
  const styles = {
    section: {
      backgroundColor: '#0f0f0f',
      padding: '80px 40px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      gap: '60px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    content: {
      flex: '1',
      minWidth: '300px',
    },
    subHeading: {
      color: '#d4af37',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontSize: '0.9rem',
      marginBottom: '10px',
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2.5rem',
      color: '#fff',
      marginBottom: '20px',
    },
    featureList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginTop: '30px',
    },
    featureItem: {
      display: 'flex',
      gap: '15px',
      alignItems: 'flex-start',
    },
    icon: {
      fontSize: '1.5rem',
      background: 'rgba(212, 175, 55, 0.1)',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      flexShrink: 0,
    }
  };

  const features = [
    { icon: '🎵', title: 'Playlsit-uri relaxante', desc: 'Atmosferă Hip-Hop & Lo-Fi specială.' },
    { icon: '📐', title: 'Consultanță de Stil', desc: 'Analizăm fizionomia pentru tunsoarea perfectă.' },
    { icon: '💎', title: 'Produse Premium', desc: 'Folosim exclusiv game de top.' }
  ];

  return (
    <section id="about" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.content}>
          <span style={styles.subHeading}>Filosofia Noastră</span>
          <h2 style={styles.title}>Mai mult decât un tuns</h2>
          <p style={{ color: '#a0a0a0', lineHeight: '1.8' }}>
            La HypeBarbershop, am redefinit ritualul de îngrijire masculină. Nu vindem doar tunsori, ci oferim o oră de deconectare totală.
          </p>
          
          <div style={styles.featureList}>
            {features.map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.icon}>{f.icon}</span>
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>{f.title}</strong>
                  <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;