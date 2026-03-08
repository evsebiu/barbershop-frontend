import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(false);

    // Spring Security așteaptă de obicei datele ca form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://192.168.1.48:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
        credentials: 'include',
      });

      
if (response.ok) {
        // --- MODIFICAREA ESTE AICI ---
        // 1. Salvăm "biletul" că suntem logați
        localStorage.setItem('isLoggedIn', 'true'); 
        
        // 2. (Opțional) Poți salva și rolul dacă îl primești din backend, ex:
        // localStorage.setItem('role', 'ADMIN');

        // 3. Acum navigăm, iar ProtectedRoute va găsi cheia de mai sus
        navigate('/dashboard');
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Eroare login:", err);
      setError(true);
    }
  };

  return (
    <div className="legal-page-container login-page-bg">
      <main className="legal-wrapper" style={{ maxWidth: '450px' }}>
        
        <div className="page-header">
          <h1 className="legal-page-title">Hype Baber</h1>
          <p className="page-intro">Dashboard frizer</p>
        </div>

        <div className="legal-card login-card-premium">
          {error && (
            <div className="login-error-msg">
              Email sau parolă incorectă.
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="username">Email</label>
              <input 
                type="email" 
                id="username" 
                placeholder="admin@hype.ro" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="password">Parolă</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-cta login-btn">
              Intră în cont
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;