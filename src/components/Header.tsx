export default function Header() {
  const navItems = ['Draft', 'Dashboard', 'Component', 'Processes'];

  return (
    <header className="app-header">
      <div className="header-logo">
        <svg width="38" height="32" viewBox="0 0 38 32" fill="none" aria-hidden>
          <polyline points="1,31 19,2 37,31" stroke="white" strokeWidth="3" fill="none" />
          <polyline points="10,20 28,20" stroke="white" strokeWidth="3" />
          <polyline points="1,31 9,19" stroke="#3a9fc4" strokeWidth="3" />
        </svg>
        <span className="header-logo-text">AVICENA</span>
      </div>

      <nav className="header-nav">
        {navItems.map(item => (
          <button key={item} className="header-nav-item">
            {item.toUpperCase()}
            <span style={{ fontSize: 9, marginLeft: 1 }}>▾</span>
          </button>
        ))}
        <button className="header-nav-item header-nav-item--user">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          KISHAN
        </button>
      </nav>
    </header>
  );
}
