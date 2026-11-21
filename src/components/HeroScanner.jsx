import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Scan, 
  Compass, 
  Layers 
} from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { MOCK_SPECIMENS } from '../data/mockPlants';

export default function HeroScanner({ 
  onImageSelected, 
  onSelectSample, 
  isScanning, 
  scanStep, 
  currentImage 
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        sounds.playClick();
        onImageSelected(file);
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      sounds.playClick();
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <section className="relative pt-10 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Massive Editorial Brutalist Typography */}
      <div className="mb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#CEDDC5] border border-[#0E2316]/15 text-[#0E2316] text-xs font-mono-brutal font-bold tracking-wider uppercase mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#153823] animate-ping"></span>
          <span>PISTACHIO BOTANICAL AI // V2.0</span>
        </div>

        <h1 className="font-anton text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase text-[#0E2316] leading-[0.88] mb-6">
          RAW BOTANICAL <br />
          <span className="text-[#3B6648]">INTELLIGENCE.</span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#0E2316]/15 pb-8">
          <p className="text-base sm:text-lg text-[#0E2316]/85 max-w-xl font-normal leading-relaxed">
            A high-fidelity multimodal diagnostic engine for foliar pathology, micro-nutrient triage, and ecological classification.
          </p>
          <div className="flex items-center space-x-4 font-mono-brutal text-xs uppercase tracking-wider text-[#446E52] font-bold">
            <span>[PISTACHIO CANVAS]</span>
            <span>•</span>
            <span>[8K RESOLUTION]</span>
          </div>
        </div>
      </div>

      {/* Main Bento-Adjacent Upload Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Large Scanner Viewport Bento Box */}
        <div className="lg:col-span-8 bento-card rounded-[3rem] p-6 sm:p-10 border-2 border-[#0E2316]/15 flex flex-col justify-between relative overflow-hidden bg-white shadow-[0_25px_50px_-12px_rgba(14,35,22,0.06)]">
          
          {/* Top Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono-brutal text-xs font-bold uppercase tracking-wider text-[#0E2316] flex items-center space-x-2">
              <Scan className="w-4 h-4 text-[#446E52]" />
              <span>OPTICAL SENSOR VIEWPORT</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-[#DCE7D5] text-[10px] font-mono-brutal font-bold text-[#0E2316]">
              DRAG & DROP READY
            </span>
          </div>

          {/* Hidden File Input */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileInput}
            className="hidden" 
          />

          {/* Main Dropzone / Viewport */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative min-h-[320px] sm:min-h-[380px] rounded-[2.5rem] transition-all duration-300 flex flex-col items-center justify-center p-6 text-center overflow-hidden border-2 ${
              isDragOver 
                ? 'border-[#0E2316] bg-[#CEDDC5]/70 scale-[0.99]' 
                : currentImage 
                  ? 'border-[#0E2316]/20 bg-[#DCE7D5]/40' 
                  : 'border-dashed border-[#0E2316]/20 bg-[#DCE7D5]/30 hover:bg-[#DCE7D5]/60 hover:border-[#0E2316]/40'
            }`}
          >
            {/* Display Scanned Specimen */}
            {currentImage ? (
              <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                <img 
                  src={currentImage} 
                  alt="Botanical specimen" 
                  className="max-h-[340px] w-auto object-contain rounded-2xl shadow-md border-2 border-[#0E2316]/10"
                />

                {/* Brutalist Fluid Scanning Bar */}
                {isScanning && (
                  <>
                    <div className="absolute inset-x-4 h-1.5 bg-[#0E2316] rounded-full brutal-scanner-line shadow-lg z-20"></div>
                    <div className="absolute inset-0 bg-[#446E52]/10 pointer-events-none z-10 backdrop-blur-[1px]"></div>
                    
                    {/* Status Pill in Anton */}
                    <div className="absolute bottom-6 inset-x-8 bg-[#0E2316] text-[#DCE7D5] px-6 py-4 rounded-2xl shadow-xl z-30 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#96BE9E] animate-ping"></span>
                        <span className="font-anton text-lg tracking-wider uppercase">
                          {scanStep || 'ANALYZING SPECIMEN...'}
                        </span>
                      </div>
                      <span className="font-mono-brutal text-xs text-[#96BE9E]">V2.0</span>
                    </div>
                  </>
                )}

                {/* Change photo button */}
                {!isScanning && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-4 right-4 px-4 py-2 bg-white hover:bg-[#DCE7D5] text-[#0E2316] text-xs font-mono-brutal font-bold uppercase rounded-full border-2 border-[#0E2316]/15 shadow-sm transition-all"
                  >
                    Replace Photo
                  </button>
                )}
              </div>
            ) : (
              /* Empty Canvas State */
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-md"
                >
                  <Upload className="w-8 h-8 stroke-[2]" />
                </div>

                <div>
                  <h3 className="font-anton text-2xl uppercase tracking-wide text-[#0E2316] mb-1">
                    DROP BIO-SPECIMEN IMAGE HERE
                  </h3>
                  <p className="text-xs font-mono-brutal text-[#446E52] uppercase font-bold">
                    ACCEPTS HIGH-RES JPG, PNG, WEBP • MULTIMODAL VISION
                  </p>
                </div>

                {/* Tactile Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      fileInputRef.current?.click();
                    }}
                    className="px-6 py-3 rounded-full bg-[#0E2316] hover:bg-[#153823] text-[#DCE7D5] font-anton text-sm uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>BROWSE FILES</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute('capture', 'environment');
                        fileInputRef.current.click();
                      }
                    }}
                    className="px-6 py-3 rounded-full bg-white hover:bg-[#DCE7D5] border-2 border-[#0E2316]/20 text-[#0E2316] font-anton text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4 text-[#446E52]" />
                    <span>CAMERA CAPTURE</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="mt-6 pt-4 border-t-2 border-[#0E2316]/10 flex flex-wrap items-center justify-between text-xs font-mono-brutal text-[#0E2316]/70">
            <span>[DIAGNOSTIC STATUS: ONLINE]</span>
            <span>CAPACITOR APK + MULTIMODAL GEMINI</span>
          </div>
        </div>

        {/* Right Bento Box: Brutalist Stat */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Deep Forest Bento Card */}
          <div className="bento-card-forest rounded-[3rem] p-8 flex flex-col justify-between flex-1 shadow-lg">
            <div>
              <span className="font-mono-brutal text-xs font-bold text-[#96BE9E] uppercase tracking-widest block mb-4">
                [PHYTOPATHOLOGY // 01]
              </span>
              <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-[#DCE7D5] leading-none mb-4">
                CELLULAR PRECISION.
              </h3>
              <p className="text-xs sm:text-sm text-[#DCE7D5]/80 leading-relaxed font-normal">
                Detect foliar chlorosis, fungal spore colonies, and root hypoxia in sub-second inference passes.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#DCE7D5]/20 flex items-baseline justify-between">
              <div>
                <p className="font-anton text-5xl text-[#DCE7D5]">99.2%</p>
                <p className="font-mono-brutal text-[10px] text-[#96BE9E] uppercase tracking-wider">Taxonomic Fidelity</p>
              </div>
              <Compass className="w-8 h-8 text-[#96BE9E] stroke-[1.5]" />
            </div>
          </div>

          {/* Pistachio Deep Bento Card */}
          <div className="bento-card-sage rounded-[2.5rem] p-6 border-2 border-[#0E2316]/15 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-mono-brutal text-[10px] font-bold uppercase tracking-wider text-[#0E2316]/70">ENVIRONMENT ENGINE</p>
              <h4 className="font-anton text-xl uppercase text-[#0E2316]">NASA CLEAN AIR SPECS</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

        </div>

      </div>

      {/* Reference Specimens Bento Row */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-5 px-1 border-b-2 border-[#0E2316]/10 pb-3">
          <span className="font-anton text-xl uppercase tracking-wider text-[#0E2316]">
            CURATED REFERENCE SPECIMENS // 1-CLICK TEST DRIVE
          </span>
          <span className="font-mono-brutal text-xs text-[#446E52] font-bold">[CLICK TO LOAD]</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_SPECIMENS.map((specimen, idx) => (
            <button
              key={specimen.id}
              onClick={() => {
                sounds.playClick();
                onSelectSample(specimen);
              }}
              className="group text-left bento-card bento-interactive rounded-[2rem] p-4 border-2 border-[#0E2316]/15 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-anton text-lg text-[#0E2316]/40 group-hover:text-[#0E2316] transition-colors">
                    0{idx + 1}
                  </span>
                  <span className={`text-[10px] font-mono-brutal font-bold px-2 py-0.5 rounded-full uppercase ${
                    specimen.dossier.health.status === 'Healthy'
                      ? 'bg-[#CEDDC5] text-[#0E2316]'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {specimen.dossier.health.status}
                  </span>
                </div>

                <div className="h-32 w-full rounded-2xl overflow-hidden bg-[#DCE7D5] mb-3">
                  <img 
                    src={specimen.thumbnail} 
                    alt={specimen.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                <h4 className="font-anton text-lg uppercase text-[#0E2316] truncate group-hover:text-[#446E52] transition-colors">
                  {specimen.name}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#0E2316]/10">
                <p className="text-[11px] font-mono-brutal italic text-[#446E52] truncate">
                  {specimen.dossier.scientificName}
                </p>
                <ArrowRight className="w-3.5 h-3.5 text-[#0E2316] group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}
