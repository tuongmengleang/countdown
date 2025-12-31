"use client"

import {useEffect, useRef} from "react"

export const Fireworks = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        
        let animationId: number
        const particles: Particle[] = []
        
        class Particle {
            x: number
            y: number
            color: string
            velocity: { x: number; y: number }
            alpha: number
            friction: number
            gravity: number
            
            constructor(x: number, y: number, color: string, velocity: { x: number; y: number }) {
                this.x = x
                this.y = y
                this.color = color
                this.velocity = velocity
                this.alpha = 1
                this.friction = 0.96
                this.gravity = 0.15
            }
            
            draw() {
                if (!ctx) return
                ctx.save()
                ctx.globalAlpha = this.alpha
                ctx.beginPath()
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false)
                ctx.fillStyle = this.color
                ctx.fill()
                ctx.restore()
            }
            
            update() {
                this.velocity.x *= this.friction
                this.velocity.y *= this.friction
                this.velocity.y += this.gravity
                this.x += this.velocity.x
                this.y += this.velocity.y
                this.alpha -= 0.01
            }
        }
        
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        
        const createFirework = (x: number, y: number) => {
            const particleCount = 100
            const colors = ["#ff0040", "#00ffcc", "#ffcc00", "#ff00ff", "#ffffff", "#4dff88"]
            const color = colors[Math.floor(Math.random() * colors.length)]
            
            for (let i = 0; i < particleCount; i++) {
                const angle = ((Math.PI * 2) / particleCount) * i
                const power = Math.random() * 8 + 2
                particles.push(
                    new Particle(x, y, color, {
                        x: Math.cos(angle) * power,
                        y: Math.sin(angle) * power,
                    }),
                )
            }
        }
        
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            particles.forEach((particle, index) => {
                if (particle.alpha > 0) {
                    particle.update()
                    particle.draw()
                } else {
                    particles.splice(index, 1)
                }
            })
            
            if (Math.random() < 0.05) {
                createFirework(Math.random() * canvas.width, Math.random() * (canvas.height * 0.6))
            }
        }
        
        window.addEventListener("resize", resize)
        resize()
        animate()
        
        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", resize)
        }
    }, [])
    
    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
