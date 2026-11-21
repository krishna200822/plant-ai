import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Sun, 
  Droplet, 
  ShieldCheck, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

const ATLAS_CATALOG = [
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    scientific: 'Monstera deliciosa',
    category: 'aroids',
    difficulty: 'Easy',
    light: 'Bright Indirect',
    water: 'Every 7-10 Days',
    petSafe: false,
    airScore: 92,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic Swiss Cheese Plant famous for dramatic natural leaf fenestrations.'
  },
  {
    id: 'fiddle_leaf',
    name: 'Fiddle Leaf Fig',
    scientific: 'Ficus lyrata',
    category: 'trees',
    difficulty: 'Moderate',
    light: 'Bright Filtered',
    water: 'Every 8-12 Days',
    petSafe: false,
    airScore: 84,
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    description: 'Architectural violin-shaped foliage. Prefers consistent bright spots.'
  },
  {
    id: 'snake_plant',
    name: 'Snake Plant',
    scientific: 'Dracaena trifasciata',
    category: 'low_light',
    difficulty: 'Ultra Easy',
    light: 'Low to Bright',
    water: 'Every 2-4 Weeks',
    petSafe: false,
    airScore: 98,
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
    description: 'NASA clean air champion releasing fresh nighttime oxygen through CAM photosynthesis.'
  },
  {
    id: 'peace_lily',
    name: 'Peace Lily',
    scientific: 'Spathiphyllum wallisii',
    category: 'flowering',
    difficulty: 'Easy',
    light: 'Low to Medium',
    water: 'Every 5-7 Days',
    petSafe: false,
    airScore: 96,
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
    description: 'Lush tropical communicator with elegant white spathes.'
  },
  {
    id: 'pothos',
    name: 'Golden Pothos',
    scientific: 'Epipremnum aureum',
    category: 'vines',
    difficulty: 'Ultra Easy',
    light: 'Low to Medium',
    water: 'Every 7-10 Days',
    petSafe: false,
    airScore: 90,
    image: 'https://images.unsplash.com/photo-1596724856002-e25f828a2a8b?auto=format&fit=crop&w=800&q=80',
    description: 'Indestructible trailing vine with golden variegated heart-shaped leaves.'
  },
  {
    id: 'boston_fern',
    name: 'Boston Fern',
    scientific: 'Nephrolepis exaltata',
    category: 'pet_friendly',
    difficulty: 'Moderate',
    light: 'Filtered Medium',
    water: 'Every 4-6 Days',
    petSafe: true,
    airScore: 95,
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
    description: 'Completely pet-safe feathery fronds that thrive in humid bathrooms.'
  },
  {
    id: 'calathea',
    name: 'Calathea Orbifolia',
    scientific: 'Goeppertia orbifolia',
    category: 'pet_friendly',
    difficulty: 'Moderate',
    light: 'Medium Dappled',
    water: 'Every 5-7 Days',
    petSafe: true,
    airScore: 88,
    image: 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=800&q=80',
    description: 'Non-toxic prayer plant with silver metallic striped dinner-plate leaves.'
  },
  {
    id: 'zz_plant',
    name: 'ZZ Plant',
    scientific: 'Zamioculcas zamiifolia',
    category: 'low_light',
    difficulty: 'Ultra Easy',
    light: 'Low to Bright',
    water: 'Every 3-4 Weeks',
    petSafe: false,
    airScore: 91,
    image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800&q=80',
    description: 'Glossy dark green leaves with underground water-storing bulbous rhizomes.'
  }
];

export default function SpeciesAtlas({ onInspectSpecies }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = ATLAS_CATALOG.filter((plant) => {
    const matchesSearch = 
      plant.name.toLowerCase().includes(search.toLowerCase()) ||
      plant.scientific.toLowerCase().includes(search.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'pet_safe') return matchesSearch && plant.petSafe;
    if (selectedCategory === 'low_light') return matchesSearch && plant.category === 'low_light';
    if (selectedCategory === 'easy') return matchesSearch && plant.difficulty.includes('Easy');
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bento-card-forest rounded-[3.5rem] p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-brutal font-bold text-[#7E9F85] uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" />
            <span>GLOBAL BOTANICAL TAXONOMY // ATLAS</span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight text-[#DCE7D5] leading-none mb-3">
            SPECIES ENCYCLOPEDIA
          </h2>
          <p className="text-xs sm:text-sm text-[#DCE7D5]/80 font-normal max-w-lg leading-relaxed">
            Search comprehensive horticultural care standards, difficulty ratings, and ecological air purification indexes.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7E9F85] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search botanical species..."
              className="w-full bg-[#153823] border border-[#7E9F85]/40 rounded-full pl-11 pr-4 py-3 text-xs font-mono-brutal text-[#DCE7D5] placeholder-[#7E9F85] focus:outline-none focus:border-[#DCE7D5]"
            />
          </div>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar font-anton text-xs uppercase tracking-wider">
        {[
          { id: 'all', label: 'ALL SPECIES' },
          { id: 'pet_safe', label: '🐾 PET-SAFE ONLY' },
          { id: 'low_light', label: '🌑 LOW LIGHT CHAMPIONS' },
          { id: 'easy', label: '⚡ BEGINNER FRIENDLY' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => { sounds.playClick(); setSelectedCategory(cat.id); }}
            className={`px-5 py-2.5 rounded-full border transition-all whitespace-nowrap active:scale-95 ${
              selectedCategory === cat.id
                ? 'bg-[#0E2316] text-[#DCE7D5] border-[#0E2316]'
                : 'bg-white text-[#0E2316]/70 border-[#0E2316]/15 hover:border-[#0E2316]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Species Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((plant) => (
          <div
            key={plant.id}
            className="bento-card rounded-[2.5rem] p-5 border-2 border-[#0E2316]/15 bg-white flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
          >
            <div>
              <div className="relative rounded-[2rem] overflow-hidden aspect-square bg-[#DCE7D5] mb-4">
                <img 
                  src={plant.image} 
                  alt={plant.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover" 
                />
                <span className={`absolute top-3 left-3 text-[10px] font-mono-brutal font-bold px-3 py-1 rounded-full uppercase ${
                  plant.petSafe ? 'bg-[#CEDDC5] text-[#0E2316]' : 'bg-[#0E2316] text-[#DCE7D5]'
                }`}>
                  {plant.petSafe ? '🐾 PET SAFE' : '⚠️ PET TOXIC'}
                </span>
              </div>

              <h4 className="font-anton text-2xl uppercase text-[#0E2316] leading-tight mb-0.5">
                {plant.name}
              </h4>
              <p className="font-mono-brutal text-xs italic text-[#3B6648] uppercase mb-2">
                {plant.scientific}
              </p>
              <p className="text-xs text-[#0E2316]/70 font-normal line-clamp-2 leading-relaxed">
                {plant.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#0E2316]/10">
              <div className="flex justify-between items-center text-[11px] font-mono-brutal text-[#0E2316]/70">
                <span>DIFFICULTY:</span>
                <span className="font-bold text-[#0E2316]">{plant.difficulty}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono-brutal text-[#0E2316]/70">
                <span>AIR PURIFICATION:</span>
                <span className="font-bold text-[#3B6648]">{plant.airScore}%</span>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onInspectSpecies(plant);
                }}
                className="w-full py-2.5 rounded-full bg-[#DCE7D5] hover:bg-[#CEDDC5] border border-[#0E2316]/15 font-anton text-xs uppercase tracking-wider text-[#0E2316] flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                <span>OPEN IN SCANNER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
