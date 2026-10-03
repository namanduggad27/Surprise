import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import togetherImg from './assets/together.jpg'
import './StoryPage.css'

// ─── Chapter Data ──────────────────────────────────────────────────────────────
// For each chapter: add real imported images to the `photos` array.
// e.g.: import ch1a from './assets/childhood1.jpg'
//       then: photos: [ch1a, ch1b, ch1c]
const CHAPTERS = [
  {
    id: 1,
    layout: 'ch1',
    era: 'Once Upon a Time',
    title: 'The Little Girl',
    photos: ['/childhood1.jpeg', '/childhood2.jpeg', '/childhood3.jpeg', '/childhood4.jpg'],
    photoLabels: ['Baby days ✨', 'First smile 💕', 'Little explorer 🌸', 'Pure joy 🌊'],
    body: [
      `In a world full of wonder and wide-eyed magic, a tiny girl arrived and changed everything.`,
      `She was cute, beautiful a bit stubborn but was loved by everyone and cared by her bestfriends.`,
      `✨`,
    ],
  },
  {
    id: 2,
    layout: 'ch2',
    era: 'Growing Up',
    title: 'Little Steps, Big Dreams',
    photos: ['/school.jpeg', '/school1.jpeg', '/teen.jpeg'],
    photoLabels: ['School days 📚', 'Best pals 🌻', 'Adventures 🎨'],
    body: [
      `She grew a little taller every year, and her curiosity grew even faster.`,
      `School days meant leading assemblies having healthy competition and best friends made through those competitions. She was always in top in her class.`,
      `Through chaos and things she got her way out through everything. 🌿`,
    ],
  },
  {
    id: 3,
    layout: 'ch3',
    era: 'The School Years',
    title: 'Pages & Friendships',
    photos: ['/cringe.jpg', '/sorry.jpg', '/gossip.mp4'],
    photoLabels: ['Classroom laughs 😄', 'Bestie moments 💜', 'Fun memories 🎭'],
    body: [
      `The school corridor became a second home.`,
      `Friendships forged over shared lunch boxes and whispered gossip in the back row turned into bonds that would last lifetimes those samosas from the school canteen the fights to sit beside you or near you(the rounder incident to be specific).`,
    ],
  },
  {
    id: 4,
    layout: 'ch4',
    era: 'Class 12th',
    title: 'The Final Bell',
    photos: ['/maggie.mp4', '/khauf.mp4', '/precious.mp4'],
    photoLabels: ['Study nights ☕', 'Exam season 📝', 'Results day 🏆'],
    body: [
      `Class 12. The year everything felt impossibly big.`,
      `Late nights with textbooks, stress that could fill an ocean, and the bittersweet knowledge that this chapter was ending. Friends getting apart starting new phase of life.`,
      `And when results came in she exhaled. Because she had done it. On her own terms. In her own way. 🔑`,
    ],
  },
  {
    id: 5,
    layout: 'ch5',
    era: 'College · Year 1',
    title: 'A New World',
    photos: ['/college1.jpeg', '/hooodie.mp4', '/skincare.mp4'],
    photoLabels: ['First day 🌅', 'Hostel fun 🎉', 'Self-care 🧴'],
    body: [
      `College. A completely new galaxy.`,
      `New faces, new freedom, new versions of herself she hadn't met yet. The first year was a glorious chaos figuring out schedules, making friends who felt like family within weeks.`,
      `It was terrifying. It was exhilarating. It was the beginning of everything. 🌍`,
    ],
  },
  {
    id: 6,
    layout: 'ch6',
    era: 'College · Year 2',
    title: 'Finding Her Feet',
    photos: ['/college2.jpeg', '/cute.jpg', '/sundarr.mp4'],
    photoLabels: ['Late nights 🌙', 'Pure joy 🌸', 'Her glow up ✨'],
    body: [
      `Second year arrived and she knew the corridors, knew the faces, knew herself a little better.`,
      `She chased the things that lit her up the late-night conversations, the spontaneous trips, the projects that kept her up until 3am because she actually cared.`,
      `She learned that growing up isn't a straight line, and she was perfectly okay with her wonderfully winding path. 🌺`,
    ],
  },
  {
    id: 7,
    layout: 'ch7',
    era: 'College · Year 3',
    title: 'She Became Herself',
    photos: ['/sundar.mp4', '/precious.mp4', '/together.jpg'],
    photoLabels: ['Confidence ✨', 'Precious moments 💖', 'Unstoppable 💫'],
    body: [
      `Three years in, and everything fell into place. She wasn’t just navigating the world anymore—she was truly owning it.`,
      `From late-night talks that felt like therapy to conquering challenges that once felt impossible, Year 3 was where confidence became second nature.`,
      `She had built friendships that felt like home and discovered the strength she had carried all along. 💜`,
    ],
  },
  {
    id: 8,
    layout: 'ch8',
    era: 'College · Year 4',
    happyLabel: 'HAPPY',
    title: 'Birthday, Vidhi!',
    photos: ['/graduation.jpeg', '/sundar.mp4', '/mba.jpeg'],
    photoLabels: ['Your journey 💝', 'Your smile 🌟', 'You, today 🎂'],
    body: [
      `Four years of memories, laughter, lessons, and pure magic and here you are, shining brighter than ever.`,
      `Today, on this very special birthday, here's to everything you’ve been, everything you are, and the incredible journey waiting ahead.`,
      `May your year ahead be as bright, beautiful, and unforgettable as you are.`,
      `Happy Birthday, Vidhi! 🎉 ✨`,
    ],
  },
]

