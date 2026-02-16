import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import roLocale from '@fullcalendar/core/locales/ro';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';



const Dashboard = () => {
    // --- STĂRI (STATE) ---
    const [activeTab, setActiveTab] = useState('calendar');
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('sv-SE'));
    const [nextApp, setNextApp] = useState(null);
    const [myServices, setMyServices] = useState([]);
    const [newService, setNewService] = useState({ serviceName: '', price: '', duration: '' });
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    const [isSavingSchedule, setIsSavingSchedule] = useState(false);
    const [allBarbers, setAllBarbers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false)


    // TRANSFORMARE PENTRU UPGRADE RANGE SLIDER

    const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr.split(':').map(Number);
    return hrs * 60 + mins;
};

// Transformă 540 în "09:00"
const minutesToTime = (totalMinutes) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

    // PROGRAMUL FRIZERILOR

    const fetchWeeklySchedule = useCallback(async () => {
    try {
        const res = await fetch('http://192.168.1.132:8080/dashboard/api/dashboard/schedule', { 
            credentials: 'include' 
        });

        const data = await res.json();
        // Sortăm zilele să înceapă cu Luni (MONDAY)
        const sorted = data.dailySchedules.sort((a, b) => {
            const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
            return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
        });
        setWeeklySchedule(sorted);
    } catch (err) { console.error("Eroare încărcare program:", err); }
}, []);

// Apelăm fetch când tab-ul devine activ
useEffect(() => {
    if (activeTab === 'schedule') fetchWeeklySchedule();
}, [activeTab, fetchWeeklySchedule]);

// 2. Update local în state
const handleDayToggle = (index) => {
    const updated = [...weeklySchedule];
    updated[index].isWorkingDay = !updated[index].isWorkingDay;
    setWeeklySchedule(updated);
};

const handleTimeChange = (index, field, value) => {
    const updated = [...weeklySchedule];
    updated[index][field] = value;
    setWeeklySchedule(updated);
};

// 3. Funcția Magică: Copiază programul de Luni la restul zilelor lucrătoare
const copyMondayToAll = () => {
    const monday = weeklySchedule[0];
    const updated = weeklySchedule.map((day, idx) => {
        if (idx === 0) return day;
        return { ...day, startTime: monday.startTime, endTime: monday.endTime, isWorkingDay: monday.isWorkingDay };
    });
    setWeeklySchedule(updated);
};

// 4. Salvare în Backend
const saveSchedule = async () => {
    setIsSavingSchedule(true);
    try {
        const res = await fetch('http://192.168.1.132:8080/dashboard/api/dashboard/schedule/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dailySchedules: weeklySchedule }),
            credentials: 'include'
        });
        if (res.ok) alert("Program actualizat cu succes!");
    } catch (err) { alert("Eroare la salvare."); }
    finally { setIsSavingSchedule(false); }
};



    // --- LOGICĂ FETCH (BACKEND INTEGRATION) ---


    // 1. Fetch Lista Frizeri (Doar dacă ești pe tab-ul Team)
