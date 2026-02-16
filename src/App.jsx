import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Gdpr from './pages/Gdpr';
import CookiesPage from './pages/Cookies';
import ConsumerRights from './pages/Consumer-rights';
import BarberProfile from './pages/BarberProfile'
import AppointmentForm from './pages/AppointmentForm.jsx'
import AppointmentConfirmed from './pages/AppointmentConfirmed'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EditAppointment from './pages/EditAppointment';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';



// --- COMPONENTA CARE SE OCUPĂ DE AFIȘARE (LAYOUT) ---
function Layout() {
  const location = useLocation(); // Acum funcționează pentru că Layout e în Router
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // 1. Definim logica de ascundere
  // Verificăm dacă suntem pe o pagină de dashboard sau login
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname === '/login';
  
  // Dacă suntem pe dashboard sau login, NU afișăm header/footer public
  const showPublicNav = !isDashboard && !isLogin;

  return (
    <div className="app-main-container">
      
      {/* 2. HEADER - Apare condiționat */}
      {showPublicNav && (
        <header>
          <div className="logo-container">
            <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="logo-text">HYPE BARBERSHOP</span>
              <span className="scissors-icon">✂</span>
            </Link>
          </div>

          <button 
            className={`hamburger-btn ${menuOpen ? 'active' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={menuOpen ? 'active' : ''}>
            <ul>
              <li><a href="/#about" className="nav-link-btn" onClick={closeMenu}>Concept</a></li>
              <li><a href="/#barbers" className="nav-link-btn" onClick={closeMenu}>Frizeri</a></li>
            </ul>
          </nav>
        </header>
      )}

      {/* 3. CONȚINUTUL PRINCIPAL (Rutele) */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/gdpr" element={<Gdpr />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/consumer-rights" element={<ConsumerRights />} />
          <Route path="/barber/:id" element={<BarberProfile />} />
          <Route path="/appointment/new" element={<AppointmentForm />} />
          <Route path="/appointment/confirmed" element={<AppointmentConfirmed />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/edit-appointment/:id" element={<EditAppointment />} />
          </Route>
        </Routes>
      </main>

      {/* 4. FOOTER - Apare condiționat */}
      {showPublicNav && (
        <footer className="footer">
          <div className="footer-col">
            <h4>Program</h4>
            <ul>
              <li>Marti-Duminica: 10:00 - 20:00</li>
              <li>Luni: Închis</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>Șoseaua Arcu 8, Iași 700259</li>
              <li>+40 700 000 000</li>
              <li>contact@hypebarbershop.ro</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/gdpr">GDPR</Link></li>
              <li><Link to="/terms">Termeni și Condiții</Link></li>
              <li><Link to="/cookies">Politica cookies</Link></li>
              <li><Link to="/consumer-rights">Protecția consumatorilor / ANPC</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Protecția Consumatorilor</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="nofollow">
                  <img src="https://etamade-com.github.io/anpc-sal-sol-logo/anpc-sal.svg" alt="SAL" style={{ width: '200px', height: 'auto', borderRadius: '4px' }} />
                </a>
              </li>
              <li>
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="nofollow">
                  <img src="https://etamade-com.github.io/anpc-sal-sol-logo/anpc-sol.svg" alt="SOL" style={{ width: '200px', height: 'auto', borderRadius: '4px' }} />
                </a>
              </li>
            </ul>
          </div>
        </footer>
      )}

      {showPublicNav && (
        <div style={{ textAlign: 'center', padding: '20px', background: '#050505', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <p>&copy; 2026 Hype Barbershop. Toate drepturile rezervate.</p>
        </div>
      )}

    </div>
  );
}



function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Layout este copilul lui Router, deci useLocation va funcționa în interiorul lui Layout */}
      <Layout />
    </Router>
  );
}

export default App;