// ─── Fireworks ─────────────────────────────────────────────────────────────────
function launchFireworks() {
  const duration = 3500
  const end = Date.now() + duration
  const colors = ['#fde047', '#f472b6', '#a78bfa', '#34d399', '#fb923c', '#fff']
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

// ─── Shared Placeholder ────────────────────────────────────────────────────────
function PhotoPlaceholder({ label, color = '#fff' }) {
  return (
    <div className="photo-placeholder" style={{ color }}>
      <span className="ph-icon">📷</span>
      <span className="ph-text">{label}</span>
    </div>
  )
}

// ─── Dynamic Media Frame & Aspect Ratio ──────────────────────────────────────
function getMediaAspect(src) {
  if (!src || typeof src !== 'string') return '3 / 4'
  if (src.endsWith('.mp4') || src.endsWith('.webm')) return '9 / 16'
  if (src.includes('cringe') || src.includes('sorry') || src.includes('childhood4')) return '9 / 16'
  if (src.includes('school.jpeg')) return '4 / 3'
  return '3 / 4'
}

function getMediaClass(src) {
  if (!src || typeof src !== 'string') return 'media-placeholder'
  if (src.endsWith('.mp4') || src.endsWith('.webm')) return 'is-video is-vertical-9-16'
  if (src.includes('cringe') || src.includes('sorry') || src.includes('childhood4')) return 'is-photo is-vertical-9-16'
  if (src.includes('school.jpeg')) return 'is-photo is-landscape'
  return 'is-photo is-portrait-3-4'
}

function MediaCard({ src, label, color, className = '' }) {
  const [naturalAspect, setNaturalAspect] = useState(null)
  const defaultAspect = getMediaAspect(src)
  const mediaClass = getMediaClass(src)
  const isVideo = typeof src === 'string' && (src.endsWith('.mp4') || src.endsWith('.webm'))
  const resolvedSrc = typeof src === 'string' && src.startsWith('/')
    ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${src}`
    : src

  return (
    <div
      className={`${className} ${mediaClass}`}
      style={{ aspectRatio: naturalAspect || defaultAspect }}
    >
      {!src ? (
        <PhotoPlaceholder label={label} color={color} />
      ) : isVideo ? (
        <video
          src={resolvedSrc}
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={(e) => {
            const { videoWidth, videoHeight } = e.target
            if (videoWidth && videoHeight) {
              setNaturalAspect(`${videoWidth} / ${videoHeight}`)
            }
          }}
        />
      ) : (
        <img
          src={resolvedSrc}
          alt={label}
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.target
            if (naturalWidth && naturalHeight) {
              setNaturalAspect(`${naturalWidth} / ${naturalHeight}`)
            }
          }}
        />
      )}
    </div>
  )
}

// ─── Per-chapter Layout Components ────────────────────────────────────────────

function Chapter1({ chapter, onNext, onRestart, isLast }) {
  return (
    <div className="ch1-bg story-wrapper">
      <div className="ch1-layout">
        {/* Scroll letter */}
        <div className="ch1-scroll">
          <div className="era-tag">{chapter.era}</div>
          <div className="big-title">{chapter.title}</div>
          <hr className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {!isLast && (
            <div className="continue-link on-light" onClick={onNext}>→ next memory</div>
          )}
        </div>
        {/* Photos */}
        <div className="ch1-photos">
          {chapter.photos.map((src, i) => (
            <MediaCard key={i} src={src} label={chapter.photoLabels[i]} color="#c8a888" className="photo-cell" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Chapter2({ chapter, onNext }) {
  return (
    <div className="ch2-bg story-wrapper">
      <div className="ch2-layout">
        {/* Photos LEFT */}
        <div className="ch2-photo-col">
          {chapter.photos.map((src, i) => (
            <MediaCard key={i} src={src} label={chapter.photoLabels[i]} color="#5a8a6a" className="ch2-photo-frame" />
          ))}
        </div>
        {/* Card RIGHT */}
        <div className="ch2-card">
          <span className="era-tag">{chapter.era}</span>
          <div className="big-title">{chapter.title}</div>
          <div className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="continue-link on-light" onClick={onNext}>→ continue the story</div>
        </div>
      </div>
    </div>
  )
}

function Chapter3({ chapter, onNext }) {
  return (
    <div className="ch3-bg story-wrapper">
      <div className="ch3-layout">
        {/* Dark letter LEFT */}
        <div className="ch3-letter">
          <span className="era-tag">{chapter.era}</span>
          <span className="big-title">{chapter.title}</span>
          <div className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="continue-link on-dark" onClick={onNext}>→ keep going</div>
        </div>
        {/* Scrapbook collage RIGHT */}
        <div className="ch3-scrapbook">
          {chapter.photos.map((src, i) => (
            <MediaCard key={i} src={src} label={chapter.photoLabels[i]} color="#a878d0" className="s-photo" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Chapter4({ chapter, onNext }) {
  return (
    <div className="ch4-bg story-wrapper">
      <div className="ch4-layout">
        {/* Dark glass letter LEFT */}
        <div className="ch4-letter">
          <span className="era-tag">{chapter.era}</span>
          <span className="big-title">{chapter.title}</span>
          <div className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="continue-link on-dark" onClick={onNext}>→ onward</div>
        </div>
        {/* Photos RIGHT stacked */}
        <div className="ch4-photo-col">
          {chapter.photos.map((src, i) => (
            <MediaCard key={i} src={src} label={chapter.photoLabels[i]} color="#3a5080" className="ch4-single-photo" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Chapter5({ chapter, onNext }) {
  return (
    <div className="ch5-bg story-wrapper">
      <div className="ch5-layout">
        {/* Banner photos TOP */}
        <div className="ch5-photo-strip">
          {chapter.photos.map((src, i) => (
            <MediaCard key={i} src={src} label={chapter.photoLabels[i]} color="#a84020" className="strip-frame" />
          ))}
        </div>
        {/* Floating glass card BELOW */}
        <div className="ch5-card">
          <span className="era-tag">{chapter.era}</span>
          <div className="big-title">{chapter.title}</div>
          <div className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="continue-link on-light" onClick={onNext}>→ one more year</div>
        </div>
      </div>
    </div>
  )
}

function Chapter6({ chapter, onNext }) {
  return (
    <div className="ch6-bg story-wrapper">
      <div className="ch6-layout">
        {/* Deep rose letter LEFT */}
        <div className="ch6-letter">
          <span className="era-tag">{chapter.era}</span>
          <span className="big-title">{chapter.title}</span>
          <div className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="continue-link on-dark" style={{ color: 'rgba(255,200,220,0.65)' }} onClick={onNext}>→ onwards to year 3</div>
        </div>
        {/* Photos RIGHT */}
        <div className="ch6-photo-col">
          {chapter.photos.map((src, i) => (
            <MediaCard key={i} src={src} label={chapter.photoLabels[i]} color="#8a4060" className="ch6-photo-frame" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Chapter7({ chapter, onNext }) {
  return (
    <div className="ch7-bg story-wrapper">
      <div className="ch7-layout">
        {/* Violet glass letter LEFT */}
        <div className="ch7-letter">
          <span className="era-tag">{chapter.era}</span>
          <span className="big-title">{chapter.title}</span>
          <div className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="continue-link on-dark" onClick={onNext}>→ the final chapter</div>
        </div>
        {/* Photos RIGHT */}
        <div className="ch7-photo-col">
          {chapter.photos.map((src, i) => (
            <MediaCard key={i} src={src} label={chapter.photoLabels[i]} color="#a855f7" className="ch7-photo-frame" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Chapter8({ chapter, onNext }) {
  return (
    <div className="ch8-bg story-wrapper">
      <div className="ch8-layout">
        {/* Plum celebration letter LEFT */}
        <div className="ch8-letter">
          {chapter.happyLabel && <span className="happy-label">{chapter.happyLabel}</span>}
          <span className="era-tag">{chapter.era}</span>
          <span className="big-title">{chapter.title}</span>
          <div className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <button className="celebrate-btn" onClick={launchFireworks}>
            🎉 Celebrate!
          </button>
        </div>
        {/* Glowing photos RIGHT */}
        <div className="ch8-photo-col">
          {chapter.photos.map((src, i) => (
            <MediaCard key={i} src={src} label={chapter.photoLabels[i]} color="#6a20a0" className="ch8-photo-frame" />
          ))}
        </div>
      </div>
    </div>
  )
}

function SecretPage() {
  return (
    <div className="secret-wrapper story-wrapper">
      <div className="secret-backdrop" style={{ backgroundImage: `url(${togetherImg})` }} />
      <div className="secret-scrim" />

      <div className="secret-text-overlay">
        <div className="secret-floating-content">
          <span className="secret-tag">A Special Note</span>
          <h1 className="secret-title">Happy Birthday, Vidhi</h1>
          <div className="secret-divider" />
          <div className="secret-message">
            <p>Behind all the chapters, the milestones, and the memories, there is you someone truly irreplaceable.</p>
            <p>Having you in my life makes everything brighter, lighter, and so much more meaningful. Thank you for simply being you, for your genuine warmth, your laughter, and every little moment we share.</p>
            <p className="secret-highlight">Here’s to celebrating you today and always. Wishing you the happiest birthday and the most beautiful year ahead. ✨</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const LAYOUT_MAP = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6, Chapter7, Chapter8]

// ─── Dot / label colour per chapter ───────────────────────────────────────────
const DOT_STYLE = ['on-light', 'on-dark', 'on-dark', 'on-dark', 'on-light', 'on-dark', 'on-dark', 'on-dark']
const LABEL_STYLE = ['dark-text', 'dark-text', 'light-text', 'light-text', 'dark-text', 'light-text', 'light-text', 'light-text']

// Transition timing matches the fluid CSS animation duration (0.42s = 420ms)
const TRANSITION_MS = 420

// ─── Main StoryPage ────────────────────────────────────────────────────────────
export default function StoryPage({ onRestart }) {
  const total = CHAPTERS.length

  // Active index: 0..total-1 for chapters, total (8) for the SecretPage
  const [current, setCurrent] = useState(0)
  // Departing chapter (null when idle)
  const [leaving, setLeaving] = useState(null)
  // Navigation direction: 'right' = forward, 'left' = backward
  const [dir, setDir] = useState('right')
  // Guard against rapid clicks during transition
  const [locked, setLocked] = useState(false)

  const goTo = useCallback((index, direction = 'right') => {
    if (index < 0 || index > total || locked || index === current) return
    setLocked(true)
    setDir(direction)
    setLeaving(current)    // snapshot outgoing chapter
    setCurrent(index)      // set incoming chapter
    if (index === total - 1) setTimeout(launchFireworks, 460) // Year 4 fireworks!
    // After transition finishes, unlock
    setTimeout(() => {
      setLeaving(null)
      setLocked(false)
    }, TRANSITION_MS)
  }, [current, total, locked])

  const goNext = useCallback(() => goTo(current + 1, 'right'), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1, 'left'), [current, goTo])

  // Always reset scroll on chapter change so each page starts cleanly at top
  useEffect(() => {
    const scrollable = document.querySelectorAll(
      '.ch1-layout, .ch2-layout, .ch3-layout, .ch4-layout, .ch5-layout, .ch6-layout, .ch7-layout, .ch8-layout, .secret-text-overlay'
    )
    scrollable.forEach((el) => {
      el.scrollTop = 0
    })
  }, [current])

  // Keyboard navigation
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goNext, goPrev])

  // Touch swipe — smooth horizontal navigation with vertical scroll protection
  useEffect(() => {
    let sx = 0
    let sy = 0
    let active = false
    const onStart = (e) => {
      if (e.touches.length !== 1) return
      sx = e.touches[0].clientX
      sy = e.touches[0].clientY
      active = true
    }
    const onEnd = (e) => {
      if (!active) return
      active = false
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      // Only switch chapter if horizontal swipe is intentional and exceeds vertical movement
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) goNext()
        if (dx > 0) goPrev()
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [goNext, goPrev])

  // ── Compute animation class names ──────────────────────────────────────────
  const enterClass = dir === 'right' ? 'slide-enter-from-right' : 'slide-enter-from-left'
  const exitClass = dir === 'right' ? 'slide-exit-to-left' : 'slide-exit-to-right'

  const isSecret = current === total
  const chapter = isSecret ? null : CHAPTERS[current]
  const ChapterUI = isSecret ? SecretPage : LAYOUT_MAP[current]
  const dotStyle = isSecret ? 'on-dark' : DOT_STYLE[current]
  const labelStyle = isSecret ? 'light-text' : LABEL_STYLE[current]

  const isLeavingSecret = leaving === total
  const LeavingUI = isLeavingSecret ? SecretPage : (leaving !== null ? LAYOUT_MAP[leaving] : null)
  const leavingChapter = isLeavingSecret ? null : (leaving !== null ? CHAPTERS[leaving] : null)

  return (
    // Clip container — deep tone prevents any light flash during crossfade
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0e0616' }}>

      {/* ── Outgoing chapter (plays exit animation simultaneously) ── */}
      {LeavingUI && (
        <div
          key={`leaving-${leaving}`}
          className={exitClass}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        >
          <LeavingUI
            chapter={leavingChapter}
            onNext={() => { }}
            onPrev={() => { }}
            onRestart={() => { }}
            isLast={leaving === total - 1}
          />
        </div>
      )}

      {/* ── Incoming chapter (plays enter animation simultaneously) ── */}
      <div
        key={`entering-${current}`}
        className={enterClass}
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
      >
        <ChapterUI
          chapter={chapter}
          onNext={goNext}
          onPrev={goPrev}
          onRestart={onRestart}
          isLast={current === total - 1}
        />
      </div>

      {/* ── Persistent UI overlay (always on top, never animates) ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, pointerEvents: 'none' }}>

        {/* Top chapter label — hidden on the secret page */}
        {!isSecret && chapter && (
          <div className="story-top-bar" key={chapter.id}>
            <span className={`story-chapter-label ${labelStyle}`}>{chapter.era}</span>
            <span className={`story-chapter-label ${labelStyle}`}>{current + 1} / {total}</span>
          </div>
        )}

        {/* Nav arrows */}
        <button
          className="story-nav-btn prev on-dark"
          style={{ pointerEvents: 'auto' }}
          onClick={goPrev}
          disabled={current === 0}
          aria-label="Previous chapter"
        >‹</button>
        <button
          className="story-nav-btn next on-dark"
          style={{ pointerEvents: 'auto' }}
          onClick={goNext}
          disabled={isSecret}
          aria-label="Next chapter"
        >›</button>

        {/* Bottom progress dots — treats Year 4 as the last page; hidden on secret page */}
        {!isSecret && (
          <div className="story-dots" style={{ pointerEvents: 'auto' }}>
            {CHAPTERS.map((_, i) => (
              <button
                key={i}
                className={`story-dot ${dotStyle} ${i === current ? 'active' : ''}`}
                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                aria-label={`Chapter ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
