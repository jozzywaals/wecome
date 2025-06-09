'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import confetti from 'canvas-confetti'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { isSignedIn, user } = useUser()
  const [hasCelebrated, setHasCelebrated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn && !hasCelebrated) {
      setHasCelebrated(true)

      const duration = 20 * 1000 // 20 seconds
      const end = Date.now() + duration

      const baseSound = new Audio('/sound/welcome.mp3')
      baseSound.volume = 0.3

      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval)
          return
        }

        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } })
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } })

        const pop = baseSound.cloneNode() as HTMLAudioElement
        pop.play().catch(e => console.warn('Sound error:', e))
      }, 250)

      // Redirect to booking page after 7 seconds
      const redirectTimeout = setTimeout(() => {
        router.push('/booking')
      }, 7000)

      return () => {
        clearInterval(interval)
        clearTimeout(redirectTimeout)
      }
    }
  }, [isSignedIn, hasCelebrated, router])

  if (!isSignedIn) {
    return <div>Please log in to see your homepage.</div>
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1 className="animated-gradient-text">🎉 Congratulations! 🎉</h1>
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #ff7e5f, #feb47b, #86fde8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginTop: '20px',
        }}
      >
        {user.firstName || user.username || 'Welcome'}, you are now signed in!
      </h2>

      <style jsx>{`
        .animated-gradient-text {
          font-size: 3rem;
          font-weight: bold;
          background: linear-gradient(-45deg, #ff6ec4, #7873f5, #42e695, #ffe985);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientMove 8s ease infinite;
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}
