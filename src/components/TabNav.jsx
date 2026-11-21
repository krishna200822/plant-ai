import React from 'react';
import { 
  Scan, 
  Sprout, 
  Stethoscope, 
  Sun, 
  Bot, 
  BookOpen 
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

export const TABS = [
  { id: 'scanner', label: 'BIO-SCANNER', icon: Scan, tag: 'AI VISION' },
  { id: 'greenhouse', label: 'MY GREENHOUSE', icon: Sprout, tag: 'TRACKER' },
  { id: 'clinic', label: 'PLANT CLINIC', icon: Stethoscope, tag: 'TRIAGE' },
  { id: 'lightmeter', label: 'LIGHT METER', icon: Sun, tag: 'LUX AR' },
  { id: 'doctor', label: 'AI DOCTOR', icon: Bot, tag: 'CHAT' },
  { id: 'atlas', label: 'SPECIES ATLAS', icon: BookOpen, tag: 'ENCYCLO' },
];

export default function TabNav({ activeTab, onChangeTab, greenhouseCount = 0 }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
      <div className="bg-white/80 backdrop-blur-md rounded-full p-1.5 border-2 border-[#0E2316]/10 shadow-sm flex items-center justify-start overflow-x-auto no-scrollbar gap-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                onChangeTab(tab.id);
              }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-anton text-xs tracking-wider uppercase transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-[#0E2316] text-[#F4F1EA] shadow-md'
                  : 'text-[#0E2316]/70 hover:text-[#0E2316] hover:bg-[#E5EDE4]/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7E9F85]' : 'text-[#0E2316]/60'}`} />
              <span>{tab.label}</span>
              {tab.id === 'greenhouse' && greenhouseCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono-brutal ${
                  isActive ? 'bg-[#7E9F85] text-[#0E2316]' : 'bg-[#E5EDE4] text-[#0E2316]'
                }`}>
                  {greenhouseCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
