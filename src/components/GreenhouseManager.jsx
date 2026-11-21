import React, { useState } from 'react';
import { 
  Sprout, 
  Droplet, 
  Plus, 
  Calendar, 
  Check, 
  AlertCircle, 
  Trash2, 
  Search,
  Filter,
  ArrowRight,
  Sun
} from 'lucide-react';
import { sounds } from '../services/soundEffects';
import confetti from 'canvas-confetti';

export default function GreenhouseManager({ 
  plants, 
  onInspectSpecimen, 
  onAddCustomPlant, 
  onDeletePlant,
  onWaterPlant 
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'needs_water' | 'healthy'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [newCommonName, setNewCommonName] = useState('');
  const [newInterval, setNewInterval] = useState('7');
  const [newLocation, setNewLocation] = useState('Living Room (East Window)');

  const handleLogWater = (plantId) => {
    sounds.playSuccessChime();
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#7E9F85', '#0E2316', '#BAC9B8']
    });
    onWaterPlant(plantId);
  };

  const handleCreatePlant = (e) => {
    e.preventDefault();
    if (!newCommonName.trim()) return;

    sounds.playSuccessChime();
    onAddCustomPlant({
      nickname: newNickname.trim() || newCommonName.trim(),
      commonName: newCommonName.trim(),
      waterIntervalDays: parseInt(newInterval, 10) || 7,
      location: newLocation,
      lastWatered: new Date().toISOString()
    });

    setNewNickname('');
    setNewCommonName('');
    setIsAddModalOpen(false);
  };

  // Filter plants
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = 
      (plant.nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.dossier?.commonName || plant.commonName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const daysSinceWater = Math.floor(
      (new Date() - new Date(plant.lastWatered || plant.timestamp)) / (1000 * 60 * 60 * 24)
    );
    const interval = plant.waterIntervalDays || 7;
    const needsWater = daysSinceWater >= interval;

    if (filter === 'needs_water') return matchesSearch && needsWater;
    if (filter === 'healthy') return matchesSearch && !needsWater;
    return matchesSearch;
  });

  const thirstyCount = plants.filter(p => {
    const days = Math.floor((new Date() - new Date(p.lastWatered || p.timestamp)) / (1000 * 60 * 60 * 24));
    return days >= (p.waterIntervalDays || 7);
  }).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bento-card-forest rounded-[3.5rem] p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-brutal font-bold text-[#7E9F85] uppercase tracking-wider mb-3">
            <Sprout className="w-4 h-4" />
            <span>NURSERY MANAGEMENT INTERFACE // V2.0</span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight text-[#F4F1EA] leading-none mb-3">
            MY LIVING GREENHOUSE
          </h2>
          <p className="text-xs sm:text-sm text-[#F4F1EA]/80 font-normal max-w-lg leading-relaxed">
            Monitor daily irrigation cadences, track growth milestones, and prevent root drought across your personal collection.
          </p>
        </div>

        {/* Thirsty Alert & Add Action */}
        <div className="flex flex-wrap items-center gap-3">
          {thirstyCount > 0 && (
            <div className="px-5 py-3 rounded-full bg-amber-400 text-[#0E2316] font-anton text-xs tracking-wider uppercase flex items-center space-x-2 shadow-md">
              <Droplet className="w-4 h-4 text-[#0E2316]" />
              <span>{thirstyCount} NEED WATER TODAY</span>
            </div>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#F4F1EA] hover:bg-white text-[#0E2316] font-anton text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ADD SPECIMEN</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7E9F85] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specimen by name..."
            className="w-full bg-white border-2 border-[#0E2316]/10 rounded-full pl-11 pr-4 py-2.5 text-xs text-[#0E2316] placeholder-[#0E2316]/40 focus:outline-none focus:border-[#0E2316]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 font-anton text-xs uppercase tracking-wider overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => { sounds.playClick(); setFilter('all'); }}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === 'all'
                ? 'bg-[#0E2316] text-[#F4F1EA] border-[#0E2316]'
                : 'bg-white text-[#0E2316]/70 border-[#0E2316]/15 hover:border-[#0E2316]'
            }`}
          >
            All ({plants.length})
          </button>
          <button
            onClick={() => { sounds.playClick(); setFilter('needs_water'); }}
            className={`px-4 py-2 rounded-full border transition-all flex items-center space-x-1.5 ${
              filter === 'needs_water'
                ? 'bg-[#0E2316] text-[#F4F1EA] border-[#0E2316]'
                : 'bg-white text-[#0E2316]/70 border-[#0E2316]/15 hover:border-[#0E2316]'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-amber-500" />
            <span>Thirsty ({thirstyCount})</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setFilter('healthy'); }}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === 'healthy'
                ? 'bg-[#0E2316] text-[#F4F1EA] border-[#0E2316]'
                : 'bg-white text-[#0E2316]/70 border-[#0E2316]/15 hover:border-[#0E2316]'
            }`}
          >
            Hydrated ({plants.length - thirstyCount})
          </button>
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length === 0 ? (
        <div className="bento-card rounded-[3rem] p-12 text-center flex flex-col items-center justify-center space-y-4 border-2 border-[#0E2316]/15">
          <div className="w-16 h-16 rounded-full bg-[#E5EDE4] flex items-center justify-center text-[#0E2316]">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="font-anton text-2xl uppercase text-[#0E2316]">No Specimens In This Filter</h3>
          <p className="text-xs font-mono-brutal text-[#7E9F85] max-w-sm uppercase">
            Scan plants using the Bio-Scanner or click "Add Specimen" above to begin your botanical sanctuary tracker.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => {
            const daysSince = Math.floor(
              (new Date() - new Date(plant.lastWatered || plant.timestamp)) / (1000 * 60 * 60 * 24)
            );
            const interval = plant.waterIntervalDays || 7;
            const daysRemaining = Math.max(0, interval - daysSince);
            const needsWater = daysSince >= interval;

            return (
              <div
                key={plant.id}
                className="bento-card rounded-[2.5rem] p-6 border-2 border-[#0E2316]/15 bg-white flex flex-col justify-between space-y-5 hover:shadow-lg transition-all"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-[#F4F1EA] mb-4">
                    <img 
                      src={plant.photoUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80'} 
                      alt={plant.nickname || plant.dossier?.commonName} 
                      className="w-full h-full object-cover" 
                    />
                    
                    <span className={`absolute top-3 left-3 text-[10px] font-mono-brutal font-bold px-3 py-1 rounded-full uppercase ${
                      needsWater
                        ? 'bg-amber-400 text-[#0E2316] font-black'
                        : 'bg-[#0E2316] text-[#F4F1EA]'
                    }`}>
                      {needsWater ? '⚠️ NEEDS WATER' : `NEXT IN ${daysRemaining}D`}
                    </span>
                  </div>

                  {/* Identification */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-anton text-2xl uppercase text-[#0E2316] leading-tight">
                        {plant.nickname || plant.dossier?.commonName || plant.commonName}
                      </h4>
                      <p className="font-mono-brutal text-xs italic text-[#7E9F85] uppercase">
                        {plant.dossier?.scientificName || 'Botanical Cultivar'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        onDeletePlant(plant.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove plant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Location & Frequency */}
                  <div className="mt-4 p-3 rounded-2xl bg-[#F4F1EA] border border-[#0E2316]/10 text-xs font-mono-brutal flex justify-between items-center text-[#0E2316]/80">
                    <span>CADENCE: {interval} DAYS</span>
                    <span>{plant.location || 'Indoor Window'}</span>
                  </div>
                </div>

                {/* Actions: Log Watered & View Dossier */}
                <div className="pt-2 border-t border-[#0E2316]/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleLogWater(plant.id)}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-full bg-[#E5EDE4] hover:bg-[#BAC9B8] text-[#0E2316] font-anton text-xs uppercase tracking-wider transition-all active:scale-95"
                  >
                    <Droplet className="w-3.5 h-3.5 text-[#153823]" />
                    <span>LOG WATERED</span>
                  </button>

                  {plant.dossier && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onInspectSpecimen(plant);
                      }}
                      className="px-4 py-2.5 rounded-full bg-white hover:bg-[#F4F1EA] border border-[#0E2316]/20 text-[#0E2316] font-anton text-xs uppercase tracking-wider transition-all"
                      title="View full dossier"
                    >
                      <span>DOSSIER</span>
                      <ArrowRight className="w-3 h-3 inline ml-1" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Plant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2316]/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#F4F1EA] rounded-[3rem] p-8 border-2 border-[#0E2316] shadow-2xl">
            <h3 className="font-anton text-2xl uppercase tracking-wider text-[#0E2316] mb-4">
              ADD SPECIMEN TO GREENHOUSE
            </h3>

            <form onSubmit={handleCreatePlant} className="space-y-4">
              <div>
                <label className="block font-mono-brutal text-xs font-bold uppercase text-[#0E2316] mb-1">
                  Plant Common Name:
                </label>
                <input
                  type="text"
                  required
                  value={newCommonName}
                  onChange={(e) => setNewCommonName(e.target.value)}
                  placeholder="e.g. Fiddle Leaf Fig"
                  className="w-full bg-white border-2 border-[#0E2316]/20 rounded-full px-4 py-2.5 text-xs text-[#0E2316] focus:outline-none focus:border-[#0E2316]"
                />
              </div>

              <div>
                <label className="block font-mono-brutal text-xs font-bold uppercase text-[#0E2316] mb-1">
                  Custom Nickname:
                </label>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="e.g. Figgy Smalls"
                  className="w-full bg-white border-2 border-[#0E2316]/20 rounded-full px-4 py-2.5 text-xs text-[#0E2316] focus:outline-none focus:border-[#0E2316]"
                />
              </div>

              <div>
                <label className="block font-mono-brutal text-xs font-bold uppercase text-[#0E2316] mb-1">
                  Watering Interval (Days):
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={newInterval}
                  onChange={(e) => setNewInterval(e.target.value)}
                  className="w-full bg-white border-2 border-[#0E2316]/20 rounded-full px-4 py-2.5 text-xs text-[#0E2316] focus:outline-none focus:border-[#0E2316]"
                />
              </div>

              <div>
                <label className="block font-mono-brutal text-xs font-bold uppercase text-[#0E2316] mb-1">
                  Location in Home:
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. South Window Balcony"
                  className="w-full bg-white border-2 border-[#0E2316]/20 rounded-full px-4 py-2.5 text-xs text-[#0E2316] focus:outline-none focus:border-[#0E2316]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#0E2316]/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-mono-brutal uppercase text-[#0E2316]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0E2316] text-[#F4F1EA] font-anton text-xs uppercase tracking-wider shadow-md hover:bg-[#153823] transition-all"
                >
                  Save to Nursery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
