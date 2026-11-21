import React, { useState } from 'react';
import { 
  Sprout, 
  Volume2, 
  VolumeX, 
  Key, 
  Archive, 
  Smartphone, 
  ArrowUpRight 
} from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { getStoredApiKeys } from '../services/gemini';

export default function Navbar({ 
  onOpenVault, 
  onOpenApiKey, 
  onOpenApkGuide, 
  vaultCount = 0 
}) {
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);

  const handleToggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  const keysCount = getStoredApiKeys().length;

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-full border-2 border-[#0E2316]/10 shadow-[0_10px_30px_rgba(14,35,22,0.06)] px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Brand Mark */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 stroke-[2]" />
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="font-anton text-2xl tracking-wide uppercase text-[#0E2316]">
              PLANTAI
            </span>
            <span className="text-[10px] font-mono-brutal font-bold tracking-widest text-[#3B6648] uppercase hidden sm:inline">
              [GEMINI 3.6 FLASH]
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Audio Synthesizer */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? "Audio: Active" : "Audio: Muted"}
            className="p-2.5 rounded-full border border-[#0E2316]/15 hover:border-[#0E2316] hover:bg-[#CEDDC5]/60 transition-all text-[#0E2316]"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#153823]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#446E52]" />
            )}
          </button>

          {/* Gemini 3.6 Flash Failover Pool Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenApiKey();
            }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-mono-brutal font-bold uppercase tracking-wider border-2 transition-all ${
              keysCount > 0
                ? 'bg-[#CEDDC5] text-[#0E2316] border-[#0E2316]/20 hover:border-[#0E2316]'
                : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {keysCount > 0 ? `GEMINI 3.6 // ${keysCount} ACTIVE` : 'SET 3.6 FLASH KEYS'}
            </span>
            {keysCount > 1 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#0E2316] text-[#DCE7D5] text-[9px]">
                FAILOVER
              </span>
            )}
          </button>

          {/* Collection Vault */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenVault();
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-mono-brutal font-bold uppercase tracking-wider bg-white border-2 border-[#0E2316]/15 hover:border-[#0E2316] text-[#0E2316] transition-all"
          >
            <Archive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">VAULT</span>
            <span className="px-2 py-0.2 rounded-full bg-[#0E2316] text-[#DCE7D5] text-[10px]">
              {vaultCount}
            </span>
          </button>

          {/* Android APK */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenApkGuide();
            }}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-xs font-anton tracking-wider uppercase bg-[#0E2316] hover:bg-[#153823] text-[#DCE7D5] shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>GET APK</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>

        </div>

      </div>
    </header>
  );
}
