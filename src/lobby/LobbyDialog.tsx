import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react'
import './lobby.css'

const Lobby = lazy(() => import('./Lobby'))

export default function LobbyDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  const finished = useRef(false)

  const finishClose = useCallback(() => {
    if (finished.current) return
    finished.current = true
    onClose()
  }, [onClose])

  function requestClose() {
    if (closing) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose()
    } else {
      setClosing(true)
    }
  }

  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    return () => element?.close()
  }, [])

  useEffect(() => {
    if (!closing) return
    const timeout = window.setTimeout(finishClose, 300)
    return () => window.clearTimeout(timeout)
  }, [closing, finishClose])

  return (
    <dialog
      ref={dialog}
      className="pixel-dialog"
      aria-label="Jet's Office"
      data-closing={closing ? '' : undefined}
      onCancel={event => { event.preventDefault(); requestClose() }}
      onClick={event => { if (event.target === event.currentTarget) requestClose() }}
      onAnimationEnd={event => {
        if (event.target === event.currentTarget && event.animationName === 'pixel-dialog-exit') finishClose()
      }}
    >
      <section className="pixel-dialog-content">
        <Suspense fallback={<p className="pixel-loading" role="status">Loading the office…</p>}>
          <Lobby />
        </Suspense>
      </section>
    </dialog>
  )
}
