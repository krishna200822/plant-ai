// Google Gemini Multimodal Vision Service for PlantAI
// Automatic Model Discovery & Resilient Multi-Key Failover Engine

const API_KEYS_STORAGE_KEY = 'plantai_gemini_api_keys';
const LEGACY_KEY_STORAGE = 'plantai_gemini_api_key';

// Cache discovered models for each key: key -> { apiVer, models: string[] }
const keyModelCache = new Map();

// Standard models to check in priority order
const FALLBACK_CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-3.6-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-pro',
  'gemini-1.5-flash-latest'
];

export function getStoredApiKeys() {
  try {
    const raw = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(k => typeof k === 'string' && k.trim().length > 6);
      }
    }
  } catch {}

  const legacy = localStorage.getItem(LEGACY_KEY_STORAGE);
  if (legacy && legacy.trim().length > 6) {
    const migrated = [legacy.trim()];
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  }

  // Check for environment variable key (e.g. from Render or .env)
  try {
    const envKeys = import.meta.env.VITE_GEMINI_API_KEYS || import.meta.env.VITE_GEMINI_API_KEY;
    if (envKeys && typeof envKeys === 'string') {
      const splitKeys = envKeys
        .split(/[\n,]+/)
        .map(k => k.trim())
        .filter(k => k.length > 6);
      if (splitKeys.length > 0) {
        return splitKeys;
      }
    }
  } catch {}

  return [];
}

export function saveApiKeys(keysArray) {
  const cleaned = keysArray
    .map(k => (typeof k === 'string' ? k.trim() : ''))
    .filter(k => k.length > 6);
  
  localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(cleaned));
  if (cleaned.length > 0) {
    localStorage.setItem(LEGACY_KEY_STORAGE, cleaned[0]);
  } else {
    localStorage.removeItem(LEGACY_KEY_STORAGE);
  }
  return cleaned;
}

export function addApiKey(newKey) {
  if (!newKey || typeof newKey !== 'string') return getStoredApiKeys();
  const current = getStoredApiKeys();
  const trimmed = newKey.trim();
  if (trimmed.length > 6 && !current.includes(trimmed)) {
    const updated = [...current, trimmed];
    return saveApiKeys(updated);
  }
  return current;
}

export function removeApiKey(index) {
  const current = getStoredApiKeys();
  if (index >= 0 && index < current.length) {
    current.splice(index, 1);
    return saveApiKeys(current);
  }
  return current;
}

