import { Link, useLocation } from 'react-router-dom'

export function Sidebar() {
  const location = useLocation()

  function handleClick() {
    const checkbox = document.getElementById('menu-checkbox')
    if (checkbox) {
       checkbox.checked = true
     }
  }

  return (
    <nav className='sidebar'>
      <div className='sidebar-content'>
        <ul className='list-items'>
          <Link
            to='/students'
            className={`list-item ${
              location.pathname.includes('/students') ? 'active' : ''
            }`}
            onClick={handleClick}
          >
            <span className='material-symbols-outlined'>school</span>
            תלמידים
          </Link>
          <Link
            to='/teachers'
            className={`list-item ${
              location.pathname.includes('/teachers') ? 'active' : ''
            }`}
            onClick={handleClick}
          >
            <span className='material-symbols-outlined'>group</span>
            מורים
          </Link>
          <Link
            to='/orchestras'
            className={`list-item ${
              location.pathname.includes('/orchestras') ? 'active' : ''
            }`}
            onClick={handleClick}
          >
            <span className='material-symbols-outlined'>piano</span>
            תזמורות
          </Link>
          {/* <li>
            <Link
              to='/theory'
              className={`list-item ${
                location.pathname.includes('/theory') ? 'active' : ''
              }`}
            >
              תאוריה
            </Link>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}
