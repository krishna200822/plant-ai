import React, { useState } from 'react';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  FlaskConical, 
  Activity, 
  ShieldAlert,
  Sparkles,
  Bot
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

const CLINIC_SYMPTOMS = [
  {
    id: 'yellowing',
    title: 'Yellowing Foliage (Chlorosis)',
    anatomy: 'Lower & Mature Leaves',
    commonCauses: 'Overwatering, Nitrogen deficiency, or Poor drainage aeration.',
    urgency: 'Medium',
    prognosis: 'Recovery in 10-14 days with corrected watering.',
    remedySteps: [
      'Cease watering immediately. Probe soil with a wooden skewer to gauge deep moisture.',
      'Inspect bottom drainage holes for trapped stagnant water saucers.',
      'If soil is clay-heavy, repot into a chunky 40% perlite + 60% coco coir substrate.',
      'Feed with a balanced diluted 10-10-10 organic nitrogen fertilizer once soil dries.'
    ]
  },
  {
    id: 'crispy_edges',
    title: 'Crispy Brown Leaf Tips & Margins',
    anatomy: 'Foliage Periphery',
    commonCauses: 'Dry AC air, Low humidity (<40%), Tap water fluorides or mineral salts.',
    urgency: 'Low',
    prognosis: 'New leaves will emerge healthy once ambient humidity is elevated.',
    remedySteps: [
      'Switch from hard municipal tap water to filtered, distilled, or rainwater.',
      'Group plants together to establish a microclimate humidity buffer.',
      'Place a shallow pebble tray filled with water beneath the pot (keep base above water level).',
      'Prune only the completely dead brown tips using sanitized shears (leave a tiny sliver of brown to prevent fresh tissue wound).'
    ]
  },
  {
    id: 'powdery_mildew',
    title: 'White Powdery Coating on Foliage',
    anatomy: 'Leaf Surfaces & Petioles',
    commonCauses: 'Podosphaera fungal spores thriving in stagnant humid air with poor air circulation.',
    urgency: 'High',
    prognosis: 'Fungal colonies halted in 5-7 days with antifungal application.',
    remedySteps: [
      'Quarantine the plant immediately to protect neighboring houseplants from airborne spores.',
      'Mix 1 tsp cold-pressed neem oil + 1/2 tsp mild castile soap into 1 liter warm water.',
      'Spray tops and undersides of leaves generously in the evening away from direct sun.',
      'Position a small oscillating fan nearby on low setting to restore gentle airflow.'
    ]
  },
  {
    id: 'root_rot',
    title: 'Mushy Black Stems & Stagnant Soil Odor',
    anatomy: 'Roots & Crown',
    commonCauses: 'Pythium/Phytophthora anaerobic fungal pathogen from severe overwatering.',
    urgency: 'Critical',
    prognosis: 'Critical intervention needed within 48 hours to save vascular system.',
    remedySteps: [
      'Carefully unpot the plant and gently wash away all soggy contaminated soil from roots.',
      'Use sterilized scissors to amputate all black, slimy, hollow, or foul-smelling roots.',
      'Submerge remaining healthy firm white roots in a 1 part 3% hydrogen peroxide to 3 parts water bath for 5 minutes.',
      'Repot into fresh, bone-dry potting mix with extra pumice and DO NOT water for 3 days.'
    ]
  },
  {
    id: 'spider_mites',
    title: 'Fine Webbing & Pale Leaf Stippling',
    anatomy: 'Leaf Undersides',
    commonCauses: 'Tetranychidae spider mites thriving in hot, dry, dusty indoor environments.',
    urgency: 'High',
    prognosis: 'Eradication within 14 days with repeat physical washes.',
    remedySteps: [
      'Take plant to shower or garden hose and forcefully wash down foliage with room-temperature water.',
      'Wipe down every leaf and stem with 70% isopropyl alcohol on a cotton pad.',
      'Apply insecticidal soap or horticultural oil weekly for 3 consecutive weeks to break the egg cycle.',
      'Elevate ambient humidity above 60% to suppress mite reproduction.'
    ]
  }
];

