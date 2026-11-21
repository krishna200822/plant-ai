import React from 'react';
import { X, Trash2, Sprout, ArrowRight } from 'lucide-react';
import { sounds } from '../services/soundEffects';

export default function GreenhouseVault({ 
  isOpen, 
  onClose, 
  vault, 
  onSelectSpecimen, 
  onDeleteSpecimen,
  onClearVault 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0E2316]/40 backdrop-blur-sm animate-fadeIn">
      
      {/* Slide-over panel */}
      <div className="w-full max-w-md h-full bg-[#DCE7D5] border-l-2 border-[#0E2316]/20 p-8 flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-[#0E2316]/10 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-anton text-2xl uppercase tracking-wider text-[#0E2316]">
                BIO-VAULT ARCHIVE
              </h3>
              <p className="font-mono-brutal text-[10px] text-[#3B6648] uppercase font-bold">
                [LOCAL INDEX: {vault.length} SPECIMENS]
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-full border border-[#0E2316]/20 text-[#0E2316] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {vault.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#0E2316]/50 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#CEDDC5] flex items-center justify-center text-[#0E2316]">
                <Sprout className="w-8 h-8" />
              </div>
              <p className="font-anton text-xl uppercase text-[#0E2316]">VAULT EMPTY</p>
              <p className="text-xs font-mono-brutal text-[#3B6648] max-w-xs uppercase font-bold">
                Save any analyzed specimen to store its organic dossier in this local archive.
              </p>
            </div>
          ) : (
            vault.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-3xl bg-white border-2 border-[#0E2316]/10 hover:border-[#0E2316] shadow-sm flex items-center justify-between gap-3 transition-all"
              >
                <div 
                  onClick={() => {
                    sounds.playClick();
                    onSelectSpecimen(item);
                    onClose();
                  }}
                  className="flex items-center space-x-3.5 flex-1 cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.photoUrl}
                    alt={item.dossier?.commonName || item.commonName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#0E2316]/10 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-anton text-lg uppercase text-[#0E2316] truncate group-hover:text-[#3B6648] transition-colors">
                      {item.nickname || item.dossier?.commonName || item.commonName}
                    </h4>
                    <p className="text-[11px] font-mono-brutal text-[#3B6648] italic truncate">
                      {item.dossier?.scientificName || 'Botanical Cultivar'}
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] font-mono-brutal font-bold text-[#0E2316]/60 mt-1">
                      <span className={`px-2 py-0.2 rounded-full uppercase ${
                        item.dossier?.health?.status === 'Healthy' 
                          ? 'bg-[#CEDDC5] text-[#0E2316]' 
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {item.dossier?.health?.status || 'Active'}
                      </span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onDeleteSpecimen(item.id);
                  }}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove specimen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {vault.length > 0 && (
          <div className="pt-4 border-t-2 border-[#0E2316]/10 flex justify-between items-center text-xs font-mono-brutal">
            <span className="text-[#3B6648] uppercase font-bold">[STORED LOCALLY]</span>
            <button
              onClick={() => {
                if (window.confirm("Purge all specimens from the local bio-vault?")) {
                  sounds.playAlertChime();
                  onClearVault();
                }
              }}
              className="text-rose-600 hover:underline font-bold uppercase"
            >
              PURGE ALL
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
