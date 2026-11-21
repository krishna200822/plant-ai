import React, { useState } from 'react';
import { X, Smartphone, Check, Copy, ArrowUpRight } from 'lucide-react';
import { sounds } from '../services/soundEffects';

export default function ApkGuideModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, index) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const steps = [
    {
      title: "01 // COMPILE WEB ASSETS & SYNC CAPACITOR",
      description: "Builds the high-resolution interface and synchronizes it into the native Android module.",
      command: "npm run build && npx cap sync android"
    },
    {
      title: "02 // ASSEMBLE STANDALONE ANDROID APK",
      description: "Invokes Gradle daemon to compile an installable APK package.",
      command: "cd android && ./gradlew assembleDebug"
    },
    {
      title: "03 // COMPILED APK DESTINATION",
      description: "Your compiled APK will be generated at this exact path for USB sideloading or sharing:",
      command: "android/app/build/outputs/apk/debug/app-debug.apk"
    },
    {
      title: "04 // OPTIONAL: LAUNCH ANDROID STUDIO",
      description: "Opens the native project directly in Google Android Studio for device debugging.",
      command: "npx cap open android"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2316]/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#DCE7D5] rounded-[3.5rem] p-8 sm:p-10 border-2 border-[#0E2316] shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-[#0E2316]/10 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center">
              <Smartphone className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-anton text-2xl uppercase tracking-wider text-[#0E2316]">
                ANDROID APK PIPELINE
              </h3>
              <p className="font-mono-brutal text-[10px] text-[#3B6648] uppercase font-bold">
                [CAPACITOR SINGLE CODEBASE // ANDROID]
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

        {/* Intro */}
        <p className="text-xs sm:text-sm text-[#0E2316]/85 leading-relaxed mb-6 font-normal">
          PlantAI utilizes a unified single codebase architecture. The complete native Android project has already been initialized in the <code className="font-mono-brutal bg-white px-1.5 py-0.5 rounded border border-[#0E2316]/10 text-[#0E2316]">android/</code> directory.
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-6">
          {steps.map((step, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-white border-2 border-[#0E2316]/10 space-y-2">
              <h4 className="font-anton text-sm uppercase tracking-wide text-[#0E2316]">
                {step.title}
              </h4>
              <p className="text-xs text-[#0E2316]/70 font-normal">
                {step.description}
              </p>

              <div className="flex items-center justify-between bg-[#CEDDC5]/60 rounded-full px-4 py-2.5 border border-[#0E2316]/15 font-mono-brutal text-xs text-[#0E2316] overflow-x-auto">
                <span className="truncate mr-2 font-bold">{step.command}</span>
                <button
                  onClick={() => copyToClipboard(step.command, idx)}
                  className="p-1 rounded text-slate-600 hover:text-[#0E2316] shrink-0"
                  title="Copy command"
                >
                  {copiedIndex === idx ? (
                    <span className="flex items-center space-x-1 text-[#3B6648] text-[10px] font-mono-brutal font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dismiss Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-8 py-3 rounded-full bg-[#0E2316] hover:bg-[#153823] text-[#DCE7D5] font-anton text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            DISMISS
          </button>
        </div>

      </div>
    </div>
  );
}
