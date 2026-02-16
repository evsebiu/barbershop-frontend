import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Importă Link-ul

const BarberList = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coloredId, setColoredId] = useState(null);

  useEffect(() => {
    fetch('http://192.168.1.132:8080/api/barbers/active')
      .then(res => res.json())
      .then(data => {
        setBarbers(data);
        setLoading(false);
      })
      .catch(err => console.error("Eroare la încărcarea frizerilor:", err));
  }, []);

  const getBarberImage = (email) => {
    if (email === 'ovidiu@hype.ro') return '/images/ovidiu.jpg';
    if (email === 'catalin@hype.ro') return '/images/catalin.JPG';
    return 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1925&auto=format&fit=crop';
  };

  if (loading) return <p style={{ textAlign: 'center', color: 'var(--accent-gold)' }}>Se încarcă echipa...</p>;

  return (
    <div className="barbers-grid">
      {barbers.map((barber) => (
        /* 2. Învăluim cardul într-un Link pentru a face toată zona clickabilă */
        /* Ruta trebuie să corespundă cu cea definită în App.jsx: /barber/:id */
        <Link to={`/barber/${barber.id}`} key={barber.id} className="barber-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          
          <div className="card-img-wrapper">
            <img src={getBarberImage(barber.email)} alt={barber.firstName} />
          </div>

          <div className="card-info">
            <h3 className="barber-name">
              {barber.firstName} {barber.lastName}
            </h3>
            
            <p className="barber-desc">
               {barber.firstName === 'Ovidiu' ? "Specialist în tunsori clasice și Old School." : 
                barber.firstName === 'Catalin' ? "Expert în design geometric și fade-uri moderne." : 
                "Specialist în fade-uri precise și îngrijirea bărbii."}
            </p>

            {/* 3. Transformăm butonul în Link pentru a păstra stilul btn-cta */}
            <div className="btn-cta btn-small" style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                Vezi Servicii
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BarberList;