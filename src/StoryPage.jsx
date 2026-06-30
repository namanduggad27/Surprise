import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
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
    photos: [null, null, null],
    photoLabels: ['Baby days ✨', 'First smile 💕', 'Little explorer 🌸'],
    body: [
      `In a world full of wonder and wide-eyed magic, a tiny girl arrived and changed everything.`,
      `She laughed at clouds, talked to butterflies, and found treasure in every puddle she jumped into. The world was her playground, and she was its brightest spark.`,
      `Every bedtime story ended with her already dreaming of the next adventure. ✨`,
    ],
  },
  {
    id: 2,
    layout: 'ch2',
    era: 'Growing Up',
    title: 'Little Steps, Big Dreams',
    photos: [null, null, null],
    photoLabels: ['School days 📚', 'Best pals 🌻', 'Adventures 🎨'],
    body: [
      `She grew a little taller every year, and her curiosity grew even faster.`,
      `School days meant crayon drawings and best friends made on the very first day. She was the one who always had a question, who read books under the blanket with a torch.`,
      `She believed absolutely anything was possible — because nobody had told her otherwise yet. 🌿`,
    ],
  },
  {
    id: 3,
    layout: 'ch3',
    era: 'The School Years',
    title: 'Pages & Friendships',
    photos: [null, null, null],
    photoLabels: ['Classroom laughs 😄', 'Bestie moments 💜', 'Stage memories 🎭'],
    body: [
      `The school corridor became a second home.`,
      `Friendships forged over shared lunch boxes and whispered gossip in the back row turned into bonds that would last lifetimes.`,
      `She discovered passions she didn't know she had — a love of music, a flair for words, a stubbornness to never give up. Every test, every stage moment — she showed up fully. 🎵`,
    ],
  },
  {
    id: 4,
    layout: 'ch4',
    era: 'Class 12th',
    title: 'The Final Bell',
    photos: [null, null, null],
    photoLabels: ['Study nights ☕', 'Exam season 📝', 'Results day 🏆'],
    body: [
      `Class 12. The year everything felt impossibly big.`,
      `Late nights with textbooks, stress that could fill an ocean, and the bittersweet knowledge that this chapter was ending. She sat through exams with her pen trembling but her heart steady.`,
      `And when results came in — she exhaled. Because she had done it. On her own terms. In her own way. 🔑`,
    ],
  },
  {
    id: 5,
    layout: 'ch5',
    era: 'College · Year 1',
    title: 'A New World',
    photos: [null, null, null],
    photoLabels: ['First day 🌅', 'New friendships 🎉', 'Exploring 🌍'],
    body: [
      `College. A completely new galaxy.`,
      `New faces, new freedom, new versions of herself she hadn't met yet. The first year was a glorious chaos — figuring out schedules, making friends who felt like family within weeks.`,
      `It was terrifying. It was exhilarating. It was the beginning of everything. 🌍`,
    ],
  },
  {
    id: 6,
    layout: 'ch6',
    era: 'College · Year 2',
    title: 'Finding Her Feet',
    photos: [null, null, null],
    photoLabels: ['Late nights 🌙', 'Fun moments 💃', 'Her glow up ✨'],
    body: [
      `Second year arrived and she knew the corridors, knew the faces, knew herself a little better.`,
      `She chased the things that lit her up — the late-night conversations, the spontaneous trips, the projects that kept her up until 3am because she actually cared.`,
      `She learned that growing up isn't a straight line, and she was perfectly okay with her wonderfully winding path. 🌺`,
    ],
  },
  {
    id: 7,
    layout: 'ch7',
    era: 'College · Year 3',
    happyLabel: 'HAPPY',
    title: 'Birthday, Bubo!',
    signature: 'iloveyou',
    photos: [null, null, null],
    photoLabels: ['Your journey 💝', 'Your smile 🌟', 'You, today 🎂'],
    body: [
      `Three years in, and she's a different person — or maybe she's finally the person she always was.`,
      `Wiser, warmer, more her. Today, on this very special birthday, here's to the girl who danced in the rain, who stayed up too late and laughed too loud.`,
      `You are loved more than any page could ever hold.`,
      `Once again, Happy Birthday, my love! 🎉 ❤️`,
      `May your day be as wonderful, beautiful, and unforgettable as you are to me. :)`,
    ],
  },
]

