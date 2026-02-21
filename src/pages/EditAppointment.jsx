import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

const EditAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    
    // Starea inițială goală
    const [formData, setFormData] = useState({
        clientName: '',
        phoneNumber: '',
        clientEmail: '',
        startTime: '',
        serviceId: '',
        barberId: '',
        additionalInfo: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Încărcăm datele programării specifice
                const appRes = await fetch(`http://192.168.1.32:8080/api/appointments/${id}`, { 
                    credentials: 'include' 
                });
                
                if (!appRes.ok) throw new Error("Programarea nu a fost găsită");
                const appData = await appRes.json();
                
                // 2. Încărcăm toate serviciile pentru dropdown
                const srvRes = await fetch(`http://192.168.1.32:8080/api/services`, { 
                    credentials: 'include' 
                });
                const srvData = await srvRes.json();
                setServices(srvData);

                // 3. PRESTABILIM DATELE (Pre-filling)
                // Ne asigurăm că cheile din backend se potrivesc cu starea noastră
                setFormData({
                    clientName: appData.clientName || '',
                    phoneNumber: appData.phoneNumber || '',
                    clientEmail: appData.clientEmail || '',
                    startTime: appData.startTime || '',
                    serviceId: appData.serviceId || '', // Luăm ID-ul serviciului curent
                    barberId: appData.barberId || '',
                    additionalInfo: appData.additionalInfo || ''
                });

                setLoading(false);
            } catch (err) {
                console.error("Eroare:", err);
                navigate('/dashboard');
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://192.168.1.32:8080/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (res.ok) {
                navigate('/dashboard');
            } else {
                alert("Eroare la salvarea modificărilor.");
            }
        } catch (err) {
            alert("Eroare de server.");
        }
    };

    if (loading) return (
        <div className="premium-edit-wrapper" style={{justifyContent: 'center'}}>
            <div className="edit-main-title" style={{fontSize: '1.5rem'}}>Se încarcă detaliile...</div>
        </div>
    );

    return (
        <div className="premium-edit-wrapper" style={{paddingTop: '60px'}}>
            
            {/* NOUL TITLU ELEGANT */}
            <div className="edit-header-section">
                <span className="edit-subtitle">Administrare Hype</span>
                <h1 className="edit-main-title">Editare Programare</h1>
                <div className="edit-divider"></div>
            </div>

            <div className="premium-card">
                <form onSubmit={handleSubmit}>
                    <div className="luxury-form-group">
                        <label className="premium-label">Nume Client</label>
                        <input className="premium-input" type="text" 
                            value={formData.clientName} 
                            onChange={e => setFormData({...formData, clientName: e.target.value})} 
                            required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="luxury-form-group">
                            <label className="premium-label">Telefon</label>
                            <input className="premium-input" type="text" 
                                value={formData.phoneNumber} 
                                onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
                                required />
                        </div>
                        <div className="luxury-form-group">
                            <label className="premium-label">Email</label>
                            <input className="premium-input" type="email" 
                                value={formData.clientEmail} 
                                onChange={e => setFormData({...formData, clientEmail: e.target.value})} 
                                required />
                        </div>
                    </div>

                    <div className="luxury-form-group">
                        <label className="premium-label">Data și Ora Programării</label>
                        <Flatpickr
                            value={formData.startTime}
                            className="premium-input"
                            options={{ 
                                enableTime: true, 
                                dateFormat: "Y-m-d H:i", 
                                time_24hr: true,
                                altInput: true,
                                altFormat: "d F Y, ora H:i"
                            }}
                            onChange={([date]) => {
                                const offset = date.getTimezoneOffset() * 60000;
                                const localTime = (new Date(date - offset)).toISOString().slice(0, 19);
                                setFormData({...formData, startTime: localTime});
                            }}
                        />
                    </div>

                    <div className="luxury-form-group">
                        <label className="premium-label">Serviciu</label>
                        <select className="premium-input" 
                                value={formData.serviceId} 
                                onChange={e => setFormData({...formData, serviceId: e.target.value})} 
                                required>
                            {services.map(s => (
                                <option key={s.id} value={s.id} style={{background: '#141414'}}>
                                    {s.serviceName} ({s.price} RON)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                        <button type="submit" className="btn-save-premium" style={{flex: 2}}>
                            Actualizează Programarea
                        </button>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn-cancel-premium" style={{flex: 1}}>
                            Anulează
                        </button>
                    </div>
                </form>
            </div>
            
            <div style={{height: '100px'}}></div>
        </div>
    );
};

export default EditAppointment;