import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Coloana 1: Program */}
      <div className="footer-col">
        <h4>Program</h4>
        <ul>
          <li>Marti-Duminica: 10:00 - 20:00</li>
          <li>Luni: Închis</li>
        </ul>
      </div>

      {/* Coloana 2: Contact */}
      <div className="footer-col">
        <h4>Contact</h4>
        <ul>
          <li>Șoseaua Arcu 8, Iași 700259</li>
          <li>+40 700 000 000</li>
          <li>contact@hypebarbershop.ro</li>
        </ul>
      </div>

      {/* Coloana 3: Legal */}
      <div className="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="/gdpr">GDPR</a></li>
          <li><a href="/terms">Termeni și Condiții</a></li>
          <li><a href="/cookies">Politica cookies</a></li>
          <li><a href="/consumer-rights">Protecția consumatorilor / ANPC</a></li>
        </ul>
      </div>

      {/* Coloana 4: ANPC */}
      <div className="footer-col">
        <h4>Protecția Consumatorilor</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="nofollow">
              <img 
                src="https://etamade-com.github.io/anpc-sal-sol-logo/anpc-sal.svg" 
                alt="SAL" 
                style={{ width: '200px', borderRadius: '4px', background: 'white', padding: '5px' }} 
              />
            </a>
          </li>
          <li>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="nofollow">
              <img 
                src="https://etamade-com.github.io/anpc-sal-sol-logo/anpc-sol.svg" 
                alt="SOL" 
                style={{ width: '200px', borderRadius: '4px', background: 'white', padding: '5px' }} 
              />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;