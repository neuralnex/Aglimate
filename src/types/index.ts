export interface UserSettings {
  language: SupportedLanguage
}

export interface ClimateFirstBlock {
  advisory: string
  confidence: number
  model: string
}

export interface CropRequirements {
  water_mm?: number
  gdd?: number
  [key: string]: number | string | undefined
}

export interface AdviseResponse {
  answer: string
  session_id?: string
  climate_first?: ClimateFirstBlock
  used_wapor?: boolean
  wapor_layers?: string[]
  data_sources?: string[]
  crop_requirements?: CropRequirements
  // Legacy fields (optional, for backward compatibility with older backends)
  latitude?: number
  longitude?: number
  used_image?: boolean
  used_video?: boolean
  model_used?: string
}

export type SupportedLanguage = 'en' | 'ha' | 'ig' | 'yo' | 'pcm' | 'sw' | 'am'

export const LANGUAGE_MAP: Record<SupportedLanguage, { name: string; native: string; flag: string }> = {
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
  ha: { name: 'Hausa', native: 'Hausa', flag: '🇳🇧' },
  ig: { name: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
  yo: { name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  pcm: { name: 'Nigerian Pidgin', native: 'Pidgin', flag: '🇳🇬' },
  sw: { name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  am: { name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
}

export const GROWTH_STAGES = [
  'Establishment',
  'Vegetative',
  'Flowering',
  'Fruit/Seed filling',
  'Maturity',
  'Harvest',
] as const

export const COMMON_CROPS = [
  'Maize',
  'Rice',
  'Cassava',
  'Yam',
  'Sorghum',
  'Millet',
  'Cowpea',
  'Groundnut',
  'Soybean',
  'Cocoa',
  'Plantain',
  'Tomato',
  'Pepper',
  'Onion',
] as const

export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'FCT',
] as const
