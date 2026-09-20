import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import profilePhoto from '../../assets/KunalProfilePhoto.jpeg'

/**
 * LoadingOverlay
 *
 * Shown on first page paint. A centred card with:
 *   – circular profile photo
 *   – name + title
 *   – animated progress bar that fills over `duration` ms
 *
 * Once the bar completes it fades out and unmounts.
 * Skips itself if the user has visited before this session
 * (stored in sessionStorage so it only shows once per tab).
 */

const DURATION = 2200 // total fill time in ms

export function LoadingOverlay() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    const seen = sessionStorage.getItem('intro-seen')
    return !seen
  })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!visible) return

    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)

      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        // Small pause at 100% before fading out
        setTimeout(() => {
          sessionStorage.setItem('intro-seen', '1')
          setVisible(false)
        }, 320)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-live="polite"
          aria-label="Loading portfolio"
          role="status"
        >
          <div className="loading-card">
            {/* Profile photo */}
            <div className="loading-avatar">
              <img
                src={profilePhoto}
                alt="Kunal Wadhai"
                className="loading-avatar__img"
                draggable={false}
              />
            </div>

            {/* Identity */}
            <p className="loading-name">Kunal Wadhai</p>
            <p className="loading-title">Backend Engineer</p>

            {/* Progress bar */}
            <div
              className="loading-bar-track"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Loading"
            >
              <div
                className="loading-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="loading-pct">{Math.round(progress)}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
