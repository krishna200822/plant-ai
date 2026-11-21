import React, { useState } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Trash2, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { 
  getStoredApiKeys, 
  saveApiKeys, 
  removeApiKey, 
  testSingleApiKey 
} from '../services/gemini';
import { sounds } from '../services/soundEffects';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [keys, setKeys] = useState(getStoredApiKeys());
  const [newKeyInput, setNewKeyInput] = useState('');
  const [testingIndex, setTestingIndex] = useState(null);
  const [keyStatuses, setKeyStatuses] = useState({});

  if (!isOpen) return null;

  const handleAddKey = () => {
    if (!newKeyInput.trim()) return;

    sounds.playClick();
    const rawInputs = newKeyInput.split(/[\n,]+/);
    let updated = [...keys];

    rawInputs.forEach(inputKey => {
      const trimmed = inputKey.trim();
      if (trimmed.length > 10 && !updated.includes(trimmed)) {
        updated.push(trimmed);
      }
    });

    saveApiKeys(updated);
    setKeys(updated);
    setNewKeyInput('');
    sounds.playSuccessChime();
  };

  const handleRemoveKey = (index) => {
    sounds.playClick();
    const updated = removeApiKey(index);
    setKeys(updated);
    setKeyStatuses(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const handleTestKey = async (keyToTest, index) => {
    sounds.playClick();
    setTestingIndex(index);
    setKeyStatuses(prev => ({ ...prev, [index]: { status: 'testing' } }));

    try {
      await testSingleApiKey(keyToTest);
      sounds.playSuccessChime();
      setKeyStatuses(prev => ({ ...prev, [index]: { status: 'success' } }));
    } catch (err) {
      sounds.playAlertChime();
      setKeyStatuses(prev => ({ 
        ...prev, 
        [index]: { status: 'error', message: err.message } 
      }));
    } finally {
      setTestingIndex(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Remove all API keys from your failover pool?")) {
      sounds.playAlertChime();
      saveApiKeys([]);
      setKeys([]);
      setKeyStatuses({});
    }
  };

  const maskKey = (k) => {
    if (!k || k.length < 12) return '••••••••••••';
    return `${k.slice(0, 6)}••••••••••••${k.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2316]/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#DCE7D5] rounded-[3.5rem] p-8 sm:p-10 border-2 border-[#0E2316] shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-[#0E2316]/10 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-anton text-2xl uppercase tracking-wider text-[#0E2316]">
                GEMINI 3.6 FLASH POOL
              </h3>
              <p className="font-mono-brutal text-[10px] text-[#3B6648] uppercase font-bold">
                [{keys.length} KEYS CONFIGURED • AUTO-FAILOVER READY]
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

        {/* Explain the Automatic Failover System */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-3xl bg-[#CEDDC5] border border-[#0E2316]/10 flex items-start space-x-3 text-xs text-[#0E2316]">
            <Sparkles className="w-5 h-5 text-[#3B6648] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">Next-Gen Gemini 3.6 Flash Engine: </span>
              Your scans and consultations execute natively using Google's ultra-fast <strong>Gemini 3.6 Flash</strong> multimodal vision model with sub-second inference. If Key #1 reaches quota caps, PlantAI automatically cascades to Key #2 and #3.
            </p>
          </div>

          {/* Add Key Input Form */}
          <div className="p-4 rounded-3xl bg-white border-2 border-[#0E2316]/15 space-y-3">
            <label className="block font-mono-brutal text-xs font-bold uppercase text-[#0E2316]">
              ADD KEY TO 3.6 FLASH POOL:
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={newKeyInput}
                onChange={(e) => setNewKeyInput(e.target.value)}
                placeholder="Paste key (AIzaSy...) or multiple separated by comma"
                className="flex-1 bg-[#DCE7D5]/40 border-2 border-[#0E2316]/20 rounded-full px-5 py-2.5 text-xs font-mono-brutal text-[#0E2316] placeholder-[#0E2316]/40 focus:outline-none focus:border-[#0E2316]"
              />
              <button
                type="button"
                onClick={handleAddKey}
                disabled={!newKeyInput.trim()}
                className="px-6 py-2.5 rounded-full bg-[#0E2316] hover:bg-[#153823] text-[#DCE7D5] font-anton text-xs uppercase tracking-wider disabled:opacity-40 flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>ADD KEY</span>
              </button>
            </div>
          </div>

          {/* Active Key Pool List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono-brutal text-xs font-bold uppercase text-[#0E2316] px-1">
              <span>CONFIGURED KEYS ({keys.length}):</span>
              <span className="text-[#3B6648] text-[10px]">GEMINI 3.6 FLASH ACTIVE</span>
            </div>

            {keys.length === 0 ? (
              <div className="p-6 rounded-3xl bg-white/60 border-2 border-dashed border-[#0E2316]/20 text-center">
                <p className="font-anton text-base uppercase text-[#0E2316]">No API Keys Configured</p>
                <p className="text-xs font-mono-brutal text-[#3B6648] mt-1 font-bold">
                  Add 1 or more free Google AI Studio keys above to enable live plant diagnosis.
                </p>
              </div>
            ) : (
              keys.map((keyStr, idx) => {
                const status = keyStatuses[idx];
                const isTesting = testingIndex === idx;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border-2 border-[#0E2316]/10 flex flex-col space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-[#0E2316] text-[#DCE7D5] flex items-center justify-center font-anton text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-mono-brutal text-xs font-bold text-[#0E2316]">
                            {maskKey(keyStr)}
                          </p>
                          <span className="text-[10px] font-mono-brutal text-[#3B6648] font-bold">
                            {idx === 0 ? 'PRIMARY 3.6 FLASH KEY' : `FAILOVER TIER #${idx}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleTestKey(keyStr, idx)}
                          disabled={isTesting}
                          className="px-3 py-1.5 rounded-full bg-[#DCE7D5] hover:bg-[#CEDDC5] text-[#0E2316] font-mono-brutal text-[11px] font-bold uppercase transition-all"
                        >
                          {isTesting ? 'VERIFYING...' : 'TEST KEY'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveKey(idx)}
                          className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Status feedback */}
                    {status?.status === 'success' && (
                      <p className="text-[11px] font-mono-brutal text-[#3B6648] flex items-center space-x-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>AUTHENTICATED FOR GEMINI 3.6 FLASH</span>
                      </p>
                    )}

                    {status?.status === 'error' && (
                      <p className="text-[11px] font-mono-brutal text-rose-600 flex items-center space-x-1 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{status.message || 'Key rejected by Google AI Studio'}</span>
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Helper link */}
          <div className="flex items-center justify-between text-xs pt-2 font-mono-brutal">
            <span className="text-[#3B6648] font-bold">GET FREE GEMINI KEYS:</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0E2316] hover:text-[#3B6648] flex items-center space-x-1 font-bold underline"
            >
              <span>GOOGLE AI STUDIO</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-6 border-t-2 border-[#0E2316]/10">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-mono-brutal uppercase text-[#3B6648] hover:text-rose-600 transition-colors font-bold"
          >
            Clear All Keys
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-8 py-3 rounded-full bg-[#0E2316] hover:bg-[#153823] text-[#DCE7D5] font-anton text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            DONE
          </button>
        </div>

      </div>
    </div>
  );
}
