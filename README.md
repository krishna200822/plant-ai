# 🌿 PlantAI • Cyber-Botanical Vision & AI Diagnostic Engine

A futuristic, glassmorphic plant identification, pathology diagnostic, and care handbook web application, bundled with **Capacitor** for 1-click **Android APK** generation from a single codebase.

---

## ✨ Features

- 🛸 **Futuristic Cyber-Botanical Glassmorphism UI:**
  - Multi-layered frosted glass panels (`backdrop-blur-xl`).
  - Neon emerald (`#00ffa3`) and laser cyan accents with dynamic glowing borders.
  - Interactive laser beam scanline animation and holographic reticle HUD.
  - Built-in Web Audio API synthesizer for futuristic scan chirps, sweeps, and success chimes (zero external audio files).

- 🧬 **Multimodal AI Botanical Engine:**
  - Connects to Google Gemini Multimodal Vision API (`gemini-2.5-flash` / `gemini-1.5-flash`).
  - Structured botanical dossier output:
    - **Taxonomy:** Common name, scientific binomial name, plant family, confidence score.
    - **Pathology & Health Matrix:** Overall health score (0-100), condition triage (Healthy, Mild Stress, Diseased, Critical), primary issue, symptoms, and checkable recovery checklist.
    - **Vital Metrics Gauges:** Solar exposure index, watering frequency + exact moisture check rule, target atmospheric humidity %, and thermal envelope (°C/°F).
    - **Bio-Safety & Toxicity Shield:** Explicit warnings for domestic felines (cats), canines (dogs), and children.
    - **Botanical Wisdom:** NASA Clean Air filtration rating, growth velocity, and native habitat facts.

- 💬 **Ask PlantAI Doctor Chatbot:**
  - Interactive AI Q&A window directly under each scanned specimen for personalized care guidance.

- 📦 **Greenhouse Vault:**
  - Offline-first local storage archive of saved scans with dates, health status, and quick recall.

- 📱 **1-Click Android APK (Capacitor Engine):**
  - Native Android project scaffolded under `android/`.
  - Camera and local hardware integration.

- ⚡ **Instant Test Drive Specimens:**
  - Pre-loaded with 4 realistic specimen profiles (Monstera Deliciosa, Fiddle Leaf Fig, Snake Plant, Peace Lily) so anyone can test drive the full scanner without needing an API key upfront.

---

## 🚀 Quick Start (Web App)

```bash
# Navigate to the project
cd C:\Users\krish\.gemini\antigravity\scratch\plantai

# Start the local development server
npm run dev
```

Visit the local URL shown (typically `http://localhost:5173/`).

---

## 📱 How to Build the Android APK

The native Android project is already initialized in `android/`.

### Option 1: Direct Gradle Build (Command Line)
```bash
# 1. Build and sync web assets to Android
npm run android:sync

# 2. Compile APK
cd android
./gradlew assembleDebug
```
The compiled APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Option 2: Run in Android Studio
```bash
npx cap open android
```
Click **Run** (or `Build > Build Bundle(s) / APK(s) > Build APK(s)`).

---

## 🔑 Adding a Google Gemini API Key
1. Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click the **"SET GEMINI KEY"** button in the PlantAI navbar.
3. Paste the key and click **Test Key** -> **Save Config**.
4. The key is stored locally in your browser (`localStorage`) and never shared with any intermediary servers.
