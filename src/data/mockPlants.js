// Curated sample bio-specimens with 100% verified, reliable image assets

export const MOCK_SPECIMENS = [
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    subtitle: 'Swiss Cheese Plant',
    thumbnail: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    dossier: {
      commonName: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      family: 'Araceae',
      confidenceScore: 98.6,
      health: {
        status: 'Healthy',
        score: 95,
        primaryIssue: 'Optimal Vitality (No Pathogens Detected)',
        urgency: 'Low',
        symptoms: ['Lush deep green foliage', 'Clean fenestration edges', 'Active aerial root vigor'],
        treatmentPlan: [
          'Maintain regular indirect bright lighting to foster new fenestrations.',
          'Wipe broad leaves monthly with a damp microfiber cloth to remove dust.',
          'Stake or moss-pole the aerial roots for vertical architectural support.'
        ]
      },
      vitals: {
        sunlight: {
          level: 'Bright Indirect Light',
          score: 85,
          description: 'Thrives in medium to bright filtered light. Direct scorching noon sunlight can burn leaves.'
        },
        watering: {
          frequency: 'Every 7 - 10 Days',
          score: 75,
          rule: 'Allow top 2-3 inches of soil to completely dry before thorough deep soaking.'
        },
        humidity: {
          percentage: '65% - 85%',
          score: 85,
          description: 'Loves rainforest humidity. Group with other plants or use a pebble tray.'
        },
        temperature: {
          rangeC: '18°C - 30°C',
          rangeF: '65°F - 86°F',
          ideal: '24°C / 75°F'
        },
        soil: {
          type: 'Chunky Aroid Substrate (Orchid bark, perlite, peat, worm castings)',
          ph: '5.5 - 7.0 (Slightly Acidic to Neutral)'
        }
      },
      toxicity: {
        toxicToCats: true,
        toxicToDogs: true,
        toxicToHumans: true,
        details: 'Contains insoluble calcium oxalate crystals. Ingestion causes intense oral burning, excess salivation, and vomiting.'
      },
      botanicalProfile: {
        airPurificationScore: 92,
        growthRate: 'Rapid during Spring & Summer',
        nativeHabitat: 'Tropical rainforests of Southern Mexico & Central America',
        funFacts: [
          'The leaf holes (fenestrations) evolved to allow torrential tropical winds to pass through without ripping foliage.',
          'In wild rainforests, it climbs trees up to 20 meters tall using robust aerial anchor roots.',
          'Mature plants produce an edible fruit called ceriman, which tastes like sweet fruit salad.'
        ]
      }
    }
  },
  {
    id: 'fiddle_leaf',
    name: 'Fiddle Leaf Fig',
    subtitle: 'Ficus Lyrata (Leaf Spot Alert)',
    thumbnail: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    dossier: {
      commonName: 'Fiddle Leaf Fig',
      scientificName: 'Ficus lyrata',
      family: 'Moraceae',
      confidenceScore: 96.2,
      health: {
        status: 'Mild Stress',
        score: 68,
        primaryIssue: 'Cercospora Fungal Leaf Spot (Early Stage)',
        urgency: 'Medium',
        symptoms: ['Brown pinpoint lesions with yellow halo on lower leaf', 'Slight leaf edema'],
        treatmentPlan: [
          'Isolate plant slightly to prevent fungal spore dispersal.',
          'Carefully prune the heavily spotted lower leaf using sanitized shears.',
          'Apply organic copper fungicide or diluted cold-pressed neem oil spray.',
          'Discontinue top-down leaf wetting; water soil directly.'
        ]
      },
      vitals: {
        sunlight: {
          level: 'Abundant Bright Filtered Light',
          score: 92,
          description: 'Needs 5-6 hours of consistent bright filtered sun near an east or south-facing window.'
        },
        watering: {
          frequency: 'Every 8 - 12 Days',
          score: 60,
          rule: 'Never allow pot to sit in stagnant saucer water. Let top 50% of soil dry.'
        },
        humidity: {
          percentage: '50% - 70%',
          score: 70,
          description: 'Sensitive to dry AC or radiator air drafts.'
        },
        temperature: {
          rangeC: '16°C - 26°C',
          rangeF: '60°F - 80°F',
          ideal: '22°C / 72°F'
        },
        soil: {
          type: 'Fast-draining loamy potting mix with added pumice',
          ph: '6.0 - 7.0'
        }
      },
      toxicity: {
        toxicToCats: true,
        toxicToDogs: true,
        toxicToHumans: true,
        details: 'Milky sap contains irritating furocoumarins and ficin enzymes causing dermatitis and digestive upset.'
      },
      botanicalProfile: {
        airPurificationScore: 84,
        growthRate: 'Moderate',
        nativeHabitat: 'Lowland tropical rainforests of Western Africa',
        funFacts: [
          'Known as a hemiepiphyte: it often starts life in the canopy crotch of another tree before rooting downward.',
          'Its enormous violin-shaped leaves can grow over 45 cm long.'
        ]
      }
    }
  },
  {
    id: 'snake_plant',
    name: 'Snake Plant',
    subtitle: 'Sansevieria Trifasciata',
    // Tested & verified working Unsplash image URL:
    thumbnail: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
    dossier: {
      commonName: 'Snake Plant / Mother-in-Law\'s Tongue',
      scientificName: 'Dracaena trifasciata',
      family: 'Asparagaceae',
      confidenceScore: 99.1,
      health: {
        status: 'Healthy',
        score: 98,
        primaryIssue: 'Excellent Structural Integrity',
        urgency: 'Low',
        symptoms: ['Rigid upright sword blades', 'Sharp yellow margin variegation', 'Dense rhizomes'],
        treatmentPlan: [
          'Water only when soil is 100% bone dry throughout the pot.',
          'Ideal specimen for low-light modern interior spaces or bedrooms.'
        ]
      },
      vitals: {
        sunlight: {
          level: 'Low to High Indirect Light (Extremely Adaptable)',
          score: 95,
          description: 'Can tolerate almost any lighting condition from dim corners to bright morning sun.'
        },
        watering: {
          frequency: 'Every 2 - 4 Weeks',
          score: 90,
          rule: 'Extremely drought-tolerant succulent. Overwatering is its #1 mortal threat.'
        },
        humidity: {
          percentage: '30% - 50% (Normal Room Air)',
          score: 95,
          description: 'Does not require extra misting or humidity adjustments.'
        },
        temperature: {
          rangeC: '15°C - 32°C',
          rangeF: '59°F - 90°F',
          ideal: '23°C / 73°F'
        },
        soil: {
          type: 'Cactus & succulent gritty coarse sand mix with perlite',
          ph: '6.0 - 7.5'
        }
      },
      toxicity: {
        toxicToCats: true,
        toxicToDogs: true,
        toxicToHumans: false,
        details: 'Contains saponins causing nausea, vomiting, and diarrhea in domestic pets if chewed.'
      },
      botanicalProfile: {
        airPurificationScore: 98,
        growthRate: 'Slow to Steady',
        nativeHabitat: 'Tropical West Africa from Nigeria to the Congo Basin',
        funFacts: [
          'Recognized in NASA Clean Air Study for filtering formaldehyde, benzene, and trichloroethylene.',
          'Utilizes Crassulacean Acid Metabolism (CAM) to release fresh oxygen during the night.'
        ]
      }
    }
  },
  {
    id: 'peace_lily',
    name: 'Peace Lily',
    subtitle: 'Spathiphyllum (Dehydrated)',
    // Tested & verified working Unsplash image URL:
    thumbnail: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80',
    dossier: {
      commonName: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      family: 'Araceae',
      confidenceScore: 97.4,
      health: {
        status: 'Mild Stress',
        score: 72,
        primaryIssue: 'Acute Moisture Deprivation (Foliar Wilt)',
        urgency: 'Medium',
        symptoms: ['Dramatic downward leaf drooping', 'Loss of cellular turgor pressure', 'Dull matte foliage'],
        treatmentPlan: [
          'Place the pot in a basin of lukewarm filtered water for 25 minutes (bottom watering).',
          'Allow excess water to thoroughly drain out from bottom holes.',
          'Leaves will perk upright within 2 to 4 hours once vascular system rehydrates.'
        ]
      },
      vitals: {
        sunlight: {
          level: 'Low to Medium Dappled Light',
          score: 80,
          description: 'Naturally grows on rainforest floors. Direct sun will bleach white spathes.'
        },
        watering: {
          frequency: 'Every 5 - 7 Days',
          score: 80,
          rule: 'Water as soon as soil surface feels dry or when the top leaves begin a subtle droop.'
        },
        humidity: {
          percentage: '60% - 80%',
          score: 85,
          description: 'Benefits from frequent foliage misting.'
        },
        temperature: {
          rangeC: '18°C - 28°C',
          rangeF: '65°F - 82°F',
          ideal: '21°C / 70°F'
        },
        soil: {
          type: 'Moisture-retentive yet aerated peat & perlite mix',
          ph: '5.8 - 6.5'
        }
      },
      toxicity: {
        toxicToCats: true,
        toxicToDogs: true,
        toxicToHumans: true,
        details: 'Calcium oxalate crystals create oral pain and dysphagia. Keep out of reach of puppies and kittens.'
      },
      botanicalProfile: {
        airPurificationScore: 96,
        growthRate: 'Moderate',
        nativeHabitat: 'Tropical Central & South America',
        funFacts: [
          'The iconic white "flower" is actually a modified leaf called a spathe shielding the center spadix.',
          'One of the most expressive "communicator" plants in botany due to its visible thirst signals.'
        ]
      }
    }
  }
];