const fetchBarbers = useCallback(async () => {
    try {
        const res = await fetch('http://192.168.1.132:8080/api/admin/barbers', {
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            setAllBarbers(data);
            // Opțional: Aici poți verifica și dacă userul curent are rol de ADMIN
            // setIsAdmin(true); 
        }
    } catch (err) {
        console.error("Eroare la încărcarea echipei:", err);
    }
}, []);

// 2. Funcția de Toggle (Switch ON/OFF)
const handleToggleBarber = async (id, currentStatus) => {
    // Optimistic UI Update: Schimbăm vizual imediat, înainte de server (se simte mai rapid)
    const updatedBarbers = allBarbers.map(b => 
        b.id === id ? { ...b, isActive: !currentStatus } : b
    );
    setAllBarbers(updatedBarbers);

    try {
        const res = await fetch(`http://192.168.1.132:8080/api/admin/barbers/toggle/${id}`, {
            method: 'PATCH', // Sau POST, depinde cum ai definit în Java (ai pus @PatchMapping)
            credentials: 'include'
        });

        if (!res.ok) {
            // Dacă dă eroare, revenim la starea inițială (Rollback)
            alert("Eroare la server. Modificarea nu s-a salvat.");
            fetchBarbers(); // Reîncărcăm datele reale
        }
    } catch (err) {
        alert("Eroare de conexiune.");
        fetchBarbers();
    }
};

// 3. Adaugă apelul în useEffect-ul principal
useEffect(() => {
    if (activeTab === 'team') fetchBarbers();
    // ... restul codului existent
}, [activeTab, fetchBarbers]); // Adaugă fetchBarbers la dependențe


    // 1. Agenda Zilei
    const fetchAgendaData = useCallback(async (date) => {
        try {
            const res = await fetch(`http://192.168.1.132:8080/dashboard/appointments-by-date?date=${date}`, {
                credentials: 'include'
            });
            const data = await res.json();
            setAppointments(data);
        } catch (err) { console.error("Eroare încărcare agendă:", err); }
    }, []);

    // 2. Următorul Client (Focus)
    const fetchNextClient = useCallback(async () => {
        try {
            const res = await fetch('http://192.168.1.132:8080/dashboard/next-appointment-data', {
                credentials: 'include'
            });
            if (res.status === 200) {
                const data = await res.json();
                setNextApp(data);
            } else { setNextApp(null); }
        } catch (err) { console.log("Nu sunt programări viitoare."); }
    }, []);

    // 3. Management Servicii
    const fetchMyServices = useCallback(async () => {
        try {
            // Notă: Folosim endpoint-ul de API pentru a lua lista de servicii
            const res = await fetch('http://192.168.1.132:8080/api/services', { credentials: 'include' });
            const data = await res.json();
            setMyServices(data);
        } catch (err) { console.error("Eroare încărcare servicii:", err); }
    }, []);

    // Controlul apelurilor de date în funcție de tab-ul activ
    useEffect(() => {
        fetchNextClient();
        
        if(activeTab === 'list' || activeTab === 'calendar'){
            fetchAgendaData(selectedDate);
        }

        if(activeTab === 'services') fetchMyServices();
    }, [activeTab, selectedDate, fetchAgendaData, fetchNextClient, fetchMyServices]);

    // --- HANDLERS (ACȚIUNI) ---

    // Schimbare Status Programare
    const updateStatus = async (id, action) => {
        if (!window.confirm(`Sigur vrei să marchezi programarea ca ${action}?`)) return;
        try {
            const res = await fetch(`http://192.168.1.132:8080/dashboard/appointment/${action}/${id}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                fetchAgendaData(selectedDate);
                fetchNextClient();
            }
        } catch (err) { alert("Eroare de comunicare cu serverul."); }
    };

    // Management Servicii: Adăugare
  const handleSaveService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const method = editingServiceId ? 'PUT' : 'POST';
    const url = editingServiceId 
        ? `http://192.168.1.132:8080/api/services/${editingServiceId}` 
        : 'http://192.168.1.132:8080/api/services';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newService), // Trimitem JSON direct
            credentials: 'include'
        });

        if (res.ok) {
            setNewService({ serviceName: '', price: '', duration: '' });
            setEditingServiceId(null);
            fetchMyServices();
        }
    } catch (err) {
        alert("Eroare la procesarea serviciului.");
    } finally {
        setIsSubmitting(false);
    }
};

    // Management Servicii: Ștergere
    const handleDeleteService = async (id) => {
    if (!window.confirm("Atenție! Serviciul va fi șters definitiv din baza de date. Continui?")) return;
    try {
        const res = await fetch(`http://192.168.1.132:8080/api/services/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (res.ok) fetchMyServices();
    } catch (err) {
        console.error("Eroare la ștergere:", err);
    }
};

    // Navigare către Editare
    const startEdit = (service) => {
    setEditingServiceId(service.id);
    setNewService({
        serviceName: service.serviceName,
        price: service.price,
        duration: service.duration
    });
};

    // Helper: WhatsApp Link
    const formatWhatsApp = (phone) => {
        const clean = phone.replace(/\D/g, '');
        return clean.startsWith('0') ? `40${clean.substring(1)}` : clean;
    };


    const handleEventDrop = async  (info) => {
        const {event} = info;
        const year = event.start.getFullYear();
    const month = String(event.start.getMonth() + 1).padStart(2, '0');
    const day = String(event.start.getDate()).padStart(2, '0');
    const hours = String(event.start.getHours()).padStart(2, '0');
    const minutes = String(event.start.getMinutes()).padStart(2, '0');
    const seconds = String(event.start.getSeconds()).padStart(2, '0');

    // Formatul rezultat: YYYY-MM-DDTHH:mm:ss (fără "Z" la final)
    const newStart = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        if (!window.confirm(`Sigur vrei să muți programarea lui ${event.title} la ora ${event.start.toLocaleTimeString()}?`)) {
            info.revert();
            return;
        }

        try{
           const res = await fetch(`http://192.168.1.132:8080/dashboard/appointment/move/${event.id}?newStart=${newStart}`, {
            method: 'POST',
            credentials: 'include'
        });

        if(res.ok){
            fetchAgendaData(selectedDate);
            fetchNextClient();
        } else {
            const errorText = await res.text();
            alert("Eroare la mutare :" + errorText);
            info.revert();
        }

        } catch(err){
            alert("Eroare de comunicare cu serverul.");
            info.revert();
        }
    };

    const handleDatesSet = (dateInfo) => {
        const newVisibleDate = dateInfo.startStr.split('T')[0];

        if (newVisibleDate !== selectedDate){
            setSelectedDate(newVisibleDate);
        }
    }

    const handleEdit = (id) => {
    navigate(`/dashboard/edit-appointment/${id}`);
};

    return (
        <div className="dashboard-container" style={{ paddingBottom: '100px' }}>
            {/* HEADER COMPACT */}
            <div className="dashboard-header-compact" style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '15px 20px', // Padding consistent
    background: 'rgba(10,10,10,0.8)', // Ușor transparent
    backdropFilter: 'blur(10px)'
}}>
    <div className="user-welcome">
        {/* Folosim 'clamp' pentru text responsive */}
        <h2 style={{ 
            color: '#fff', 
            margin: 0,
            fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', 
            fontFamily: 'var(--font-heading)' 
        }}>
            Hype Barbershop
        </h2>
        <span style={{ 
            color: 'var(--accent-gold)', 
            fontSize: '0.75rem', 
            letterSpacing: '1px',
            textTransform: 'uppercase' 
        }}>
            Panou Admin
        </span>
    </div>
    <button onClick={() => navigate('/')} className="btn-logout-premium">
        ⏻
    </button>
