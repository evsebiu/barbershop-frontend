import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

const AppointmentForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const barberId = searchParams.get('barberId');
  const serviceId = searchParams.get('serviceId');

  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    clientEmail: '',
    startTime: '', 
  });

  const [barberName, setBarberName] = useState('...');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (barberId) {
      fetch(`http://192.168.1.12:8080/api/barbers/${barberId}`)
        .then(res => res.json())
        .then(data => setBarberName(data.firstName))
        .catch(err => console.error("Eroare nume frizer:", err));
    }
  }, [barberId]);

  useEffect(() => {
    if (selectedDate) {
      fetch(`http://192.168.1.12:8080/api/appointments/slots?barberId=${barberId}&serviceId=${serviceId}&date=${selectedDate}`)
        .then(res => res.json())
        .then(data => setAvailableSlots(data))
        .catch(err => console.error("Eroare slots:", err));
    }
  }, [selectedDate, barberId, serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // REPARARE FORMAT DATĂ: Adăugăm ":00" la final pentru ca Java să primească secundele
    const startTimeWithSeconds = formData.startTime.length === 16 ? `${formData.startTime}:00` : formData.startTime;

    try {
      const response = await fetch('http://192.168.1.12:8080/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          startTime: startTimeWithSeconds, // Trimitem formatul cu secunde
          barberId: parseInt(barberId), 
          serviceId: parseInt(serviceId) 
        })
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/appointment/confirmed', { 
          state: { 
            appointment: { ...result, barberName: barberName } 
          } 
        });
      } else {
        const errorData = await response.json();
        alert("Eroare la salvare: " + (errorData.message || "Date invalide"));
      }
    } catch (err) { 
      console.error(err);
      alert("Eroare de rețea. Verifică backend-ul.");
    }
  };

  return (
    <div className="legal-page-container">
      <main className="legal-wrapper">
        <div className="page-header">
          <h1 className="legal-page-title">Finalizează Programarea</h1>
          <p className="page-intro">Te rugăm să completezi datele de contact.</p>
        </div>

        <div className="legal-card" style={{ padding: 'var(--space-m)' }}>
          <h2 className="barber-card-subtitle">
            Programare la <span>{barberName}</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nume Complet</label>
              <input type="text" placeholder="Ex: Popescu Ion" required
                value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Telefon</label>
              <input type="tel" placeholder="07xxxxxxxx" required
                value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="exemplu@email.com" required
                value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} />
            </div>

            <div className="form-group">
              <label>Alege Ziua</label>
              <Flatpickr
                placeholder="Selectează data..."
                className="luxury-date-picker"
                
                options={
                  { minDate: "today",
                    locale: { firstDayOfWeek: 1 },
                  disableMobile: true,
                  animate: true,
                  static: true,
                  monthSelectorType: "dropdown",
                 }}

                onChange={([date]) => {
                  const d = date.toLocaleDateString('sv-SE');
                  setSelectedDate(d);
                }}
              />
            </div>

            {selectedDate && (
              <div className="form-group" style={{ marginTop: '2rem' }}>
                <label className="slots-label-gold">Ore Disponibile</label>
                <div id="slots-grid-luxury">
                  {availableSlots.map(time => (
                    <div 
                      key={time} 
                      className={`time-slot-item ${formData.startTime.endsWith(time) ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, startTime: `${selectedDate}T${time}` })}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="legal-consent-section">
              <div className="checkbox-luxury-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                    Sunt de acord cu <Link to="/terms" className="legal-link-gold">Termenii și Condițiile</Link>
                </label>
              </div>
              <div className="checkbox-luxury-group">
                <input type="checkbox" id="gdpr" required />
                <label htmlFor="gdpr">
                    Am luat la cunoștință <Link to="/gdpr" className="legal-link-gold">Politica GDPR</Link>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-cta" style={{ width: '100%' }} disabled={!formData.startTime}>
              Confirmă Programarea
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AppointmentForm;