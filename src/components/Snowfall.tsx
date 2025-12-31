import React, {memo, useEffect, useRef} from 'react';

interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    drift: number;
    opacity: number;
    isTiny: boolean;
}

const Snowfall: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Use alpha: true to allow transparency
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;
        
        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // Reduce flake count on mobile (width < 768)
        const isMobile = width < 768;
        const densityFactor = isMobile ? 6000 : 4000;
        const snowflakeCount = Math.floor((width * height) / densityFactor);
        const snowflakes: Snowflake[] = [];
        
        const createSnowflake = (): Snowflake => {
            const radius = Math.random() * 2 + 0.5;
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                radius: radius,
                speed: Math.random() * 1.5 + 0.5,
                drift: Math.random() * 1 - 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                isTiny: radius < 1.2 // Optimization flag: tiny flakes use rects
            };
        };
        
        for (let i = 0; i < snowflakeCount; i++) {
            snowflakes.push(createSnowflake());
        }
        
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            // Cap DPR at 2.0 for performance on mobile
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };
        
        window.addEventListener('resize', resize);
        resize();
        
        const draw = () => {
            // Clear the canvas instead of drawing a background gradient
            ctx.clearRect(0, 0, width, height);
            
            snowflakes.forEach((flake) => {
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
                
                if (flake.isTiny) {
                    // Optimized drawing for small particles
                    ctx.fillRect(flake.x, flake.y, flake.radius * 2, flake.radius * 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                flake.y += flake.speed;
                flake.x += flake.drift;
                
                if (flake.y > height) {
                    flake.y = -10;
                    flake.x = Math.random() * width;
                }
                if (flake.x > width) flake.x = 0;
                if (flake.x < 0) flake.x = width;
            });
            
            animationFrameId = requestAnimationFrame(draw);
        };
        
        draw();
        
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    
    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
};

export default memo(Snowfall);
