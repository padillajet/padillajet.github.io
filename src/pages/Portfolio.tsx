import MobileNavigation from '../components/MobileNavigation'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PanelsTopLeft, Smartphone, PencilRuler, CodeXml } from 'lucide-react'
import '../App.css'
import { db } from '../data/db'
import type { Project, Certificate, Skill } from '../data/db'
import GitHubContributions from '../components/GitHubContributions'

function Portfolio() {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const main = mainRef.current
    if (!main || !('IntersectionObserver' in window)) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (preference.matches) return

    const sections = main.querySelectorAll<HTMLElement>('.hero-services, .content-section')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('section-reveal-pending')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.05 })

    sections.forEach(section => {
      section.classList.add('section-reveal-pending')
      observer.observe(section)
    })
    const revealAll = () => {
      if (preference.matches) {
        sections.forEach(section => section.classList.remove('section-reveal-pending'))
        observer.disconnect()
      }
    }
    preference.addEventListener('change', revealAll)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', revealAll)
      sections.forEach(section => section.classList.remove('section-reveal-pending'))
    }
  }, [])

  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (!localStorage.getItem('portfolio_theme_set')) {
      localStorage.setItem('portfolio_theme_set', 'true')
      localStorage.setItem('theme', 'light')
      return 'light'
    }
    return localStorage.getItem('theme') || 'light'
  })
  const [certIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [certs, setCerts] = useState<Certificate[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [allP, c, s] = await Promise.all([db.getProjects(), db.getCerts(), db.getSkills()])
      setProjects(allP.filter(p => p.pinned))
      setCerts(c)
      setSkills(s)
    }
    fetchData()
    window.scrollTo(0, 0)
  }, [])


  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isPdfUrl = (url?: string) => !!url && url.toLowerCase().includes('.pdf')
  const isCloudinaryUrl = (url?: string) => !!url && url.includes('res.cloudinary.com')

  const getMobilePdfPreviewSrc = (url?: string) => {
    if (!url || !isPdfUrl(url) || !isCloudinaryUrl(url)) return ''
    return url.replace('/upload/', '/upload/pg_1,f_auto,q_auto,w_1400/')
  }

  const activeCert = certs[certIndex]
  const activeCertUrl = activeCert?.file_url
  const showMobilePdfPreview = isMobileDevice && isPdfUrl(activeCertUrl)
  const mobilePdfPreviewSrc = getMobilePdfPreviewSrc(activeCertUrl)

  useEffect(() => {
    if (showMobilePdfPreview && !mobilePdfPreviewSrc && isFading) {
      const timer = setTimeout(() => setIsFading(false), 150)
      return () => clearTimeout(timer)
    }
  }, [showMobilePdfPreview, mobilePdfPreviewSrc, isFading])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  const stackCategories = [
    { title: 'Frontend', categoryKey: 'Frontend Development' },
    { title: 'Backend', categoryKey: 'Backend Development' },
    { title: 'Databases & Infrastructure', categoryKey: 'Database & Infra' },
    { title: 'AI Tools & Automation', categoryKey: 'AI Tools & Automation' },
    { title: 'Tools & Workflows', categoryKey: 'Tools & Others' },
  ]

  return (
    <div className="page-layout">

      {/* ── LEFT NAV SIDEBAR ── */}
      <aside className={`left-nav-sidebar ${menuOpen ? 'lnav-open' : ''}`}>

        {/* Logo / Name */}
        <div
          className="lnav-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={theme === 'light' ? '/images/logo_light.png' : '/images/default_logo.png'}
            alt="Logo"
            className="lnav-logo-img"
          />
          <span className="lnav-name">Jet P.</span>
        </div>

        {/* External Links */}
        <div className="lnav-group">
          <a href="https://github.com/padillajet" target="_blank" rel="noreferrer" className="lnav-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" /></svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/jet-padilla-b19b68327/" target="_blank" rel="noreferrer" className="lnav-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
            LinkedIn
          </a>
          <a href="https://drive.google.com/file/d/1o8zZvsyKBCiIu4I1LBLZrnk1nvZW9lv6/view?usp=sharing" target="_blank" rel="noreferrer" className="lnav-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" /></svg>
            Resume
          </a>
          <a href="/projects" onClick={(e) => { e.preventDefault(); navigate('/projects') }} className="lnav-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
            Projects
          </a>
          <a href="/gear" onClick={(e) => { e.preventDefault(); navigate('/gear') }} className="lnav-link">
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

      {/* ── MAIN CONTENT WRAPPER ── */}
      <div className="main-content-wrapper">
        <main className="main-content-area portfolio-main" ref={mainRef}>

          { }
          <div id="services" className="hero-split">
            {/* Dot grid top-right ambient decoration */}
            <div className="hero-dot-grid" aria-hidden="true" />

            {/* Left: photo */}
            <div className="hero-photo-col">
              <div className="hero-photo-wrap">
                <img src="/images/hero2.png" alt="Jet Padilla" className="hero-photo" />
              </div>
            </div>

            {/* Right: text */}
            <div className="hero-text-col">
              <h1 className="hero-name">Jet Padilla</h1>

              <p className="hero-bio">
                Fresh Computer Science graduate targeting a{' '}
                <span className="hero-pill">
                  <span className="hero-pill-code-icon">&lt;/&gt;</span>
                  <span>Junior Software Developer</span>
                </span>{' '}
                role. Experienced in{' '}
                <span className="hero-pill">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>web development</span>
                </span>
                ,{' '}
                <span className="hero-pill">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  <span>mobile apps</span>
                </span>
                , and{' '}
                <span className="hero-pill">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                  <span>UI/UX design</span>
                </span>
                .
              </p>

              <p className="hero-bio">
                Proficient in{' '}
                <span className="hero-pill">
                  <span>⚡ React &amp; Python</span>
                </span>
                , REST APIs, and{' '}
                <span className="hero-pill hero-pill-ai">
                  <span className="hero-pill-icons">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                      <path d="m12 2 2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="12" height="12">
                      <line x1="12" y1="2" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                    </svg>
                  </span>
                  <span>AI-assisted tools</span>
                </span>
                . Proven ability to lead teams, ship{' '}
                <span className="hero-pill">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 9v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                  <span>production apps</span>
                </span>
                , and deliver clean, user-friendly interfaces with a focus on performance and accessibility.
              </p>

              {/* AI Tools In My Workflow */}
              <div className="hero-ai-tools-section">
                <div className="hero-ai-tools-label">AI TOOLS IN MY WORKFLOW</div>
                <div className="hero-ai-tools-row">
                  {/* ChatGPT (OpenAI official vector logo) */}
                  <span className="hero-ai-tool-pill">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M22.28 9.82a6 6 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.5-2.9A6.06 6.06 0 0 0 4.98 4.18a6 6 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 6 6 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.2 6 6 0 0 0 4-2.9 6.05 6.05 0 0 0-.75-7.08zm-9.02 12.6a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.5 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.85-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.98v5.69a.77.77 0 0 0 .38.67l5.82 3.36-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.87zm16.6 3.85L13.1 8.36l2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.67a.8.8 0 0 0-.4-.67zm2.01-3.02l-.14-.08-4.77-2.79a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.79 2.76a.8.8 0 0 0-.4.68zm1.1-2.37l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z" />
                    </svg>
                    <span>ChatGPT</span>
                  </span>

                  {/* Claude (Anthropic sunburst) */}
                  <span className="hero-ai-tool-pill">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M10.8 2h2.4v6.8l4.8-4.8 1.7 1.7-4.8 4.8H21.7v2.4h-6.8l4.8 4.8-1.7 1.7-4.8-4.8V22h-2.4v-6.8l-4.8 4.8-1.7-1.7 4.8-4.8H2.3v-2.4h6.8l-4.8-4.8 1.7-1.7 4.8 4.8z" />
                    </svg>
                    <span>Claude</span>
                  </span>

                  {/* Antigravity (Google Antigravity orbital planet symbol) */}
                  <span className="hero-ai-tool-pill">
                    <img
                      src="https://res.cloudinary.com/dwutjobga/image/upload/v1775528511/portfolio_upload/hv0geodktoe8sk37hyfi.png"
                      alt="Antigravity"
                      className="hero-ai-tool-img"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const svg = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                        if (svg) svg.style.display = 'inline-block';
                      }}
                    />
                    <svg
                      className="hero-ai-tool-fallback-svg"
                      style={{ display: 'none' }}
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-28 12 12)" />
                      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                    </svg>
                    <span>Antigravity</span>
                  </span>

                  {/* Grok (xAI slashed circle) */}
                  <span className="hero-ai-tool-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <circle cx="12" cy="12" r="9" />
                      <line x1="6.5" y1="17.5" x2="17.5" y2="6.5" />
                    </svg>
                    <span>Grok</span>
                  </span>

                  {/* Gemini (Google 4-point star) */}
                  <span className="hero-ai-tool-pill">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 24c-.4 0-.8-.3-.9-.7C9.6 15.6 8.4 14.4.7 12.9c-.4-.1-.7-.5-.7-.9s.3-.8.7-.9C8.4 9.6 9.6 8.4 11.1.7c.1-.4.5-.7.9-.7s.8.3.9.7c1.5 7.7 2.7 8.9 10.4 10.4.4.1.7.5.7.9s-.3.8-.7.9c-7.7 1.5-8.9 2.7-10.4 10.4-.1.4-.5.7-.9.7z" />
                    </svg>
                    <span>Gemini</span>
                  </span>
                </div>
              </div>


            </div>
          </div>

          <section className="hero-services" aria-labelledby="process-heading">
            <h2 id="process-heading" className="hero-ai-tools-label hero-services-heading">What I Do</h2>
            {[
              { title: 'UX & UI', description: 'Designing interfaces that are intuitive, efficient, and enjoyable to use.', icon: PanelsTopLeft },
              { title: 'Web & Mobile App', description: 'Transforming ideas into exceptional web and mobile app experiences.', icon: Smartphone },
              { title: 'Design & Creative', description: 'Crafting visually stunning designs that connect with your audience.', icon: PencilRuler },
              { title: 'Development', description: 'Bringing your vision to life with the latest technology and design trends.', icon: CodeXml },
            ].map(({ title, description, icon: Icon }) => (
              <article className="hero-service" key={title}>
                <Icon className="hero-service-icon" size={28} strokeWidth={1.3} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </section>

          {/* PROJECTS */}
          <section id="projects" className="content-section">
            <h2 className="content-section-title">Projects</h2>

            <div className="projects-showcase-grid">
              {projects.length === 0 ? (
                <p style={{ opacity: 0.6 }}>No projects yet.</p>
              ) : (
                projects.map((p) => (
                  <div
                    key={p.id}
                    className="project-showcase-card"
                    onClick={() => setSelectedProject(p)}
                  >
                    <div className="project-showcase-thumb">
                      <img
                        src={p.image_url || '/images/default_logo.png'}
                        alt={p.title}
                        className="project-showcase-img"
                      />
                    </div>
                    <div className="project-showcase-body">
                      <h3 className="project-showcase-title">{p.title}</h3>
                      <p className="project-showcase-desc">{p.desc_text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* EXPERIENCE */}
          <section id="experience" className="content-section">
            <h2 className="content-section-title">Experience</h2>
            <div className="experience-list">
              <article className="experience-entry">
                <p className="experience-date">APRIL 2025 - JUNE 2025</p>
                <h3 className="experience-entry-title">Web Developer / Head Marketing (OJT)</h3>
                <p className="experience-organization">EASTS Enrollment System | Bulacan, Philippines</p>
                <p className="experience-description">Designed and developed dual-portal front-end for EASTS Enrollment System serving 30+ users, implementing student registration, class scheduling, and academic record tracking interfaces using Figma prototypes as design foundation. Delivered accessible, user-friendly web interfaces across administrator and student portals, applying UX principles to streamline course enrollment and profile management workflows for a 8-person cross-functional team. Supported digital marketing operations by managing social media scheduling, editing video content, and producing branded materials.</p>
              </article>
              <article className="experience-entry">
                <p className="experience-date">SEPTEMBER 2024 - JUNE 2026</p>
                <h3 className="experience-entry-title">Frontend Engineer / Project Lead</h3>
                <p className="experience-organization">Code Mania | Thesis Project</p>
                <p className="experience-description">Led frontend development and UI/UX design as project lead for a gamified coding education platform supporting Python, JavaScript, and C++ challenges. Managed a 5-person team via GitHub Issues, assigning tickets and tracking tasks to deliver a fully responsive interface with progress tracking across administrator and student-facing features. Deployed to classmates and students as test users, incorporating feedback to refine UX and optimize the learning journey.</p>
              </article>
            </div>
          </section>


          {/* TECH STACK */}
          <section id="skills" className="content-section">
            < h2 className="content-section-title" >Tech Stack</h2>
            <p className="tech-stack-subtitle">
              The tools, frameworks, and product patterns I use across frontend, backend, databases, cloud infrastructure, AI integrations, and design workflows.
            </p>
            <div className="tech-stack-container">
              {stackCategories.map((cat) => {
                const catSkills = skills.filter(
                  (s) => s.category?.toLowerCase() === cat.categoryKey.toLowerCase()
                )
                if (catSkills.length === 0) return null

                return (
                  <div className="tech-stack-group" key={cat.title}>
                    <div className="tech-stack-label">{cat.title}</div>
                    <div className="tech-stack-row">
                      {catSkills.map((s) => {
                        const isChatGPT = s.name.toLowerCase() === 'chatgpt'
                        const isAntigravity = s.name.toLowerCase() === 'antigravity'
                        const isInvertDark = ['next.js', 'github', 'unity', 'vercel', 'framer'].some(
                          (k) => s.name.toLowerCase().includes(k)
                        )

                        return (
                          <div className="tech-stack-pill" key={s.id || s.name}>
                            {isChatGPT ? (
                              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="tech-stack-icon tech-stack-svg">
                                <path d="M22.28 9.82a6 6 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.5-2.9A6.06 6.06 0 0 0 4.98 4.18a6 6 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 6 6 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.2 6 6 0 0 0 4-2.9 6.05 6.05 0 0 0-.75-7.08zm-9.02 12.6a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.5 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.85-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.98v5.69a.77.77 0 0 0 .38.67l5.82 3.36-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.87zm16.6 3.85L13.1 8.36l2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.67a.8.8 0 0 0-.4-.67zm2.01-3.02l-.14-.08-4.77-2.79a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.79 2.76a.8.8 0 0 0-.4.68zm1.1-2.37l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z" />
                              </svg>
                            ) : isAntigravity ? (
                              <>
                                <img
                                  src={s.icon}
                                  alt={s.name}
                                  className="tech-stack-icon"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none'
                                    const svg = (e.target as HTMLElement).nextElementSibling as HTMLElement
                                    if (svg) svg.style.display = 'inline-block'
                                  }}
                                />
                                <svg
                                  className="tech-stack-icon tech-stack-svg"
                                  style={{ display: 'none' }}
                                  viewBox="0 0 24 24"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-28 12 12)" />
                                  <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                                </svg>
                              </>
                            ) : s.icon ? (
                              <img
                                src={s.icon.startsWith('http') ? s.icon : `/images/${s.icon}.png`}
                                alt={s.name}
                                className={`tech-stack-icon ${isInvertDark ? 'tech-stack-invert-dark' : ''}`}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none'
                                }}
                              />
                            ) : null}
                            <span className="tech-stack-name">{s.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* CERTIFICATIONS */}
          <section id="certifications" className="content-section">
            <h2 className="content-section-title">Certifications</h2>
            <p className="cert-section-subtitle">
              Credentials across development, AI, and engineering — each verifiable at its source.
            </p>
            {certs.length === 0 ? (
              <p className="no-certs-msg">No certificates added yet.</p>
            ) : (
              (() => {
                const categories = Array.from(new Set(certs.map(c => c.category || 'General')));
                return categories.map(cat => (
                  <div className="cert-category-group" key={cat}>
                    <div className="cert-category-label">{cat}</div>
                    <div className="cert-cards-grid">
                      {certs.filter(c => (c.category || 'General') === cat).map(cert => {
                        const certTargetUrl = cert.file_url || cert.link_url;
                        const CardContent = (
                          <>
                            <div className="cert-card-logo">
                              {cert.icon_url ? (
                                <img src={cert.icon_url} alt={cert.issuer} className="cert-card-icon-img" />
                              ) : (
                                <span className="cert-card-icon-fallback">
                                  <svg viewBox="0 0 48 48" fill="none" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="20" r="12" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.85" />
                                    <polyline points="17,30 14,44 24,39 34,44 31,30" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" opacity="0.85" />
                                    <circle cx="24" cy="20" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
                                  </svg>
                                </span>
                              )}
                            </div>
                            <div className="cert-card-title">{cert.title}</div>
                            <div className="cert-card-issuer">{cert.issuer}</div>
                            <span className={`cert-card-verify ${!certTargetUrl ? 'muted' : ''}`}>✦ VERIFY</span>
                          </>
                        );

                        return certTargetUrl ? (
                          <a
                            href={certTargetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="cert-card"
                            key={cert.id}
                          >
                            {CardContent}
                          </a>
                        ) : (
                          <div className="cert-card" key={cert.id}>
                            {CardContent}
                          </div>
                        );
                      })}

                    </div>
                  </div>
                ));
              })()
            )}
          </section>
          <GitHubContributions />
        </main>
      </div>

      {/* ── UPWORK PROJECT DETAIL MODAL ── */}
      {selectedProject && (
        <div className="upwork-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="upwork-modal-container" onClick={(e) => e.stopPropagation()}>

            {/* Top Bar */}
            <div className="upwork-modal-header">
              <h2 className="upwork-modal-title">{selectedProject.title}</h2>
              <div className="upwork-modal-top-actions">
                {selectedProject.link_url && (
                  <button
                    className="upwork-copy-link-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedProject.link_url!)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                  >
                    <span>{copied ? 'Copied!' : 'Copy link'}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  </button>
                )}
                <button className="upwork-modal-close-btn" onClick={() => setSelectedProject(null)} aria-label="Close">
                  ✕
                </button>
              </div>
            </div>

            {/* Main 2-Column Section */}
            <div className="upwork-modal-body">

              {/* Left Info Column */}
              <div className="upwork-modal-left">
                <div className="upwork-modal-section">
                  <span className="upwork-modal-label">Project description</span>
                  <h3 className="upwork-modal-subtitle">{selectedProject.title}</h3>
                  {selectedProject.link_url && (
                    <a href={selectedProject.link_url} target="_blank" rel="noreferrer" className="upwork-modal-link">
                      {selectedProject.link_url}
                    </a>
                  )}
                  <p className="upwork-modal-desc">{selectedProject.desc_text}</p>
                </div>

                {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                  <div className="upwork-modal-section">
                    <span className="upwork-modal-label">Skills and deliverables</span>
                    <div className="upwork-modal-pills">
                      {selectedProject.tech_stack.map((iconUrl, i) => (
                        <span key={i} className="upwork-modal-pill">
                          {getTechName(iconUrl)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="upwork-modal-section">
                  <span className="upwork-modal-meta">Published on {selectedProject.year}</span>
                </div>
              </div>

              {/* Right Preview Column — Horizontal Scroll Strip */}
              <div className="upwork-modal-right">
                {(() => {
                  const allImgs = [
                    ...(selectedProject.image_url ? [selectedProject.image_url] : []),
                    ...(selectedProject.images || []),
                  ].filter(Boolean);
                  const imgs = allImgs.length > 0 ? allImgs : ['/images/default_logo.png'];
                  return (
                    <div className="modal-img-scroll">
                      {imgs.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`${selectedProject.title} screenshot ${i + 1}`}
                          className="modal-img-scroll-item"
                        />
                      ))}
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Bottom "More by Jet P." Row */}
            <div className="upwork-modal-bottom">
              <h4 className="upwork-modal-bottom-title">More by Jet P.</h4>
              <div className="upwork-modal-carousel">
                {projects.filter(p => p.id !== selectedProject.id).map(otherP => (
                  <div
                    key={otherP.id}
                    className="upwork-modal-thumb-item"
                    onClick={() => setSelectedProject(otherP)}
                  >
                    <div className="upwork-modal-thumb-img-wrap">
                      <img src={otherP.image_url || '/images/unnamed.jpg'} alt={otherP.title} />
                    </div>
                    <span className="upwork-modal-thumb-name">{otherP.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

function getTechName(url: string): string {
  if (url.includes('react')) return 'React'
  if (url.includes('typescript')) return 'TypeScript'
  if (url.includes('python')) return 'Python'
  if (url.includes('javascript')) return 'JavaScript'
  if (url.includes('html5')) return 'HTML5'
  if (url.includes('css3')) return 'CSS3'
  if (url.includes('figma')) return 'Figma'
  if (url.includes('nodejs')) return 'Node.js'
  if (url.includes('flutter')) return 'Flutter'
  if (url.includes('sqlite')) return 'SQLite'
  if (url.includes('github')) return 'GitHub'
  return 'Deliverable'
}

export default Portfolio
