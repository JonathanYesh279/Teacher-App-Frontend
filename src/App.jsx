import { useRoutes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx';
import routes from './routes/routes.jsx'
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

function App() {
  const element = useRoutes(routes)

  return (
    <AuthProvider>
      <div className='app'>
        <Header />
        <input
          type='checkbox'
          id='menu-checkbox'
          className='menu-checkbox'
          defaultChecked={true}
        />
        <label htmlFor='menu-checkbox' className='material-symbols-outlined'>
          menu
        </label>
        <label htmlFor='menu-checkbox' className='overlay'></label>
        <main>
          <div className='overlay'></div>
          <Sidebar />
          {element}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App
