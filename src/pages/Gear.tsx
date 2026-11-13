import MobileNavigation from '../components/MobileNavigation'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const gearItems = [
  { id: 'laptop', name: 'Acer Nitro V15', detail: 'Laptop', image: '/images/anv15.webp' },
  { id: 'phone', name: 'Vivo Y35', detail: 'Phone', image: '/images/vivoy35.png' },
  { id: 'keyboard', name: 'Redragon Lakshmi', detail: 'Keyboard', image: '/images/lakshmi.jpg' },
  { id: 'mouse', name: 'Razer Cobra', detail: 'Mouse', image: '/images/mouse.webp' },
  { id: 'earphone', name: 'Moondrop CHU', detail: 'Earphone', image: '/images/moondrop.webp' },
]

function Gear() {
  const [theme, setTheme] = useState(() => {
    if (!localStorage.getItem('portfolio_theme_set')) {
      localStorage.setItem('portfolio_theme_set', 'true')
      localStorage.setItem('theme', 'light')
      return 'light'
    }
    return localStorage.getItem('theme') || 'light'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="page-layout">

      {/* ── LEFT NAV SIDEBAR ── */}
      <aside className={`left-nav-sidebar ${menuOpen ? 'lnav-open' : ''}`}>
        {/* Logo / Name */}
        <div
          className="lnav-brand"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={theme === 'light' ? '/images/logo_light.png' : '/images/default_logo.png'}
            alt="Logo"
            className="lnav-logo-img"
          />
          <span className="lnav-name">Jet P.</span>
        </div>

        {/* All Links — one group, no divider */}
        <div className="lnav-group">
          <a href="https://github.com/padillajet" target="_blank" rel="noreferrer" className="lnav-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" /></svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/jet-padilla-b19b68327/" target="_blank" rel="noreferrer" className="lnav-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
            LinkedIn
          </a>
          <a href="https://drive.google.com/file/d/1e_cASutmJX4y0AWYwBJ4lsApeX260m7n/view?usp=sharing" target="_blank" rel="noreferrer" className="lnav-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" /></svg>
            Resume
          </a>
          <a href="/projects" onClick={(e) => { e.preventDefault(); navigate('/projects') }} className="lnav-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
            Projects
          </a>
          <a href="/gear" className="lnav-link lnav-active" onClick={(e) => { e.preventDefault(); navigate('/gear') }} aria-current="page">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.69.07-1.08s-.03-.73-.07-1.08l2.32-1.82c.21-.16.27-.46.13-.7l-2.2-3.81c-.13-.23-.43-.31-.67-.23l-2.73 1.1c-.57-.44-1.18-.8-1.86-1.07l-.42-2.9A.55.55 0 0 0 14 2h-4c-.27 0-.5.19-.54.45l-.42 2.9c-.68.27-1.3.63-1.86 1.07L4.46 5.32c-.24-.09-.54 0-.67.23L1.6 9.36c-.14.24-.08.54.13.7l2.32 1.82c-.04.35-.07.7-.07 1.08s.03.73.07 1.08L1.73 15.86c-.21.16-.27.46-.13.7l2.2 3.81c.13.23.43.31.67.23l2.73-1.1c.57.44 1.18.8 1.86 1.07l.42 2.9c.04.26.27.45.54.45h4c.27 0 .5-.19.54-.45l.42-2.9c.68-.27 1.3-.63 1.86-1.07l2.73 1.1c.24.09.54 0 .67-.23l2.2-3.81c.14-.24.08-.54-.13-.7l-2.32-1.82z" /></svg>
            Gear
          </a>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom utility */}
        <div className="lnav-bottom">
          <div className="lnav-avail">
            <span className="lnav-avail-dot" />
            <span>Open to Work</span>
          </div>

          <div className="lnav-controls">
            <button onClick={toggleTheme} className="lnav-control-btn" aria-label="Toggle theme" title="Toggle theme">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" /></svg>
              )}
            </button>
            <a href="https://github.com/padillajet" target="_blank" rel="noreferrer" className="lnav-control-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" /></svg>
            </a>
          </div>

          <div className="lnav-contact-label">For work, collabs &amp; everything else, reach me at</div>
          <a href="mailto:jetpadilla07@gmail.com" className="lnav-email">jetpadilla07@gmail.com</a>
        </div>
      </aside>

      <MobileNavigation menuOpen={menuOpen} onToggle={() => setMenuOpen(open => !open)} />
      {menuOpen && <div className="lnav-overlay" onClick={() => setMenuOpen(false)} />}

      {/* ── MAIN CONTENT ── */}
      <div className="main-content-wrapper">
        <main className="main-content-area projects-page-area">

          {/* PAGE HEADER */}
          <div className="projects-list-header">
            <h1 className="projects-list-title">gear</h1>
            <p className="projects-list-subtitle">
              Tools, setups, and working items I use day-to-day.
            </p>
          </div>

          <div className="gear-gallery">
            {gearItems.map(({ id, name, detail, image }) => (
              <article className="gear-item" key={id}>
                <div className="gear-photo-frame">
                  <img src={image} alt={name} className="gear-photo" loading="lazy" />
                </div>
                <div className="gear-caption">
                  <h2>{name}</h2>
                  <p>{detail}</p>
                </div>
              </article>
            ))}
          </div>

        </main>
      </div>

    </div>
  )
}

export default Gear