</div>

            {/* FOCUS: Următorul Client (Apare doar pe tab-urile principale) */}
            {nextApp && (activeTab === 'calendar' || activeTab === 'list') && (
                <div className="focus-card" style={{ margin: '0 20px 25px' }}>
                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: '700' }}>URMEAZĂ ACUM</span>
                    <div className="appointment-card focus-highlight">
                        <div className="card-content" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ color: '#fff', margin: 0 }}>{nextApp.clientName}</h2>
                                    <p style={{ color: 'var(--accent-gold)' }}>🕒 {nextApp.startTime.split('T')[1].substring(0,5)} - {nextApp.serviceName}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <a href={`tel:${nextApp.phoneNumber}`} className="btn-action-round">📞</a>
                                    <a href={`https://wa.me/${formatWhatsApp(nextApp.phoneNumber)}`} target="_blank" className="btn-action-round" style={{ background: '#25D366' }}>📱</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main style={{ padding: '0 20px' }}>
                {/* TAB 1: CALENDAR */}
                {activeTab === 'calendar' && (
                    <div className="full-calendar-wrapper glass-effect">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridDay"
                            initialDate={selectedDate}
                            editable={true}
                            eventDrop={handleEventDrop}
                            locale={roLocale}
                            datesSet={handleDatesSet}
                            events={appointments.map(app => ({
                                id: app.id,
                                title: app.clientName,
                                start: app.startTime,
                                backgroundColor: app.status === 'COMPLETED' ? '#4a4a4a' : '#d4af37',
                                borderColor: '#d4af37',
                                textColor: '#ffffff'
                            }))}
                            headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
                            height="auto"
                        />
                    </div>
                )}

                {/* TAB 2: AGENDĂ (LISTĂ) */}
                {activeTab === 'list' && (
                    <div className="agenda-section">
                        <div className="date-navigator-wrapper">
                            <label className="section-divider-title">Alege Ziua</label>
                           <Flatpickr
                             value={selectedDate}
                             className="luxury-date-picker"
                             options={{ 
                                dateFormat: "Y-m-d", 
                                locale: { firstDayOfWeek: 1 },
                                disableMobile: "true" // Previne tastatura nativă pe mobil pentru o experiență mai fluidă
                                }}
                                
                                onChange={([date]) => {
                                    
                               // Folosim metoda locală pentru a obține formatul YYYY-MM-DD fără decalaj de fus orar
                               const year = date.getFullYear();
                               const month = String(date.getMonth() + 1).padStart(2, '0');
                               const day = String(date.getDate()).padStart(2, '0');
                               const formattedDate = `${year}-${month}-${day}`;
                               
                               setSelectedDate(formattedDate);
                               
                               }}
                               
                            />
                        
                        </div>

                        <div className="appointments-grid">
                            {appointments.length === 0 ? (
                                <p className="empty-state">Nicio programare pentru această zi.</p>
                            ) : (
                                appointments.map(app => (
                                    <div key={app.id} className="appointment-card glass-effect">
                                        <div className={`status-indicator ${app.status.toLowerCase()}`}></div>
                                        <div className="card-content">
                                            <div className="card-header-row">
                                                <div className="time-badge">
                                                    <span className="app-time">{app.startTime.split('T')[1].substring(0,5)}</span>
                                                    <span className="price-tag">{app.price} RON</span>
                                                </div>
                                                <button onClick={() => handleEdit(app.id)} className="btn-icon edit">✎</button>
                                            </div>
                                            <div className="client-info">
                                                <h4>{app.clientName}</h4>
                                                <p className="service-name">{app.serviceName}</p>
                                            </div>
                                            <div className="card-actions">
    {/* Grupul de Contact (Sună + WhatsApp) */}
    <a href={`tel:${app.phoneNumber}`} className="btn-icon call">
        <span>📞</span> Sună
    </a>
    <a href={`https://wa.me/${formatWhatsApp(app.phoneNumber)}`} target="_blank" className="btn-icon whatsapp">
        <span>📱</span> WhatsApp
    </a>

    {/* Grupul de Status (Gata / Anulează) */}
    {app.status !== 'COMPLETED' && app.status !== 'CANCELED' && (
        <button onClick={() => updateStatus(app.id, 'complete')} className="btn-icon complete">
            <span>✅</span> Finalizează
        </button>
    )}
    
    {app.status !== 'CANCELED' && app.status !== 'COMPLETED' && (
        <button onClick={() => updateStatus(app.id, 'cancel')} className="btn-icon delete-icon">
            <span>🚫</span> Anulează
        </button>
    )}
</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 3: SERVICII */}
                {activeTab === 'services' && (
                    <div className="services-admin-section">
    <h3 className="section-divider-title">✂️ Management Servicii</h3>
    
    <div className="legal-card service-add-card">
        <h4 className="gold-text">
            {editingServiceId ? "Editează Serviciul" : "Adaugă Serviciu Nou"}
        </h4>
        <form onSubmit={handleSaveService} className="mini-form">
            <div className="form-group">
                <input type="text" placeholder="Denumire Serviciu" required
                    value={newService.serviceName}
                    onChange={e => setNewService({...newService, serviceName: e.target.value})} />
            </div>
            <div className="form-row-dual">
                <input type="number" placeholder="Preț" required
                    value={newService.price}
                    onChange={e => setNewService({...newService, price: e.target.value})} />
                <input type="number" placeholder="Min" required
                    value={newService.duration}
                    onChange={e => setNewService({...newService, duration: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-cta" disabled={isSubmitting}>
                    {isSubmitting ? "Se salvează..." : (editingServiceId ? "Salvează Modificările" : "+ Adaugă")}
                </button>
                {editingServiceId && (
                    <button type="button" className="btn-logout-premium" style={{fontSize: '0.8rem', padding: '10px'}}
                        onClick={() => { setEditingServiceId(null); setNewService({serviceName:'', price:'', duration:''}); }}>
                        Anulează
                    </button>
                )}
            </div>
        </form>
    </div>

    <div className="services-active-list">
        {myServices.map(service => (
            <div key={service.id} className="service-admin-item glass-effect">
                <div className="service-main-info">
                    <h5>{service.serviceName}</h5>
                    <p>{service.price} RON • {service.duration} min</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEdit(service)} className="btn-icon edit">✎</button>
                    <button onClick={() => handleDeleteService(service.id)} className="btn-delete-mini">🗑️</button>
                </div>
            </div>
        ))}
    </div>
</div>
                )}

            

           {activeTab === 'schedule' && (
    <div className="schedule-manager-section">
        <div className="section-header-row">
            <h3 className="section-divider-title">🕒 Programul Meu de Lucru</h3>
            <button onClick={copyMondayToAll} className="btn-magic-copy">🪄 Copiază Luni</button>
        </div>

        <div className="schedule-grid">
            {/* Verificăm dacă weeklySchedule există și are elemente */}
            {weeklySchedule && weeklySchedule.length > 0 ? (
                weeklySchedule.map((day, index) => (
                    <div key={day.dayOfWeek} className={`day-schedule-card ${day.isWorkingDay ? 'active' : 'inactive'}`}>
                        <div className="day-info">
                            <span className="day-name">{day.dayOfWeek}</span>
                            <div className="toggle-wrapper">
                                <input 
                                    type="checkbox" 
                                    checked={day.isWorkingDay || false} 
                                    onChange={() => handleDayToggle(index)} 
                                    id={`check-${index}`}
                                />
                                <label htmlFor={`check-${index}`}>{day.isWorkingDay ? "DESCHIS" : "ÎNCHIS"}</label>
                            </div>
                        </div>

                        {day.isWorkingDay && (
    <div className="range-slider-container" style={{ padding: '20px 10px' }}>
        <div className="time-labels" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span className="gold-text">🕒 {day.startTime?.substring(0, 5) || "09:00"}</span>
            <span className="gold-text">🕒 {day.endTime?.substring(0, 5) || "18:00"}</span>
        </div>
        
        <Slider
            range
            min={0}
            max={1440}
            step={15} // Pași de 15 minute
            value={[
                timeToMinutes(day.startTime || "09:00"),
                timeToMinutes(day.endTime || "18:00")
            ]}
            onChange={(values) => {
                handleTimeChange(index, 'startTime', minutesToTime(values[0]));
                handleTimeChange(index, 'endTime', minutesToTime(values[1]));
            }}
            trackStyle={[{ backgroundColor: 'var(--accent-gold)' }]}
            handleStyle={[
                { backgroundColor: '#000', borderColor: 'var(--accent-gold)' },
                { backgroundColor: '#000', borderColor: 'var(--accent-gold)' }
            ]}
            railStyle={{ backgroundColor: '#333' }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '10px', color: '#555' }}>
            <span>00:00</span>
            <span>12:00</span>
            <span>23:45</span>
        </div>
    </div>
)}
                    </div>
                ))
            ) : (
                <p className="empty-state">Se încarcă programul de pe server...</p>
            )}
        </div>

        <button onClick={saveSchedule} className="btn-cta save-schedule-btn" disabled={isSavingSchedule}>
            {isSavingSchedule ? "Se salvează..." : "Salvează Programul"}
        </button>
    </div>
)}

{/* TAB 4: MANAGEMENT ECHIPĂ */}
{activeTab === 'team' && (
    <div className="team-management-section">
        <h3 className="section-divider-title">👥 Management Echipă</h3>
        
        <div className="dashboard-card glass-effect" style={{ padding: '20px' }}>
            <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ddd' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                            <th style={{ padding: '15px', color: '#d4af37' }}>Nume</th>
                            <th style={{ padding: '15px', color: '#d4af37' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'right', color: '#d4af37' }}>Acțiune</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBarbers.map(barber => (
                            <tr key={barber.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{barber.firstName} {barber.lastName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{barber.email}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        color: barber.isActive ? '#4CAF50' : '#F44336', 
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {barber.isActive ? 'ACTIV' : 'INACTIV'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    {/* SWITCH COMPONENT */}
                                    <label className="switch">
                                        <input 
                                            type="checkbox" 
                                            checked={barber.isActive}
                                            onChange={() => handleToggleBarber(barber.id, barber.isActive)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {allBarbers.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        Se încarcă lista sau nu ai drepturi de admin...
                    </div>
                )}
            </div>
        </div>
    </div>
)}


            </main>

            {/* NAVIGARE BOTTOM */}
            <nav className="bottom-nav">
                <button className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
                    <span className="nav-icon">📅</span><span className="nav-label">Calendar</span>
                </button>
                <button className={`nav-item ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
                    <span className="nav-icon">📋</span><span className="nav-label">Agendă</span>
                </button>
                <button className={`nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
                    <span className="nav-icon">✂️</span><span className="nav-label">Servicii</span>
                </button>
                <button className={`nav-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
                    <span className="nav-icon">👥</span><span className="nav-label">Echipă</span>
                </button>
                <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
    <span className="nav-icon">🕒</span>
    <span className="nav-label">Program</span>
</button>
            </nav>
        </div>
    );
};

export default Dashboard;