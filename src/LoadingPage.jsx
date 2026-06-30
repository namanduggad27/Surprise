import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './LoadingPage.css'

const STICKERS = [
  { id: 1, text: '(⌐■_■)', type: 'kaomoji', top: '8%', left: '7%', duration: '5s', rotStart: '-5deg', rotEnd: '8deg' },
  { id: 2, text: '(¬‿¬)', type: 'kaomoji', top: '68%', right: '9%', duration: '6s', rotStart: '4deg', rotEnd: '-6deg' },
  { id: 3, text: '(*^‿^*)', type: 'kaomoji', top: '16%', right: '14%', duration: '5.5s', rotStart: '-8deg', rotEnd: '5deg' },
  { id: 4, text: '(♥_♥)', type: 'kaomoji', bottom: '18%', left: '12%', duration: '4.8s', rotStart: '3deg', rotEnd: '-10deg' },
  { id: 5, text: '🎉', type: 'emoji-sticker', top: '42%', left: '5%', duration: '4s' },
  { id: 6, text: '✨', type: 'emoji-sticker', top: '22%', left: '22%', duration: '3.5s' },
  { id: 7, text: '🎀', type: 'emoji-sticker', bottom: '14%', left: '6%', duration: '5.2s' },
  { id: 8, text: '⭐', type: 'emoji-sticker', top: '6%', right: '6%', duration: '4.2s' },
  { id: 9, text: '🌸', type: 'emoji-sticker', top: '12%', right: '24%', duration: '4.7s' },
  { id: 10, text: '💖', type: 'emoji-sticker', top: '34%', right: '5%', duration: '3.8s' },
  { id: 11, text: '💫', type: 'emoji-sticker', bottom: '26%', left: '26%', duration: '5.1s' },
  { id: 12, text: '🍰', type: 'emoji-sticker', bottom: '16%', right: '18%', duration: '4.5s' },
]

export default function LoadingPage({ onFinish }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Slow step increment every 140ms for a deliberate, suspenseful loading feel (~9s)
        const step = Math.random() > 0.4 ? 1 : 2
        return Math.min(prev + step, 100)
      })
    }, 140)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      const timeout = setTimeout(() => {
        if (onFinish) onFinish()
      }, 900)
      return () => clearTimeout(timeout)
    }
  }, [progress, onFinish])

  const getStatusText = () => {
    if (progress < 25) return "Loading your birthday surprise..."
    if (progress < 55) return "Gathering virtual hugs & wishes..."
    if (progress < 85) return "Adding extra sparkles for Bubo..."
    if (progress < 100) return "Almost ready! Unwrapping..."
    return "Surprise Ready! 🎉"
  }

  return (
    <div className="loading-page-wrapper">
      {/* Background Floating Kaomoji & Stickers */}
      {STICKERS.map((s) => (
        <div
          key={s.id}
          className={`bg-sticker ${s.type}`}
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            '--duration': s.duration,
            '--rot-start': s.rotStart || '-5deg',
            '--rot-end': s.rotEnd || '5deg'
          }}
        >
          {s.text}
        </div>
      ))}

      {/* Main Glass Loading Box */}
      <div className="loading-content">
        <h1 className="loading-title">
          <span>Hey gurl!</span>
          <span>🎉</span>
        </h1>

        <div className="loading-cake-wrapper">
          🎂
        </div>

        <div className="loading-status-text">
          {getStatusText()}
        </div>

        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="progress-percentage">
          {progress}%
        </div>
      </div>

      <button className="skip-loading-btn" onClick={() => { setProgress(100); }}>
        Skip ⏩
      </button>
    </div>
  )
}
