import { useState, useEffect } from 'react'
import { Lock, Unlock, Delete } from 'lucide-react'
import confetti from 'canvas-confetti'
import heroImg from './assets/hero.png'
import './LockScreen.css'

export default function LockScreen({ onUnlock }) {
  const [passcode, setPasscode] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const triggerCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fcd34d', '#f43f5e', '#ec4899', '#ffffff']
    })
  }

  const handleDigit = (digit) => {
    if (isSuccess || passcode.length >= 6) return
    const nextCode = passcode + digit
    setPasscode(nextCode)

    if (nextCode.length === 6) {
      if (nextCode === '270706') {
        setIsSuccess(true)
        triggerCelebrate()
        setTimeout(() => {
          onUnlock()
        }, 1300)
      } else {
        setIsError(true)
        setTimeout(() => {
          setPasscode('')
          setIsError(false)
        }, 600)
      }
    }
  }

  const handleDelete = () => {
    if (isSuccess || passcode.length === 0) return
    setPasscode(prev => prev.slice(0, -1))
  }

  const handleClearOrDot = () => {
    if (isSuccess) return
    if (passcode.length > 0) {
      setPasscode('')
    }
  }

  // Keyboard support for physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSuccess) return
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key)
      } else if (e.key === 'Backspace') {
        handleDelete()
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        setPasscode('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [passcode, isSuccess])

  return (
    <div className="lock-screen-wrapper">
      <div className="lock-screen-container">
        {/* Left Side: Polaroid Photo Card */}
        <div className="polaroid-section">
          <div className="polaroid-card">
            {/* 3D Red Ribbon Bow SVG */}
            <div className="polaroid-bow" aria-hidden="true">
              <svg width="68" height="58" viewBox="0 0 68 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.5 16.5C21.5 6.5 6.5 8.5 8.5 21.5C9.9 30.5 25.5 26.5 32 23.5C28.5 16.5 28.5 16.5 28.5 16.5Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5"/>
                <path d="M39.5 16.5C46.5 6.5 61.5 8.5 59.5 21.5C58.1 30.5 42.5 26.5 36 23.5C39.5 16.5 39.5 16.5 39.5 16.5Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5"/>
                <path d="M30 25L15 48L22 51L33 28L30 25Z" fill="#B91C1C"/>
                <path d="M38 25L53 48L46 51L35 28L38 25Z" fill="#DC2626"/>
                <circle cx="34" cy="22" r="6" fill="#F87171" stroke="#B91C1C" strokeWidth="1.5"/>
              </svg>
            </div>

            <div className="polaroid-photo">
              <img src={heroImg} alt="Happy Birthday Vidhi" />
            </div>

            <div className="polaroid-caption">
              Happy Birthday!<br />
              Vidhi
            </div>
          </div>
        </div>

        {/* Right Side: Passcode Keypad */}
        <div className="passcode-section">
          <div className="lock-icon-wrapper">
            {isSuccess ? <Unlock size={32} color="#34d399" /> : <Lock size={30} />}
          </div>
          
          <div className="passcode-label">
            ENTER A PASSCODE
          </div>

          {/* 6 Digit Indicators */}
          <div className="passcode-slots">
            {[...Array(6)].map((_, i) => {
              const isFilled = i < passcode.length
              return (
                <div 
                  key={i} 
                  className={`passcode-slot ${isFilled ? 'filled' : ''} ${isSuccess ? 'success' : ''} ${isError ? 'error' : ''}`}
                >
                  {isFilled && <span className="passcode-dot"></span>}
                </div>
              )
            })}
          </div>

          {/* Keypad Grid */}
          <div className="keypad-grid">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                className="keypad-btn"
                onClick={() => handleDigit(num)}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              className="keypad-btn action-btn"
              onClick={handleClearOrDot}
              title="Clear Passcode"
            >
              •
            </button>

            <button
              type="button"
              className="keypad-btn"
              onClick={() => handleDigit('0')}
            >
              0
            </button>

            <button
              type="button"
              className="keypad-btn action-btn"
              onClick={handleDelete}
              title="Backspace"
            >
              <Delete size={22} />
            </button>
          </div>

          <div 
            className="passcode-hint" 
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? "✨ Hint: Vidhi's birthday date (DDMMYY - 270706)" : "Need a hint?"}
          </div>
        </div>
      </div>
    </div>
  )
}
