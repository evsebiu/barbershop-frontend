import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BarberProfile = () => {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verificăm că URL-ul este cel de ID, nu cel de search
    fetch(`http://192.168.1.32:8080/api/barbers/${id}`) 
      .then(res => {
        if (!res.ok) throw new Error("Frizerul nu a fost găsit");
        return res.json();
      })
      .then(data => {
        console.log("Date primite de la server:", data); // Verifică în consolă (F12)
        setBarber(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Eroare la fetch:", err);
        setLoading(false);
      });
  }, [id]);

  // Dacă încă se încarcă, afișăm un mesaj vizibil pe fundalul negru
  if (loading) return (
    <div className="legal-page-container">
      <p style={{ textAlign: 'center', marginTop: '100px', color: 'var(--accent-gold)' }}>
        Se încarcă profilul...
      </p>
    </div>
  );

  // 2. CRITIC: Dacă barber este încă null (eroare fetch), prevenim crash-ul
  if (!barber) return (
    <div className="legal-page-container">
      <div className="legal-wrapper" style={{textAlign: 'center'}}>
        <h1 className="legal-page-title">Eroare</h1>
        <p style={{color: 'var(--text-muted)'}}>Frizerul nu a putut fi găsit.</p>
        <Link to="/" className="btn-cta" style={{marginTop: '20px'}}>Înapoi la Home</Link>
      </div>
    </div>
  );

  return (
    <div className="legal-page-container">
      <main style={{ padding: '2rem 5%' }}>
        
        <div className="profile-header">
          <div className="profile-img-wrapper">
            {/* 3. Folosim Optional Chaining (?.) pentru siguranță */}
            <img 
              src={barber?.firstName?.toLowerCase() === 'ovidiu' ? "/images/ovidiu.jpg" : "/images/catalin.JPG"} 
              className="profile-img" 
              alt="Portrait" 
            />
          </div>
          <div>
            <h1 className="legal-page-title" style={{ textAlign: 'left', fontSize: '3rem', marginBottom: '0' }}>
              {barber?.firstName} {barber?.lastName}
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '800px', margin: '4rem auto 0' }}>
          <h2 className="section-divider-title" style={{ textAlign: 'left', borderBottom: '1px solid var(--accent-gold)', display: 'inline-block', paddingBottom: '5px', marginBottom: '2rem' }}>
            Lista Servicii
          </h2>

          {!barber?.serviceDetails || barber.serviceDetails.length === 0 ? (
            <p className="empty-state">Acest frizer nu are servicii configurate momentan.</p>
          ) : (
            barber.serviceDetails.map(service => (
              <div key={service.id} className="service-item">
                <div className="service-meta">
                  <h3>{service.serviceName}</h3>
                  <p>{service.duration} minute</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="service-price">{service.price.toFixed(1)} RON</div>
                  <Link 
                    to={`/appointment/new?barberId=${barber.id}&serviceId=${service.id}`} 
                    className="btn-cta btn-small"
                  >
                    Programează
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default BarberProfile;