// ─── Fireworks ─────────────────────────────────────────────────────────────────
function launchFireworks() {
  const duration = 3500
  const end = Date.now() + duration
  const colors = ['#fde047', '#f472b6', '#a78bfa', '#34d399', '#fb923c', '#fff']
  const frame = () => {
    confetti({ particleCount: 5, angle: 60,  spread: 55, origin: { x: 0 }, colors })
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

// ─── Photo helpers ─────────────────────────────────────────────────────────────
function renderImg(src, label, color) {
  return src
    ? <img src={src} alt={label} />
    : <PhotoPlaceholder label={label} color={color} />
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
        {/* 3 horizontal photos */}
        <div className="ch1-photos">
          {chapter.photos.map((src, i) => (
            <div key={i} className="photo-cell">
              {renderImg(src, chapter.photoLabels[i], '#c8a888')}
            </div>
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
            <div key={i} className="ch2-photo-frame">
              {renderImg(src, chapter.photoLabels[i], '#5a8a6a')}
            </div>
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
            <div key={i} className={`s-photo`}>
              {renderImg(src, chapter.photoLabels[i], '#a878d0')}
            </div>
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
            <div key={i} className="ch4-single-photo">
              {renderImg(src, chapter.photoLabels[i], '#3a5080')}
            </div>
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
            <div key={i} className="strip-frame">
              {renderImg(src, chapter.photoLabels[i], '#a84020')}
            </div>
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
          <div className="continue-link on-dark" style={{ color: 'rgba(255,200,220,0.65)' }} onClick={onNext}>→ the final chapter</div>
        </div>
        {/* Photos RIGHT */}
        <div className="ch6-photo-col">
          {chapter.photos.map((src, i) => (
            <div key={i} className="ch6-photo-frame">
              {renderImg(src, chapter.photoLabels[i], '#8a4060')}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Chapter7({ chapter, onRestart }) {
  return (
    <div className="ch7-bg story-wrapper">
      <div className="ch7-layout">
        {/* Plum glass letter LEFT */}
        <div className="ch7-letter">
          {chapter.happyLabel && <span className="happy-label">{chapter.happyLabel}</span>}
          <span className="era-tag">{chapter.era}</span>
          <span className="big-title">{chapter.title}</span>
          <div className="divider" />
          <div className="body-text">
            {chapter.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {chapter.signature && (
            <span className="signature">{chapter.signature} 💋</span>
          )}
          <button className="celebrate-btn" onClick={launchFireworks}>
            🎉 Celebrate!
          </button>
          {onRestart && (
            <span className="restart-link" onClick={onRestart}>
              ↩ Start from the beginning
            </span>
          )}
        </div>
        {/* Glowing photos RIGHT */}
        <div className="ch7-photo-col">
          {chapter.photos.map((src, i) => (
            <div key={i} className="ch7-photo-frame">
              {renderImg(src, chapter.photoLabels[i], '#6a20a0')}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LAYOUT_MAP = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6, Chapter7]

// ─── Dot / label colour per chapter ───────────────────────────────────────────
const DOT_STYLE   = ['on-light','on-dark','on-dark','on-dark','on-light','on-dark','on-dark']
const LABEL_STYLE = ['dark-text','dark-text','light-text','light-text','dark-text','light-text','light-text']

// Transition timing must match the longer of the two CSS animation durations (enter = 0.48s)
const TRANSITION_MS = 480

// ─── Main StoryPage ────────────────────────────────────────────────────────────
export default function StoryPage({ onRestart }) {
  const total = CHAPTERS.length

  // Active (visible) chapter
  const [current, setCurrent]   = useState(0)
  // Departing chapter (null when idle)
  const [leaving, setLeaving]   = useState(null)
  // Navigation direction: 'right' = forward, 'left' = backward
  const [dir, setDir]           = useState('right')
  // Guard against rapid clicks during transition
  const [locked, setLocked]     = useState(false)

  const goTo = useCallback((index, direction = 'right') => {
    if (index < 0 || index >= total || locked || index === current) return
    setLocked(true)
    setDir(direction)
    setLeaving(current)    // snapshot the outgoing chapter
    setCurrent(index)      // immediately set new chapter (it starts entering)
    if (index === total - 1) setTimeout(launchFireworks, 520)
    // After both animations finish, clear the leaving layer and unlock
    setTimeout(() => {
      setLeaving(null)
      setLocked(false)
    }, TRANSITION_MS)
  }, [current, total, locked])

  const goNext = useCallback(() => goTo(current + 1, 'right'), [current, goTo])
  const goPrev = useCallback(() => goTo(current - 1, 'left'),  [current, goTo])

  // Keyboard navigation
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goNext, goPrev])

  // Touch swipe
  useEffect(() => {
    let sx = 0
    const onStart = (e) => { sx = e.touches[0].clientX }
    const onEnd   = (e) => {
      const dx = e.changedTouches[0].clientX - sx
      if (dx < -60) goNext()
      if (dx >  60) goPrev()
    }
    window.addEventListener('touchstart', onStart)
    window.addEventListener('touchend',   onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend',   onEnd)
    }
  }, [goNext, goPrev])

  // ── Compute animation class names ──────────────────────────────────────────
  // Incoming chapter: slides in from the direction we came from
  const enterClass = dir === 'right' ? 'slide-enter-from-right' : 'slide-enter-from-left'
  // Outgoing chapter: exits in the opposite direction
  const exitClass  = dir === 'right' ? 'slide-exit-to-left'     : 'slide-exit-to-right'

  const chapter    = CHAPTERS[current]
  const ChapterUI  = LAYOUT_MAP[current]
  const dotStyle   = DOT_STYLE[current]
  const labelStyle = LABEL_STYLE[current]
  const isLast     = current === total - 1

  const LeavingUI  = leaving !== null ? LAYOUT_MAP[leaving] : null
  const leavingChapter = leaving !== null ? CHAPTERS[leaving] : null

  return (
    // Clip container — never scrolls, never flashes
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>

      {/* ── Outgoing chapter (plays exit animation simultaneously) ── */}
      {LeavingUI && leavingChapter && (
        <div
          key={`leaving-${leaving}`}
          className={exitClass}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        >
          <LeavingUI
            chapter={leavingChapter}
            onNext={() => {}}
            onRestart={() => {}}
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
          onRestart={onRestart}
          isLast={isLast}
        />
      </div>

      {/* ── Persistent UI overlay (always on top, never animates) ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, pointerEvents: 'none' }}>

        {/* Top chapter label */}
        <div className="story-top-bar">
          <span className={`story-chapter-label ${labelStyle}`}>{chapter.era}</span>
          <span className={`story-chapter-label ${labelStyle}`}>{current + 1} / {total}</span>
        </div>

        {/* Nav arrows */}
        <button
          className="story-nav-btn prev on-dark"
          style={{ pointerEvents: 'auto' }}
          onClick={goPrev}
          disabled={current === 0 || locked}
          aria-label="Previous chapter"
        >‹</button>
        <button
          className="story-nav-btn next on-dark"
          style={{ pointerEvents: 'auto' }}
          onClick={goNext}
          disabled={isLast || locked}
          aria-label="Next chapter"
        >›</button>

        {/* Bottom progress dots */}
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

      </div>
    </div>
  )
}
