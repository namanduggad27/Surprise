import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import './DateReveal.css'

// Generate static radial particles surrounding the date
const PARTICLES = Array.from({ length: 42 }).map((_, i) => {
  const angle = (i / 42) * 2 * Math.PI + (Math.random() * 0.2 - 0.1)
  const distance = 110 + Math.random() * 220
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance
  
  const shapes = ['circle', 'circle', 'square', 'diamond']
  const shape = shapes[i % shapes.length]
  const size = 5 + Math.random() * 12
  
  const colors = ['#fde047', '#fca5a5', '#fda4af', '#fef08a', '#ffffff', '#f43f5e']
  const color = colors[i % colors.length]
  
  const opacity = 0.4 + Math.random() * 0.6
  const duration = (2.5 + Math.random() * 3).toFixed(1) + 's'
  const dx = (Math.random() * 30 - 15) + 'px'
  const dy = (Math.random() * 30 - 15) + 'px'
  const rot = (Math.random() * 180 - 90) + 'deg'
  
  return { id: i, x, y, shape, size, color, opacity, duration, dx, dy, rot }
})

export default function DateReveal({ onNext }) {
  useEffect(() => {
    // Initial celebration burst when the date pops out
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#fde047', '#f43f5e', '#ffffff', '#fbcfe8']
    })
  }, [])

  const handleClick = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#fde047', '#fb7185', '#ffffff']
    })
    if (onNext) {
      setTimeout(onNext, 400)
    }
  }

  return (
    <div className="date-reveal-wrapper" onClick={handleClick}>
      <div className="date-glow-backdrop" aria-hidden="true" />

      {/* Radial Geometric Floating Particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className={`particle ${p.shape}`}
          style={{
            left: `calc(50% + ${p.x}px - ${p.size / 2}px)`,
            top: `calc(50% + ${p.y}px - ${p.size / 2}px)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            '--duration': p.duration,
            '--dx': p.dx,
            '--dy': p.dy,
            '--rot': p.rot
          }}
        />
      ))}

      {/* Popping Date Display */}
      <div className="date-container">
        <h1 className="date-text">
          <span>27</span>
          <span className="date-slash">/</span>
          <span>07</span>
          <span className="date-slash">/</span>
          <span>06</span>
        </h1>
      </div>

      <button className="date-continue-prompt" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
        ✨ Tap to Continue ✨
      </button>
    </div>
  )
}
