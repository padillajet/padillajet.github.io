import { Link } from 'react-router-dom'
import { useEffect } from 'react'

type MobileNavigationProps = {
  menuOpen: boolean
  onToggle: () => void
}

export default function MobileNavigation({ menuOpen, onToggle }: MobileNavigationProps) {
  useEffect(() => {
    if (!menuOpen) return
    const mobile = window.matchMedia('(max-width: 900px)')
    const previousOverflow = document.body.style.overflow
    const updateScroll = () => {
      document.body.style.overflow = mobile.matches ? 'hidden' : previousOverflow
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onToggle()
    }
    updateScroll()
    mobile.addEventListener('change', updateScroll)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      mobile.removeEventListener('change', updateScroll)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen, onToggle])

  return (
    <div className="mobile-navigation">
      <Link to="/" className="mobile-navigation-brand" onClick={() => { if (menuOpen) onToggle() }}>Jet Padilla</Link>
      <button
        className={`lnav-hamburger ${menuOpen ? 'lnav-hamburger-open' : ''}`}
        onClick={onToggle}
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>
    </div>
  )
}
