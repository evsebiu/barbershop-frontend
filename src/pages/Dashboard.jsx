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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name'); // Poate fi 'name', 'phone' sau 'email'
    const [searchResults, setSearchResults] = useState(null); // null = nu se caută nimic
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    
    const [manualBooking, setManualBooking] = useState({
        clientName: '',
        phoneNumber: '',
        clientEmail: '',
        startTime: '',
        serviceId: '',
    });

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
    setIsLoadingSchedule(true);
    
    // Generăm programul standard pe care îl vom folosi mereu dacă ceva nu merge
    const defaultSchedule = [
        { dayOfWeek: "MONDAY", isWorkingDay: true, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: "TUESDAY", isWorkingDay: true, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: "WEDNESDAY", isWorkingDay: true, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: "THURSDAY", isWorkingDay: true, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: "FRIDAY", isWorkingDay: true, startTime: "09:00", endTime: "18:00" },
        { dayOfWeek: "SATURDAY", isWorkingDay: false, startTime: "09:00", endTime: "14:00" },
        { dayOfWeek: "SUNDAY", isWorkingDay: false, startTime: "09:00", endTime: "14:00" }
    ];

    try {
        // ATENȚIE: Verifică dacă acest URL este cel corect! 
        // Înainte aveai '/dashboard/api/dashboard/schedule' care s-ar putea să fi fost duplicat
        const res = await fetch('http://192.168.1.48:8080/api/dashboard/schedule', { 
            credentials: 'include' 
        });

        // Dacă backend-ul zice "Eroare", aruncăm eroarea ca să fim prinși de "catch"
        if (!res.ok) throw new Error("Nu s-a găsit program, sau sesiune expirată.");

        const data = await res.json();
        const schedulesArray = data.dailySchedules || data; 

        if (!schedulesArray || schedulesArray.length === 0) {
            setWeeklySchedule(defaultSchedule); // Dacă e gol, punem programul de bază
        } else {
            const sorted = schedulesArray.sort((a, b) => {
                const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
                return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
            });
            setWeeklySchedule(sorted);
        }
    } catch (err) { 
        console.error("A picat fetch-ul, aplicăm programul default. Motiv:", err); 
        // MAGIC FIX: Chiar dacă serverul dă eroare, noi AFIȘĂM programul ca să îl poți salva!
        setWeeklySchedule(defaultSchedule);
    } finally {
        setIsLoadingSchedule(false);
    }
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
        const res = await fetch('http://192.168.1.48:8080/dashboard/api/dashboard/schedule/save', {
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
            const res = await fetch('http://192.168.1.48:8080/api/admin/barbers', {
                credentials: 'include'
            });
            
            if (!res.ok) {
                if (res.status === 403) {
                    console.error("Nu ai drepturi de ADMIN pentru a vedea echipa.");
                }
                throw new Error(`Eroare de la server: ${res.status}`);
            }

            const data = await res.json();
            setAllBarbers(data);
        } catch (err) {
            console.error("Eroare la încărcarea echipei:", err);
            setAllBarbers([]); // Prevenim blocarea
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
        const res = await fetch(`http://192.168.1.48:8080/api/admin/barbers/toggle/${id}`, {
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
            const res = await fetch(`http://192.168.1.48:8080/dashboard/appointments-by-date?date=${date}`, {
                credentials: 'include'
            });
            const data = await res.json();
            setAppointments(data);
        } catch (err) { console.error("Eroare încărcare agendă:", err); }
    }, []);

    // 2. Următorul Client (Focus)
    const fetchNextClient = useCallback(async () => {
        try {
            const res = await fetch('http://192.168.1.48:8080/dashboard/next-appointment-data', {
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
            const res = await fetch('http://192.168.1.48:8080/api/services', { 
                credentials: 'include' 
            });
            
            if (!res.ok) {
                throw new Error(`Eroare de la server: ${res.status}`);
            }
            
            const data = await res.json();
            setMyServices(data);
        } catch (err) { 
            console.error("Eroare încărcare servicii:", err); 
            setMyServices([]); // Prevenim blocarea ecranului punând o listă goală
        }
    }, []);

    // Controlul apelurilor de date în funcție de tab-ul activ
    useEffect(() => {
        fetchNextClient();
        
        if(activeTab === 'list' || activeTab === 'calendar'){
            fetchAgendaData(selectedDate);
        }

       fetchMyServices();
    }, [activeTab, selectedDate, fetchAgendaData, fetchNextClient, fetchMyServices]);

    // --- HANDLERS (ACȚIUNI) ---

    // Adaugă această funcție în zona de HANDLERS
const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
        setSearchResults(null); // Resetează căutarea dacă input-ul e gol
        return;
    }
    
    setIsSearching(true);
    try {
        // Construim query-ul pe baza selecției
        const queryParam = `${searchType}=${encodeURIComponent(searchTerm)}`;
        
        const res = await fetch(`http://192.168.1.48:8080/api/appointments/search?${queryParam}`, {
            credentials: 'include'
        });
        
        if (res.ok) {
            const data = await res.json();
            setSearchResults(data);
        }
    } catch (err) {
        alert("Eroare la efectuarea căutării.");
    } finally {
        setIsSearching(false);
    }
};

const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
};



    // Schimbare Status Programare
    const updateStatus = async (id, action) => {
        if (!window.confirm(`Sigur vrei să marchezi programarea ca ${action}?`)) return;
        try {
            const res = await fetch(`http://192.168.1.48:8080/dashboard/appointment/${action}/${id}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                fetchAgendaData(selectedDate);
                fetchNextClient();
            }
        } catch (err) { alert("Eroare de comunicare cu serverul."); }
    };

    const handleManualBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            // ATENȚIE: Link-ul modificat cu /manual-booking
            const res = await fetch('http://192.168.1.48:8080/api/appointments/manual-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(manualBooking),
                credentials: 'include'
            });

            if (res.ok) {
                setIsBookingModalOpen(false); 
                setManualBooking({ clientName: '', phoneNumber: '', clientEmail: '', startTime: '', serviceId: '' });
                fetchAgendaData(selectedDate);
                fetchNextClient();
                alert("✅ Programare adăugată cu succes!");
            } else {
                // Aici extragem motivul EXACT de la Java (ex: "Eroare: Nu poți programa in trecut")
                const errorData = await res.json(); 
                alert("❌ Eroare: " + (errorData.message || "Date invalide."));
            }
        } catch (err) {
            alert("❌ Eroare de conexiune cu serverul.");
        }
    };

    // Management Servicii: Adăugare
  const handleSaveService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const method = editingServiceId ? 'PUT' : 'POST';
    const url = editingServiceId 
        ? `http://192.168.1.48:8080/api/services/${editingServiceId}` 
        : 'http://192.168.1.48:8080/api/services';

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
        const res = await fetch(`http://192.168.1.48:8080/api/services/${id}`, {
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
           const res = await fetch(`http://192.168.1.48:8080/dashboard/appointment/move/${event.id}?newStart=${newStart}`, {
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
                            contentHeight="auto"
                            stickyHeaderDates={true}
                            allDaySlot={false}
                            longPressDelay={250}
                            eventLongPressDelay={250}
                            selectLongPressDelay={250}
                        />
                    </div>
                )}

                {/* TAB 2: AGENDĂ (LISTĂ) */}
                {activeTab === 'list' && (
    <div className="agenda-section">
        
        {/* BARA DE CĂUTARE PREMIUM */}
        <div className="premium-search-container glass-effect">
            <form onSubmit={handleSearch} className="search-form-modern">
                <div className="search-input-group">
                    <select 
                        className="search-select-modern"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="name">Nume</option>
                        <option value="phone">Telefon</option>
                        <option value="email">Email</option>
                    </select>
                    
                    <input 
                        type={searchType === 'email' ? 'email' : 'text'}
                        className="search-input-modern"
                        placeholder="Caută client..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {searchTerm && (
                        <button type="button" onClick={clearSearch} className="btn-clear-search">
                            ✕
                        </button>
                    )}
                    
                    <button type="submit" className="btn-search-modern" disabled={isSearching}>
                        {isSearching ? '⏳' : '🔍'}
                    </button>
                </div>
            </form>
        </div>

        {/* Dacă NU suntem în modul căutare, afișăm date picker-ul normal */}
        {!searchResults && (
            <div className="date-navigator-wrapper">
                <label className="section-divider-title">Alege Ziua</label>
                <Flatpickr
                    value={selectedDate}
                    className="luxury-date-picker"
                    options={{ dateFormat: "Y-m-d", locale: { firstDayOfWeek: 1 }, disableMobile: "true" }}
                    onChange={([date]) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setSelectedDate(`${year}-${month}-${day}`);
                    }}
                />
            </div>
        )}

        {/* LISTA DE REZULTATE SAU PROGRAMĂRI ZILNICE */}
        <div className="appointments-grid">
            {searchResults !== null ? (
                // Afișăm rezultatele căutării
                <>
                    <h3 className="section-divider-title">Rezultatele căutării ({searchResults.length})</h3>
                    {searchResults.length === 0 ? (
                        <p className="empty-state">Niciun client găsit.</p>
                    ) : (
                        searchResults.map(app => (
                            /* Reutilizăm cardul existent pentru programări */
                            <div key={app.id} className="appointment-card glass-effect">
                                <div className={`status-indicator ${app.status?.toLowerCase() || 'pending'}`}></div>
                                <div className="card-content">
                                    <div className="card-header-row">
                                        <div className="time-badge">
                                            <span className="app-date">{app.startTime.split('T')[0]}</span>
                                            <span className="app-time" style={{marginLeft: '10px'}}>{app.startTime.split('T')[1].substring(0,5)}</span>
                                        </div>
                                    </div>
                                    <div className="client-info">
                                        <h4>{app.clientName}</h4>
                                        <p className="service-name">{app.serviceName} - {app.price} RON</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </>
            ) : (
                // Afișăm agenda normală a zilei (codul tău existent)
                appointments.length === 0 ? (
                    <p className="empty-state">Nicio programare pentru această zi.</p>
                ) : (
                    appointments.map(app => (
                        <div key={app.id} className="appointment-card glass-effect">
                           {/* Aici păstrezi codul tău exact așa cum era pentru afișarea cardului normal */}
                           <div className={`status-indicator ${app.status?.toLowerCase() || 'pending'}`}></div>
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
                                   <a href={`tel:${app.phoneNumber}`} className="btn-icon call"><span>📞</span> Sună</a>
                                   <a href={`https://wa.me/${formatWhatsApp(app.phoneNumber)}`} target="_blank" rel="noreferrer" className="btn-icon whatsapp"><span>📱</span> WhatsApp</a>
                                   {app.status !== 'COMPLETED' && app.status !== 'CANCELED' && (
                                       <button onClick={() => updateStatus(app.id, 'complete')} className="btn-icon complete"><span>✅</span> Finalizează</button>
                                   )}
                                   {app.status !== 'CANCELED' && app.status !== 'COMPLETED' && (
                                       <button onClick={() => updateStatus(app.id, 'cancel')} className="btn-icon delete-icon"><span>🚫</span> Anulează</button>
                                   )}
                               </div>
                           </div>
                        </div>
                    ))
                )
            )}
        </div>
    </div>
)}

                {/* TAB 3: SERVICII */}
                {activeTab === 'services' && (
                    <div className="premium-services-section">
                        <h3 className="section-divider-title">✂️ Management Servicii</h3>
                        
                        {/* CARDUL DE ADĂUGARE / EDITARE */}
                        <div className="premium-form-card">
                            <h4 className="gold-text-title">
                                {editingServiceId ? "Editează Serviciul" : "Adaugă Serviciu Nou"}
                            </h4>
                            <form onSubmit={handleSaveService} className="premium-service-form">
                                <div className="form-group-modern">
                                    <input 
                                        type="text" 
                                        className="premium-input-modern"
                                        placeholder="Denumire Serviciu (ex: Tuns și Barbă)" 
                                        required
                                        value={newService.serviceName}
                                        onChange={e => setNewService({...newService, serviceName: e.target.value})} 
                                    />
                                </div>
                                
                                {/* AICI ESTE MAGIA PENTRU ALINIERE: Grid-ul pe 2 coloane */}
                                <div className="input-grid-2col">
                                    <input 
                                        type="number" 
                                        className="premium-input-modern"
                                        placeholder="Preț (RON)" 
                                        required
                                        value={newService.price}
                                        onChange={e => setNewService({...newService, price: e.target.value})} 
                                    />
                                    <input 
                                        type="number" 
                                        className="premium-input-modern"
                                        placeholder="Durată (Min)" 
                                        required
                                        value={newService.duration}
                                        onChange={e => setNewService({...newService, duration: e.target.value})} 
                                    />
                                </div>

                                <div className="form-actions-row">
                                    <button type="submit" className="btn-save-modern" disabled={isSubmitting}>
                                        {isSubmitting ? "Se salvează..." : (editingServiceId ? "✔️ Salvează Modificările" : "+ Adaugă Serviciu")}
                                    </button>
                                    
                                    {editingServiceId && (
                                        <button 
                                            type="button" 
                                            className="btn-cancel-modern"
                                            onClick={() => { setEditingServiceId(null); setNewService({serviceName:'', price:'', duration:''}); }}>
                                            Anulează
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* LISTA DE SERVICII */}
                        <div className="premium-services-list">
                            {myServices.map(service => (
                                <div key={service.id} className="premium-service-item">
                                    <div className="service-main-info">
                                        <h5 className="service-title-modern">{service.serviceName}</h5>
                                        <div className="service-badges">
                                            <span className="badge-price">{service.price} RON</span>
                                            <span className="badge-time">{service.duration} min</span>
                                        </div>
                                    </div>
                                    <div className="service-actions-modern">
                                        <button onClick={() => startEdit(service)} className="btn-icon-modern edit">✎</button>
                                        <button onClick={() => handleDeleteService(service.id)} className="btn-icon-modern delete">🗑️</button>
                                    </div>
                                </div>
                            ))}
                            {myServices.length === 0 && (
                                <p className="empty-state">Nu ai adăugat niciun serviciu încă.</p>
                            )}
                        </div>
                    </div>
                )}
                

         {/* TAB 5: PROGRAM DE LUCRU */}
{activeTab === 'schedule' && (
    <div className="premium-schedule-section">
        <div className="schedule-header-modern">
            <h3 className="section-divider-title">🕒 Programul Meu de Lucru</h3>
            <button onClick={copyMondayToAll} className="btn-magic-copy-modern">
                <span>🪄</span> Copiază Luni
            </button>
        </div>

        <div className="schedule-cards-grid">
            {isLoadingSchedule ? (
                <div className="loading-state-modern">
                    <span className="spinner">⌛</span> Se încarcă programul...
                </div>
            ) : weeklySchedule && weeklySchedule.length > 0 ? (
                weeklySchedule.map((day, index) => (
                    <div key={day.dayOfWeek} className={`premium-day-card ${day.isWorkingDay ? 'is-open' : 'is-closed'}`}>
                        
                        {/* Partea de sus: Ziua și Switch-ul */}
                        <div className="day-card-header">
                            <h4 className="day-name-modern">{day.dayOfWeek}</h4>
                            
                            <div className="toggle-switch-modern">
                                <span className="status-text">{day.isWorkingDay ? 'DESCHIS' : 'ÎNCHIS'}</span>
                                <label className="premium-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={day.isWorkingDay || false} 
                                        onChange={() => handleDayToggle(index)} 
                                    />
                                    <span className="premium-slider"></span>
                                </label>
                            </div>
                        </div>

                        {/* Partea de jos: Slider-ul de ore (doar dacă e deschis) */}
                        {day.isWorkingDay && (
                            <div className="day-card-body">
                                <div className="time-display-modern">
                                    <div className="time-bubble">
                                        <span className="icon">🌅</span>
                                        <span>{day.startTime?.substring(0, 5) || "09:00"}</span>
                                    </div>
                                    <div className="time-line-connector"></div>
                                    <div className="time-bubble">
                                        <span className="icon">🌃</span>
                                        <span>{day.endTime?.substring(0, 5) || "18:00"}</span>
                                    </div>
                                </div>
                                
                                <div className="slider-wrapper-modern">
                                    <Slider
                                        range
                                        min={0}
                                        max={1440}
                                        step={15}
                                        value={[
                                            timeToMinutes(day.startTime || "09:00"),
                                            timeToMinutes(day.endTime || "18:00")
                                        ]}
                                        onChange={(values) => {
                                            handleTimeChange(index, 'startTime', minutesToTime(values[0]));
                                            handleTimeChange(index, 'endTime', minutesToTime(values[1]));
                                        }}
                                        trackStyle={[{ backgroundColor: 'var(--accent-gold)', height: '6px' }]}
                                        handleStyle={[
                                            { backgroundColor: '#000', borderColor: 'var(--accent-gold)', width: '20px', height: '20px', marginTop: '-7px', opacity: 1, boxShadow: '0 2px 5px rgba(0,0,0,0.5)' },
                                            { backgroundColor: '#000', borderColor: 'var(--accent-gold)', width: '20px', height: '20px', marginTop: '-7px', opacity: 1, boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }
                                        ]}
                                        railStyle={{ backgroundColor: 'rgba(255,255,255,0.1)', height: '6px' }}
                                    />
                                </div>
                                
                                <div className="slider-labels-modern">
                                    <span>00:00</span>
                                    <span>12:00</span>
                                    <span>24:00</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="empty-state">Nu s-a putut încărca programul.</div>
            )}
        </div>

        <div className="save-action-container">
            <button onClick={saveSchedule} className="btn-save-modern" disabled={isSavingSchedule}>
                {isSavingSchedule ? "Se salvează..." : "✔️ Salvează Programul"}
            </button>
        </div>
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
            {/* BUTONUL FLOATANT PENTRU ADĂUGARE RAPIDĂ */}
            <button 
                className="btn-floating-add" 
                onClick={() => setIsBookingModalOpen(true)}
            >
                +
            </button>

            {/* SLIDE-OVER PANEL (MODAL) */}
            <div className={`slide-over-backdrop ${isBookingModalOpen ? 'is-visible' : ''}`} onClick={() => setIsBookingModalOpen(false)}>
                <div className={`slide-over-panel ${isBookingModalOpen ? 'is-open' : ''}`} onClick={(e) => e.stopPropagation()}>
                    
                    <div className="slide-over-header">
                        <h3>Programare Nouă</h3>
                        <button className="btn-close-modal" onClick={() => setIsBookingModalOpen(false)}>✕</button>
                    </div>

                    <div className="slide-over-body">
                        <form onSubmit={handleManualBookingSubmit} className="saas-form">
                            
                            <div className="form-group-saas">
                                <label>Nume Client</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="ex: Alex Popescu"
                                    value={manualBooking.clientName}
                                    onChange={e => setManualBooking({...manualBooking, clientName: e.target.value})}
                                />
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group-saas">
                                    <label>Telefon</label>
                                    <input 
                                        type="tel" 
                                        required 
                                        placeholder="07XX XXX XXX"
                                        value={manualBooking.phoneNumber}
                                        onChange={e => setManualBooking({...manualBooking, phoneNumber: e.target.value})}
                                    />
                                </div>
                                <div className="form-group-saas">
                                    <label>Email (Opțional)</label>
                                    <input 
                                        type="email" 
                                        placeholder="client@email.com"
                                        value={manualBooking.clientEmail}
                                        onChange={e => setManualBooking({...manualBooking, clientEmail: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-group-saas">
                                <label>Data și Ora</label>
                                <Flatpickr
                                    value={manualBooking.startTime}
                                    className="saas-input"
                                    options={{ 
                                        enableTime: true, 
                                        dateFormat: "Y-m-d H:i", 
                                        time_24hr: true,
                                        disableMobile: "true"
                                    }}
                                    onChange={([date]) => {
                                        const offset = date.getTimezoneOffset() * 60000;
                                        const localTime = (new Date(date - offset)).toISOString().slice(0, 19);
                                        setManualBooking({...manualBooking, startTime: localTime});
                                    }}
                                    placeholder="Alege data și ora"
                                />
                            </div>

                            <div className="form-group-saas">
                                <label>Serviciu</label>
                                <select 
                                    required
                                    value={manualBooking.serviceId}
                                    onChange={e => setManualBooking({...manualBooking, serviceId: e.target.value})}
                                >
                                    <option value="" disabled>Alege un serviciu...</option>
                                    {myServices.map(s => (
                                        <option key={s.id} value={s.id}>{s.serviceName} - {s.price} RON</option>
                                    ))}
                                </select>
                            </div>

                            <div className="slide-over-footer">
                                <button type="submit" className="btn-saas-primary">Adaugă Programarea</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;