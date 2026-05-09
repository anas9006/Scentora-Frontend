import React, { useEffect, useRef } from 'react'

const MistBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      constructor() {
        this.init()
      }

      init() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.2 // Smaller size
        this.speedX = Math.random() * 0.3 - 0.15
        this.speedY = Math.random() * 0.3 - 0.15
        this.opacity = Math.random() * 0.5
        this.fadeSpeed = Math.random() * 0.003 + 0.001
        this.growing = true
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.growing) {
          this.opacity += this.fadeSpeed
          if (this.opacity >= 0.8) this.growing = false // Higher peak opacity
        } else {
          this.opacity -= this.fadeSpeed
          if (this.opacity <= 0) this.init()
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})` // Pure white for better visibility
        ctx.fill()
        
        // Add a subtle glow for smaller particles
        ctx.shadowBlur = 4
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)'
      }
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 4000) // Double the density
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', () => {
      resize()
      initParticles()
    })

    resize()
    initParticles()
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }} // Slight overall transparency
    />
  )
}

export default MistBackground
