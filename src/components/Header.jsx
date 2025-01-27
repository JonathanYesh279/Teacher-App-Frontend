import logo_raanana from '../assets/images/logo_raanana.jpg'

export function Header() {
  return (
    <nav className="header">
      <div className="logo-container">
        <img src={logo_raanana} />
      </div>
    </nav>
  )
}