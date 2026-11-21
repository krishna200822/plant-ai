import React, { useState } from 'react';
import { 
  Sun, 
  Compass, 
  Maximize2, 
  Sliders, 
  Sparkles, 
  Check, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

const WINDOW_TYPES = [
  { id: 'south', name: 'South-Facing', baseLux: 35000, desc: 'Intense all-day solar radiation & warmth.' },
  { id: 'west', name: 'West-Facing', baseLux: 28000, desc: 'Intense afternoon heat & direct sunset rays.' },
  { id: 'east', name: 'East-Facing', baseLux: 18000, desc: 'Gentle, cool morning direct sunlight.' },
  { id: 'north', name: 'North-Facing', baseLux: 6000, desc: 'Consistent cool ambient light, zero harsh glare.' },
  { id: 'grow_light', name: 'LED Grow Lamp', baseLux: 12000, desc: 'Artificial full-spectrum photoperiod.' }
];

const FILTER_TYPES = [
  { id: 'clear', name: 'Clear Unobstructed Glass', multiplier: 1.0 },
  { id: 'sheer', name: 'Sheer Linen Curtain', multiplier: 0.55 },
  { id: 'blinds', name: 'Angled Venetian Blinds', multiplier: 0.35 }
];

export default function LightMeter({ onSelectPlantName }) {
  const [selectedWindow, setSelectedWindow] = useState(WINDOW_TYPES[1]); // West
  const [distanceMeters, setDistanceMeters] = useState(1.2);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_TYPES[0]); // Clear

  // Inverse square law calculation approximation
  const computedLux = Math.round(
    (selectedWindow.baseLux * selectedFilter.multiplier) / Math.pow(Math.max(0.6, distanceMeters), 1.6)
  );

  const footCandles = Math.round(computedLux / 10.764);

  // Category determination
  let category = 'Bright Indirect Light';
  let badgeColor = 'bg-[#E5EDE4] text-[#0E2316]';
  let matchedPlants = ['Monstera Deliciosa', 'Fiddle Leaf Fig', 'Bird of Paradise', 'Rubber Tree'];

  if (computedLux > 20000) {
    category = 'Direct Intense Sunlight';
    badgeColor = 'bg-amber-300 text-[#0E2316]';
    matchedPlants = ['Cactus & Succulents', 'Jade Plant', 'Aloe Vera', 'Ponytail Palm'];
  } else if (computedLux > 8000) {
    category = 'Bright Filtered Indirect';
    badgeColor = 'bg-[#7E9F85] text-[#0E2316]';
    matchedPlants = ['Monstera Deliciosa', 'Philodendron', 'Pothos', 'Schefflera'];
  } else if (computedLux > 2500) {
    category = 'Medium Ambient Light';
    badgeColor = 'bg-[#E5EDE4] text-[#0E2316]';
    matchedPlants = ['Peace Lily', 'Calathea Orbifolia', 'Spider Plant', 'Boston Fern'];
  } else {
    category = 'Low / Deep Shade';
    badgeColor = 'bg-[#0E2316] text-[#F4F1EA]';
    matchedPlants = ['Snake Plant (Sansevieria)', 'ZZ Plant', 'Cast Iron Plant', 'Aglaonema'];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bento-card-forest rounded-[3.5rem] p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-brutal font-bold text-[#7E9F85] uppercase tracking-wider mb-3">
            <Sun className="w-4 h-4" />
            <span>PHOTOMETRIC SOLAR ENGINE // V2.0</span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight text-[#F4F1EA] leading-none mb-3">
            AR SOLAR LUX CALCULATOR
          </h2>
          <p className="text-xs sm:text-sm text-[#F4F1EA]/80 font-normal max-w-lg leading-relaxed">
            Calibrate ambient solar foot-candles and discover the exact biological cultivars engineered to thrive in your room's natural daylight pockets.
          </p>
        </div>

        <div className="p-6 rounded-[2.5rem] bg-[#153823] border border-[#7E9F85]/30 text-right">
          <p className="font-mono-brutal text-xs text-[#7E9F85] uppercase tracking-wider mb-1">COMPUTED LUX</p>
          <p className="font-anton text-5xl sm:text-6xl text-[#F4F1EA]">{computedLux.toLocaleString()}</p>
          <p className="font-mono-brutal text-xs text-[#7E9F85] uppercase">{footCandles.toLocaleString()} FOOT-CANDLES</p>
        </div>
      </div>

      {/* Control Console Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Window & Distance Controls */}
        <div className="lg:col-span-7 bento-card rounded-[3rem] p-8 sm:p-10 border-2 border-[#0E2316]/15 space-y-6">
          <h3 className="font-anton text-2xl uppercase tracking-wide text-[#0E2316] flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#446E52]" />
            <span>CALIBRATE ROOM PARAMETERS</span>
          </h3>

          {/* Window Direction Buttons */}
          <div>
            <label className="block font-mono-brutal text-xs font-bold uppercase text-[#0E2316] mb-3">
              1. WINDOW APERTURE ORIENTATION:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {WINDOW_TYPES.map((win) => {
                const isSelected = selectedWindow.id === win.id;
                return (
                  <button
                    key={win.id}
                    onClick={() => { sounds.playClick(); setSelectedWindow(win); }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bento-card-forest border-[#0E2316] shadow-sm'
                        : 'bg-white hover:bg-[#F4F1EA] border-[#0E2316]/15 text-[#0E2316]'
                    }`}
                  >
                    <p className="font-anton text-sm uppercase">{win.name}</p>
                    <p className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-[#F4F1EA]/70' : 'text-[#7E9F85]'}`}>
                      {win.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-2 font-mono-brutal text-xs uppercase font-bold text-[#0E2316]">
              <span>2. DISTANCE FROM WINDOW:</span>
              <span className="text-[#446E52] font-black">{distanceMeters} METERS ({Math.round(distanceMeters * 3.28)} FT)</span>
            </div>
            <input 
              type="range"
              min="0.3"
              max="5.0"
              step="0.1"
              value={distanceMeters}
              onChange={(e) => setDistanceMeters(parseFloat(e.target.value))}
              className="w-full accent-[#0E2316] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-brutal text-[#7E9F85] mt-1">
              <span>0.3m (Window Sill)</span>
              <span>2.5m (Mid-Room)</span>
              <span>5.0m (Back Corner)</span>
            </div>
          </div>

          {/* Glazing Filters */}
          <div>
            <label className="block font-mono-brutal text-xs font-bold uppercase text-[#0E2316] mb-2.5">
              3. WINDOW GLAZING & SHADING:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {FILTER_TYPES.map((flt) => {
                const isSelected = selectedFilter.id === flt.id;
                return (
                  <button
                    key={flt.id}
                    onClick={() => { sounds.playClick(); setSelectedFilter(flt); }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#0E2316] text-[#F4F1EA] border-[#0E2316]'
                        : 'bg-white hover:bg-[#F4F1EA] border-[#0E2316]/15 text-[#0E2316]'
                    }`}
                  >
                    <span className="font-anton text-xs uppercase">{flt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Biological Matching Engine */}
        <div className="lg:col-span-5 bento-card-sage rounded-[3rem] p-8 sm:p-10 border-2 border-[#0E2316]/15 flex flex-col justify-between space-y-6">
          <div>
            <span className="font-mono-brutal text-xs font-bold uppercase text-[#0E2316]/70 block mb-3">
              [SOLAR EXPOSURE CLASSIFICATION]
            </span>

            <span className={`px-4 py-1.5 rounded-full font-anton text-sm uppercase tracking-wider ${badgeColor} inline-block mb-4 shadow-sm`}>
              {category}
            </span>

            <h4 className="font-anton text-2xl uppercase text-[#0E2316] mb-2">
              SPECIES ENGINEERED FOR THIS ZONE:
            </h4>
            <p className="text-xs text-[#0E2316]/70 font-normal leading-relaxed mb-6">
              Placing these specific specimens within {distanceMeters}m of your {selectedWindow.name} window will ensure optimal photosystem II electron transport and prevent leaf scorch.
            </p>

            {/* Recommended Species Pills */}
            <div className="space-y-2.5">
              {matchedPlants.map((plantName, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-[#0E2316]/15 flex items-center justify-between text-[#0E2316]"
                >
                  <span className="font-anton text-sm uppercase">{plantName}</span>
                  <span className="text-[10px] font-mono-brutal font-bold text-[#7E9F85]">
                    IDEAL MATCH
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#0E2316]/10 text-[11px] font-mono-brutal text-[#0E2316]/60">
            DLI ESTIMATE: ~{Math.round(computedLux * 0.00045 * 10) / 10} mol/m²/day
          </div>
        </div>

      </div>

    </div>
  );
}
