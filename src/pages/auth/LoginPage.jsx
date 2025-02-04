import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, teacher } = useAuth(); // Get teacher from context

  // Redirect if already logged in
  useEffect(() => {
    if (teacher) {
      console.log('User already logged in, redirecting...');
      navigate('/students');
    }
  }, [teacher, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Starting login process...');

    try {
      const result = await login(email, password);
      console.log('Login successful:', result);

      // Wait for state to update
      setTimeout(() => {
        if (result) {
          console.log('Navigating to students page...');
          navigate('/students', { replace: true });
        }
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      setError('שם משתמש או סיסמא שגויים');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='login-page'>
      <div className='login-header'>
        <h1>התחברות</h1>
        <p>התחבר עם האימייל והסיסמה שלך</p>
      </div>
      <div className='login-content'>
        <form onSubmit={handleSubmit}>
          {error && <div className='error-message'>{error}</div>}
          <div className='form-group'>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='yourEmail@email.com'
              required
              disabled={isLoading}
            />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <button className='btn' type='submit' disabled={isLoading}>
              {isLoading ? 'מתחבר...' : 'התחבר'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
