import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TabNav from './components/TabNav';
import HeroScanner from './components/HeroScanner';
import PlantDossier from './components/PlantDossier';
import GreenhouseManager from './components/GreenhouseManager';
import PlantClinic from './components/PlantClinic';
import LightMeter from './components/LightMeter';
import AiDoctorChat from './components/AiDoctorChat';
import SpeciesAtlas from './components/SpeciesAtlas';
import GreenhouseVault from './components/GreenhouseVault';
import ApiKeyModal from './components/ApiKeyModal';
import ApkGuideModal from './components/ApkGuideModal';
import { sounds } from './services/soundEffects';
import { fileToBase64, analyzePlantImage, hasApiKey } from './services/gemini';
import { MOCK_SPECIMENS } from './data/mockPlants';

const VAULT_STORAGE_KEY = 'plantai_greenhouse_vault';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [currentImage, setCurrentImage] = useState(null);
  const [currentDossier, setCurrentDossier] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [doctorInitialPrompt, setDoctorInitialPrompt] = useState('');
  
  const [vault, setVault] = useState(() => {
    try {
      const stored = localStorage.getItem(VAULT_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'specimen-seed-1',
          nickname: 'Monty',
          commonName: 'Monstera Deliciosa',
          photoUrl: MOCK_SPECIMENS[0].thumbnail,
          dossier: MOCK_SPECIMENS[0].dossier,
          waterIntervalDays: 7,
          location: 'Living Room East Window',
          lastWatered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          timestamp: new Date().toISOString()
        },
        {
          id: 'specimen-seed-2',
          nickname: 'Viper',
          commonName: 'Snake Plant',
          photoUrl: MOCK_SPECIMENS[2].thumbnail,
          dossier: MOCK_SPECIMENS[2].dossier,
          waterIntervalDays: 21,
          location: 'Bedroom Shelf',
          lastWatered: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
          timestamp: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [isVaultDrawerOpen, setIsVaultDrawerOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isApkGuideModalOpen, setIsApkGuideModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
  }, [vault]);

  // Handle uploaded image file
  const handleImageSelected = async (file) => {
    try {
      sounds.playClick();
      const { dataUrl, base64, mimeType } = await fileToBase64(file);
      setCurrentImage(dataUrl);
      setIsScanning(true);
      setCurrentDossier(null);

      setScanStep('CALIBRATING CHROMATIC DENSITY...');
      await new Promise(r => setTimeout(r, 500));

      setScanStep('EXTRACTING FOLIAR MORPHOLOGY...');
      sounds.playClick();
      await new Promise(r => setTimeout(r, 600));

      setScanStep('MAPPING PHYTOPATHOLOGY MARKERS...');
      sounds.playClick();
      await new Promise(r => setTimeout(r, 600));

      setScanStep('CROSS-REFERENCING TAXONOMIC CORE...');
      sounds.playClick();

      let dossier = null;

      if (hasApiKey()) {
        try {
          dossier = await analyzePlantImage(base64, mimeType);
        } catch (apiErr) {
          console.warn("API call failed, using fallback:", apiErr);
          dossier = {
            ...MOCK_SPECIMENS[0].dossier,
            _isFallback: true,
            _fallbackReason: apiErr.message || 'API connection failed'
          };
          sounds.playAlertChime();
        }
      } else {
        await new Promise(r => setTimeout(r, 500));
        dossier = {
          ...MOCK_SPECIMENS[0].dossier,
          _isFallback: true,
          _fallbackReason: 'NO_API_KEY'
        };
      }

      setScanStep('DOSSIER SYNTHESIZED.');
      await new Promise(r => setTimeout(r, 350));

      setCurrentDossier(dossier);
      setIsScanning(false);
      sounds.playSuccessChime();

      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight * 0.7,
          behavior: 'smooth'
        });
      }, 150);

    } catch (err) {
      console.error(err);
      setIsScanning(false);
      sounds.playAlertChime();
      alert("Failed to analyze image. Please ensure it's a valid specimen picture.");
    }
  };

  const handleSelectSample = async (sample) => {
    setCurrentImage(sample.thumbnail);
    setIsScanning(true);
    setCurrentDossier(null);

    setScanStep(`RETRIEVING ${sample.name.toUpperCase()} PROFILE...`);
    await new Promise(r => setTimeout(r, 600));

    setCurrentDossier(sample.dossier);
    setIsScanning(false);
    sounds.playSuccessChime();

    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight * 0.7,
        behavior: 'smooth'
      });
    }, 150);
  };

  const isCurrentSaved = currentDossier
    ? vault.some(v => v.dossier?.commonName === currentDossier.commonName || v.commonName === currentDossier.commonName)
    : false;

  const handleSaveToVault = () => {
    if (!currentDossier || !currentImage) return;

    if (isCurrentSaved) {
      setVault(prev => prev.filter(v => v.dossier?.commonName !== currentDossier.commonName && v.commonName !== currentDossier.commonName));
    } else {
      const newItem = {
        id: `specimen-${Date.now()}`,
        nickname: currentDossier.commonName,
        commonName: currentDossier.commonName,
        photoUrl: currentImage,
        dossier: currentDossier,
        waterIntervalDays: 7,
        location: 'Living Room East Window',
        lastWatered: new Date().toISOString(),
        timestamp: new Date().toISOString()
      };
      setVault(prev => [newItem, ...prev]);
    }
  };

  const handleDeleteSpecimen = (id) => {
    setVault(prev => prev.filter(v => v.id !== id));
  };

  const handleClearVault = () => {
    setVault([]);
  };

  const handleSelectFromVault = (item) => {
    setCurrentImage(item.photoUrl);
    setCurrentDossier(item.dossier);
    setActiveTab('scanner');
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight * 0.7,
        behavior: 'smooth'
      });
    }, 150);
  };

  const handleWaterPlant = (plantId) => {
    setVault(prev => prev.map(p => {
      if (p.id === plantId) {
        return { ...p, lastWatered: new Date().toISOString() };
      }
      return p;
    }));
  };

  const handleAddCustomPlant = (newPlantData) => {
    const newItem = {
      id: `specimen-${Date.now()}`,
      photoUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      ...newPlantData,
      timestamp: new Date().toISOString()
    };
    setVault(prev => [newItem, ...prev]);
  };

  const handleNavigateToDoctor = (promptText) => {
    setDoctorInitialPrompt(promptText);
    setActiveTab('doctor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectSpeciesFromAtlas = (species) => {
    const match = MOCK_SPECIMENS.find(m => m.name.toLowerCase() === species.name.toLowerCase());
    if (match) {
      handleSelectSample(match);
    } else {
      setCurrentImage(species.image);
      setCurrentDossier({
        commonName: species.name,
        scientificName: species.scientific,
        family: "Plantae",
        confidenceScore: 97.8,
        health: { status: "Healthy", score: 92, primaryIssue: "Specimen Thriving", urgency: "Low", symptoms: ["Lush foliage"], treatmentPlan: ["Standard care"] },
        vitals: {
          sunlight: { level: species.light, score: 85, description: "Consistent illumination" },
          watering: { frequency: species.water, score: 75, rule: "Check topsoil moisture" },
          humidity: { percentage: "50% - 70%", score: 80, description: "Average humidity" },
          temperature: { rangeC: "18°C - 28°C", rangeF: "65°F - 82°F", ideal: "22°C" },
          soil: { type: "Well-aerated potting mix", ph: "6.0 - 7.0" }
        },
        toxicity: { toxicToCats: !species.petSafe, toxicToDogs: !species.petSafe, toxicToHumans: false, details: species.petSafe ? "Safe for domestic animals." : "Contains calcium oxalates." },
        botanicalProfile: { airPurificationScore: species.airScore, growthRate: "Moderate", nativeHabitat: "Subtropical / Tropical", funFacts: [species.description] }
      });
    }
    setActiveTab('scanner');
  };

  return (
    <div className="min-h-screen bg-[#DCE7D5] text-[#0E2316] flex flex-col font-sans selection:bg-[#0E2316] selection:text-[#DCE7D5] relative transition-colors duration-500">
      
      {/* Tactile Paper Film Grain Overlay */}
      <div className="film-grain"></div>

      {/* Floating Pill Header */}
      <Navbar
        onOpenVault={() => setIsVaultDrawerOpen(true)}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        onOpenApkGuide={() => setIsApiKeyModalOpen(false) || setIsApkGuideModalOpen(true)}
        vaultCount={vault.length}
      />

      {/* Multi-Interface Tab Selector Dock */}
      <TabNav
        activeTab={activeTab}
        onChangeTab={(tabId) => {
          setActiveTab(tabId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        greenhouseCount={vault.length}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        
        {/* INTERFACE 1: BIO-SCANNER & DOSSIER */}
        {activeTab === 'scanner' && (
          <>
            <HeroScanner
              onImageSelected={handleImageSelected}
              onSelectSample={handleSelectSample}
              isScanning={isScanning}
              scanStep={scanStep}
              currentImage={currentImage}
            />

            {currentDossier && (
              <PlantDossier
                dossier={currentDossier}
                photoUrl={currentImage}
                onSaveToVault={handleSaveToVault}
                isSaved={isCurrentSaved}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            )}
          </>
        )}

        {/* INTERFACE 2: LIVING GREENHOUSE & IRRIGATION TRACKER */}
        {activeTab === 'greenhouse' && (
          <GreenhouseManager
            plants={vault}
            onInspectSpecimen={(item) => handleSelectFromVault(item)}
            onAddCustomPlant={handleAddCustomPlant}
            onDeletePlant={handleDeleteSpecimen}
            onWaterPlant={handleWaterPlant}
          />
        )}

        {/* INTERFACE 3: PLANT HOSPITAL & EMERGENCY CLINIC */}
        {activeTab === 'clinic' && (
          <PlantClinic
            onConsultDoctor={handleNavigateToDoctor}
          />
        )}

        {/* INTERFACE 4: AR SOLAR LUX & PHOTOMETRIC CALCULATOR */}
        {activeTab === 'lightmeter' && (
          <LightMeter
            onSelectPlantName={(plantName) => {
              const match = MOCK_SPECIMENS.find(m => m.name.toLowerCase().includes(plantName.toLowerCase()));
              if (match) handleSelectSample(match);
              setActiveTab('scanner');
            }}
          />
        )}

        {/* INTERFACE 5: AI BOTANICAL DOCTOR CHAT STUDIO */}
        {activeTab === 'doctor' && (
          <AiDoctorChat
            initialPrompt={doctorInitialPrompt}
          />
        )}

        {/* INTERFACE 6: BOTANICAL SPECIES ENCYCLOPEDIA ATLAS */}
        {activeTab === 'atlas' && (
          <SpeciesAtlas
            onInspectSpecies={handleInspectSpeciesFromAtlas}
          />
        )}

      </main>

      {/* Massive Organic Brutalist Footer in Crisp White & Pistachio */}
      <footer className="mt-24 border-t-2 border-[#0E2316]/15 bg-white/80 backdrop-blur-md py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center font-anton text-sm">
              P
            </div>
            <span className="font-anton text-2xl uppercase tracking-wider text-[#0E2316]">
              PLANTAI // PISTACHIO BOTANICAL
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono-brutal text-xs uppercase text-[#446E52]">
            <span>PISTACHIO GREEN BACKGROUND</span>
            <span>•</span>
            <span>DEEP FOREST GREEN</span>
            <span>•</span>
            <span>CAPACITOR APK</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <GreenhouseVault
        isOpen={isVaultDrawerOpen}
        onClose={() => setIsVaultDrawerOpen(false)}
        vault={vault}
        onSelectSpecimen={handleSelectFromVault}
        onDeleteSpecimen={handleDeleteSpecimen}
        onClearVault={handleClearVault}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <ApkGuideModal
        isOpen={isApkGuideModalOpen}
        onClose={() => setIsApkGuideModalOpen(false)}
      />

    </div>
  );
}
