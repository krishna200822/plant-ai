import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, ArrowRight } from 'lucide-react';
import { sounds } from '../services/soundEffects';
import { askPlantDoctor } from '../services/gemini';

const PROMPT_SUGGESTIONS = [
  "How do I prune an overgrown Monstera and propagate cuttings?",
  "What is the best organic recipe for getting rid of fungus gnats?",
  "Why are my succulent leaves turning mushy and translucent?",
  "What are the top 5 air-purifying plants that are safe for cats and dogs?"
];

export default function AiDoctorChat({ initialPrompt = '' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Greetings. I am PlantAI Botanical Core, powered by Google Gemini multimodal intelligence. Ask me any horticultural question regarding soil formulations, pest outbreaks, propagation protocols, or lighting calculations."
    }
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    sounds.playClick();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setIsTyping(true);

    try {
      // Use general botanical context
      const genericDossier = {
        commonName: "Indoor & Outdoor Houseplants",
        scientificName: "Plantae Kingdom",
        family: "General Botany",
        health: { status: "Consultation Mode", primaryIssue: "General Inquiry" },
        vitals: { watering: { frequency: "Variable", rule: "Check moisture depth" }, sunlight: { level: "Variable" } },
        toxicity: { toxicToCats: false, toxicToDogs: false }
      };

      const reply = await askPlantDoctor(genericDossier, messages, query);
      sounds.playSuccessChime();
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch {
      sounds.playAlertChime();
      setMessages(prev => [
        ...prev, 
        { sender: 'bot', text: "Unable to consult botanical intelligence. Ensure your Gemini API key is configured or verify network connectivity." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bento-card-forest rounded-[3rem] p-8 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#153823] border border-[#7E9F85]/40 text-[#F4F1EA] flex items-center justify-center">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <span className="font-mono-brutal text-xs text-[#7E9F85] uppercase tracking-wider block mb-1">
              [CONVERSATIONAL REASONING ENGINE]
            </span>
            <h2 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-[#F4F1EA]">
              PLANT DOCTOR CHAT STUDIO
            </h2>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PROMPT_SUGGESTIONS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#E5EDE4] border border-[#0E2316]/15 text-[#0E2316] text-xs font-mono-brutal whitespace-nowrap transition-all shadow-sm active:scale-95 flex items-center space-x-1.5"
          >
            <Sparkles className="w-3 h-3 text-[#446E52]" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Frame */}
      <div className="bento-card rounded-[3rem] p-6 sm:p-8 border-2 border-[#0E2316]/15 min-h-[420px] flex flex-col justify-between space-y-4">
        
        {/* Messages Stream */}
        <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xl p-5 rounded-[2rem] text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0E2316] text-[#F4F1EA] rounded-br-sm shadow-md'
                    : 'bg-[#F4F1EA] border border-[#0E2316]/10 text-[#0E2316] rounded-bl-sm font-normal'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#E5EDE4] p-4 rounded-[2rem] text-xs font-mono-brutal text-[#0E2316] flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#153823] animate-ping"></span>
                <span>AI BOTANIST IS REASONING...</span>
              </div>
            </div>
          )}
        </div>

        {/* Message Input Field */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2 pt-4 border-t border-[#0E2316]/10"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your botanical question..."
            className="flex-1 bg-white border-2 border-[#0E2316]/20 rounded-full px-6 py-3.5 text-xs sm:text-sm text-[#0E2316] placeholder-[#0E2316]/40 focus:outline-none focus:border-[#0E2316]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-8 py-3.5 rounded-full bg-[#0E2316] hover:bg-[#153823] text-[#F4F1EA] font-anton text-sm uppercase tracking-wider flex items-center space-x-2 disabled:opacity-40 transition-all active:scale-95 shadow-md"
          >
            <span>ASK</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