export function hasApiKey() {
  return getStoredApiKeys().length > 0;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64Data = result.split(',')[1];
      resolve({
        dataUrl: result,
        base64: base64Data,
        mimeType: file.type || 'image/jpeg'
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Dynamically discover which models are enabled for this specific key
export async function discoverSupportedModels(apiKey) {
  if (keyModelCache.has(apiKey)) {
    return keyModelCache.get(apiKey);
  }

  for (const apiVer of ['v1beta', 'v1']) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${apiVer}/models?key=${apiKey}`);
      if (res.ok) {
        const data = await res.json();
        const available = (data.models || [])
          .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name.replace(/^models\//, ''));

        if (available.length > 0) {
          // Sort so flash models come first for fastest inference
          available.sort((a, b) => {
            if (a.includes('flash') && !b.includes('flash')) return -1;
            if (!a.includes('flash') && b.includes('flash')) return 1;
            return 0;
          });

          const config = { apiVer, models: available };
          keyModelCache.set(apiKey, config);
          return config;
        }
      }
    } catch (err) {
      console.warn(`Model discovery on ${apiVer} failed:`, err);
    }
  }

  // Fallback candidate list if ListModels is restricted
  const fallback = { apiVer: 'v1beta', models: FALLBACK_CANDIDATE_MODELS };
  keyModelCache.set(apiKey, fallback);
  return fallback;
}

// Test an individual key with automatic ModelService discovery
export async function testSingleApiKey(keyToTest) {
  if (!keyToTest || keyToTest.trim().length < 6) {
    throw new Error('Please enter a valid Google AI Studio key.');
  }

  const cleanKey = keyToTest.trim();

  // Helpful sanity check: Google AI Studio keys standardly start with AIzaSy
  if (!cleanKey.startsWith('AIzaSy') && cleanKey.startsWith('AQ.')) {
    throw new Error(
      'This key starts with "AQ." which is not a standard Google AI Studio key. Google AI Studio keys start with "AIzaSy...". Please get a free key from https://aistudio.google.com/app/apikey.'
    );
  }

  let lastError = null;

  // 1. Try ListModels first (the official verification endpoint recommended by Google)
  for (const apiVer of ['v1beta', 'v1']) {
    try {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/${apiVer}/models?key=${cleanKey}`);
      if (listRes.ok) {
        const listData = await listRes.json();
        const available = (listData.models || [])
          .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => m.name.replace(/^models\//, ''));

        if (available.length > 0) {
          // Put flash models first
          available.sort((a, b) => {
            if (a.includes('flash') && !b.includes('flash')) return -1;
            if (!a.includes('flash') && b.includes('flash')) return 1;
            return 0;
          });

          keyModelCache.set(cleanKey, { apiVer, models: available });
          return { ok: true, model: available[0], apiVer };
        }
      } else {
        const errJson = await listRes.json().catch(() => ({}));
        if (errJson.error?.message) {
          lastError = new Error(errJson.error.message);
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  // 2. Direct ping test across candidate models
  for (const apiVer of ['v1beta', 'v1']) {
    for (const model of FALLBACK_CANDIDATE_MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/${apiVer}/models/${model}:generateContent?key=${cleanKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "ping" }] }]
            })
          }
        );

        if (res.ok) {
          keyModelCache.set(cleanKey, { apiVer, models: [model, ...FALLBACK_CANDIDATE_MODELS] });
          return { ok: true, model, apiVer };
        }

        const errData = await res.json().catch(() => ({}));
        if (errData.error?.message) {
          if (!errData.error.message.includes('not found')) {
            lastError = new Error(errData.error.message);
          }
        }
      } catch (e) {
        lastError = e;
      }
    }
  }

  // If the error contains "API_KEY_INVALID" or similar
  if (lastError?.message?.includes('API_KEY_INVALID') || lastError?.message?.includes('API key not valid')) {
    throw new Error('Invalid Google API key. Please check your key at https://aistudio.google.com/app/apikey.');
  }

  throw lastError || new Error('API key verification failed. Make sure you are using a key from Google AI Studio (aistudio.google.com).');
}

const SYSTEM_PROMPT = `
You are PlantAI Core, a world-class botanical scientist and plant pathologist with deep expertise in horticulture, taxonomy, and phytopathology.

Analyze the uploaded plant image and return a strictly valid, single JSON object (with NO markdown formatting, NO backticks, NO extra commentary) with the following exact structure:
{
  "commonName": "Popular common name",
  "scientificName": "Genus species",
  "family": "Botanical family",
  "confidenceScore": 95.8,
  "health": {
    "status": "Healthy" | "Mild Stress" | "Diseased" | "Critical",
    "score": 88,
    "primaryIssue": "Summary of primary condition or health state",
    "urgency": "Low" | "Medium" | "High",
    "symptoms": ["Symptom 1", "Symptom 2"],
    "treatmentPlan": [
      "Action 1: Specific triage step",
      "Action 2: Specific triage step",
      "Action 3: Specific triage step"
    ]
  },
  "vitals": {
    "sunlight": {
      "level": "Lighting requirements (e.g. Bright Indirect Light)",
      "score": 85,
      "description": "Clear lighting advice"
    },
    "watering": {
      "frequency": "Watering cadence (e.g. Every 7-10 Days)",
      "score": 75,
      "rule": "Exact moisture check rule"
    },
    "humidity": {
      "percentage": "Humidity target (e.g. 60% - 80%)",
      "score": 80,
      "description": "Humidity requirements"
    },
    "temperature": {
      "rangeC": "18°C - 28°C",
      "rangeF": "65°F - 82°F",
      "ideal": "22°C / 72°F"
    },
    "soil": {
      "type": "Ideal soil blend",
      "ph": "Ideal pH range"
    }
  },
  "toxicity": {
    "toxicToCats": true or false,
    "toxicToDogs": true or false,
    "toxicToHumans": true or false,
    "details": "Precise toxicity warning, toxic principles, and clinical symptoms if ingested."
  },
  "botanicalProfile": {
    "airPurificationScore": 90,
    "growthRate": "Slow / Moderate / Fast",
    "nativeHabitat": "Geographic origin and biome",
    "funFacts": [
      "Fascinating botanical fact 1",
      "Fascinating botanical fact 2"
    ]
  }
}
`;

