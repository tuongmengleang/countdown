import {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import 'moment/locale/km'
import '../assets/styles/countdown.css';
// import {Fireworks} from "./Firework.tsx";
import {Fireworks} from '@fireworks-js/react'
import {AnimatePresence, motion} from "framer-motion";
import {GoldStyle, GoldText} from "./GoldText.tsx";

// Translation Map for Labels
const LABELS = {
    days: 'ថ្ងៃ',      // Days
    hours: 'ម៉ោង',     // Hours
    minutes: 'នាទី',   // Minutes
    seconds: 'វិនាទី'  // Seconds
}

// Helper: Converts "12" -> "១២"
const toKhmerDigits = (num) => {
    return String(num).replace(/\d/g, (d) => '០១២៣៤៥៦៧៨៩'[d]);
};

// 1. Single Digit Component (The Animation Engine)
const AnimatedDigit = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [prevValue, setPrevValue] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const timeoutRef = useRef(null);
    
    useEffect(() => {
        if (value !== displayValue) {
            setPrevValue(displayValue);
            setDisplayValue(value);
            setIsAnimating(true);
            
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsAnimating(false);
                setPrevValue(null);
            }, 400); // 400ms match CSS
        }
    }, [value, displayValue]);
    
    return (
        <div className="cd__digit-window">
            {isAnimating && prevValue !== null && (
                <div className="cd__digit-content animate-exit">{prevValue}</div>
            )}
            <div className={`cd__digit-content ${isAnimating ? 'animate-enter' : ''}`}>
                {displayValue}
            </div>
        </div>
    );
};

// 2. Unit Component (e.g. "05" Minutes)
const CountdownUnit = ({ label, value, isZoomed }) => {
    // Step 1: Format as standard "05", "12"
    const standardValue = String(value).padStart(2, '0');
    
    // Step 2: Convert to Khmer "០៥", "១២"
    const khmerValue = toKhmerDigits(standardValue);
    
    // Step 3: Split into array ["១", "២"]
    const digits = khmerValue.split('');
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 1,
                scale: 1,
                fontSize: isZoomed ? 'clamp(7rem, 20vw, 14rem)' : 'clamp(4rem, 7vw, 9rem)',
            }}
            exit={{ opacity: 0, scale: 0, width: 0, margin: 0 }}
            transition={{
                layout: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                fontSize: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }, // Smooth easing
                scale: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            }}
            className="relative font-bold bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer select-none"
        >
            <div className="flex items-center gap-1 tracking-wider min-w-[70px] md:min-w-[120px]">
                {digits.map((digit, index) => (
                    <AnimatedDigit key={`${label}-${index}`} value={digit} />
                ))}
            </div>
            {/* Smoothly hide label when zoomed */}
            <motion.div
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                className="text-center text-sm text-gray-400 font-medium"
            >
                {label}
            </motion.div>
        </motion.div>
    );
};

// 3. Main Component
export const NewYearCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [isComplete, setIsComplete] = useState(false);
    const [isZoomMode, setIsZoomMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true); // Prevent hydration mismatch if using Next.js
        moment.locale('km')
        
            // const targetDate = moment().add(20, 'seconds');
        const calculateTime = () => {
            const now = moment();
            // const targetDate = moment("2025-12-31 20:50:00");
            // 1. Get current year (e.g., 2025)
            // 2. Add 1 to get next year (e.g., 2026)
            // 3. Create a moment object for Jan 1st of that next year
            const nextYear = now.year() + 1;
            const targetDate = moment(`${nextYear}-01-01 00:00:00`, "YYYY-MM-DD HH:mm:ss");
            
            const diff = targetDate.diff(now);
            const totalSeconds = diff / 1000;
            
            if (diff <= 0) {
                setIsComplete(true);
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }
            
            // Trigger zoom mode if less than 60 seconds
            setIsZoomMode(totalSeconds < 15);
            
            const duration = moment.duration(diff);
            
            setTimeLeft({
                d: Math.floor(duration.asDays()),
                h: duration.hours(),
                m: duration.minutes(),
                s: duration.seconds(),
            });
        };
        
        // Run immediately
        calculateTime();
        
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    
    if (!mounted) return null;
    
    if (isComplete) {
        return (
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/*<Fireworks />*/}
                <Fireworks
                    options={{
                        opacity: 0.5,
                    }}
                    style={{
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        position: 'fixed',
                    }}
                />
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="relative z-10 text-center px-4"
                >
                    <GoldText config={
                        {
                            content: `Happy New Year ${moment().year() + 1}!`,
                            style: GoldStyle.THREE_D,
                            fontSize: 56,
                            fontWeight: '900',
                            letterSpacing: 2
                        }
                    } />
                    <h1 className="hidden text-6xl md:text-9xl font-bold bg-clip-text text-transparent bg-linear-to-b from-yellow-700 via-yellow-500 to-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        Happy New Year!
                    </h1>
                    <p className="mt-8 text-xl md:text-3xl text-muted-foreground font-light tracking-[0.2em] uppercase">
                        Welcome to {moment().year() + 1}
                    </p>
                </motion.div>
            </div>
        )
    }
    
    return (
        <>
            {/* Background Glows */}
            <div className="hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-700/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="hidden absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-pink-300/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
            
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 text-center px-6"
            >
                <GoldText config={{
                    content: `COUNTDOWN TO ${moment().year() + 1}`,
                    style: GoldStyle.METALLIC,
                    fontWeight: '900',
                    letterSpacing: 2
                }} />
            </motion.div>
            
            <motion.div
                key="countdown"
                layout
                className="flex flex-wrap gap-4 md:gap-12 items-center justify-center px-4"
            >
                <AnimatePresence mode="popLayout">
                    {/* Days (Only show if > 0 and NOT zoomed) */}
                    {!isZoomMode && timeLeft.d > 0 && (
                        <motion.div key="days-group" className="flex items-center gap-4 md:gap-12">
                            <CountdownUnit label={LABELS.days} value={timeLeft.d} />
                            <Divider />
                        </motion.div>
                    )}
                    
                    {/* Hours (Hide when zoomed) */}
                    {!isZoomMode && (
                        <motion.div key="hours-group" className="flex items-center gap-4 md:gap-12">
                            <CountdownUnit label={LABELS.hours} value={timeLeft.h} />
                            <Divider />
                        </motion.div>
                    )}
                    
                    {/* Minutes (Hide when zoomed) */}
                    {!isZoomMode && (
                        <motion.div key="minutes-group" className="flex items-center gap-4 md:gap-12">
                            <CountdownUnit label={LABELS.minutes} value={timeLeft.m} />
                            <Divider />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* SECONDS: Always Visible, scales up when zoomed */}
                <CountdownUnit
                    label={LABELS.seconds}
                    value={timeLeft.s}
                    isZoomed={isZoomMode}
                />
            </motion.div>
        </>
    );
};

const Divider = () => <div className="text-2xl md:text-4xl text-muted-foreground/30 font-light mb-8">:</div>

