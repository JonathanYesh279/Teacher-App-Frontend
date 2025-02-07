// Header.jsx
import { useLocation } from 'react-router-dom';
import logo_raanana from '../assets/images/logo_raanana.jpg';

export function Header() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <nav className={`header ${isLoginPage ? 'login-header' : ''}`}>
      <div className='logo-container'>
        <img src={logo_raanana} alt='Raanana Logo' />
      </div>
    </nav>
  );
}
