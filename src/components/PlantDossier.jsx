import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Droplet, 
  Wind, 
  Thermometer, 
  Layers, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  CheckCircle2, 
  Bot, 
  Send,
  Calendar,
  Sparkles,
  Cat,
  Dog,
  Activity
} from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { askPlantDoctor } from '../services/gemini';

export default function PlantDossier({ dossier, photoUrl, onSaveToVault, isSaved }) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: `PlantAI Core active. Complete botanical profile synthesized for ${dossier.commonName}. Inquire regarding irrigation, pathology intervention, or propagation.`
    }
  ]);
  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  const toggleStep = (index) => {
    sounds.playClick();
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!questionInput.trim() || isAsking) return;

    const userText = questionInput.trim();
    setQuestionInput('');
    sounds.playClick();

    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsAsking(true);

    try {
      const reply = await askPlantDoctor(dossier, chatMessages, userText);
      sounds.playSuccessChime();
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch {
      sounds.playAlertChime();
      setChatMessages(prev => [
        ...prev, 
        { sender: 'bot', text: "Error consulting botanical core. Verify network or API key settings." }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleSave = () => {
    sounds.playSuccessChime();
    onSaveToVault();
  };

  const handleSetReminder = () => {
    sounds.playSuccessChime();
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 3000);
  };

  const isHealthy = dossier.health.status === 'Healthy';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fadeIn">
      
      {/* Massive Editorial Header Bento Card */}
      <div className="bento-card-forest rounded-[3.5rem] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-4 py-1.5 rounded-full bg-[#DCE7D5] text-[#0E2316] font-mono-brutal text-xs font-bold uppercase tracking-wider">
            CONFIDENCE: {dossier.confidenceScore}%
          </span>
          <span className="px-4 py-1.5 rounded-full bg-[#153823] text-[#96BE9E] font-mono-brutal text-xs font-bold uppercase tracking-wider border border-[#96BE9E]/30">
            FAMILY: {dossier.family}
          </span>
          <span className={`px-4 py-1.5 rounded-full font-mono-brutal text-xs font-bold uppercase tracking-wider ${
            isHealthy 
              ? 'bg-[#CEDDC5] text-[#0E2316]' 
              : 'bg-amber-400 text-[#0E2316]'
          }`}>
            {dossier.health.status} STATUS
          </span>
        </div>

        {/* Oversized Anton Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase text-[#DCE7D5] leading-[0.88]">
              {dossier.commonName}
            </h2>
            <p className="font-mono-brutal italic text-[#96BE9E] text-base sm:text-xl mt-3 uppercase tracking-wide">
              // {dossier.scientificName}
            </p>
          </div>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-full font-anton text-sm tracking-wider uppercase transition-all shadow-md active:scale-95 ${
                isSaved
                  ? 'bg-[#CEDDC5] text-[#0E2316]'
                  : 'bg-[#DCE7D5] hover:bg-white text-[#0E2316]'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'SAVED TO VAULT' : 'SAVE SPECIMEN'}</span>
            </button>

            <button
              onClick={handleSetReminder}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#153823] hover:bg-[#1F4E32] text-[#DCE7D5] border border-[#96BE9E]/40 font-anton text-sm tracking-wider uppercase transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4 text-[#96BE9E]" />
              <span>{reminderSet ? 'REMINDER LOGGED' : 'HYDRATION CYCLE'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                window.print();
              }}
              className="p-3.5 rounded-full bg-[#153823] text-[#DCE7D5] hover:bg-[#1F4E32] transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Bento Grid: Photography & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Bento: Image Frame */}
        <div className="lg:col-span-5 bento-card rounded-[3rem] p-4 border-2 border-[#0E2316]/15 flex flex-col justify-between">
          <div className="rounded-[2.5rem] overflow-hidden aspect-square bg-[#DCE7D5] relative">
            <img 
              src={photoUrl} 
              alt={dossier.commonName} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-4 left-4 bg-[#0E2316] text-[#DCE7D5] px-3.5 py-1.5 rounded-full font-mono-brutal text-[10px] font-bold uppercase tracking-wider">
              SPECIMEN // {Math.floor(dossier.confidenceScore * 100)}
            </div>
          </div>

          {/* Pet Toxicity Shield Bento */}
          <div className="mt-4 p-6 rounded-[2.5rem] bg-[#CEDDC5] border border-[#0E2316]/10 space-y-3">
            <div className="flex items-center space-x-2 text-[#0E2316]">
              <ShieldCheck className="w-5 h-5 text-[#3B6648]" />
              <h3 className="font-anton text-lg uppercase tracking-wider text-[#0E2316]">
                BIO-SAFETY & PET TOXICITY
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-2xl border-2 ${
                dossier.toxicity.toxicToCats 
                  ? 'bg-amber-100 border-amber-300 text-amber-950' 
                  : 'bg-white border-[#0E2316]/15 text-[#0E2316]'
              }`}>
                <div className="flex items-center space-x-1.5 mb-1">
                  <Cat className="w-4 h-4" />
                  <span className="font-mono-brutal text-[10px] font-bold uppercase">FELINE</span>
                </div>
                <p className="font-anton text-base uppercase">
                  {dossier.toxicity.toxicToCats ? 'TOXIC' : 'SAFE'}
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl border-2 ${
                dossier.toxicity.toxicToDogs 
                  ? 'bg-amber-100 border-amber-300 text-amber-950' 
                  : 'bg-white border-[#0E2316]/15 text-[#0E2316]'
              }`}>
                <div className="flex items-center space-x-1.5 mb-1">
                  <Dog className="w-4 h-4" />
                  <span className="font-mono-brutal text-[10px] font-bold uppercase">CANINE</span>
                </div>
                <p className="font-anton text-base uppercase">
                  {dossier.toxicity.toxicToDogs ? 'TOXIC' : 'SAFE'}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#0E2316]/80 leading-relaxed font-normal bg-white p-3.5 rounded-2xl border border-[#0E2316]/10">
              <span className="font-bold">CLINICAL NOTE: </span>
              {dossier.toxicity.details}
            </p>
          </div>
        </div>

        {/* Right Bento: Pathology Diagnostics & Triage Protocol */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* Pathology Bento Card */}
          <div className="bento-card rounded-[3rem] p-8 border-2 border-[#0E2316]/15 flex-1">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#0E2316]/10">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-[#3B6648]" />
                <h3 className="font-anton text-2xl uppercase tracking-wide text-[#0E2316]">
                  PATHOLOGY & HEALTH MATRIX
                </h3>
              </div>
              <span className={`px-4 py-1 rounded-full font-mono-brutal text-xs font-bold uppercase ${
                dossier.health.urgency === 'High' 
                  ? 'bg-rose-100 text-rose-900 border border-rose-300' 
                  : 'bg-[#CEDDC5] text-[#0E2316] border border-[#0E2316]/15'
              }`}>
                {dossier.health.urgency} URGENCY
              </span>
            </div>

            {/* Huge Vitality Score Row */}
            <div className="p-6 rounded-[2rem] bg-[#DCE7D5]/50 border-2 border-[#0E2316]/10 flex items-center justify-between mb-6">
              <div>
                <p className="font-mono-brutal text-xs font-bold uppercase tracking-wider text-[#446E52] mb-1">
                  PRIMARY DIAGNOSIS
                </p>
                <p className="font-anton text-2xl uppercase text-[#0E2316]">{dossier.health.primaryIssue}</p>
              </div>
              <div className="text-right">
                <p className="font-mono-brutal text-xs font-bold uppercase tracking-wider text-[#446E52] mb-1">
                  VITALITY
                </p>
                <p className="font-anton text-5xl text-[#0E2316]">
                  {dossier.health.score}<span className="text-xl text-[#446E52]">/100</span>
                </p>
              </div>
            </div>

            {/* Observed Physical Traits */}
            <div className="mb-6">
              <h4 className="font-mono-brutal text-xs font-bold text-[#0E2316]/70 uppercase tracking-wider mb-3">
                OBSERVED TRAITS & SYMPTOMS:
              </h4>
              <div className="flex flex-wrap gap-2">
                {dossier.health.symptoms.map((symptom, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-full bg-white border border-[#0E2316]/15 text-xs font-medium text-[#0E2316]">
                    • {symptom}
                  </span>
                ))}
              </div>
            </div>

            {/* Actionable Triage Protocol */}
            <div>
              <h4 className="font-mono-brutal text-xs font-bold text-[#0E2316]/70 uppercase tracking-wider mb-3">
                PRESCRIBED TRIAGE PROTOCOL:
              </h4>
              <div className="space-y-2.5">
                {dossier.health.treatmentPlan.map((step, idx) => (
                  <div 
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                      completedSteps[idx] 
                        ? 'bg-[#CEDDC5]/60 border-[#0E2316]/10 text-[#0E2316]/40 line-through' 
                        : 'bg-white hover:bg-[#DCE7D5]/40 border-[#0E2316]/15 text-[#0E2316]'
                    }`}
                  >
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${
                      completedSteps[idx] ? 'text-[#3B6648]' : 'text-slate-300'
                    }`} />
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Environmental Metrics Bento Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Sunlight Bento */}
        <div className="bento-card rounded-[2.5rem] p-6 border-2 border-[#0E2316]/15 space-y-3">
          <div className="flex items-center space-x-2 text-[#3B6648]">
            <Sun className="w-5 h-5" />
            <span className="font-mono-brutal text-[11px] font-bold uppercase tracking-wider text-[#0E2316]">SOLAR PROFILE</span>
          </div>
          <h4 className="font-anton text-2xl uppercase text-[#0E2316]">{dossier.vitals.sunlight.level}</h4>
          <p className="text-xs text-[#0E2316]/70 leading-relaxed font-normal">{dossier.vitals.sunlight.description}</p>
        </div>

        {/* Hydration Bento */}
        <div className="bento-card rounded-[2.5rem] p-6 border-2 border-[#0E2316]/15 space-y-3">
          <div className="flex items-center space-x-2 text-[#3B6648]">
            <Droplet className="w-5 h-5" />
            <span className="font-mono-brutal text-[11px] font-bold uppercase tracking-wider text-[#0E2316]">HYDRATION</span>
          </div>
          <h4 className="font-anton text-2xl uppercase text-[#0E2316]">{dossier.vitals.watering.frequency}</h4>
          <p className="text-xs text-[#0E2316]/70 leading-relaxed font-normal">{dossier.vitals.watering.rule}</p>
        </div>

        {/* Humidity Bento */}
        <div className="bento-card rounded-[2.5rem] p-6 border-2 border-[#0E2316]/15 space-y-3">
          <div className="flex items-center space-x-2 text-[#3B6648]">
            <Wind className="w-5 h-5" />
            <span className="font-mono-brutal text-[11px] font-bold uppercase tracking-wider text-[#0E2316]">HUMIDITY TARGET</span>
          </div>
          <h4 className="font-anton text-2xl uppercase text-[#0E2316]">{dossier.vitals.humidity.percentage}</h4>
          <p className="text-xs text-[#0E2316]/70 leading-relaxed font-normal">{dossier.vitals.humidity.description}</p>
        </div>

        {/* Thermal Bento */}
        <div className="bento-card rounded-[2.5rem] p-6 border-2 border-[#0E2316]/15 space-y-3">
          <div className="flex items-center space-x-2 text-[#3B6648]">
            <Thermometer className="w-5 h-5" />
            <span className="font-mono-brutal text-[11px] font-bold uppercase tracking-wider text-[#0E2316]">THERMAL ENVELOPE</span>
          </div>
          <h4 className="font-anton text-2xl uppercase text-[#0E2316]">{dossier.vitals.temperature.rangeC}</h4>
          <p className="text-xs text-[#0E2316]/70 leading-relaxed font-normal">Optimal: {dossier.vitals.temperature.ideal}</p>
        </div>

      </div>

      {/* Botanical Lore & Substrate */}
      <div className="bento-card rounded-[3rem] p-8 sm:p-10 border-2 border-[#0E2316]/15">
        <h3 className="font-anton text-3xl uppercase tracking-wider text-[#0E2316] mb-6">
          ECOLOGICAL HERITAGE & FACTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-[2rem] bg-[#DCE7D5]/50 border border-[#0E2316]/10">
            <p className="font-mono-brutal text-[10px] font-bold uppercase text-[#446E52] mb-1">NASA AIR PURIFICATION</p>
            <p className="font-anton text-3xl text-[#0E2316]">{dossier.botanicalProfile.airPurificationScore}% RATING</p>
          </div>
          <div className="p-5 rounded-[2rem] bg-[#DCE7D5]/50 border border-[#0E2316]/10">
            <p className="font-mono-brutal text-[10px] font-bold uppercase text-[#446E52] mb-1">GROWTH VELOCITY</p>
            <p className="font-anton text-2xl uppercase text-[#0E2316]">{dossier.botanicalProfile.growthRate}</p>
          </div>
          <div className="p-5 rounded-[2rem] bg-[#DCE7D5]/50 border border-[#0E2316]/10">
            <p className="font-mono-brutal text-[10px] font-bold uppercase text-[#446E52] mb-1">NATIVE BIOME</p>
            <p className="font-anton text-xl uppercase text-[#0E2316]">{dossier.botanicalProfile.nativeHabitat}</p>
          </div>
        </div>

        <div className="space-y-3">
          {dossier.botanicalProfile.funFacts.map((fact, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#CEDDC5] border border-[#0E2316]/10 flex items-start space-x-3 text-xs sm:text-sm text-[#0E2316]">
              <Sparkles className="w-4 h-4 text-[#3B6648] shrink-0 mt-0.5" />
              <span>{fact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Consult Plant Doctor AI (Organic Brutalist Chat) */}
      <div className="bento-card rounded-[3rem] p-8 sm:p-10 border-2 border-[#0E2316]/15">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-anton text-3xl uppercase tracking-wider text-[#0E2316]">
              CONSULT BOTANICAL CORE
            </h3>
            <p className="font-mono-brutal text-xs text-[#446E52]">
              [INTERACTIVE REASONING DIALOGUE WITH GEMINI AI]
            </p>
          </div>
        </div>

        {/* Chat History */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 mb-4">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xl p-4 rounded-[1.75rem] text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0E2316] text-[#DCE7D5] rounded-br-sm shadow-md'
                    : 'bg-[#DCE7D5]/60 border-2 border-[#0E2316]/10 text-[#0E2316] rounded-bl-sm font-medium'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isAsking && (
            <div className="flex justify-start">
              <div className="bg-[#CEDDC5] border border-[#0E2316]/15 text-[#0E2316] p-4 rounded-[1.75rem] rounded-bl-sm text-xs font-mono-brutal flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#153823] animate-ping"></span>
                <span>SYNTHESIZING BOTANICAL DIAGNOSIS...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2.5">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder={`Inquire regarding ${dossier.commonName} (e.g., propagation, yellow tips)...`}
            className="flex-1 bg-white border-2 border-[#0E2316]/20 rounded-full px-6 py-3.5 text-xs sm:text-sm text-[#0E2316] placeholder-[#0E2316]/40 focus:outline-none focus:border-[#0E2316]"
          />
          <button
            type="submit"
            disabled={!questionInput.trim() || isAsking}
            className="px-8 py-3.5 rounded-full bg-[#0E2316] hover:bg-[#153823] text-[#DCE7D5] font-anton text-sm uppercase tracking-wider flex items-center space-x-2 disabled:opacity-40 transition-all active:scale-95 shadow-md"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
