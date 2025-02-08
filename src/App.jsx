import { useRoutes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import routes from './routes/routes.jsx';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

function App() {
  const element = useRoutes(routes);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <AuthProvider>
      <div className='app'>
        <Header />
        {!isLoginPage && (
          <>
            <input
              type='checkbox'
              id='menu-checkbox'
              className='menu-checkbox'
              defaultChecked={true}
            />
            <label
              htmlFor='menu-checkbox'
              className='material-symbols-outlined menu-toggle'
            >
              <span className='menu-icon'>menu</span>
              <span className='close-icon'>close</span>
            </label>
            <label htmlFor='menu-checkbox' className='overlay'></label>
          </>
        )}
        <main>
          {!isLoginPage && (
            <>
              <div className='overlay'></div>
              <Sidebar />
            </>
          )}
          {element}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