// Analyze image with dynamic model discovery and multi-key failover
export async function analyzePlantImage(base64Data, mimeType = 'image/jpeg') {
  const keys = getStoredApiKeys();

  if (keys.length === 0) {
    throw new Error('MISSING_API_KEY');
  }

  let lastError = null;

  // Failover across all keys in pool
  for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
    const currentKey = keys[keyIdx];
    
    // Discover the exact models available for this specific key
    const { apiVer, models } = await discoverSupportedModels(currentKey);

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${apiVer}/models/${model}:generateContent?key=${currentKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: SYSTEM_PROMPT },
                    {
                      inline_data: {
                        mime_type: mimeType,
                        data: base64Data
                      }
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.15,
                topP: 0.95,
                maxOutputTokens: 2048,
                responseMimeType: "application/json"
              }
            })
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`(${response.status}) on ${model}: ${errorText.slice(0, 150)}`);
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          throw new Error('Empty response from vision model');
        }

        const cleaned = rawText
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        const parsed = JSON.parse(cleaned);
        console.log(`[PlantAI] Successfully analyzed via ${model} on Key #${keyIdx + 1}!`);
        return parsed;

      } catch (err) {
        lastError = err;
        console.warn(`[PlantAI] Attempt failed on ${model} (Key #${keyIdx + 1}):`, err.message);
      }
    }
  }

  throw lastError || new Error(`All ${keys.length} API keys in your pool failed.`);
}

// Consult Plant Doctor with dynamic model resolution
export async function askPlantDoctor(plantDossier, chatHistory, userQuestion) {
  const keys = getStoredApiKeys();

  if (keys.length === 0) {
    return `[PlantAI Doctor Simulation]: Based on ${plantDossier.commonName}'s biological dossier, its primary need is ${plantDossier.vitals?.watering?.rule || 'regular moisture check'}. To address "${userQuestion}", check soil drainage and lighting (${plantDossier.vitals?.sunlight?.level || 'bright indirect'}). (Configure your Gemini API key for live real-time AI reasoning!)`;
  }

  const systemContext = `
You are the PlantAI Botanical Doctor.
The user is asking about their specific plant:
- Name: ${plantDossier.commonName} (${plantDossier.scientificName})
- Family: ${plantDossier.family}
- Health: ${plantDossier.health?.status} (${plantDossier.health?.primaryIssue})
- Watering: ${plantDossier.vitals?.watering?.frequency} (${plantDossier.vitals?.watering?.rule})
- Sunlight: ${plantDossier.vitals?.sunlight?.level}
- Toxicity: Cats: ${plantDossier.toxicity?.toxicToCats}, Dogs: ${plantDossier.toxicity?.toxicToDogs}

Give a direct, concise, compassionate, and highly actionable response in 2-3 short paragraphs with bullet points if prescribing treatments.
`;

  const messages = chatHistory.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  messages.push({
    role: 'user',
    parts: [{ text: userQuestion }]
  });

  let lastError = null;

  for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
    const currentKey = keys[keyIdx];
    const { apiVer, models } = await discoverSupportedModels(currentKey);

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${apiVer}/models/${model}:generateContent?key=${currentKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemContext }] },
              contents: messages,
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 800
              }
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Key #${keyIdx + 1} HTTP ${response.status} on ${model}`);
        }

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Diagnosis formulated.";
      } catch (err) {
        lastError = err;
        console.warn(`[PlantAI Chat] ${model} on Key #${keyIdx + 1} failed:`, err.message);
      }
    }
  }

  throw lastError || new Error('All keys in pool failed for chat inquiry.');
}
