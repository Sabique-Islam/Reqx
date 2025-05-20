"use client"

import React, { useEffect, useRef } from 'react'

interface ParsedColor {
  r: number
  g: number
  b: number
  a: number
}

interface Star {
  x: number
  y: number
  size: number
  color: string
  parsedColor: ParsedColor
  speed: number
  angle: number
}

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    function initStars() {
      const starCount = Math.floor((canvas.width * canvas.height) / 18000) // Further reduced density for subtlety
      starsRef.current = []

      for (let i = 0; i < starCount; i++) {
        const starType = Math.random();
        let size, color, speed;

        if (starType > 0.94) {
          size = Math.random() * 1.2 + 1.0;
          color = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 180, 0.3)';
          speed = Math.random() * 0.12 + 0.04;
        } else if (starType > 0.7) {
          size = Math.random() * 0.6 + 0.6;
          color = Math.random() > 0.6 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 150, 0.25)';
          speed = Math.random() * 0.15 + 0.06;
        } else {
          size = Math.random() * 0.4 + 0.2;
          color = Math.random() > 0.7 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 220, 0.2)';
          speed = Math.random() * 0.18 + 0.08;
        }

        const colorParts = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
        const parsedColor = colorParts
          ? {
              r: parseInt(colorParts[1]),
              g: parseInt(colorParts[2]),
              b: parseInt(colorParts[3]),
              a: colorParts[4] ? parseFloat(colorParts[4]) : 0.8
            }
          : { r: 255, g: 255, b: 255, a: 0.8 }

        const star: Star = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          color,
          parsedColor,
          speed,
          angle: Math.random() * Math.PI * 2
        }
        starsRef.current.push(star)
      }
    }

    function animate() {
      if (!canvas || !ctx) return

      ctx.fillStyle = 'rgba(12, 18, 34, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach(star => {
        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed

        const angleChange = (Math.random() - 0.5) * (0.03 / star.size)
        star.angle += angleChange

        const time = Date.now() / 5000
        const waveInfluence = 0.005 / (star.size * 2)
        star.x += Math.sin(time + star.y * 0.01) * waveInfluence
        star.y += Math.cos(time + star.x * 0.01) * waveInfluence

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        const { r, g, b } = star.parsedColor

        if (star.size > 1.0) {
          const outerGlow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          )
          const outerGlowColor = `rgba(${r}, ${g}, ${b}, 0.15)`

          outerGlow.addColorStop(0, outerGlowColor)
          outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = outerGlow
          ctx.fill()

          const middleGlow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 1.5
          )
          const middleGlowColor = `rgba(${r}, ${g}, ${b}, 0.25)`

          middleGlow.addColorStop(0, middleGlowColor)
          middleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = middleGlow
          ctx.fill()
        } else {
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 1.8
          )

          const glowColor = `rgba(${r}, ${g}, ${b}, ${star.parsedColor.a * 0.7})`

          glow.addColorStop(0, glowColor)
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)

        const coreColor = `rgba(${r}, ${g}, ${b}, 0.7)`

        ctx.fillStyle = coreColor
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    initStars()
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 blur-[2px] opacity-70"
    />
  )
}

export default StarryBackground