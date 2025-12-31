"use client"

import {useEffect, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {Fireworks} from "./Firework"

const TARGET_DATE = new Date("2026-01-01T00:00:00")

export const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: false,
    })
    
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const difference = TARGET_DATE.getTime() - now.getTime()
            
            if (difference <= 0) {
                setTimeLeft((prev) => ({ ...prev, isComplete: true }))
                clearInterval(timer)
                return
            }
            
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isComplete: false,
            })
        }, 1000)
        
        return () => clearInterval(timer)
    }, [])
    
    if (timeLeft.isComplete) {
        return (
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
                <Fireworks />
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="relative z-10 text-center px-4"
                >
                    <h1 className="text-6xl md:text-9xl font-bold bg-clip-text text-transparent bg-linear-to-b from-yellow-700 via-yellow-500 to-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        Happy New Year!
                    </h1>
                    <p className="mt-8 text-xl md:text-3xl text-muted-foreground font-light tracking-[0.2em] uppercase">
                        Welcome to 2026
                    </p>
                </motion.div>
            </div>
        )
    }
    
    return (
        <>
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
            
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 text-center px-6"
            >
                <h2 className="text-sm md:text-base text-primary uppercase tracking-[0.4em] mb-12 font-medium">
                    រាប់ថយចូលឆ្នាំសកល ២០២៦
                </h2>
                
                <div className="flex gap-4 md:gap-12 items-center justify-center">
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <Divider />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <Divider />
                    <TimeUnit value={timeLeft.minutes} label="Mins" />
                    <Divider />
                    <TimeUnit value={timeLeft.seconds} label="Secs" />
                </div>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 text-muted-foreground text-sm tracking-widest uppercase font-light"
                >
                    Counting down to January 1st, 2026
                </motion.div>
            </motion.div>
            
            {/* Grid Pattern Backdrop inspired by the reference images */}
            <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />
        </>
    )
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center min-w-[70px] md:min-w-[120px]">
        <div className="relative">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="text-5xl md:text-8xl font-bold font-mono tracking-tighter tabular-nums text-foreground block"
                >
                    {value.toString().padStart(2, "0")}
                </motion.span>
            </AnimatePresence>
        </div>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground mt-4 font-semibold">
      {label}
    </span>
    </div>
)

const Divider = () => <div className="text-2xl md:text-4xl text-muted-foreground/30 font-light mb-8">:</div>
