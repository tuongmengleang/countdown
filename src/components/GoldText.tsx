import React from 'react';

export enum GoldStyle {
    METALLIC = 'Metallic',
    SHIMMER = 'Shimmer',
    LIQUID = 'Liquid',
    THREE_D = '3D Beveled',
    GLITTER = 'Glitter Dust',
    ANTIQUE = 'Antique Brass'
}

export interface TextConfig {
    content: string;
    style: GoldStyle;
    fontSize: number;
    fontWeight: string;
    letterSpacing: number;
}


interface GoldTextProps {
    config: TextConfig;
}

export const GoldText: React.FC<GoldTextProps> = ({ config }) => {
    const { content, style, fontWeight, letterSpacing } = config;
    
    const getStyleClasses = () => {
        switch (style) {
            case GoldStyle.METALLIC:
                return 'bg-gradient-to-b from-[#f7e38e] via-[#e5c158] to-[#9c711a] bg-clip-text text-transparent drop-shadow-md';
            case GoldStyle.SHIMMER:
                return 'bg-gradient-to-r from-[#9c711a] via-[#f7e38e] to-[#9c711a] bg-clip-text text-transparent animate-shimmer animate-gold-shine';
            case GoldStyle.LIQUID:
                return 'bg-gradient-to-br from-[#ffd700] via-[#b8860b] via-[#daa520] to-[#ffd700] bg-clip-text text-transparent filter blur-[0.3px] brightness-125';
            case GoldStyle.THREE_D:
                return 'text-[#f7e38e] [text-shadow:0_1px_0_#9c711a,0_2px_0_#8c611a,0_3px_0_#7c511a,0_4px_0_#6c411a,0_5px_0_#5c311a,0_6px_1px_rgba(0,0,0,.1),0_0_5px_rgba(0,0,0,.1),0_1px_3px_rgba(0,0,0,.3),0_3px_5px_rgba(0,0,0,.2),0_5px_10px_rgba(0,0,0,.25),0_10px_10px_rgba(0,0,0,.2),0_20px_20px_rgba(0,0,0,.15)]';
            case GoldStyle.GLITTER:
                return 'bg-[url("https://www.transparenttextures.com/patterns/pinstripe.png")] bg-repeat bg-clip-text text-transparent bg-[#e5c158] drop-shadow-[0_0_8px_rgba(229,193,88,0.8)]';
            case GoldStyle.ANTIQUE:
                return 'bg-gradient-to-tr from-[#5d4037] via-[#d4af37] to-[#8d6e63] bg-clip-text text-transparent opacity-90 drop-shadow-lg';
            default:
                return '';
        }
    };
    
    const dynamicStyles: React.CSSProperties = {
        // fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        letterSpacing: `${letterSpacing}px`,
        lineHeight: '1.2',
        transition: 'all 0.3s ease-in-out',
    };
    
    return (
        <div className="relative flex items-center justify-center p-8 text-center select-none overflow-hidden">
            {/* Background soft glow */}
            <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full scale-50"></div>
            
            <h1 className={`${getStyleClasses()} break-words max-w-full text-[clamp(1rem,5vw,2rem)]`} style={dynamicStyles}>
                {content || "GOLD"}
            </h1>
        </div>
    );
};
