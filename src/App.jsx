import { useState } from 'react'
import LockScreen from './LockScreen'
import DateReveal from './DateReveal'
import LoadingPage from './LoadingPage'
import StoryPage from './StoryPage'
import './App.css'

function App() {
  const [stage, setStage] = useState('lockscreen')
  // stages: 'lockscreen' | 'date-reveal' | 'loading' | 'story'

  if (stage === 'lockscreen') {
    return <LockScreen onUnlock={() => setStage('date-reveal')} />
  }

  if (stage === 'date-reveal') {
    return <DateReveal onNext={() => setStage('loading')} />
  }

  if (stage === 'loading') {
    return <LoadingPage onFinish={() => setStage('story')} />
  }

  if (stage === 'story') {
    return <StoryPage onRestart={() => setStage('lockscreen')} />
  }

  return null
}

export default App