export default function PlantClinic({ onConsultDoctor }) {
  const [selectedSymptom, setSelectedSymptom] = useState(CLINIC_SYMPTOMS[0]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bento-card-forest rounded-[3.5rem] p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-brutal font-bold text-[#7E9F85] uppercase tracking-wider mb-3">
            <Stethoscope className="w-4 h-4" />
            <span>PHYTOPATHOLOGY EMERGENCY CLINIC // V2.0</span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight text-[#F4F1EA] leading-none mb-3">
            PLANT HOSPITAL & TRIAGE
          </h2>
          <p className="text-xs sm:text-sm text-[#F4F1EA]/80 font-normal max-w-lg leading-relaxed">
            Select physical symptoms observed on your plant to generate immediate organic triage prescriptions and natural pathogen remedies.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onConsultDoctor(`I need emergency diagnosis for: ${selectedSymptom.title}`);
          }}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#F4F1EA] hover:bg-white text-[#0E2316] font-anton text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 shrink-0"
        >
          <Bot className="w-4 h-4" />
          <span>ASK LIVE BOTANICAL DOCTOR</span>
        </button>
      </div>

      {/* Main Two-Column Triage Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Symptom Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-2 mb-2 font-mono-brutal text-xs uppercase text-[#0E2316]/70 font-bold">
            <span>OBSERVED SYMPTOM PATTERN</span>
            <span>[SELECT ONE]</span>
          </div>

          {CLINIC_SYMPTOMS.map((symptom) => {
            const isSelected = selectedSymptom.id === symptom.id;

            return (
              <div
                key={symptom.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedSymptom(symptom);
                }}
                className={`p-5 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bento-card-forest border-[#0E2316] shadow-md scale-[1.01]'
                    : 'bg-white hover:bg-[#F4F1EA] border-[#0E2316]/10 text-[#0E2316]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono-brutal font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    isSelected ? 'bg-[#7E9F85] text-[#0E2316]' : 'bg-[#E5EDE4] text-[#0E2316]'
                  }`}>
                    {symptom.anatomy}
                  </span>

                  <span className={`text-[10px] font-mono-brutal font-bold uppercase ${
                    symptom.urgency === 'Critical'
                      ? 'text-rose-500 font-black'
                      : symptom.urgency === 'High'
                        ? 'text-amber-500 font-bold'
                        : 'text-[#7E9F85]'
                  }`}>
                    {symptom.urgency} URGENCY
                  </span>
                </div>

                <h4 className="font-anton text-xl uppercase tracking-wide">
                  {symptom.title}
                </h4>

                <p className={`text-xs line-clamp-1 font-normal ${
                  isSelected ? 'text-[#F4F1EA]/70' : 'text-[#0E2316]/60'
                }`}>
                  {symptom.commonCauses}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Triage Prescription Bento */}
        <div className="lg:col-span-7 bento-card rounded-[3rem] p-8 sm:p-10 border-2 border-[#0E2316]/15 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#0E2316]/10 mb-6">
              <span className="font-mono-brutal text-xs font-bold uppercase text-[#7E9F85]">
                [CLINICAL TRIAGE PRESCRIPTION]
              </span>
              <span className={`px-3 py-1 rounded-full font-mono-brutal text-xs font-bold uppercase ${
                selectedSymptom.urgency === 'Critical'
                  ? 'bg-rose-100 text-rose-900'
                  : 'bg-[#E5EDE4] text-[#0E2316]'
              }`}>
                {selectedSymptom.urgency} INTERVENTION
              </span>
            </div>

            <h3 className="font-anton text-3xl sm:text-4xl uppercase text-[#0E2316] mb-2">
              {selectedSymptom.title}
            </h3>

            <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#0E2316]/10 mb-6">
              <p className="font-mono-brutal text-xs font-bold text-[#7E9F85] uppercase mb-1">PROGNOSIS:</p>
              <p className="text-sm font-semibold text-[#0E2316]">{selectedSymptom.prognosis}</p>
            </div>

            {/* Step by step remedies */}
            <div>
              <h4 className="font-mono-brutal text-xs font-bold text-[#0E2316] uppercase tracking-wider mb-3 flex items-center space-x-2">
                <FlaskConical className="w-4 h-4 text-[#446E52]" />
                <span>STEP-BY-STEP RECOVERY PROTOCOL:</span>
              </h4>

              <div className="space-y-3">
                {selectedSymptom.remedySteps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border-2 border-[#0E2316]/10 flex items-start space-x-3 text-xs sm:text-sm text-[#0E2316]">
                    <span className="font-anton text-base text-[#446E52] shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <span className="leading-relaxed font-normal">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#0E2316]/10 flex items-center justify-between">
            <span className="text-xs font-mono-brutal text-[#7E9F85] uppercase">
              ORGANIC BRUTALIST HOME PHARMACOPOEIA
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                onConsultDoctor(`How can I treat ${selectedSymptom.title} using home supplies?`);
              }}
              className="text-xs font-anton uppercase text-[#0E2316] hover:text-[#446E52] flex items-center space-x-1"
            >
              <span>DISCUSS WITH AI BOTANIST</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
